export interface Course {
  id: string; // Guid as string
  title: string;
  description?: string;
  difficultyLevel?: string;
  thumbnailUrl?: string;
  languageId?: string; // Guid as string
  categoryId?: string; // Guid as string
  creatorId?: string; // Guid as string
  isPublished: boolean;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
  modules?: Module[];
  quizzes?: Quiz[];
  userLessonProgresses?: UserLessonProgress[];
  userQuizProgresses?: UserQuizProgress[];
  creator?: Profile;
  language?: Language;
  courseCategory?: CourseCategory;
}

export interface Module {
  id: string; // Guid as string
  courseId: string; // Guid as string
  title: string;
  description?: string;
  orderNumber: number;
  createdAt: string; // ISO date string
  lessons?: Lesson[] | null;
}
//dashboardDataRequest
export interface DashboardDataRequestDTO {
  courseId: string;
  userId: string;
}

export interface Lesson {
  id: string; // Guid as string
  moduleId: string; // Guid as string
  title: string;
  content?: string;
  // videoUrl?: string[]; //list of video url
  durationMinutes?: number;
  orderNumber: number;
  createdAt: string; // ISO date string
  module?: Module | null;
  learnWords?: LearnWord[] | null;
  userLessonProgresses?: UserLessonProgress[] | null; // list user lesson progress
  userQuizProgresses?: UserQuizProgress[] | null; // list user quiz progress
}

//LearnWord
export interface LearnWord {
  id: string; // Guid as string
  lessonId: string; // Guid as string
  word: string;
  meaning: string;
  videoUrl: string[] | null;
}

export interface Quiz {
  id: string; // Guid as string
  lessonId: string; // Guid as string
  question: string;
  videoUrl?: string; // 1 question 1 video
  options?: string;
  correctAnswer: string;
  explanation?: string;
  maxScore?: number;
  createdAt: string; // ISO date string
  lesson?: Lesson | null;
  attempts?: QuizAttempt[] | null;
}

export interface UserLessonProgress {
  userId: string; // Guid as string
  lessonId: string; // Guid as string
  completedAt?: string; // ISO date string, optional
  lessonProgress: number;
  user?: Profile | null;
  lesson?: Lesson | null;
}
//userquizprogress
export interface UserQuizProgress {
  userId: string; // Guid as string
  quizId: string; // Guid as string
  completedAt?: string; // ISO date string, optional
  user?: Profile | null;
  quiz?: Quiz | null;
}

export interface UserCourseProgress {
  userId: string; // Guid as string
  courseId: string; // Guid as string
  completedAt?: string; // ISO date string, optional
  courseProgress: number;
  user?: Profile | null;
  course?: Course | null;
}

export interface UserModuleProgress {
  userId: string; // Guid as string
  moduleId: string; // Guid as string
  completedAt?: string; // ISO date string, optional
  moduleProgress: number;
  user?: Profile | null;
  module?: Module | null;
}

export interface QuizAttempt {
  id: string; // Guid as string
  userId: string; // Guid as string
  quizId: string; // Guid as string
  selectedAnswer?: string;
  score: number;
  completedAt: string; // ISO date string
  user: Profile;
  quiz: Quiz;
}

export interface Profile {
  id: string; // Guid as string
  username?: string;
  email?: string;
  roleId?: string; // Guid as string
  avatarUrl?: string;
  preferredLanguageId?: string; // Guid as string
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
}

export interface CourseCategory {
  id: string; // Guid as string
  name: string;
  description?: string;
  parentId?: string; // Guid as string
  createdAt: string; // ISO date string
  parent?: CourseCategory;
  subcategories: CourseCategory[];
  courses: Course[];
}

export interface Language {
  id: string; // Guid as string
  code: string;
  name: string;
  region?: string;
  isActive: boolean;
  createdAt: string; // ISO date string
  profiles: Profile[];
  courses: Course[];
}

export interface CourseDashboardViewModel {
  numberLearnedLessons: number;
  currentModule: Module;
  numberCompletedModules: number;
  totalLessons: number;
  totalModules: number;
  numberMasteredWords: number; // số từ đã mastered
  numberLearnedWords: number; // số từ đã học
  numberWatchedWords: number; // số từ đã xem
  numberReWatchWords: number; // số từ đã xem lại
  numberConversationWords: number; // số từ đã làm conversation
  numberReplayedWords: number; // số từ đã làm replay
  activities: Activities;
  nextLesson: Lesson;
}

export interface Activities {
  recentLearnedWords: number; // last 7 days
  recentWatchedWords: number; // last 7 days
  recentReplayedWords: number; // last 7 days
  recentConversationWords: number; // last 7 days
}
