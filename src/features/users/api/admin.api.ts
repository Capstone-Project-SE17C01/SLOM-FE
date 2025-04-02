"use client";

import { TypeAddNewAdmin } from "../user.types";

import { baseApi } from "@/redux/baseApi";

export const authAPI = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getAllAdmin: build.query({
      query: (params) => ({
        url: "/admin",
        params: params,
        method: "GET",
        flashError: true,
      }),
      providesTags: ["Admin"],
    }),
    getAdmin: build.query({
      query: ({ id }) => ({
        url: `/admin/${id}`,
        method: "GET",
        flashError: true,
      }),
      providesTags: (result, error, { id }) => [{ type: "Admin", id }],
    }),
    addNewAdmin: build.mutation({
      query: (data: TypeAddNewAdmin) => ({
        url: "/admin",
        method: "POST",
        body: data,
        flashError: true,
      }),
      invalidatesTags: (result, error) => {
        if (error) return [];

        return ["Admin"];
      },
    }),
    updateAdmin: build.mutation({
      query: (data) => {
        const { params, body } = data;
        const { id } = params;

        return {
          url: `/admin/${id}`,
          method: "PATCH",
          body: body,
          flashError: true,
        };
      },
      invalidatesTags: (result, error, { params: { id } }) => [
        { type: "Admin", id },
      ],
    }),
    deleteAdmin: build.mutation({
      query: ({ id }) => {
        return {
          url: `/admin/${id}`,
          method: "DELETE",
          flashError: true,
        };
      },
      invalidatesTags: (result, error) => {
        if (error) return [];

        return ["Admin"];
      },
    }),
    activeAdmin: build.mutation({
      query: (data) => {
        const { params, body } = data;
        const { id } = params;

        return {
          url: `/admin/${id}`,
          method: "PUT",
          body: body,
          flashError: true,
        };
      },
      invalidatesTags: (result, error) => {
        if (error) return [];

        return ["Admin"];
      },
    }),
  }),
});

export const {
  useGetAllAdminQuery,
  useGetAdminQuery,
  useAddNewAdminMutation,
  useUpdateAdminMutation,
  useDeleteAdminMutation,
  useActiveAdminMutation,
} = authAPI;
