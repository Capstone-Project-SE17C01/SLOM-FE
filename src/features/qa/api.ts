"use client";

import { baseApi } from "@/redux/baseApi";
import { APIResponse } from "../auth/types";
import { PostQuestionRequestDTO, QuestionResponseDTO } from "./types";

export const QaAPI = baseApi.injectEndpoints({
  endpoints: (build) => ({
    postQuestion: build.mutation<APIResponse<QuestionResponseDTO>, PostQuestionRequestDTO>(
      {
        query: (request: PostQuestionRequestDTO) => ({
          url: `/api/QA/PostQuestion?creatorId=${request.creatorId}&content=${request.content}&images=${request.images}&privacy=${request.privacy}`,
          method: "GET",
          flashError: false,
        }),
      }
    ),
  }),
});

export const {
  usePostQuestionMutation,
} = QaAPI;
