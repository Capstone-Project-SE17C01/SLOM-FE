"use client";

import { baseApi } from "@/redux/baseApi";
import type {
  Course,
  Lesson,
  Quiz,
  SummaryRequestDTO,
  SummaryResponse,
  CourseListResponse,
  Module,
  Word,
  VideoSuggest,
  ReminderDTO,
} from "./types";
import { APIResponse } from "../auth/types";

export const courseAPI = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getCourses: build.mutation<APIResponse<CourseListResponse>, string>({
      query: (userId: string) => ({
        url: `/api/Course/GetListCourses?userId=${userId}`,
        method: "GET",
        flashError: false,
      }),
    }),

    getCourseSummary: build.mutation<
      APIResponse<SummaryResponse>,
      SummaryRequestDTO
    >({
      query: ({ courseId, userId }) => ({
        url: `/api/Course/Summary?courseId=${courseId}&userId=${userId}`,
        method: "GET",
        flashError: false,
      }),
    }),

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

    getAllModuleByCourseId: build.mutation<APIResponse<Module[]>, string>({
      query: (courseId: string) => ({
        url: `/api/Module/AllModules?courseId=${courseId}`,
        method: "GET",
        flashError: false,
      }),
    }),

    getOngoingLessonByUserId: build.mutation<APIResponse<Lesson>, string>({
      query: (userId: string) => ({
        url: `/api/Lesson/OngoingLesson?userId=${userId}`,
        method: "GET",
        flashError: false,
      }),
    }),

    getListLearnedLessonByUserId: build.mutation<APIResponse<Lesson[]>, string>(
      {
        query: (userId: string) => ({
          url: `/api/Lesson/GetListLearnedLesson?userId=${userId}`,
          method: "GET",
          flashError: false,
        }),
      }
    ),

    getListWordByLessonId: build.mutation<APIResponse<Word[]>, string>({
      query: (lessonId: string) => ({
        url: `/api/Lesson/GetListWordLesson?lessonId=${lessonId}`,
        method: "GET",
        flashError: false,
      }),
    }),

    getListQuizByLessonId: build.mutation<APIResponse<Quiz[]>, string>({
      query: (lessonId: string) => ({
        url: `/api/Lesson/GetListQuizLesson?lessonId=${lessonId}`,
        method: "GET",
        flashError: false,
      }),
    }),

    getVideoSuggest: build.mutation<
      APIResponse<VideoSuggest>,
      { userId: string; pageNumber: number; searchQuery: string }
    >({
      query: ({ userId, pageNumber, searchQuery }) => ({
        url: `/api/VideoSuggest?UserId=${userId}&PageNumber=${pageNumber}&PageSize=20&SearchQuery=${searchQuery}`,
        method: "GET",
        flashError: false,
      }),
    }),

    addNewUserProgress: build.mutation<
      APIResponse<string>,
      { userId: string; lessonId: string }
    >({
      query: ({ userId, lessonId }) => ({
        url: `/api/LessonProgress/AddNewProgress?userId=${userId}&lessonId=${lessonId}`,
        method: "POST",
        flashError: false,
      }),
    }),

    markLessonAsCompleted: build.mutation<
      APIResponse<string>,
      { userId: string; lessonId: string }
    >({
      query: ({ userId, lessonId }) => ({
        url: `/api/LessonProgress/CompleteLesson?userId=${userId}&lessonId=${lessonId}`,
        method: "PUT",
        flashError: false,
      }),
    }),

    markLessonAsLearned: build.mutation<
      APIResponse<string>,
      { userId: string; lessonId: string }
    >({
      query: ({ userId, lessonId }) => ({
        url: `/api/LessonProgress/LearnedLesson?userId=${userId}&lessonId=${lessonId}`,
        method: "PUT",
        flashError: false,
      }),
    }),
    //get reminder
    getReminder: build.mutation<APIResponse<ReminderDTO>, string>({
      query: (email: string) => ({
        url: `/api/Reminder/GetReminder?email=${email}`,
        method: "GET",
        flashError: false,
      }),
    }),

    //setup reminder
    setupReminder: build.mutation<APIResponse<ReminderDTO>, ReminderDTO>({
      query: (data: ReminderDTO) => ({
        url: `/api/Reminder/SetupReminder`,
        method: "POST",
        body: data,
        flashError: false,
      }),
    }),
  }),
});

export const {
  useGetCourseByIdMutation,
  useGetCourseByCategoryIdMutation,
  useGetCourseByLanguageIdMutation,
  useGetCourseSummaryMutation,
  useGetCoursesMutation,
  useGetAllModuleByCourseIdMutation,
  useGetOngoingLessonByUserIdMutation,
  useGetListLearnedLessonByUserIdMutation,
  useGetListWordByLessonIdMutation,
  useGetListQuizByLessonIdMutation,
  useGetVideoSuggestMutation,
  useAddNewUserProgressMutation,
  useMarkLessonAsCompletedMutation,
  useMarkLessonAsLearnedMutation,
  useGetReminderMutation,
  useSetupReminderMutation,
} = courseAPI;
