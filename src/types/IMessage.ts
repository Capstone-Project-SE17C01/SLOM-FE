import { HubConnection } from "@microsoft/signalr";
import { Dispatch, SetStateAction } from "react";

export interface GetProfileByNameRequestDTO {
  input: string;
  currentUserEmail: string | undefined;
}

export interface SearchUserProps {
  readonly isSearch: boolean;
  readonly setIsSearch: Dispatch<SetStateAction<boolean>>;
  readonly setListSearchUser: Dispatch<SetStateAction<User[]>>;
}

export interface User {
  id: number;
  name: string;
  image: string;
  lastMessage: string;
  isSender: boolean;
  isSeen: boolean;
  lastSent: string;
  email: string;
}

export interface SearchUserMessageProps {
  readonly userId: string;
  readonly handleUserSelect: (user: User) => void;
}

export interface MessageBoxProps {
  readonly messages: Message[];
  readonly setMessages: Dispatch<SetStateAction<Message[]>>;
  readonly userId: string;
  readonly selectedUser: User | undefined;
}

export interface Message {
  id: number;
  content: string;
  isSender: boolean
};

export interface MessageRequest {
  id: string;
  otherUserName: string | undefined;
  pageNumber: number;
}

export interface MessageResponse {
  isLoadFullPage: boolean;
  data: Message[];
}

export interface InitSignalROptions {
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
  selectedUser: User | undefined;
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  onConnectionCreated?: (connection: HubConnection) => void;
}