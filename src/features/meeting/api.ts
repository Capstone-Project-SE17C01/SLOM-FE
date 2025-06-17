"use client";

import { baseApi } from "@/redux/baseApi";
import { AddRecordingRequest, CreateMeetingRequest, CreateMeetingResponse, LeaveMeetingRequest, Meeting, MeetingDetail, Recording, ScheduledMeeting, UpdateMeetingRequest } from "./types";

export const meetingApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getActiveMeetings: builder.query<Meeting[], string | void>({
      query: (userId) => ({
        url: userId ? `/api/meeting/active?userId=${userId}` : '/api/meeting/active',
        method: 'GET',
        flashError: false,
      }),
      providesTags: (result) => 
        result
          ? [
              ...result.map(({ id }) => ({ type: 'Meeting' as const, id })),
              { type: 'Meeting', id: 'ACTIVE' }
            ]
          : [{ type: 'Meeting', id: 'ACTIVE' }],
    }),
    getMeeting: builder.query<MeetingDetail, string>({
      query: (id) => ({
        url: `/api/meeting/${id}`,
        method: 'GET',
        flashError: false,
      }),
      providesTags: (result, error, id) => 
        result 
          ? [{ type: 'Meeting' as const, id }]
          : [],
    }),
    
    createMeeting: builder.mutation<CreateMeetingResponse, CreateMeetingRequest>({
      query: (body) => ({
        url: '/api/meeting',
        method: 'POST',
        body,
        flashError: true,
      }),
    }),
    
    
    leaveMeeting: builder.mutation<void, { id: string, request: LeaveMeetingRequest }>({
      query: ({ id, request }) => ({
        url: `/api/meeting/${id}/leave`,
        method: 'POST',
        body: request,
        flashError: false,
      }),
    }),
    getScheduledMeetingsByMonth: builder.query<ScheduledMeeting[], { year: number, month: number, userId?: string }>({
      query: ({ year, month, userId }) => ({
        url: userId 
          ? `/api/meeting/scheduled?year=${year}&month=${month}&userId=${userId}`
          : `/api/meeting/scheduled?year=${year}&month=${month}`,
        method: 'GET',
        flashError: false,
      }),
      providesTags: (result) => 
        result
          ? [
              ...result.map(({ id }) => ({ type: 'Meeting' as const, id })),
              { type: 'Meeting', id: 'MONTH' }
            ]
          : [{ type: 'Meeting', id: 'MONTH' }],
    }),
    
    getScheduledMeetingsByDate: builder.query<ScheduledMeeting[], { date: string, userId?: string }>({
      query: ({ date, userId }) => ({
        url: userId
          ? `/api/meeting/scheduled/date?date=${date}&userId=${userId}`
          : `/api/meeting/scheduled/date?date=${date}`,
        method: 'GET',
        flashError: false,
      }),
      providesTags: (result) => 
        result
          ? [
              ...result.map(({ id }) => ({ type: 'Meeting' as const, id })),
              { type: 'Meeting', id: 'DATE' }
            ]
          : [{ type: 'Meeting', id: 'DATE' }],
    }),
    
    addRecording: builder.mutation<Recording, { id: string, request: AddRecordingRequest }>({
      query: ({ id, request }) => ({
        url: `/api/meeting/${id}/recording`,
        method: 'POST',
        body: request,
        flashError: true,
      }),
      invalidatesTags: (result, error, { id }) => 
        error ? [] : [
          { type: 'Meeting', id },
          { type: 'Recording', id: 'LIST' }
        ]
    }),
    
    getRecordings: builder.query<Recording[], string>({
      query: (id) => ({
        url: `/api/meeting/${id}/recordings`,
        method: 'GET',
        flashError: false,
      }),
      providesTags: (result) => 
        result
          ? [
              ...result.map(({ id }) => ({ type: 'Recording' as const, id })),
              { type: 'Recording', id: 'LIST' }
            ]
          : [{ type: 'Recording', id: 'LIST' }],
    }),

    getUserMeetings: builder.query<Meeting[], string>({
      query: (userId) => ({
        url: `/api/meeting/user/${userId}`,
        method: 'GET',
        flashError: false,
      }),
      providesTags: (result) => 
        result
          ? [
              ...result.map(({ id }) => ({ type: 'Meeting' as const, id })),
              { type: 'Meeting', id: 'USER' }
            ]
          : [{ type: 'Meeting', id: 'USER' }],
    }),

    getUserRecordings: builder.query<Recording[], string>({
      query: (userId) => ({
        url: `/api/meeting/recordings/${userId}`,
        method: 'GET',
        flashError: false,
      }),
      providesTags: (result) => 
        result
          ? [
              ...result.map(({ id }) => ({ type: 'Recording' as const, id })),
              { type: 'Recording', id: 'USER' }
            ]
          : [{ type: 'Recording', id: 'USER' }],
    }),

    getAllRecordingStoragePaths: builder.query<{
      totalCount: number;
      storagePaths: Array<{
        storagePath: string;
        meetingId: string;
        recordingId: string;
        createdAt: string;
      }>
    }, { page?: number; limit?: number } | void>({
      query: (params) => ({
        url: `/api/Meeting/recordings/storage-paths/all${
          params ? `?page=${params.page || 1}&limit=${params.limit || 10}` : ''
        }`,
        method: 'GET',
        flashError: false,
      }),
      providesTags: [{ type: 'Recording', id: 'ALL_STORAGE_PATHS' }],
    }),

    deleteMeeting: builder.mutation<{ message: string }, { id: string, userId: string }>({
      query: ({ id, userId }) => ({
        url: `/api/meeting/${id}?userId=${userId}`,
        method: 'DELETE',
        flashError: true,
      }),
      invalidatesTags: (result, error, { id }) => 
        error ? [] : [
          { type: 'Meeting', id },
          { type: 'Meeting', id: 'DATE' },
          { type: 'Meeting', id: 'MONTH' },
          { type: 'Meeting', id: 'ACTIVE' }
        ]
    }),
    updateMeeting: builder.mutation<MeetingDetail, { id: string, request: UpdateMeetingRequest }>({
      query: ({ id, request }) => ({
        url: `/api/meeting/${id}`,
        method: 'PUT',
        body: request,
        flashError: true,
      }),
      invalidatesTags: (result, error, { id }) => 
        error ? [] : [
          { type: 'Meeting', id },
          { type: 'Meeting', id: 'DATE' },
          { type: 'Meeting', id: 'MONTH' },
          { type: 'Meeting', id: 'ACTIVE' }
        ]
    })
  })
});

export const {
  useGetActiveMeetingsQuery,
  useGetMeetingQuery,
  useCreateMeetingMutation,
  useLeaveMeetingMutation,
  useGetScheduledMeetingsByMonthQuery,
  useGetScheduledMeetingsByDateQuery,
  useAddRecordingMutation,
  useGetRecordingsQuery,
  useGetUserMeetingsQuery,
  useGetUserRecordingsQuery,
  useDeleteMeetingMutation,
  useUpdateMeetingMutation,
  useGetAllRecordingStoragePathsQuery
} = meetingApi;
