import {
  StartMistakeSessionResponse,
  MistakeQuestion,
  StartMistakeQuizResponse,
  MistakeQuizSessionResultsResponse,
  SubmitMistakeAnswerPayload,
  SubmitMistakeAnswerResponse,
  CompleteMistakeSessionResponse,
} from "@/types/mistakeQuizTypes";

const BASE_URL = "https://untis-production-0de8.up.railway.app/api/v1/mistake";

export const getAllMistakeQuestions = async (): Promise<MistakeQuestion[]> => {
  const response = await fetch(
    `https://untis-production-0de8.up.railway.app/api/v1/mistake/get_all_questions_from_mistake/`,
    {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Не удалось загрузить вопросы из банка ошибок");
  }

  return await response.json();
};

export const getMistakeSessionResults = async (
  session_id: string
): Promise<MistakeQuizSessionResultsResponse> => {
  const response = await fetch(
    `https://untis-production-0de8.up.railway.app/api/v1/mistake/mistake_quiz_session_results/${session_id}`,
    {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Не удалось получить результаты сессии ошибок");
  }

  return await response.json();
};

export const completeMistakeQuizSession = async (
  session_id: string
): Promise<CompleteMistakeSessionResponse> => {
  const response = await fetch(
    `https://untis-production-0de8.up.railway.app/api/v1/mistake/complete_mistake_quiz_session/?session_id=${session_id}`,
    {
      method: "POST",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Не удалось завершить сессию ошибок");
  }

  return await response.json();
};

// export const startMistakeQuizSession = async (): Promise<StartMistakeSessionResponse> => {
//   const response = await fetch(`${BASE_URL}/start_mistake_quiz_session/`, {
//     method: "GET",
//     headers: {
//       Accept: "application/json",
//       Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
//     },
//   });

//   if (!response.ok) {
//     throw new Error("Не удалось начать сессию ошибки");
//   }

//   return await response.json();
// };

export const startMistakeQuizSession =
  async (): Promise<StartMistakeSessionResponse> => {
    const response = await fetch(`${BASE_URL}/start_mistake_quiz_session/`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    });

    if (!response.ok) {
      // read error body and throw with its detail
      
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-explicit-any
      const errBody = await response.json().catch(() => ({} as any));
      const message =
        (errBody.detail as string) || "Не удалось начать сессию ошибки";
      throw new Error(message);
    }

    return await response.json();
  };

export const submitMistakeAnswer = async (
  session_id: string,
  payload: SubmitMistakeAnswerPayload
): Promise<SubmitMistakeAnswerResponse> => {
  const response = await fetch(
    `${BASE_URL}/answer_mistake_question/?session_id=${session_id}`,
    {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
      body: JSON.stringify(payload),
    }
  );

  if (!response.ok) {
    throw new Error("Не удалось отправить ответ");
  }

  return await response.json();
};

export const startMistakeQuiz = async (): Promise<StartMistakeQuizResponse> => {
  try {
    const response = await fetch(
      "https://untis-production-0de8.up.railway.app/api/v1/mistake/start_mistake_quiz_session/",
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
      throw new Error(errorData.detail || "Не удалось начать квиз по ошибкам");
    }

    const data: StartMistakeQuizResponse = await response.json();
    return data;
  } catch (error) {
    console.error("Ошибка при старте квиза с ошибками:", error);
    throw error;
  }
};

import { AllMistakeSessionsResponse } from "@/types/mistakeQuizTypes";

export const getAllMistakeSessions = async (): Promise<
  AllMistakeSessionsResponse[]
> => {
  const response = await fetch(
    `https://untis-production-0de8.up.railway.app/api/v1/mistake/all_mistake_quiz_sessions/`,
    {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Не удалось получить список сессий по ошибкам");
  }

  return await response.json();
};
