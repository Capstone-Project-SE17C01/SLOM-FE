"use client";

import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

import { getClientCookie } from "@/lib/jsCookies";
import constants from "@/settings/constants";

const baseQuery = fetchBaseQuery({
  baseUrl: constants.API_SERVER,
  prepareHeaders: (headers) => {
    const accessToken = getClientCookie("accessToken");

    if (accessToken) {
      headers.set("Authorization", `Bearer ${accessToken}`);
    }

    return headers;
  },
});

export const UploadApi = createApi({
  reducerPath: "uploadApi",
  baseQuery: baseQuery,
  endpoints: (build) => ({
    uploadImage: build.mutation({
      query: (body: FormData) => {
        return {
          url: `/categories/upload-image`,
          method: "POST",
          body: body,
          flashError: true,
          formData: true,
        };
      },
    }),
  }),
});

export const { useUploadImageMutation } = UploadApi;
