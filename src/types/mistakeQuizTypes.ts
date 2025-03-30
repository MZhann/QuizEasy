export interface MistakeQuizOption {
  label: string;
  option_text: string;
  is_correct: boolean;
}

export interface MistakeQuizQuestion {
  question_id: string;
  question_text: string;
  options: MistakeQuizOption[];
}

export interface StartMistakeQuizResponse {
  session_id: string;
  questions: MistakeQuizQuestion[];
}


export interface MistakeQuestionOption {
  label: string;
  option_text: string;
  is_correct: boolean;
}

export interface MistakeQuestion {
  question_id: string;
  question_text: string;
  options: MistakeQuestionOption[];
}

export interface StartMistakeSessionResponse {
  session_id: string;
  questions: MistakeQuestion[];
}

export interface SubmitMistakeAnswerPayload {
  question_id: string;
  selected_options: string[];
}

export interface SubmitMistakeAnswerResponse {
  message: string;
  correct: boolean;
  correct_options: string[];
  selected_options: string[];
}

export interface CompleteMistakeSessionResponse {
  message: string;
  session_results: MistakeSessionResult[];
}

export interface MistakeSessionResult {
  question_id: string;
  question_text: string;
  options: MistakeQuestionOption[];
  selected_options: string[];
  is_correct: boolean;
}

export interface MistakeQuizSessionResultsResponse {
  session_id: string;
  mistakes: MistakeSessionResult[];
}

export interface AllMistakeSessionsResponse {
  _id: string;
  user_id: string;
  started_at: string;
  completed_at: string;
  status: "completed" | "in_progress";
  mistakes: MistakeSessionResult[];
}

export interface MistakeQuestion {
  question_id: string;
  question_text: string;
  options: {
    label: string;
    option_text: string;
    is_correct: boolean;
  }[];
}
