"use client";

import { baseApi } from "@/services";

export interface ExtractTextRequest {
  videoUrl: string;
}

export interface ExtractTextResponse {
  errorMessages: string[];
  result: {
    text: string;
    audioDuration: number;
    confidence: number;
  };
  pagination: null;
}

export const transcriptApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    extractText: builder.mutation<ExtractTextResponse, ExtractTextRequest>({
      query: (request) => ({
        url: '/api/Transcription',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(request.videoUrl)
      }),
    }),
  }),
});

export const {
  useExtractTextMutation
} = transcriptApi;
