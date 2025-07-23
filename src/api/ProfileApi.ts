"use client";

import { baseApi } from "@/services";
import { CreateReportRequestDTO, HistoryPaymentDTO, IProfile, ReportType } from "../types/IProfile";
import { APIResponse } from "../types/IAuth";

export const profileAPI = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getHistoryPayment: build.mutation<APIResponse<HistoryPaymentDTO[]>, string>(
      {
        query: (userId) => ({
          url: `/api/Payment/GetAllPaymentInformation?userId=${userId}`,
          method: "GET",
          flashError: false,
        }),
      }
    ),
    reportPayment: build.mutation<APIResponse<void>, CreateReportRequestDTO>({
      query: (data) => ({
        url: `/api/Report/CreateReport`,
        method: "POST",
        flashError: false,
        body: data,
      }),
    }),
    getReportType: build.mutation<APIResponse<ReportType[]>, void>({
      query: () => ({
        url: `/api/ReportType/GetAllReportType`,
        method: "GET",
      }),
    }),
    getProfile: build.query<APIResponse<IProfile>, string>({
      query: (email) => ({
        url: `/api/Profile?email=${email}`,
        method: "GET",
      }),
    }),
    updateProfile: build.mutation<APIResponse<void>, IProfile>({
      query: (data) => ({
        url: `/api/Profile`,
        method: "PUT",
        body: data
      }),
    }),
    getAllProfiles: build.query<APIResponse<IProfile[]>, void>({
      query: () => ({
        url: `api/Profile/GetAll`,
        method: "GET",
      }),
    }),
    deleteProfile: build.mutation<APIResponse<void>, string>({
      query: (id) => ({
        url: `api/Profile/${id}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useGetHistoryPaymentMutation,
  useReportPaymentMutation,
  useGetReportTypeMutation,
  useUpdateProfileMutation,
  useGetProfileQuery,
  useGetAllProfilesQuery,
  useDeleteProfileMutation,
} = profileAPI;
