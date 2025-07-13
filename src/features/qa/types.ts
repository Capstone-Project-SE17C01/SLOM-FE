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
    specificThread: {
    thread_id: number;
    date_created: string;
    author: {
        author_id: number;
        username: string;
        profile_image: string;
        bio: string;
    };
    content: string;
    images: string[];
    comments: {
        comment_id: number;
        author: {
            author_id: number;
            username: string;
            profile_image: string;
            bio: string;
        };
        content: string;
        date_created: string;
        images: never[];
    }[];
    commentCount: number;
}
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
}

export interface Author {
  username: string;
  profileImage: string;
}

export interface PostQuestionRequestDTO {
  creatorId: string;
  content: string;
  images: string[];
  privacy: string;
}

export interface QuestionResponseDTO {
  questionId: string;
  createdAt: string;
  author: Author;
  content: string;
  images: string[];
  answerAmount: number;
}