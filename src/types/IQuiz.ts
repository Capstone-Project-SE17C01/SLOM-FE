export interface Quiz {
  id: string;
  lessonId: string;
  question: string;
  correctAnswer: string;
  explanation?: string;
  maxScore?: number;
  createdAt: string;
  lesson?: Lesson;
  attempts?: QuizAttempt[];
  wordQuizzes?: WordQuiz[];
  quizOptions?: QuizOption[];
}

export interface QuizRequestDTO {
  id?: string;
  lessonId: string;
  question: string;
  correctAnswer: string;
  explanation?: string;
  maxScore?: number;
}

export interface QuizResponseDTO {
  id: string;
  lessonId: string;
  question: string;
  correctAnswer: string;
  explanation?: string;
  maxScore?: number;
  createdAt: string;
}

export interface GetQuizByLessonRequest {
  lessonId: string;
}

export interface QuizAttempt {
  id: string;
  quizId: string;
  userId: string;
  score: number;
  attemptedAt: string;
}

export interface WordQuiz {
  id: string;
  quizId: string;
  wordId: string;
}

export interface QuizOption {
  id: string;
  quizId: string;
  optionText: string;
  isCorrect: boolean;
}

export interface Lesson {
  id: string;
  title: string;
  description?: string;
}
