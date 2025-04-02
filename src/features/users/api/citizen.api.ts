"use client";

import { TypeAddNewCitizens, TypeupdateNewCitizens } from "../user.types";

import { baseApi } from "@/redux/baseApi";

export const authAPI = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getAllCitizens: build.query({
      query: (params) => ({
        url: "/citizens",
        params: params,
        method: "GET",
        flashError: true,
      }),
      providesTags: ["citizens"],
    }),
    getCitizenById: build.query({
      query: ({ id }) => ({
        url: `/citizens/${id}`,
        method: "GET",
        flashError: true,
      }),
      providesTags: (result, error, { id }) => [{ type: "citizens", id }],
    }),
    getCitizenByPhone: build.query({
      query: ({ phone }: { phone: string }) => ({
        url: `/citizens/${phone}`,
        method: "GET",
        flashError: true,
      }),
      providesTags: (result, error, { phone }) => [{ type: "citizens", phone }],
    }),
    addNewCitizen: build.mutation({
      query: (data: TypeAddNewCitizens) => ({
        url: "/citizens",
        method: "POST",
        body: data,
        flashError: true,
      }),
      invalidatesTags: (result, error) => {
        if (error) return [];

        return ["citizens"];
      },
    }),
    updateCitizen: build.mutation({
      query: (data) => {
        const { params, body } = data;
        const { id } = params;

        return {
          url: `/citizens/${id}`,
          method: "PATCH",
          body: body,
          flashError: true,
        };
      },
      invalidatesTags: (result, error, { params: { id } }) => [
        { type: "citizens", id },
      ],
    }),
    deleteCitizen: build.mutation({
      query: ({ id }) => {
        return {
          url: `/citizens/${id}`,
          method: "DELETE",
          flashError: true,
        };
      },
      invalidatesTags: (result, error) => {
        if (error) return [];

        return ["citizens"];
      },
    }),
    activeCitizen: build.mutation({
      query: (data: TypeupdateNewCitizens) => {
        const { params, body } = data;
        const { id } = params;

        return {
          url: `/citizens/${id}/isActive`,
          method: "PATCH",
          flashError: true,
          body: body,
        };
      },
      invalidatesTags: (result, error) => {
        if (error) return [];

        return ["citizens"];
      },
    }),
  }),
});

export const {
  useGetAllCitizensQuery,
  useGetCitizenByIdQuery,
  useGetCitizenByPhoneQuery,
  useAddNewCitizenMutation,
  useUpdateCitizenMutation,
  useDeleteCitizenMutation,
  useActiveCitizenMutation,
} = authAPI;
