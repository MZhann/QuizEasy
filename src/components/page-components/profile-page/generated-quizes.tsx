"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { GeneratedQuiz } from "@/types/generatedQuizTypes";

const MyGeneratedQuizzes = () => {
  const [quizzes, setQuizzes] = useState<GeneratedQuiz[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const res = await fetch("https://untis-production-0de8.up.railway.app/api/v1/generated-quiz/me", {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        });

        if (!res.ok) throw new Error("Failed to fetch quizzes");

        const data = await res.json();
        setQuizzes(data);
      } catch (error) {
        console.error("Error fetching my quizzes:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchQuizzes();
  }, []);

  return (
    <div className="p-6 flex flex-col items-center w-full">
      <h2 className="text-xl font-bold text-gray-700 mb-4">Your Generated Quizzes</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {loading
          ? Array.from({ length: 3 }).map((_, idx) => (
              <Card key={idx} className="rounded-xl">
                <CardContent className="p-4 space-y-2">
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </CardContent>
              </Card>
            ))
          : quizzes.map((quiz) => {
              // const total = quiz.questions.length;
              // Симуляция прохождения: количество вопросов с хотя бы одним правильным ответом
              // const correct = quiz.questions.filter((q) =>
              //   q.options.some((o) => o.is_correct)
              // ).length;

              return (
                <div
                  key={quiz._id}
                  className="bg-[url('/assets/images/decoration/main-page-block-bg.svg')] bg-cover bg-center text-white rounded-xl p-4 shadow-md min-h-28 hover:-mt-1 duration-100"
                >
                  <h3 className="text-lg font-semibold underline mb-2">{quiz.title}</h3>
                  {/* <p className="text-sm">result: {correct}/{total}</p> */}
                </div>
              );
            })}
      </div>
    </div>
  );
};

export default MyGeneratedQuizzes;
