"use client";

import { baseApi } from "@/services";
import type {
  LoginRequestDTO,
  ConfirmRegisterationRequestDTO,
  RegisterationRequestDTO,
  ResendConfirmationCodeDTO,
  ForgotPasswordRequestDTO,
  ReturnUrlQueryDTO,
  CreatePaymentRequestDTO,
  APIResponse,
  SubscriptionPlanDTO,
  LoginWithGoogleRequestDTO,
  UpdatePasswordRequestDTO,
  ChangeLanguageRequestDTO,
  ChangeLanguageResponseDTO,
} from "../types/IAuth";
import { authSlice } from "../redux/auth/slice";

export const authAPI = baseApi.injectEndpoints({
  endpoints: (build) => ({
    loginWithGoogle: build.mutation({
      query: (data: LoginWithGoogleRequestDTO) => ({
        url: "/api/auth/loginWithGoogle",
        method: "POST",
        body: data,
        flashError: true,
      }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data: loginData } = await queryFulfilled;
          if (loginData?.result?.userEmail) {
            const profileResult = await dispatch(
              authAPI.endpoints.getUserProfile.initiate(
                loginData.result.userEmail
              )
            ).unwrap();

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
                    preferredLanguageId: user.preferredLanguageId,
                    languageCode: user.languageCode,
                    courseTitle: "chooseCourse",
                  },
                  accessToken: loginData.result.accessToken,
                })
              );
            }
          }
        } catch (error) {
          console.log("Error fetching user profile:", error);
        }
      },
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
          if (loginData?.result?.userEmail) {
            const profileResult = await dispatch(
              authAPI.endpoints.getUserProfile.initiate(
                loginData.result.userEmail
              )
            ).unwrap();

            if (profileResult?.result) {
              const user = profileResult.result;
              const roleName = loginData.result.roleName || '';
              dispatch(
                authSlice.actions.setCredentials({
                  userInfo: {
                    id: user.id,
                    email: user.email,
                    username: user.username,
                    avatarUrl: user.avatarUrl || "",
                    role: user.roleId,
                    roleName: roleName,
                    preferredLanguageId: user.preferredLanguageId,
                    languageCode: user.languageCode,
                    courseTitle: "chooseCourse",
                    vipUser: user.vipUser || false,
                  },
                  accessToken: loginData.result.accessToken,
                })
              );
            }
          }
        } catch (error) {
          console.log("Error fetching user profile:", error);
        }
      },
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
          status: response.status,
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
    getAllPlan: build.query<APIResponse<SubscriptionPlanDTO>, void>({
      query: () => ({
        url: "/api/Payment/GetAllPlan",
        method: "GET",
        flashError: false,
      }),
    }),
    createPaymentLink: build.mutation({
      query: (data: CreatePaymentRequestDTO) => ({
        url: "/api/Payment/CreatePaymentLink",
        method: "POST",
        body: data,
        flashError: false,
      }),
    }),
    updatePlan: build.mutation({
      query: (data: ReturnUrlQueryDTO) => ({
        url: "/api/Payment/UpdatePlan",
        method: "POST",
        body: data,
        flashError: false,
      }),
    }),
    updatePassword: build.mutation({
      query: (data: UpdatePasswordRequestDTO) => ({
        url: "/api/auth/updatePassword",
        method: "POST",
        body: data,
        flashError: false,
      }),
    }),
    changeLanguage: build.mutation<
      APIResponse<ChangeLanguageResponseDTO>,
      ChangeLanguageRequestDTO
    >({
      query: (data: ChangeLanguageRequestDTO) => ({
        url: "/api/Profile/ChangeLanguage",
        method: "POST",
        body: data,
        flashError: false,
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
  useCreatePaymentLinkMutation,
  useUpdatePlanMutation,
  useGetAllPlanQuery,
  useUpdatePasswordMutation,
  useChangeLanguageMutation,
} = authAPI;
