export type QuestionType = "single_choice" | "multiple_choice" | "true_false";

export interface QuestionOption {
  label: string;
  option_text: string;
  is_correct: boolean;
}

export interface GeneratedQuizQuestion {
  id: string;
  type: QuestionType;
  question_text: string;
  options: QuestionOption[];
}

export interface GeneratedQuiz {
  _id: string;
  user_id: string;
  title: string;
  questions: GeneratedQuizQuestion[];
}


export interface QuestionOption {
  label: string;
  option_text: string;
  is_correct: boolean;
}


export interface QuizQuestion {
  id: string;
  type: QuestionType;
  question_text: string;
  options: QuestionOption[];
}

export interface GetOneGeneratedQuizResponse {
  _id: string;
  user_id: string;
  title: string;
  questions: QuizQuestion[];
}


export interface StartQuizAttemptResponse {
  _id: string; // это и есть attempt_id
  user_id: string;
  quiz_id: string;
  answers: {
    question_id: string;
    selected_options: string[]; // Примеры: ["A"], ["B", "D"]
    score: number;
  }[];
  score: number;
  started_at: string;
  finished_at: string | null;
}


export interface SubmitAnswerPayload {
  question_id: string;
  selected_options: string[]; // Примеры: ["A"], ["B", "D"]
}

export interface SubmitAnswerResponse {
  message: string;
  score: number;
  correct_options: string[];
  selected_options: string[];
}


export interface FinishQuizAttemptResponse {
  message: string;
  total_score: number;
}


export interface AttemptResultResponse {
  attempt_id: string;
  user_id: string;
  quiz_id: string;
  quiz_title: string;
  score: number;
  max_score: number;
  questions_count: number;
  score_percentage: number;
  completion_percentage: number;
  started_at: string;
  finished_at: string;
  time_taken_seconds: number;
  is_completed: boolean;
  questions: AttemptQuestion[];
}

export interface AttemptQuestion {
  question_id: string;
  question_text: string;
  question_type: "single_choice" | "multiple_choice" | "true_false";
  options: AttemptOption[];
  user_answer: {
    selected_options: string[];
    score: number;
  };
  correct_options: string[];
  is_correct: boolean;
}

export interface AttemptOption {
  label: string;
  text: string;
  is_correct: boolean;
}
