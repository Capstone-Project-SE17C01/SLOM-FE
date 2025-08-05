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
            privacy: request.privacy,
            tags: request.tags
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
          privacy: request.privacy,
          tags: request.tags
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
    getTags: build.query<APIResponse<string[]>, void>({
      query: () => ({
        url: `/api/QA/GetTags`,
        method: "GET",
        flashError: false,
      }),
    }),
    getQuestionByTag: build.mutation<APIResponse<QuestionResponseDTO[]>, {tags: string[], pageNumber: number, userId: string, isCurrentUser: boolean, isAdmin?: boolean}>({
      query: (request) => {
        // Ensure tags is always an array, even if empty
        const tags = Array.isArray(request.tags) ? request.tags : [];
        
        // Build URL with all parameters except tags
        const queryParams = new URLSearchParams();
        queryParams.append('pageNumber', request.pageNumber.toString());
        queryParams.append('userId', request.userId);
        queryParams.append('isCurrentUser', request.isCurrentUser.toString());
        queryParams.append('isAdmin', (request.isAdmin ?? false).toString());
        
        return {
          url: `/api/QA/GetQuestionByTag?${queryParams.toString()}`,
          method: "POST",
          flashError: false,
          // Send tags array directly as the body, not as a property in an object
          body: tags.length > 0 ? tags : ["placeholder"]
        };
      },
    }),
  }),
});

export const {
  usePostQuestionMutation,
  useGetQuestionMutation,
  usePostAnswerMutation,
  useGetAnswerMutation,
  useUpdateQuestionMutation,
  useDeleteQuestionMutation,
  useGetTagsQuery,
  useGetQuestionByTagMutation
} = QaAPI;
