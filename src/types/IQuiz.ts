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
  quizOptions?: string[]; // Backend expects array of strings
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
  quizId?: string;
  text: string;
  isCorrect: boolean;
}

export interface Lesson {
  id: string;
  moduleId: string;
  title: string;
  content?: string;
  videoUrl?: string | null;
  durationMinutes?: number;
  orderNumber: number;
  createdAt: string;
  module?: Module | null;
  quizzes?: unknown[] | null;
  words?: unknown[] | null;
  userLessonProgress?: unknown[] | null;
}

export interface Module {
  id: string;
  courseId: string;
  title: string;
  description?: string;
  orderNumber: number;
  createdAt: string;
  course?: unknown | null;
  lessons?: unknown[] | null;
  userModuleProgress?: unknown[] | null;
}
