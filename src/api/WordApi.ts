"use client";

import { baseApi } from "@/services";
import { APIResponse } from "../types/IAuth";
import { WordRequestDTO, WordResponseDTO, GetWordByLessonRequest, Word } from "@/types/IWord";

export const WordAPI = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getListWordLesson: build.mutation<APIResponse<Word[]>, GetWordByLessonRequest>(
      {
        query: (request: GetWordByLessonRequest) => ({
          url: `/api/Word/GetListWordLesson?lessonId=${request.lessonId}`,
          method: "GET",
          flashError: false,
        }),
      }
    ),
    getAllWords: build.query<APIResponse<Word[]>, void>({
      query: () => ({
        url: `/api/Word`,
        method: "GET",
        flashError: false,
      }),
    }),
    getWordById: build.mutation<APIResponse<Word>, string>({
      query: (id: string) => ({
        url: `/api/Word/${id}`,
        method: "GET",
        flashError: false,
      }),
    }),
    createWord: build.mutation<APIResponse<WordResponseDTO>, WordRequestDTO>(
      {
        query: (request: WordRequestDTO) => ({
          url: `/api/Word`,
          method: "POST",
          flashError: false,
          body: {
            lessonId: request.lessonId,
            text: request.text,
            videoSrc: request.videoSrc
          }
        }),
      }
    ),
    updateWord: build.mutation<APIResponse<WordResponseDTO>, WordRequestDTO>(
      {
        query: (request: WordRequestDTO) => ({
          url: `/api/Word`,
          method: "PUT",
          flashError: false,
          body: {
            id: request.id,
            lessonId: request.lessonId,
            text: request.text,
            videoSrc: request.videoSrc
          }
        }),
      }
    ),
    deleteWord: build.mutation<APIResponse<string>, string>({
      query: (id: string) => ({
        url: `/api/Word/${id}`,
        method: "DELETE",
        flashError: false,
      }),
    }),
  }),
});

export const {
  useGetListWordLessonMutation,
  useGetAllWordsQuery,
  useGetWordByIdMutation,
  useCreateWordMutation,
  useUpdateWordMutation,
  useDeleteWordMutation,
} = WordAPI;
