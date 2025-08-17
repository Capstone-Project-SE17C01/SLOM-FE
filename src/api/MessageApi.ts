"use client";

import { baseApi } from "@/services";
import type {
  GetProfileByNameRequestDTO,
  MessageRequest
} from "../types/IMessage";

export const authAPI = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getProfileByName: build.mutation({
      query: (data: GetProfileByNameRequestDTO) => ({
        url: `/api/Profile/GetProfileByName?input=${data.input}&currentUserEmail=${data.currentUserEmail}`,
        method: "GET",
        flashError: true,
      }),
    }),
    getUserById: build.mutation({
      query: (data: string) => ({
        url: `/api/Message/GetUserMessage?UserId=${data}`,
        method: "GET",
        flashError: true,
      }),
    }),
    getMessageById: build.mutation({
      query: (data: MessageRequest) => ({
        url: `/api/Message/GetMessage?userId=${data.id}&receiverEmail=${data.otherUserName}&pageNumber=${data.pageNumber}`,
        method: "GET",
        flashError: true,
      }),
    }),
    markIsRead: build.mutation({
      query: (data: { senderEmail: string; receiverEmail: string }) => ({
        url: `/api/Message/MarkIsRead?senderEmail=${data.senderEmail}&receiverEmail=${data.receiverEmail}`,
        method: "PUT",
        flashError: false,
      }),
    }),
    getMessageNotRead: build.mutation({
      query: (userId: string) => ({
        url: `/api/Message/GetMessageNotRead?userId=${userId}`,
        method: "GET",
        flashError: false,
      }),
    }),
  }),
});

export const {
  useGetProfileByNameMutation,
  useGetUserByIdMutation,
  useGetMessageByIdMutation,
  useMarkIsReadMutation,
  useGetMessageNotReadMutation
} = authAPI;
