"use client";

import { baseApi } from "@/services";
import { APIResponse, CreatePaymentLinkResponseDTO, CreatePaymentRequestDTO, ReturnUrlQueryDTO, SubscriptionPlanDTO } from "@/types/IAuth";
import { Payment } from "@/types/IPayment";
import { CreateReportRequestDTO, HistoryPaymentDTO } from "@/types/IProfile";

export const paymentAPI = baseApi.injectEndpoints({
  endpoints: (build) => ({
    // Chuyển từ ProfileApi
    getHistoryPayment: build.mutation<APIResponse<HistoryPaymentDTO[]>, string>({
      query: (userId) => ({
        url: `/api/Payment/GetAllPaymentInformation?userId=${userId}`,
        method: "GET",
        flashError: false,
      }),
    }),
    
    reportPayment: build.mutation<APIResponse<void>, CreateReportRequestDTO>({
      query: (data) => ({
        url: `/api/Report/CreateReport`,
        method: "POST",
        flashError: false,
        body: data,
      }),
    }),

    // Chuyển từ AuthApi
    getAllPlan: build.query<APIResponse<SubscriptionPlanDTO>, void>({
      query: () => ({
        url: "/api/Payment/GetAllPlan",
        method: "GET",
        flashError: false,
      }),
    }),

    createPaymentLink: build.mutation<APIResponse<CreatePaymentLinkResponseDTO>, CreatePaymentRequestDTO>({
      query: (data) => ({
        url: "/api/Payment/CreatePaymentLink",
        method: "POST",
        body: data,
        flashError: false,
      }),
    }),

    updatePlan: build.mutation<APIResponse<void>, ReturnUrlQueryDTO>({
      query: (data) => ({
        url: "/api/Payment/UpdatePlan",
        method: "POST",
        body: data,
        flashError: false,
      }),
    }),

    // Chuyển từ AdminApi
    getAllPayments: build.query<APIResponse<Payment[]>, void>({
      query: () => ({
        url: "/api/payment",
        method: "GET",
        flashError: false,
      }),
    }),
  }),
  overrideExisting: true,
});

export const {
  useGetHistoryPaymentMutation,
  useReportPaymentMutation,
  useGetAllPlanQuery,
  useCreatePaymentLinkMutation,
  useUpdatePlanMutation,
  useGetAllPaymentsQuery,
} = paymentAPI;
