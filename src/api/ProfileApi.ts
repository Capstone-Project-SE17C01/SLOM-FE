"use client";

import { baseApi } from "@/services";
import { CreateReportRequestDTO, HistoryPaymentDTO, ReportType } from "../types/IProfile";
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
  }),
});

export const {
  useGetHistoryPaymentMutation,
  useReportPaymentMutation,
  useGetReportTypeMutation,
} = profileAPI;
