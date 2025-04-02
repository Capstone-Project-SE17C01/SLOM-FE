"use client";

import { TypeAddNewSupervision, TypeUpdateSupervision } from "../user.types";

import { baseApi } from "@/redux/baseApi";

export const authAPI = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getAllSupervision: build.query({
      query: (params) => ({
        url: "/supervisors",
        params: params,
        method: "GET",
        flashError: true,
      }),
      providesTags: ["Supervisions"],
    }),
    getSupervision: build.query({
      query: ({ id }) => ({
        url: `/supervisors/${id}`,
        method: "GET",
        flashError: true,
      }),
      providesTags: (result, error, { id }) => [{ type: "Supervisions", id }],
    }),
    addNewSupervision: build.mutation({
      query: (data: TypeAddNewSupervision) => ({
        url: "/supervisors",
        method: "POST",
        body: data,
        flashError: true,
      }),
      invalidatesTags: (result, error) => {
        if (error) return [];

        return ["Supervisions"];
      },
    }),
    updateSupervision: build.mutation({
      query: (data: TypeUpdateSupervision) => {
        const { params, body } = data;
        const { id } = params;

        return {
          url: `/supervisors/${id}`,
          method: "PATCH",
          body: body,
          flashError: true,
        };
      },
      invalidatesTags: (result, error, { params: { id } }) => [
        { type: "Supervisions", id },
      ],
    }),
    deleteSupervision: build.mutation({
      query: ({ id }) => {
        return {
          url: `/supervisors/${id}`,
          method: "DELETE",
          flashError: true,
        };
      },
      invalidatesTags: (result, error) => {
        if (error) return [];

        return ["Supervisions"];
      },
    }),
    activeSupervision: build.mutation({
      query: (data: TypeUpdateSupervision) => {
        const { params, body } = data;
        const { id } = params;

        return {
          url: `/supervisors/${id}/setIsActive`,
          method: "PATCH",
          flashError: true,
          body: body,
        };
      },
      invalidatesTags: ["Supervisions"],
    }),
  }),
});

export const {
  useGetAllSupervisionQuery,
  useGetSupervisionQuery,
  useAddNewSupervisionMutation,
  useUpdateSupervisionMutation,
  useDeleteSupervisionMutation,
  useActiveSupervisionMutation,
} = authAPI;
