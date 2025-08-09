"use client";

import { baseApi } from "@/services";
import { APIResponse } from "../types/IAuth";
import { QuizRequestDTO, QuizResponseDTO, GetQuizByLessonRequest, Quiz } from "../types/IQuiz";
import { Lesson } from "../types/ICourse";

export const QuizAPI = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getListQuizLesson: build.mutation<APIResponse<Quiz[]>, GetQuizByLessonRequest>(
      {
        query: (request: GetQuizByLessonRequest) => ({
          url: `/api/Quiz/GetListQuizLesson?lessonId=${request.lessonId}`,
          method: "GET",
          flashError: false,
        }),
      }
    ),
    getAllQuizzes: build.query<APIResponse<Quiz[]>, void>({
      query: () => ({
        url: `/api/Quiz`,
        method: "GET",
        flashError: false,
      }),
    }),
    getQuizById: build.mutation<APIResponse<Quiz>, string>({
      query: (id: string) => ({
        url: `/api/Quiz/${id}`,
        method: "GET",
        flashError: false,
      }),
    }),
    createQuiz: build.mutation<APIResponse<QuizResponseDTO>, QuizRequestDTO>(
      {
        query: (request: QuizRequestDTO) => ({
          url: `/api/Quiz`,
          method: "POST",
          flashError: false,
          body: {
            lessonId: request.lessonId,
            question: request.question,
            correctAnswer: request.correctAnswer,
            explanation: request.explanation,
            maxScore: request.maxScore
          }
        }),
      }
    ),
    updateQuiz: build.mutation<APIResponse<QuizResponseDTO>, QuizRequestDTO>(
      {
        query: (request: QuizRequestDTO) => ({
          url: `/api/Quiz`,
          method: "PUT",
          flashError: false,
          body: {
            id: request.id,
            lessonId: request.lessonId,
            question: request.question,
            correctAnswer: request.correctAnswer,
            explanation: request.explanation,
            maxScore: request.maxScore
          }
        }),
      }
    ),
    deleteQuiz: build.mutation<APIResponse<string>, string>({
      query: (id: string) => ({
        url: `/api/Quiz/${id}`,
        method: "DELETE",
        flashError: false,
      }),
    }),
    getAllLessons: build.query<APIResponse<Lesson[]>, void>({
      query: () => ({
        url: `/api/Lesson`,
        method: "GET",
        flashError: false,
      }),
    }),
  }),
});

export const {
  useGetListQuizLessonMutation,
  useGetAllQuizzesQuery,
  useGetQuizByIdMutation,
  useCreateQuizMutation,
  useUpdateQuizMutation,
  useDeleteQuizMutation,
  useGetAllLessonsQuery
} = QuizAPI;
