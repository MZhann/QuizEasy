"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getQuizAttemptDetails } from "@/api/quiz";
import { AttemptResultResponse } from "@/types/generatedQuizTypes";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export default function QuizResultsPage() {
  const { attempt_id } = useParams<{ attempt_id: string }>();
  const [attempt, setAttempt] = useState<AttemptResultResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAttempt = async () => {
      try {
        if (!attempt_id) return;
        const data = await getQuizAttemptDetails(attempt_id);
        setAttempt(data);
      } catch (error) {
        console.error("Ошибка при загрузке результатов попытки:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAttempt();
  }, [attempt_id]);

  const formatTime = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = Math.floor(totalSeconds % 60);
    return `${hours}h-${minutes}m-${seconds}s`;
  };

  if (loading) return <p className="text-center mt-10">Загрузка...</p>;
  if (!attempt) return <p className="text-center mt-10 text-red-500">Результаты не найдены</p>;

  return (
    <div className="p-6 w-full max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">{attempt.quiz_title}</h1>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6 text-gray-700">
        <div>
          <span className="text-gray-500">Счет:</span>{" "}
          <span className="font-bold">{attempt.score} / {attempt.max_score}</span>
        </div>
        <div>
          <span className="text-gray-500">Вопросов:</span>{" "}
          <span className="font-bold">{attempt.questions_count}</span>
        </div>
        <div>
          <span className="text-gray-500">Время:</span>{" "}
          <span className="font-bold">{formatTime(attempt.time_taken_seconds)}</span>
        </div>
      </div>

      <div className="space-y-6">
        {attempt.questions.map((q, index) => {
          const isCorrect = q.is_correct;
          return (
            <div key={q.question_id} className="p-4 border bg-white rounded-xl shadow">
              <p className="font-semibold mb-2">
                {index + 1}. {q.question_text}
              </p>
              <ul className="space-y-1">
                {q.options.map((opt) => {
                  const isUserSelected = q.user_answer.selected_options.includes(opt.label);
                  return (
                    <li
                      key={opt.label}
                      className={cn(
                        "px-3 py-2 rounded-md text-sm",
                        opt.is_correct
                          ? "bg-green-100 text-green-800"
                          : isUserSelected
                          ? "bg-red-100 text-red-800"
                          : "text-gray-700"
                      )}
                    >
                      <span className="font-semibold">{opt.label}.</span> {opt.text}
                      {isUserSelected && <Badge variant="outline" className="ml-2">Выбрано</Badge>}
                      {opt.is_correct && <Badge className="ml-2">Правильно</Badge>}
                    </li>
                  );
                })}
              </ul>
              <p className="mt-3 text-sm font-medium">
                Результат:{" "}
                <span className={isCorrect ? "text-green-600" : "text-red-600"}>
                  {isCorrect ? "Верно" : "Неверно"}
                </span>
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
