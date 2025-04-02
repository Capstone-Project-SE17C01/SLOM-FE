"use client";

import { Topic, TypeAddNewTopic, TypeUpdateTopic } from "./topic.type";

import { baseApi } from "@/redux/baseApi";

export const authAPI = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getAllTopic: build.query<Topic, any>({
      query: (params) => ({
        url: "/topics",
        params: params,
        method: "GET",
        flashError: true,
      }),
      providesTags: ["Topics"],
    }),
    getTopic: build.query({
      query: ({ id }) => ({
        url: `/topics/${id}`,
        method: "GET",
        flashError: true,
      }),
    }),
    addNewTopic: build.mutation({
      query: (data: TypeAddNewTopic) => ({
        url: "/topics",
        method: "POST",
        body: data,
        flashError: true,
      }),
      invalidatesTags: ["Topics"],
    }),
    updateTopic: build.mutation({
      query: (data: TypeUpdateTopic) => {
        const { params, body } = data;
        const { id } = params;

        return {
          url: `/topics/${id}`,
          method: "PUT",
          body: body,
          flashError: true,
        };
      },
    }),
    deleteTopic: build.mutation({
      query: ({ id }) => {
        return {
          url: `/topics/${id}`,
          method: "DELETE",
          flashError: true,
        };
      },
      invalidatesTags: ["Topics"],
    }),
  }),
});

export const {
  useGetAllTopicQuery,
  useGetTopicQuery,
  useAddNewTopicMutation,
  useUpdateTopicMutation,
  useDeleteTopicMutation,
} = authAPI;
