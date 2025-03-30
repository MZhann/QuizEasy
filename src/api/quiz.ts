import { backendApiInstance } from "./index";

import {
  QuizRequest,
  QuizResponse,
  GetAllGeneratedQuizzesResponse,
} from "@/types/quizTypes";
import { GetOneGeneratedQuizResponse,AttemptResultResponse, StartQuizAttemptResponse, FinishQuizAttemptResponse, SubmitAnswerPayload, SubmitAnswerResponse } from "@/types/generatedQuizTypes";

export const getQuizAttemptDetails = async (
  attemptId: string
): Promise<AttemptResultResponse> => {
  try {
    const response = await fetch(
      `https://untis-production-0de8.up.railway.app/api/v1/generated-quiz/${attemptId}/attempt_details`,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || "Не удалось получить результаты попытки");
    }

    const data: AttemptResultResponse = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching quiz attempt details:", error);
    throw error;
  }
};

export const finishQuizAttempt = async (
  attemptId: string
): Promise<FinishQuizAttemptResponse> => {
  try {
    const response = await fetch(
      `https://untis-production-0de8.up.railway.app/api/v1/generated-quiz/${attemptId}/finish`,
      {
        method: "POST",
        headers: {
          Accept: "application/json",
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || "Не удалось завершить квиз");
    }

    const data: FinishQuizAttemptResponse = await response.json();
    return data;
  } catch (error) {
    console.error("Error finishing quiz attempt:", error);
    throw error;
  }
};

export const submitAnswer = async (
  attemptId: string,
  payload: SubmitAnswerPayload
): Promise<SubmitAnswerResponse> => {
  try {
    const response = await fetch(
      `https://untis-production-0de8.up.railway.app/api/v1/generated-quiz/${attemptId}/answer`,
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || "Не удалось отправить ответ");
    }

    const data: SubmitAnswerResponse = await response.json();
    return data;
  } catch (error) {
    console.error("Error submitting answer:", error);
    throw error;
  }
};

export const startQuizAttempt = async (
  quizId: string
): Promise<StartQuizAttemptResponse> => {
  try {
    const response = await fetch(
      `https://untis-production-0de8.up.railway.app/api/v1/generated-quiz/${quizId}/start`,
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to start quiz attempt");
    }

    const data: StartQuizAttemptResponse = await response.json();
    return data;
  } catch (error) {
    console.error("Error starting quiz:", error);
    throw new Error("Не удалось начать квиз. Попробуйте позже.");
  }
};

export const getOneGeneratedQuiz = async (
  quizId: string
): Promise<GetOneGeneratedQuizResponse> => {
  try {
    const response = await backendApiInstance.get<GetOneGeneratedQuizResponse>(
      `/generated-quiz/${quizId}`
    );
    return response.data;
  } catch (error) {
    console.error(`Failed to fetch quiz ${quizId}:`, error);
    throw new Error("Не удалось загрузить квиз. Попробуйте позже.");
  }
};



export const generateQuiz = async (
  data: QuizRequest
): Promise<QuizResponse> => {
  try {
    const response = await fetch(
      "https://untis-production-0de8.up.railway.app/api/v1/generated-quiz/",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
        body: JSON.stringify(data),
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to generate quiz: ${response.statusText}`);
    }
    console.log("Response:", response);
    return await response.json();
  } catch (error) {
    console.error("Quiz generation failed:", error);
    throw new Error("Failed to generate quiz. Try again.");
  }
};



export const getAllGeneratedQuizzes = async (): Promise<GetAllGeneratedQuizzesResponse> => {
  try {
    const response = await backendApiInstance.get<GetAllGeneratedQuizzesResponse>(
      "/generated-quiz/"
    );
    return response.data;
  } catch (error) {
    console.error("Failed to fetch generated quizzes:", error);
    throw new Error("Не удалось получить список квизов. Попробуйте позже.");
  }
};