"use client";

import { baseApi } from "@/services";
import { APIResponse } from "../types/IAuth";
import { AnswerRequestDTO, AnswerResponseDTO, GetQuestionRequest, PostAnswerRequestDTO, PostQuestionRequestDTO, QuestionResponseDTO, UpdateQuestionRequestDTO } from "../types/IQa";

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
    getQuestion: build.mutation<APIResponse<QuestionResponseDTO[]>, GetQuestionRequest>(
      {
        query: (request: GetQuestionRequest) => ({
          url: `/api/QA/GetQuestion?pageNumber=${request.pageNumber}&userId=${request.userId}&isCurrentUser=${request.isCurrentUser}&isAdmin=${request.isAdmin ?? false}`,
          method: "GET",
          flashError: false,
        }),
      }
    ),
    postAnswer: build.mutation<APIResponse<AnswerResponseDTO>, PostAnswerRequestDTO>(
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
    getAnswer: build.mutation<APIResponse<AnswerResponseDTO[]>, AnswerRequestDTO>(
      {
        query: (data: AnswerRequestDTO) => ({
          url: `/api/QA/GetAnswer?questionId=${data.questionId}&page=${data.page}`,
          method: "GET",
          flashError: false,
        }),
      }
    ),
    updateQuestion: build.mutation<APIResponse<QuestionResponseDTO>, UpdateQuestionRequestDTO>({
      query: (request: UpdateQuestionRequestDTO) => ({
        url: `/api/QA/UpdateQuestion`,
        method: "PUT",
        flashError: false,
        body: {
          questionId: request.questionId,
          content: request.content,
          images: request.images,
          privacy: request.privacy
        }
      }),
    }),
    deleteQuestion: build.mutation<APIResponse<string>, string>({
      query: (questionId: string) => ({
        url: `/api/QA/DeleteQuestion/${questionId}`,
        method: "DELETE",
        flashError: false,
      }),
    }),
  }),
});

export const {
  usePostQuestionMutation,
  useGetQuestionMutation,
  usePostAnswerMutation,
  useGetAnswerMutation,
  useUpdateQuestionMutation,
  useDeleteQuestionMutation
} = QaAPI;
