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
  title: string;
  description?: string;
}
