"use client";

import { baseApi } from "@/redux/baseApi";
import { User } from "firebase/auth";
import type {
  LoginRequestDTO,
  ConfirmRegisterationRequestDTO,
  RegisterationRequestDTO,
  ResendConfirmationCodeDTO,
  ForgotPasswordRequestDTO,
} from "./types";

export const authAPI = baseApi.injectEndpoints({
  endpoints: (build) => ({
    loginWithGoogle: build.mutation({
      query: (data: User) => ({
        url: "/api/auth/loginWithGoogle",
        method: "POST",
        body: data,
        flashError: true,
      }),
    }),
    login: build.mutation({
      query: (data: LoginRequestDTO) => ({
        url: "/api/auth/login",
        method: "POST",
        body: data,
        flashError: true,
      }),
    }),
    register: build.mutation({
      query: (data: RegisterationRequestDTO) => ({
        url: "/api/auth/register",
        method: "POST",
        body: data,
        flashError: true,
      }),
    }),
    confirmRegistration: build.mutation({
      query: (data: ConfirmRegisterationRequestDTO) => ({
        url: "/api/auth/confirmRegistration",
        method: "POST",
        body: {
          ...data,
          isPasswordReset: data.isPasswordReset || false,
        },
        flashError: true,
      }),
    }),
    resendConfirmationCode: build.mutation({
      query: (data: ResendConfirmationCodeDTO) => ({
        url: "/api/auth/resendConfirmationCode",
        method: "POST",
        body: data,
        responseHandler: async (response) => ({
          data: await response.text(),
          status: response.status
        }),
        flashError: true,
      }),
    }),
    forgotPassword: build.mutation({
      query: (data: ForgotPasswordRequestDTO) => ({
        url: "/api/auth/forgotPassword",
        method: "POST",
        body: data,
        flashError: true,
      }),
    }),
  }),
});

export const {
  useLoginWithGoogleMutation,
  useRegisterMutation,
  useLoginMutation,
  useConfirmRegistrationMutation,
  useResendConfirmationCodeMutation,
  useForgotPasswordMutation,
} = authAPI;
