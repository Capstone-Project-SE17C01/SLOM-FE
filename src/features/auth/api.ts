"use client";

import { baseApi } from "@/redux/baseApi";
import { User } from "firebase/auth";

export const authAPI = baseApi.injectEndpoints({
  endpoints: (build) => ({
    loginWithGoogle: build.mutation({
      query: (data: User) => ({
        url: "/api/v1/auth/loginWithGoogle",
        method: "POST",
        body: data,
        flashError: true,
      }),
    }),
  }),
});

export const { useLoginWithGoogleMutation } = authAPI;
