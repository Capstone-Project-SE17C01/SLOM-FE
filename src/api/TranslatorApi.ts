"use client";

import { baseApi } from "@/services";
import { uploadVideoToCloudinary } from "@/services/cloudinary/config";
import { 
  UploadVideoRequest, 
  UploadVideoResponse, 
  ProcessVideoRequest, 
  ProcessVideoResponse,
  VideoTranslationResult,
  TranslationHistory
} from "../types/ITranslator";

export const translatorApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    
    // Upload video to Cloudinary (for now, until backend is ready)
    uploadVideoForTranslation: builder.mutation<UploadVideoResponse, UploadVideoRequest>({
      queryFn: async ({ file, userId }) => {
        try {
          // Upload to Cloudinary first
          const cloudinaryResult = await uploadVideoToCloudinary(file, "translator");
          
          // Create a mock response that matches our interface
          const response: UploadVideoResponse = {
            id: `trans_${Date.now()}_${userId || 'anonymous'}`,
            uploadUrl: cloudinaryResult.secure_url,
            filename: file.name,
            fileSize: file.size,
            status: 'uploaded',
            createdAt: new Date().toISOString(),
          };
          
          return { data: response };
        } catch (error) {
          return { 
            error: { 
              status: 'CUSTOM_ERROR', 
              error: error instanceof Error ? error.message : 'Upload failed' 
            } 
          };
        }
      },
    }),

    // Process uploaded video for translation (mock for now)
    processVideoTranslation: builder.mutation<ProcessVideoResponse, ProcessVideoRequest>({
      queryFn: async ({ videoId }) => {
        try {
          // Mock processing - replace with actual API call when backend is ready
          await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate processing time
          
          const mockResult: VideoTranslationResult = {
            id: videoId,
            filename: `video_${videoId}.mp4`,
            uploadUrl: '', // Will be filled from upload response
            processedUrl: '', // Would be filled by backend
            translations: [
              {
                startTime: 0,
                endTime: 5,
                prediction: "Hello",
                confidence: 0.95,
                boundingBox: { x: 100, y: 100, width: 200, height: 200 }
              },
              {
                startTime: 5,
                endTime: 10,
                prediction: "How are you",
                confidence: 0.87,
                boundingBox: { x: 120, y: 110, width: 180, height: 190 }
              },
              {
                startTime: 10,
                endTime: 15,
                prediction: "Thank you",
                confidence: 0.92,
                boundingBox: { x: 110, y: 105, width: 190, height: 195 }
              }
            ],
            summary: "The video contains basic greeting and politeness expressions in sign language.",
            duration: 15,
            fileSize: 0, // Will be filled from upload
            status: 'completed',
            createdAt: new Date().toISOString(),
            completedAt: new Date().toISOString()
          };

          const response: ProcessVideoResponse = {
            id: videoId,
            status: 'completed',
            progress: 100,
            result: mockResult
          };
          
          return { data: response };
        } catch (error) {
          return { 
            error: { 
              status: 'CUSTOM_ERROR', 
              error: error instanceof Error ? error.message : 'Processing failed' 
            } 
          };
        }
      },
    }),

    // Get translation history for user
    getTranslationHistory: builder.query<TranslationHistory[], string>({
      query: (userId) => ({
        url: `/api/translator/history/${userId}`,
        method: 'GET',
        flashError: false,
      }),
      providesTags: (result) => 
        result
          ? [
              ...result.map(({ id }) => ({ type: 'Translation' as const, id })),
              { type: 'Translation', id: 'HISTORY' }
            ]
          : [{ type: 'Translation', id: 'HISTORY' }],
    }),

    // Save translation result
    saveTranslationResult: builder.mutation<TranslationHistory, { 
      userId: string, 
      type: 'realtime' | 'upload', 
      result: VideoTranslationResult | TranslationHistory
    }>({
      query: ({ userId, type, result }) => ({
        url: `/api/translator/save`,
        method: 'POST',
        body: {
          userId,
          type,
          result
        },
        flashError: true,
      }),
      invalidatesTags: [{ type: 'Translation', id: 'HISTORY' }],
    }),

    // Delete translation from history
    deleteTranslation: builder.mutation<void, { id: string, userId: string }>({
      query: ({ id, userId }) => ({
        url: `/api/translator/${id}?userId=${userId}`,
        method: 'DELETE',
        flashError: true,
      }),
      invalidatesTags: (result, error, { id }) => 
        error ? [] : [
          { type: 'Translation', id },
          { type: 'Translation', id: 'HISTORY' }
        ],
    }),

    // Get processing status for uploaded video
    getVideoProcessingStatus: builder.query<ProcessVideoResponse, string>({
      query: (videoId) => ({
        url: `/api/translator/status/${videoId}`,
        method: 'GET',
        flashError: false,
      }),
      providesTags: (result, error, videoId) => 
        result 
          ? [{ type: 'Translation' as const, id: videoId }]
          : [],
    }),

  }),
});

export const {
  useUploadVideoForTranslationMutation,
  useProcessVideoTranslationMutation,
  useGetTranslationHistoryQuery,
  useSaveTranslationResultMutation,
  useDeleteTranslationMutation,
  useGetVideoProcessingStatusQuery,
  useLazyGetTranslationHistoryQuery,
  useLazyGetVideoProcessingStatusQuery,
} = translatorApi; 