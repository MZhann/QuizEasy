"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  startMistakeQuizSession,
  submitMistakeAnswer,
  completeMistakeQuizSession,
  getAllMistakeQuestions,
} from "@/api/mistake-quiz";
import { MistakeQuizQuestion, SubmitMistakeAnswerResponse } from "@/types/mistakeQuizTypes";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface AnsweredState {
  [questionId: string]: {
    selected: string[];
    result: SubmitMistakeAnswerResponse;
  };
}

export default function MistakeQuizPage() {
  const router = useRouter();
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [questions, setQuestions] = useState<MistakeQuizQuestion[]>([]);
  const [allMistakeQuestionsCount, setAllMistakeQuestionsCount] = useState<number>(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [answered, setAnswered] = useState<AnsweredState>({});
  const [isFlipped, setIsFlipped] = useState(false);

  const currentQuestion = questions[currentIndex];
  const isMulti = currentQuestion?.options.length > 4;
  const isAnswered = !!answered[currentQuestion?.question_id];

  useEffect(() => {
    const fetchMistakeCount = async () => {
      try {
        const data = await getAllMistakeQuestions();
        setAllMistakeQuestionsCount(data.length);
      } catch (e) {
        console.error("Ошибка при получении количества вопросов из mistake bank", e);
        console.error("Ошибка при получении списка вопросов из mistake bank");
      }
    };
    fetchMistakeCount();
  }, []);

  const handleStart = async () => {
    try {
      const data = await startMistakeQuizSession();
      setSessionId(data.session_id);
      setQuestions(data.questions);
    } catch (e) {
      console.error("Ошибка при старте квиза по ошибкам", e);
      alert("Ошибка при старте квиза по ошибкам");
    }
  };

  const handleOptionChange = (label: string) => {
    if (isMulti) {
      setSelectedOptions((prev) =>
        prev.includes(label) ? prev.filter((l) => l !== label) : [...prev, label]
      );
    } else {
      setSelectedOptions([label]);
    }
  };

  const handleSubmit = async () => {
    if (!sessionId || !currentQuestion) return;
    try {
      const result = await submitMistakeAnswer(sessionId, {
        question_id: currentQuestion.question_id,
        selected_options: selectedOptions,
      });
      setAnswered((prev) => ({
        ...prev,
        [currentQuestion.question_id]: {
          selected: selectedOptions,
          result,
        },
      }));
      setIsFlipped(true);
    } catch (e) {
      console.error("Ошибка при отправке ответа", e);
      alert("Ошибка при отправке ответа");
    }
  };

  const handleNext = () => {
    setIsFlipped(false);
    setSelectedOptions([]);
    setCurrentIndex((prev) => prev + 1);
  };

  const handleFinish = async () => {
    if (!sessionId) return;
    await completeMistakeQuizSession(sessionId);
    router.push(`/mistake-results/${sessionId}`);
  };

  if (!sessionId) {
    return (
      <div className="text-center mt-20">
        <h1 className="text-2xl font-bold">Mistake Bank</h1>
        <p className="text-muted-foreground">powered with AI</p>
        <p className="mt-4">Количество вопросов: {allMistakeQuestionsCount}</p>
        <Button onClick={handleStart} className="mt-6">Start</Button>
      </div>
    );
  }

  const answerData = answered[currentQuestion.question_id];

  return (
    <div className="flex flex-col items-center mt-10">
      <h2 className="text-xl font-semibold">Mistake Quiz</h2>
      <p className="text-muted-foreground">
        Answered: {Object.keys(answered).length} / {questions.length}
      </p>

      <div className="mt-10 flex gap-4">
        {[-1, 0, 1].map((offset) => {
          const index = currentIndex + offset;
          const q = questions[index];
          if (!q) return null;

          const isCenter = offset === 0;
          const isBack = isCenter && isFlipped;

          return (
            <div
              key={q.question_id}
              className={cn(
                'w-72 min-h-72 rounded-xl bg-yellow-100 p-4 shadow-lg transition-transform duration-500 border-4 border-yellow-400',
                offset === -1 && 'scale-90 translate-x-[0%] blur-sm',
                offset === 0 && 'scale-100 z-10',
                offset === 1 && 'scale-90 translate-x-[0%] blur-sm',
                isBack && 'rotate-y-180',
                'relative'
              )}
            >
              {!isBack ? (
                <div>
                  <p className="font-medium text-center mb-4">{q.question_text}</p>
                  <div className="flex flex-col gap-2">
                    {q.options.map((opt) => (
                      <label key={opt.label} className="flex items-center gap-2">
                        <input
                          type={isMulti ? "checkbox" : "radio"}
                          name={`q-${q.question_id}`}
                          checked={selectedOptions.includes(opt.label)}
                          onChange={() => handleOptionChange(opt.label)}
                          disabled={isAnswered}
                        />
                        <span>{opt.option_text}</span>
                      </label>
                    ))}
                  </div>
                  {!isAnswered && (
                    <Button onClick={handleSubmit} className="mt-4 w-full">Submit</Button>
                  )}
                </div>
              ) : (
                <div className="text-center">
                  <p className="text-lg mb-2 font-medium">
                    {answerData?.result.correct ? '✅ Correct!' : '❌ Incorrect'}
                  </p>
                  <p>Correct Answer: {answerData?.result.correct_options.join(', ')}</p>
                  <Button onClick={handleNext} className="mt-4">Next</Button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {Object.keys(answered).length === questions.length && (
        <Button onClick={handleFinish} className="mt-10 px-10">
          Complete
        </Button>
      )}
    </div>
  );
}
