import { Dispatch, SetStateAction } from "react";

export interface QuestionViewProps {
  setIsResponseQuestion: Dispatch<SetStateAction<boolean>>;
  setIsSpecifiedPage: Dispatch<SetStateAction<boolean>>;
  userInfo: {
    id?: string;
    username?: string;
    email: string;
    avatarUrl: string;
    role?: string;
    preferredLanguageId?: string;
    firstname?: string;
    lastname?: string;
  } | null;
  setDetailQuestion: Dispatch<SetStateAction<QuestionResponseDTO | undefined>>
  setAllQuestion: Dispatch<SetStateAction<QuestionResponseDTO[] | null | undefined>>
  allQuestion: QuestionResponseDTO[] | null | undefined
  setIsLoadFull: Dispatch<SetStateAction<boolean>>
  isLoadFull: boolean
  setSavedScrollPosition: Dispatch<SetStateAction<ScrollPosition | null>>
  savedScrollPosition: ScrollPosition | null
}

export interface NewQuestionProps {
  setIsNewQuestion: Dispatch<SetStateAction<boolean>>;
  userInfo: {
    id?: string;
    username?: string;
    email: string;
    avatarUrl: string;
    role?: string;
    preferredLanguageId?: string;
    firstname?: string;
    lastname?: string;
  } | null;
}

export interface AnswerDetailQuestionViewProps {
  specificThread: AnswerResponseDTO[] | undefined | null
}

export interface NewAnswerProps {
  setIsResponseQuestion: Dispatch<SetStateAction<boolean>>;
  userInfo: {
    id?: string;
    username?: string;
    email: string;
    avatarUrl: string;
    role?: string;
    preferredLanguageId?: string;
    firstname?: string;
    lastname?: string;
  } | null;
  question: QuestionResponseDTO | undefined;
}

export interface NewQuestionPopupProps {
  setIsNewQuestion: Dispatch<SetStateAction<boolean>>;
  userInfo: {
    id?: string;
    username?: string;
    email: string;
    avatarUrl: string;
    role?: string;
    preferredLanguageId?: string;
    firstname?: string;
    lastname?: string;
  } | null;
}

export interface DetailQuestionViewProps {
  setIsResponseQuestion: Dispatch<SetStateAction<boolean>>
  setIsSpecifiedPage: Dispatch<SetStateAction<boolean>>
  question: QuestionResponseDTO | undefined
}

export interface Author {
  username: string;
  profileImage: string;
}

export interface PostQuestionRequestDTO {
  creatorId: string | undefined;
  content: string;
  images?: string[];
  privacy?: string;
}

export interface QuestionResponseDTO {
  questionId: string;
  createdAt: string;
  author: Author;
  content: string;
  images: string[];
  answerAmount: number;
  isFull: boolean;
}

export interface UploadImageDTO {
  setFiles: Dispatch<SetStateAction<File[]>>
}

export interface PostAnswerRequestDTO {
  creatorId: string | undefined;
  questionId: string | undefined;
  content: string;
  images?: string[];
}

export interface AnswerResponseDTO {
  answerId: string;
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