"use client";

import { baseApi } from "@/services";
import type { Course, Lesson, Module } from "../types/ICourse";
import { APIResponse } from "../types/IAuth";
import { Feedback } from "./FeedbackApi";

export const adminAPI = baseApi.injectEndpoints({
  endpoints: (build) => ({
    //get all feedback
    getListFeedback: build.mutation<Feedback[], void>({
      query: () => ({
        url: `/api/Feedback`,
        method: "GET",
        flashError: false,
      }),
    }),
    //delete feedback
    deleteFeedback: build.mutation<APIResponse<void>, string>({
      query: (id) => ({
        url: `/api/Feedback/${id}`,
        method: "DELETE",
        flashError: false,
      }),
    }),
    //get all module
    getListModule: build.mutation<APIResponse<Module[]>, void>({
      query: () => ({
        url: `/api/Module`,
        method: "GET",
        flashError: false,
      }),
    }),
    //create module
    createModule: build.mutation<APIResponse<Module>, Module>({
      query: (module) => ({
        url: `/api/Module`,
        method: "POST",
        body: module,
      }),
    }),
    //update module
    updateModule: build.mutation<APIResponse<Module>, Module>({
      query: (module) => ({
        url: `/api/Module`,
        method: "PUT",
        body: module,
      }),
    }),
    //delete module
    deleteModule: build.mutation<APIResponse<string>, string>({
      query: (id) => ({
        url: `/api/Module/${id}`,
        method: "DELETE",
        flashError: false,
      }),
    }),
    //get all course
    getListCourse: build.mutation<APIResponse<Course[]>, void>({
      query: () => ({
        url: `/api/Course/GetAllCourse`,
        method: "GET",
        flashError: false,
      }),
    }),
    //create course
    createCourse: build.mutation<APIResponse<Course>, Course>({
      query: (course) => ({
        url: `/api/Course`,
        method: "POST",
        body: course,
      }),
    }),
    //get all lesson
    getListLesson: build.mutation<APIResponse<Lesson[]>, void>({
      query: () => ({
        url: `/api/Lesson`,
        method: "GET",
        flashError: false,
      }),
    }),
    //create lesson
    createLesson: build.mutation<APIResponse<Lesson>, Lesson>({
      query: (lesson) => ({
        url: `/api/Lesson`,
        method: "POST",
        body: lesson,
      }),
    }),
    //update lesson
    updateLesson: build.mutation<APIResponse<Lesson>, Lesson>({
      query: (lesson) => ({
        url: `/api/Lesson`,
        method: "PUT",
        body: lesson,
      }),
    }),
    //delete lesson
    deleteLesson: build.mutation<APIResponse<void>, string>({
      query: (id) => ({
        url: `/api/Lesson/${id}`,
        method: "DELETE",
        flashError: false,
      }),
    }),
  }),
});

export const {
  useGetListFeedbackMutation,
  useDeleteFeedbackMutation,
  useGetListModuleMutation,
  useCreateModuleMutation,
  useCreateCourseMutation,
  useCreateLessonMutation,
  useGetListCourseMutation,
  useGetListLessonMutation,
  useUpdateModuleMutation,
  useUpdateLessonMutation,
  useDeleteModuleMutation,
  useDeleteLessonMutation,
} = adminAPI;
