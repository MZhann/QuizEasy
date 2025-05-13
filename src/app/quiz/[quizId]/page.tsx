"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Lottie from "lottie-react";
import fireworksAnimation from "../../../animations/lottie/fireworks.json";
import {
  getOneGeneratedQuiz,
  startQuizAttempt,
  submitAnswer,
  finishQuizAttempt,
} from "@/api/quiz";
import type {
  QuizQuestion,
  SubmitAnswerPayload,
  SubmitAnswerResponse,
} from "@/types/generatedQuizTypes";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface AnsweredState {
  [questionId: string]: {
    selected: string[];
    result: SubmitAnswerResponse | null;
  };
}

export default function QuizAttemptPage() {
  const { quizId } = useParams<{ quizId: string }>();
  const router = useRouter();
  const [quizTitle, setQuizTitle] = useState("");
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
      console.error("Ошибка при отправке ответа", e);
      alert("Ошибка при отправке ответа");
    }
  };

  const handleNext = () => {
    setIsFlipped(false);
    setSelectedOptions([]);
    setCurrentIndex((prev) => prev + 1);
  };

  if (!attemptId) {
    return (
      <div
        className="text-center w-full h-screen flex flex-col items-center justify-center bg-cover bg-center"
        style={{
          backgroundImage: "url('/assets/images/decoration/pink-bg.png')",
        }}
      >
        <div className="bg-white w-96 -mt-32 rounded-2xl p-10 relative">
          <Image
            src="/assets/images/decoration/megaphone.png"
            alt="megaphone"
            width={200}
            height={200}
            className="absolute -left-20 -top-20"
          />
          <Image
            src="/assets/images/decoration/cube-questions.png"
            alt="cube-questions"
            width={130}
            height={130}
            className="absolute -right-16 -top-16 rotate-12"
          />
          <h1 className="text-3xl text-[#b2326d] font-bold">QUIZ TIME</h1>
          <h2 className="text-2xl text-[#b2326d] font-bold">{quizTitle}</h2>
          <p className="text-muted-foreground">powered with ai</p>
          <p className="mt-4">Вопросов: {questions.length}</p>
          <Button onClick={handleStart} className="mt-6 bg-[#b2326d]">
            Start Quiz
          </Button>
        </div>
      </div>
    );
  }

  const isMulti = currentQuestion?.options.length > 4;
  const answerData = answered[currentQuestion?.id];
  const isAnswered = !!answerData;

  return (
    <div
      className="flex flex-col items-center h-screen pt-10"
      style={{
        backgroundImage: "url('/assets/images/decoration/pink-bg.png')",
        backgroundPosition: "center",
        backgroundSize: "cover",
      }}
    >
      <div className="font-semibold text-gray-200 text-2xl">{quizTitle}</div>
      <div className="text-gray-200">
        answered: {Object.keys(answered).length}/{questions.length}
      </div>

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
                "w-72 min-h-72 rounded-xl bg-white p-4 shadow-lg transition-transform duration-500 border-8 border-gray-300",
                offset === -1 && "scale-90 translate-x-[0%] blur-sm",
                offset === 0 && "scale-100 z-10",
                offset === 1 && "scale-90 translate-x-[0%] blur-sm",
                isBack && "rotate-y-180",
                "relative"
              )}
            >
              {!isBack ? (
                <div>
                  <p className="font-medium text-center mb-4">
                    {q.question_text}
                  </p>
                  <div className="flex flex-col gap-2">
                    {q.options.map((opt) => (
                      <label
                        key={opt.label}
                        className="flex items-center gap-2"
                      >
                        <input
                          type={isMulti ? "checkbox" : "radio"}
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
                    <Button
                      onClick={handleSubmit}
                      className="mt-4 w-full bg-[#af4375] font-bold"
                    >
                      Submit
                    </Button>
                  )}
                </div>
              ) : (
                // <div className="text-center">
                //   <p className="text-lg mb-2 font-medium">
                //     {answerData?.result?.correct_options.every((opt) =>
                //       answerData.selected.includes(opt)
                //     )
                //       ? "✅ Correct!"
                //       : "❌ Incorrect"}
                //   </p>
                //   <p>
                //     Correct Answer:{" "}
                //     {answerData?.result?.correct_options.join(", ")}
                //   </p>
                //   <Button onClick={handleNext} className="mt-4 bg-[#af4375] font-bold">
                //     Next
                //   </Button>
                // </div>
                <div className="text-center relative">
                  {answerData?.result?.correct_options.every((opt) =>
                    answerData.selected.includes(opt)
                  ) && (
                    <div className="absolute -inset-[4.5rem] flex h-72 w-96 items-center justify-center">
                      <Lottie
                        animationData={fireworksAnimation}
                        loop={false}
                        className="w-[500px] h-[500px]"
                      />
                    </div>
                  )}
                  <div className="relative z-10 flex flex-col min-h-40 items-center justify-between">
                    <p className="text-lg mb-2 font-medium">
                      {answerData?.result?.correct_options.every((opt) =>
                        answerData.selected.includes(opt)
                      ) ? (
                        "✅ Correct!"
                      ) : (
                        <p>
                          <span className="animate-spin">❌</span>Incorrect
                        </p>
                      )}
                    </p>
                    <p>
                      Correct Answer:{" "}
                      {answerData?.result?.correct_options.join(", ")}
                    </p>
                    <Button
                      onClick={handleNext}
                      className="mt-4 bg-[#af4375] font-bold w-full"
                    >
                      Next
                    </Button>
                  </div>
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
      <Button
        variant="secondary"
        className=" bg-white/20 border-2 rounded-xl border-white hover:bg-[#af4375] text-white mt-20"
        onClick={async () => {
          if (!attemptId) return;
          await finishQuizAttempt(attemptId);
          router.push(`/quiz-results/${attemptId}`);
        }}
      >
        Finish Session Now
      </Button>
    </div>
  );
}
