"use client";

import { TypeAddNewManager } from "../user.types";

import { baseApi } from "@/redux/baseApi";

export const authAPI = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getAllManager: build.query({
      query: (params) => ({
        url: "/manager",
        params: params,
        method: "GET",
        flashError: true,
      }),
      providesTags: ["Manager"],
    }),
    getManager: build.query({
      query: ({ id }) => ({
        url: `/manager/${id}`,
        method: "GET",
        flashError: true,
      }),
      providesTags: (result, error, { id }) => [{ type: "Manager", id }],
    }),
    addNewManager: build.mutation({
      query: (data: TypeAddNewManager) => ({
        url: "/manager",
        method: "POST",
        body: data,
        flashError: true,
      }),
      invalidatesTags: (result, error) => {
        if (error) return [];

        return ["Manager"];
      },
    }),
    updateManager: build.mutation({
      query: (data) => {
        const { params, body } = data;
        const { id } = params;

        return {
          url: `/manager/${id}`,
          method: "PATCH",
          body: body,
          flashError: true,
        };
      },
      invalidatesTags: (result, error, { params: { id } }) => [
        { type: "Manager", id },
      ],
    }),
    deleteManager: build.mutation({
      query: ({ id }) => {
        return {
          url: `/manager/${id}`,
          method: "DELETE",
          flashError: true,
        };
      },
      invalidatesTags: (result, error) => {
        if (error) return [];

        return ["Manager"];
      },
    }),
    activeManager: build.mutation({
      query: (data) => {
        const { params, body } = data;
        const { id } = params;

        return {
          url: `/manager/${id}`,
          method: "PUT",
          flashError: true,
          body: body,
        };
      },
      invalidatesTags: (result, error) => {
        if (error) return [];

        return ["Manager"];
      },
    }),
  }),
});

export const {
  useGetAllManagerQuery,
  useGetManagerQuery,
  useAddNewManagerMutation,
  useUpdateManagerMutation,
  useDeleteManagerMutation,
  useActiveManagerMutation,
} = authAPI;
