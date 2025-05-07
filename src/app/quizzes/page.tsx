"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import Image from "next/image";
import clsx from "clsx";

interface GeneratedQuiz {
  id: string;
  user_id: string;
  title: string;
}

const Quizzes = () => {
  const [quizzes, setQuizzes] = useState<GeneratedQuiz[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const response = await fetch(
          "https://untis-production-0de8.up.railway.app/api/v1/generated-quiz/",
          {
            method: "GET",
            headers: {
              Accept: "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch quizzes");
        }

        const data = await response.json();
        setQuizzes(data);
      } catch (error) {
        console.error("Error fetching quizzes:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchQuizzes();
  }, []);

  return (
    <div className="p-6 px-4 md:px-20">
      <h2 className="text-2xl font-semibold mt-4">Global quizzes</h2>
      <div className="flex items-center gap-4 mt-5">
        <Image
          src={"/assets/images/decoration/mini-man.png"}
          width={70}
          height={70}
          alt="mini man"
        />
        <p className="italic text-lg leading-5 text-gray-500 mt-2">
          &quot;All the quizzes, generated on this platform will be seen here! <br />
          So you can always find something interesting and help the <br />
          community to gain knowledge!&quot;
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-11">
        {loading
          ? Array.from({ length: 6 }).map((_, idx) => (
              <Skeleton key={idx} className="h-32 w-full rounded-xl" />
            ))
          : quizzes.map((quiz) => (
              <Link key={quiz.id} href={`/quiz/${quiz.id}`}>
                <Card
                  className={clsx(
                    "cursor-pointer hover:-mt-1 hover:shadow-lg transition-all duration-200 bg-cover bg-center text-white rounded-xl",
                    quizzes.indexOf(quiz) % 2 === 0
                      ? "bg-[url('/assets/images/decoration/main-page-block-bg.svg')]"
                      : "bg-[url('/assets/images/decoration/background-2.svg')] text-orange-700"
                  )}
                >
                  <CardContent className="p-6 flex flex-col justify-between h-32">
                    <div className="text-xl font-semibold underline overflow-hidden">
                      {quiz.title}
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
      </div>
    </div>
  );
};

export default Quizzes;
