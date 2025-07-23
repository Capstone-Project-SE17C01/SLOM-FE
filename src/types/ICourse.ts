export interface Course {
  id: string;
  title: string;
  description?: string;
  difficultyLevel?: string;
  thumbnailUrl?: string;
  languageId?: string;
  categoryId?: string;
  creatorId?: string;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
  modules?: Module[];
  quizzes?: Quiz[];
  userLessonProgresses?: UserLessonProgress[];
  userQuizProgresses?: UserQuizProgress[];
  creator?: Profile;
  language?: Language;
  courseCategory?: CourseCategory;
}

export interface Module {
  id: string;
  courseId: string;
  title: string;
  description?: string;
  orderNumber: number;
  createdAt: string;
  lessons?: Lesson[] | null;
  course?: Course | null;
}
export interface SummaryRequestDTO {
  courseId: string;
  userId: string;
}

export interface Lesson {
  id: string;
  moduleId: string;
  title: string;
  content?: string;
  durationMinutes?: number;
  orderNumber: number;
  createdAt: string;
  module?: Module | null;
  wordList?: Word[] | null;
  quizList?: Quiz[] | null;
  userLessonProgress?: UserLessonProgress[] | null;
}

export interface Word {
  id: string;
  lessonId: string;
  text: string;
  videoSrc: string;
}

export interface Quiz {
  id: string;
  lessonId: string;
  question: string;
  videoUrl?: string;
  quizOptions?: QuizOption[];
  correctAnswer: string;
  explanation?: string;
  maxScore?: number;
  createdAt: string;
  lesson?: Lesson | null;
  attempts?: QuizAttempt[] | null;
}

export interface QuizOption {
  id: string;
  text: string;
  isCorrect: boolean;
}

export interface UserLessonProgress {
  userId: string;
  lessonId: string;
  completedAt?: Date;
  user?: Profile | null;
  lesson?: Lesson | null;
  isActive: boolean;
}

export interface UserQuizProgress {
  userId: string;
  quizId: string;
  completedAt?: Date;
  user?: Profile | null;
  quiz?: Quiz | null;
}

export interface UserCourseProgress {
  userId: string;
  courseId: string;
  completedAt?: Date;
  user?: Profile | null;
  course?: Course | null;
  isActive: boolean;
}

export interface UserModuleProgress {
  userId: string;
  moduleId: string;
  completedAt?: Date;
  user?: Profile | null;
  module?: Module | null;
  isActive: boolean;
}

export interface QuizAttempt {
  id: string;
  userId: string;
  quizId: string;
  selectedAnswer?: string;
  score: number;
  completedAt: string;
  user: Profile;
  quiz: Quiz;
}

export interface Profile {
  id: string;
  username?: string;
  email?: string;
  roleId?: string;
  avatarUrl?: string;
  preferredLanguageId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CourseCategory {
  id: string;
  name: string;
  description?: string;
  parentId?: string;
  createdAt: string;
  parent?: CourseCategory;
  subcategories: CourseCategory[];
  courses: Course[];
}

export interface Language {
  id: string;
  code: string;
  name: string;
  region?: string;
  isActive: boolean;
  createdAt: string;
  profiles: Profile[];
  courses: Course[];
}

export interface SummaryResponse {
  totalLessonsCompleted: number;
  totalLessons: number;
  totalModulesCompleted: number;
  totalModules: number;
  totalCourseCompleted: number;
  totalCourse: number;
  activeLesson: Lesson | null;
  activities: Activities | null;
}

export interface CourseListResponse {
  learningCourses: Course[];
  remainingCourses: Course[];
}

export interface Activities {
  recentLessonsCompleted: number;
  recentModulesCompleted: number;
  recentCoursesCompleted: number;
}

export interface ListVideoSuggestResult {
  videoThumbnail: string;
  id: string;
  title: string;
  description: string;
  videoUrl: string;
  publishDate: string;
  videoId: string;
}

export interface VideoSuggest {
  videoSuggest: ListVideoSuggestResult[] | null;
  isLoadFullPage: boolean;
}

export interface VideoHeaderInput {
  headerTitle: string;
  headerDesc: string;
}

export interface VideoTabsInput {
  active: number;
  setActive: (i: number) => void;
}

export interface ReminderDTO {
  email: string;
  message?: string;
  userId?: string;
  timeToSend: string;
  isActive: boolean;
}
