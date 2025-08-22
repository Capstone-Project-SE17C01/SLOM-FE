export interface Word {
  id: string;
  text?: string;
  videoSrc?: string;
  lessonId?: string;
  lesson?: Lesson;
  wordQuizzes?: WordQuiz[];
}

export interface WordRequestDTO {
  id?: string;
  text?: string;
  videoSrc?: string;
  lessonId?: string;
}

export interface WordResponseDTO {
  id: string;
  text?: string;
  videoSrc?: string;
  lessonId?: string;
  lessonTitle?: string;
}

export interface GetWordByLessonRequest {
  lessonId: string;
}

export interface WordQuiz {
  id: string;
  quizId: string;
  wordId: string;
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
