"use client";

import { TypeAddNewstudents, TypeupdateNewstudents } from "../user.types";

import { baseApi } from "@/redux/baseApi";

export const authAPI = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getAllStudents: build.query({
      query: (params) => ({
        url: "/students",
        params: params,
        method: "GET",
        flashError: true,
      }),
      providesTags: ["students"],
    }),
    getStudentById: build.query({
      query: ({ id }) => ({
        url: `/students/${id}`,
        method: "GET",
        flashError: true,
      }),
      providesTags: (result, error, { id }) => [{ type: "students", id }],
    }),
    getStudentByPhone: build.query({
      query: ({ phone }: { phone: string }) => ({
        url: `/students/${phone}`,
        method: "GET",
        flashError: true,
      }),
      providesTags: (result, error, { phone }) => [{ type: "students", phone }],
    }),
    addNewStudent: build.mutation({
      query: (data: TypeAddNewstudents) => ({
        url: "/students",
        method: "POST",
        body: data,
        flashError: true,
      }),
      invalidatesTags: (result, error) => {
        if (error) return [];

        return ["students"];
      },
    }),
    updateStudent: build.mutation({
      query: (data) => {
        const { params, body } = data;
        const { id } = params;

        return {
          url: `/students/${id}`,
          method: "PATCH",
          body: body,
          flashError: true,
        };
      },
      invalidatesTags: (result, error, { params: { id } }) => [
        { type: "students", id },
      ],
    }),
    deleteStudents: build.mutation({
      query: ({ id }) => {
        return {
          url: `/students/${id}`,
          method: "DELETE",
          flashError: true,
        };
      },
      invalidatesTags: (result, error) => {
        if (error) return [];

        return ["students"];
      },
    }),
    activeStudents: build.mutation({
      query: (data: TypeupdateNewstudents) => {
        const { params, body } = data;
        const { id } = params;

        return {
          url: `/students/${id}/isActive`,
          method: "PATCH",
          flashError: true,
          body: body,
        };
      },
      invalidatesTags: (result, error) => {
        if (error) return [];

        return ["students"];
      },
    }),
  }),
});

export const {
  useGetAllStudentsQuery,
  useGetStudentByIdQuery,
  useGetStudentByPhoneQuery,
  useAddNewStudentMutation,
  useUpdateStudentMutation,
  useDeleteStudentsMutation,
  useActiveStudentsMutation,
} = authAPI;
