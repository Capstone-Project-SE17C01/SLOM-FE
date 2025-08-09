import { Dispatch, SetStateAction } from "react";

export interface QuestionViewProps {
  setIsResponseQuestion: Dispatch<SetStateAction<boolean>>;
  setIsSpecifiedPage: Dispatch<SetStateAction<boolean>>;
  userInfo: UserInfo | null;
  setDetailQuestion: Dispatch<SetStateAction<QuestionResponseDTO | undefined>>
  isCurrentUser: boolean
  setIsNewQuestion?: Dispatch<SetStateAction<boolean>>
  setQuestion?: Dispatch<SetStateAction<QuestionResponseDTO | undefined>>
  setIsUpdateQuestion?: Dispatch<SetStateAction<boolean>>
  isAdmin?: boolean
}

export interface NewQuestionProps {
  setIsNewQuestion: Dispatch<SetStateAction<boolean>>;
  userInfo: UserInfo | null;
}

export interface AnswerDetailQuestionViewProps {
  specificThread: AnswerResponseDTO[] | undefined | null
}

export interface NewAnswerProps {
  setIsResponseQuestion: Dispatch<SetStateAction<boolean>>;
  userInfo: UserInfo | null;
  question: QuestionResponseDTO | undefined;
  setAnswerOfQuestion: Dispatch<SetStateAction<AnswerResponseDTO[] | null | undefined>>
  setNewAnswerAmount: Dispatch<SetStateAction<NewAnswerAmount[]>>
  newAnswerAmount: NewAnswerAmount[] | undefined
}

export interface NewQuestionPopupProps {
  setIsNewQuestion: Dispatch<SetStateAction<boolean>>;
  userInfo: UserInfo | null;
  isUpdateQuestion: boolean
  question: QuestionResponseDTO | undefined
  setIsUpdateQuestion: Dispatch<SetStateAction<boolean>>
  setQuestion: Dispatch<SetStateAction<QuestionResponseDTO | undefined>>
}

export interface DetailQuestionViewProps {
  setIsResponseQuestion: Dispatch<SetStateAction<boolean>>
  setIsSpecifiedPage: Dispatch<SetStateAction<boolean>>
  question: QuestionResponseDTO | undefined
  setAnswerOfQuestion: Dispatch<SetStateAction<AnswerResponseDTO[] | null | undefined>>
  answersOfQuestion: AnswerResponseDTO[] | null | undefined
  newAnswerAmount: NewAnswerAmount[] | undefined
}

export interface Author {
  username: string;
  profileImage: string;
}

export interface PostQuestionRequestDTO {
  creatorId: string | undefined;
  content: string | undefined;
  images?: string[];
  privacy?: string;
  tags?: string[];
}

export interface QuestionResponseDTO {
  questionId: string;
  createdAt: string;
  author: Author;
  content: string;
  images: string[];
  answerAmount: number;
  isFull: boolean;
  tags?: string[];
}

export interface UploadImageDTO {
  setFiles: Dispatch<SetStateAction<File[]>>
  images: string[]
  setExistImages: Dispatch<SetStateAction<string[] | undefined>> | undefined
  existImage: string[] | undefined
}

export interface PostAnswerRequestDTO {
  creatorId: string | undefined;
  questionId: string | undefined;
  content: string;
  images?: string[];
}

export interface AnswerResponseDTO {
  answerId: string;
  questionId: string;
  createdAt: string;
  author: Author;
  content: string;
  images: string[];
  isFull: boolean;
}

export interface QuestionNewAnswerProps {
  question: QuestionResponseDTO | undefined
}

export interface AnswerRequestDTO {
  page: number;
  questionId: string
}

export interface ScrollPosition {
  x: number;
  y: number;
}

export interface NewAnswerAmount {
  amount: number;
  questionId: string
}

export interface GetQuestionRequest {
  userId: string,
  pageNumber: number,
  isCurrentUser: boolean,
  isAdmin?: boolean
}

export interface UpdateQuestionRequestDTO {
  questionId: string;
  content: string;
  images?: string[];
  privacy: string;
  tags?: string[];
}

export interface UpdateAnswerRequestDTO {
  answerId: string;
  content: string;
  images?: string[];
}

export interface UserInfo {
  id?: string;
  username?: string;
  email: string;
  avatarUrl: string;
  role?: string;
  preferredLanguageId?: string;
  firstname?: string;
  lastname?: string;
}

export interface QuestionTypeToggleProps {
  isCurrentUser: boolean;
  onToggle: (isCurrentUser: boolean) => void;
  className?: string;
  isAdmin?: boolean;
}