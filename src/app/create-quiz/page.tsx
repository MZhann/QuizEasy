"use client";

import { useState } from "react";
import { generateQuiz } from "@/api/quiz";
import { Loader2 } from "lucide-react";
import { QuizResponse } from "@/types/quizTypes";
import { useRouter } from "next/navigation";

// const [quiz, setQuiz] = useState<QuizResponse | null>(null);

const QuizGeneration = () => {
  const router = useRouter();
  const [prompt, setPrompt] = useState("");
  const [selectedTypes, setSelectedTypes] = useState<string[]>([
    "single_choice",
  ]);
  const [loading, setLoading] = useState(false);

  const [quiz, setQuiz] = useState<QuizResponse | null>(null);

  const [error, setError] = useState("");

  const handleCheckboxChange = (type: string) => {
    setSelectedTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  const handleStartQuiz = (quizId: string) => {
    // Redirect to the quiz attempt page with the quiz ID
    router.push(`/quiz/${quizId}`);
  };
  

  const handleGenerateQuiz = async () => {
    if (!prompt || selectedTypes.length === 0) {
      setError("Please enter a prompt and select at least one question type.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      console.log(prompt, selectedTypes);
      const generatedQuiz = await generateQuiz({
        user_prompt: prompt,
        question_types: selectedTypes,
      });

      setQuiz(generatedQuiz);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full mx-auto mt-10 p-6 px-20 bg-white rounded-lg">
      <h1 className="text-2xl font-bold">Quiz Creation</h1>
      <p className="text-gray-500 text-sm">powered with AI</p>

      {/* User Prompt */}
      <label className="block mt-4 text-lg font-semibold">Prompt</label>
      <textarea
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Generate me a quiz with 10 questions about mathematics..."
        className="w-full mt-2 p-3 border-4 border-teal-600 shadow-xl rounded-2xl bg-cyan-50"  
        rows={6}
      />

      {/* Question Type Selection */}
      <div className="mt-4 space-y-2">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={selectedTypes.includes("multiple_choice")}
            onChange={() => handleCheckboxChange("multiple_choice")}
            className="accent-[#2f6c89]"
          />
          Multiple Answer Questions
        </label>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={selectedTypes.includes("true_false")}
            onChange={() => handleCheckboxChange("true_false")}
            className="accent-[#2f6c89]"
          />
          True or False Questions
        </label>
      </div>

      {/* Generate Button */}
      <button
        onClick={handleGenerateQuiz}
        className={`mt-4 w-full py-3 text-white font-semibold rounded-md ${
          loading
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-[#2f6c89] hover:bg-[#2f6c89]/80"
        }`}
        disabled={loading}
      >
        {loading ? (
          <Loader2 className="inline-block animate-spin" size={20} />
        ) : (
          "Generate"
        )}
      </button>

      {/* Error Message */}
      {error && <p className="mt-2 text-red-500">{error}</p>}

      {/* Quiz Info Display */}
      {quiz && (
        <div className="mt-6 p-4 border rounded-lg bg-gray-100 shadow-sm">
          <h2 className="text-lg font-semibold">{quiz.title}</h2>
          <p className="text-gray-400">{quiz._id}</p>
          <p className="text-gray-500">{quiz.questions.length} questions</p>
          <button className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600" onClick={() => handleStartQuiz(quiz._id)}>
            Start Quiz
          </button>
        </div>
      )}
    </div>
  );
};

export default QuizGeneration;
