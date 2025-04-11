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
import { authSlice } from "./slice";

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
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data: loginData } = await queryFulfilled;
          console.log("Login data:", loginData);
          if (loginData?.userEmail) {
            const profileResult = await dispatch(
              authAPI.endpoints.getUserProfile.initiate(loginData.userEmail)
            ).unwrap();

            console.log("Profile result:", profileResult);
            
            if (profileResult?.result) {
              const user = profileResult.result;
              dispatch(
                authSlice.actions.setCredentials({
                  userInfo: {
                    id: user.id,
                    email: user.email,
                    username: user.username,
                    avatarUrl: user.avatarUrl || "",
                    role: user.roleId,
                    preferredLanguageId: user.preferredLanguageId
                  },
                  accessToken: loginData.accessToken
                })
              );
            }
          }
        } catch (error) {
          console.error('Error fetching user profile:', error);
        }
      }
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
    getUserProfile: build.query({
      query: (email) => ({
        url: `/api/Profile?email=${encodeURIComponent(email)}`,
        method: "GET",
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
  useGetUserProfileQuery,
} = authAPI;
