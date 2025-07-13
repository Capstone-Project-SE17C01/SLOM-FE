"use client";

import { baseApi } from "@/redux/baseApi";
import { APIResponse } from "../auth/types";
import { AnswerResponseDTO, PostAnswerRequestDTO, PostQuestionRequestDTO, QuestionResponseDTO } from "./types";

export const QaAPI = baseApi.injectEndpoints({
  endpoints: (build) => ({
    postQuestion: build.mutation<APIResponse<QuestionResponseDTO>, PostQuestionRequestDTO>(
      {
        query: (request: PostQuestionRequestDTO) => ({
          url: `/api/QA/PostQuestion`,
          method: "POST",
          flashError: false,
          body: {
            creatorId: request.creatorId,
            content: request.content,
            images: request.images,
            privacy: request.privacy
          }
        }),
      }
    ),
    getQuestion: build.mutation<APIResponse<QuestionResponseDTO[]>, number>(
      {
        query: (pageNumber: number) => ({
          url: `/api/QA/GetQuestion?pageNumber=${pageNumber}`,
          method: "GET",
          flashError: false,
        }),
      }
    ),
    postAnswer: build.mutation<APIResponse<AnswerResponseDTO[]>, PostAnswerRequestDTO>(
      {
        query: (request: PostAnswerRequestDTO) => ({
          url: `/api/QA/PostAnswer`,
          method: "POST",
          flashError: false,
          body: {
            creatorId: request.creatorId,
            content: request.content,
            images: request.images,
            questionId: request.questionId
          }
        }),
      }
    ),
    getAnswer: build.mutation<APIResponse<AnswerResponseDTO[]>, string>(
      {
        query: (questionId: string) => ({
          url: `/api/QA/GetAnswer?questionId=${questionId}`,
          method: "GET",
          flashError: false,
        }),
      }
    ),
  }),
});

export const {
  usePostQuestionMutation,
  useGetQuestionMutation,
  usePostAnswerMutation,
  useGetAnswerMutation
} = QaAPI;
