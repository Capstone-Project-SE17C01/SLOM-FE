"use client";

import { baseApi } from "@/redux/baseApi";
import type {
  Course,
  CourseDashboardViewModel,
  DashboardDataRequestDTO,
  Lesson,
  Quiz,
  UserCourseProgress,
  UserLessonProgress,
  UserModuleProgress,
} from "./types";
import { APIResponse } from "../auth/types";

export const courseAPI = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getCourseById: build.mutation<APIResponse<Course>, string>({
      query: (id: string) => ({
        url: `/api/Course/GetCourseById?id=${id}`,
        method: "GET",
        flashError: false,
      }),
    }),
    getCourseByCategoryId: build.mutation<APIResponse<Course[]>, string>({
      query: (categoryId: string) => ({
        url: `/api/Course/GetCourseByCategoryId?categoryId=${categoryId}`,
        method: "GET",
        flashError: false,
      }),
    }),
    getCourseByLanguageId: build.mutation<APIResponse<Course[]>, string>({
      query: (languageId: string) => ({
        url: `/api/Course/GetCourseByLanguageId?languageId=${languageId}`,
        method: "GET",
        flashError: false,
      }),
    }),
    getCourseDashboardData: build.mutation<
      APIResponse<CourseDashboardViewModel>,
      DashboardDataRequestDTO
    >({
      query: ({ courseId, userId }) => ({
        url: `/api/Course/GetCourseDashboardData?courseId=${courseId}&userId=${userId}`,
        method: "GET",
        flashError: false,
      }),
    }),
    getUserCourseProgress: build.mutation<
      APIResponse<UserCourseProgress>,
      { userId: string; courseId: string }
    >({
      query: ({ userId, courseId }) => ({
        url: `/api/Course/GetUserCourseProgress?userId=${userId}&courseId=${courseId}`,
        method: "GET",
        flashError: false,
      }),
    }),
    getUserModuleProgress: build.mutation<
      APIResponse<UserModuleProgress>,
      { userId: string; moduleId: string }
    >({
      query: ({ userId, moduleId }) => ({
        url: `/api/Course/GetUserModuleProgress?userId=${userId}&moduleId=${moduleId}`,
        method: "GET",
        flashError: false,
      }),
    }),
    getLearnedLessonByUserId: build.mutation<
      APIResponse<Lesson[]>,
      { userId: string }
    >({
      query: ({ userId }) => ({
        url: `/api/Course/GetLearnedLessonByUserId?userId=${userId}`,
        method: "GET",
        flashError: false,
      }),
    }),
    getUserLessonProgress: build.mutation<
      APIResponse<UserLessonProgress[]>,
      { userId: string; lessonId: string }
    >({
      query: ({ userId, lessonId }) => ({
        url: `/api/Course/GetUserLessonProgress?userId=${userId}&lessonId=${lessonId}`,
        method: "GET",
        flashError: false,
      }),
    }),
    getAllQuizByLessonId: build.mutation<APIResponse<Quiz[]>, string>({
      query: (lessonId: string) => ({
        url: `/api/Course/GetAllQuizByLessonId?lessonId=${lessonId}`,
        method: "GET",
        flashError: false,
      }),
    }),
    getLessonByModuleId: build.mutation<APIResponse<Lesson[]>, string>({
      query: (moduleId: string) => ({
        url: `/api/Course/GetLessonByModuleId?moduleId=${moduleId}`,
        method: "GET",
        flashError: false,
      }),
    }),
  }),
});

export const {
  useGetCourseByIdMutation,
  useGetCourseByCategoryIdMutation,
  useGetCourseByLanguageIdMutation,
  useGetCourseDashboardDataMutation,
  useGetUserCourseProgressMutation,
  useGetUserModuleProgressMutation,
  useGetLearnedLessonByUserIdMutation,
  useGetUserLessonProgressMutation,
  useGetAllQuizByLessonIdMutation,
} = courseAPI;
