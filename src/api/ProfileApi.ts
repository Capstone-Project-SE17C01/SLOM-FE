"use client";

import { baseApi } from "@/services";
import {
  IProfile,
  ReportType,
} from "../types/IProfile";
import { APIResponse } from "../types/IAuth";

export const profileAPI = baseApi.injectEndpoints({
  endpoints: (build) => ({
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
        body: data,
      }),
    }),
    editUpdateAt: build.mutation<APIResponse<void>, { email: string }>(
      {
        query: ({ email }) => ({
          url: `/api/Profile/EditUpdateAt?email=${encodeURIComponent(email)}`,
          method: "PUT",
          // KHÔNG cần body
          flashError: false,
        }),
      }
    ),
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
  overrideExisting: true,
});

export const {
  useGetReportTypeMutation,
  useUpdateProfileMutation,
  useGetProfileQuery,
  useGetAllProfilesQuery,
  useDeleteProfileMutation,
  useEditUpdateAtMutation,
} = profileAPI;
