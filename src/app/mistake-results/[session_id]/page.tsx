"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { getMistakeSessionResults } from "@/api/mistake-quiz";
import { MistakeQuizSessionResultsResponse } from "@/types/mistakeQuizTypes";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export default function MistakeResultsPage() {
  const { session_id } = useParams<{ session_id: string }>();
  const [results, setResults] = useState<MistakeQuizSessionResultsResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const data = await getMistakeSessionResults(session_id);
        setResults(data);
      } catch (err) {
        console.error("Failed to fetch mistake results", err);
      } finally {
        setLoading(false);
      }
    };
    fetchResults();
  }, [session_id]);

  if (loading) return <p className="text-center mt-10 text-myindigo">Loading...</p>;
  if (!results) return <p className="text-center mt-10 text-red-500">Session not found</p>;

  return (
    <div className="max-w-6xl w-full mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Working On Mistakes Session Results</h1>
      <p className="text-muted-foreground mb-4">
        Session ID: <span className="font-mono text-sm text-gray-800">{results.session_id}</span>
      </p>
      <p className="text-gray-600 italic font-bold mt-3">Correct answers for the questions are marked with &quot;*&quot;</p>
      <p className="text-gray-600 italic font-bold mb-4">Your answer marked as  &quot;your choice&quot;</p>
      <div className="space-y-6">
        {results.mistakes.map((question, index) => {
          const isCorrect = question.is_correct;

          return (
            <div key={question.question_id} className="p-4 border rounded-lg bg-white shadow">
              <p className="font-medium text-lg mb-2">
                {index + 1}. {question.question_text}
              </p>
              <ul className="space-y-1">
                {question.options.map((opt) => {
                  const isUserSelected = question.selected_options.includes(opt.label);
                  const isCorrectOption = opt.is_correct;

                  return (
                    <li
                      key={opt.label}
                      className={cn(
                        "px-3 py-2 rounded-md text-sm",
                        isCorrectOption
                          ? "text-green-800"
                          : isUserSelected
                          ? "bg-red-100 text-red-800"
                          : "text-gray-700"
                      )}
                    >
                      <span className="font-semibold">{opt.label}.</span> {opt.option_text}{" "}
                      {isUserSelected && <Badge variant="outline">Your choice</Badge>}
                      {isCorrectOption && <Badge className="ml-2 bg-green-500">*</Badge>}
                    </li>
                  );
                })}
              </ul>
              <p className="mt-2 font-semibold text-sm">
                Result:{" "}
                <span className={isCorrect ? "text-green-600" : "text-red-600"}>
                  {isCorrect ? "Correct" : "Incorrect"}
                </span>
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
