'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  getOneGeneratedQuiz,
  startQuizAttempt,
  submitAnswer,
  finishQuizAttempt,
} from '@/api/quiz';
import type {
  QuizQuestion,
  SubmitAnswerPayload,
  SubmitAnswerResponse,
} from '@/types/generatedQuizTypes';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface AnsweredState {
  [questionId: string]: {
    selected: string[];
    result: SubmitAnswerResponse | null;
  };
}

export default function QuizAttemptPage() {
  const { quizId } = useParams<{ quizId: string }>();
  const router = useRouter();
  const [quizTitle, setQuizTitle] = useState('');
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [attemptId, setAttemptId] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answered, setAnswered] = useState<AnsweredState>({});
  const [isFlipped, setIsFlipped] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const currentQuestion = questions[currentIndex];

  useEffect(() => {
    const fetchQuiz = async () => {
      const data = await getOneGeneratedQuiz(quizId);
      setQuizTitle(data.title);
      setQuestions(data.questions);
    };
    fetchQuiz();
  }, [quizId]);

  const handleStart = async () => {
    const data = await startQuizAttempt(quizId);
    setAttemptId(data._id);
  };

  const handleOptionChange = (option: string) => {
    if (!currentQuestion) return;
    const isMulti = currentQuestion.options.length > 4;
    if (isMulti) {
      setSelectedOptions((prev) =>
        prev.includes(option)
          ? prev.filter((o) => o !== option)
          : [...prev, option]
      );
    } else {
      setSelectedOptions([option]);
    }
  };

  const handleSubmit = async () => {
    if (!attemptId || !currentQuestion) return;
    const payload: SubmitAnswerPayload = {
      question_id: currentQuestion.id,
      selected_options: selectedOptions,
    };
    try {
      const res = await submitAnswer(attemptId, payload);
      setAnswered((prev) => ({
        ...prev,
        [currentQuestion.id]: { selected: selectedOptions, result: res },
      }));
      setIsFlipped(true);
    } catch (e) {
      console.error('Ошибка при отправке ответа', e);
      alert('Ошибка при отправке ответа');
    }
  };

  const handleNext = () => {
    setIsFlipped(false);
    setSelectedOptions([]);
    setCurrentIndex((prev) => prev + 1);
  };

  if (!attemptId) {
    return (
      <div className="text-center mt-20">
        <h1 className="text-2xl font-bold">{quizTitle}</h1>
        <p className="text-muted-foreground">powered with ai</p>
        <p className="mt-4">Вопросов: {questions.length}</p>
        <Button onClick={handleStart} className="mt-6">Start Quiz</Button>
      </div>
    );
  }

  const isMulti = currentQuestion?.options.length > 4;
  const answerData = answered[currentQuestion?.id];
  const isAnswered = !!answerData;

  return (
    <div className="flex flex-col items-center mt-10">
      <div className="text-xl font-semibold">{quizTitle}</div>
      <div className="text-muted-foreground">answered: {Object.keys(answered).length}/{questions.length}</div>

      <div className="mt-10 flex gap-4">
        {[-1, 0, 1].map((offset) => {
          const index = currentIndex + offset;
          const q = questions[index];
          if (!q) return null;

          const isCenter = offset === 0;
          const isBack = isCenter && isFlipped;

          return (
            <div
              key={q.id}
              className={cn(
                'w-72 min-h-72 rounded-xl bg-blue-100 p-4 shadow-lg transition-transform duration-500 border-4 border-mygreenish',
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
                          type={isMulti ? 'checkbox' : 'radio'}
                          name={`q-${q.id}`}
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
                    {answerData?.result?.correct_options.every((opt) => answerData.selected.includes(opt)) ? '✅ Correct!' : '❌ Incorrect'}
                  </p>
                  <p>Correct Answer: {answerData?.result?.correct_options.join(', ')}</p>
                  <Button onClick={handleNext} className="mt-4">Next</Button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {Object.keys(answered).length === questions.length && (
        <Button
          className="mt-10 px-10"
          onClick={async () => {
            if (!attemptId) return;
            await finishQuizAttempt(attemptId);
            router.push(`/quiz-results/${attemptId}`);
          }}
        >
          Complete
        </Button>
      )}
    </div>
  );
}
