"use client";

import { baseApi } from "@/redux/baseApi";

export const authAPI = baseApi.injectEndpoints({
  endpoints: (build) => ({
    loginWithGoogle: build.mutation({
      query: (data) => ({
        url: "/auth/google",
        method: "POST",
        body: data,
        flashError: true,
      }),
    }),
  }),
});

export const { useLoginWithGoogleMutation } = authAPI;
