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
  setResponseQuestionId: Dispatch<SetStateAction<string>>
  setDetailQuestion: Dispatch<SetStateAction<QuestionResponseDTO | undefined>>
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
  setResponseQuestionId: Dispatch<SetStateAction<string>>
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
}

export interface QuestionNewAnswerProps {
  question: QuestionResponseDTO | undefined
}