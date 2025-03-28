import { backendApiInstance } from "./index";
import { QuizRequest, QuizResponse } from "@/types/quizTypes";

export const generateQuiz = async (data: QuizRequest): Promise<QuizResponse> => {
  try {
    const response = await backendApiInstance.post<QuizResponse>("/generated-quiz", data);
    return response.data;
  } catch (error) {
    console.error("Quiz generation failed:", error);
    throw new Error("Failed to generate quiz. Try again.");
  }
};


