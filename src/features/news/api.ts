"use client";

import { TypeAddNewNews, TypeUpdateNews } from "./news.type";

import { baseApi } from "@/redux/baseApi";

export const newsAPI = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getAllNews: build.query({
      query: (params) => ({
        url: "/news",
        params: params,
        method: "GET",
        flashError: true,
      }),
      providesTags: ["News"],
    }),
    getNews: build.query({
      query: ({ id }) => ({
        url: `/news/${id}`,
        method: "GET",
        flashError: true,
      }),
      providesTags: (result, error, { id }) => [{ type: "News", id }],
    }),
    addNewNews: build.mutation({
      query: (data: TypeAddNewNews) => ({
        url: "/news",
        method: "POST",
        body: data,
        flashError: true,
      }),
    }),
    updateNews: build.mutation({
      query: (data: TypeUpdateNews) => {
        const { params, body } = data;
        const { id } = params;

        return {
          url: `/news/${id}`,
          method: "PATCH",
          body: body,
          flashError: true,
        };
      },
      invalidatesTags: (result, error, { params: { id } }) => [
        { type: "News", id },
      ],
    }),
    deleteNews: build.mutation({
      query: ({ id }) => {
        return {
          url: `/news/${id}`,
          method: "DELETE",
          flashError: true,
        };
      },
      invalidatesTags: ["News"],
    }),
  }),
});

export const {
  useGetAllNewsQuery,
  useGetNewsQuery,
  useAddNewNewsMutation,
  useUpdateNewsMutation,
  useDeleteNewsMutation,
} = newsAPI;
