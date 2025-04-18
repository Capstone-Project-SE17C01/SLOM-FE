"use client";

import { baseApi } from "@/redux/baseApi";
import type {
  GetProfileByNameRequestDTO,
  MessageRequest
} from "./types";

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
  }),
});

export const {
  useGetProfileByNameMutation,
  useGetUserByIdMutation,
  useGetMessageByIdMutation
} = authAPI;
