import { useCallback, useState, useEffect } from "react";
import {
  VideoUploadState,
  UseVideoUploadReturn,
  VideoTranslationResult,
} from "@/types/ITranslator";
import {
  useUploadVideoForTranslationMutation,
} from "@/api/TranslatorApi";
import { useTranslations } from "next-intl";
import { useVideoSignLanguageProcessor } from "./useVideoSignLanguageProcessor";

interface UseVideoUploadTranslatorOptions {
  onResult?: (result: VideoTranslationResult) => void;
  language?: "en" | "vi";
  maxFileSize?: number; // in MB
  userId?: string;
}

export const useVideoUploadTranslator = ({
  onResult,
  language = "en",
  maxFileSize = 100,
  userId,
}: UseVideoUploadTranslatorOptions = {}): UseVideoUploadReturn => {
  const t_translatorPage = useTranslations("translatorPage");
  const [uploadVideo] = useUploadVideoForTranslationMutation();
  
  // Sử dụng AI processor
  const videoProcessor = useVideoSignLanguageProcessor({
    language,
    onProgress: (progress) => {
      setState(prev => ({
        ...prev,
        isProcessing: progress < 100,
        uploadProgress: Math.min(50 + progress / 2, 99) // Map 0-100 to 50-99
      }));
    },
    onResult: (result) => {
      setState(prev => ({
        ...prev,
        isProcessing: false,
        uploadProgress: 100,
        translationResult: result
      }));
      
      if (onResult) {
        onResult(result);
      }
    }
  });
  
  const [state, setState] = useState<VideoUploadState>({
    isUploading: false,
    isProcessing: false,
    uploadProgress: 0,
    file: null,
    videoUrl: null,
    translationResult: null,
    error: null,
  });
  
  // Theo dõi lỗi từ processor
  useEffect(() => {
    if (videoProcessor.state.error) {
      setState(prev => ({
        ...prev,
        isProcessing: false,
        error: videoProcessor.state.error
      }));
    }
  }, [videoProcessor.state.error]);
  
  // Upload và xử lý video
  const uploadVideoFile = useCallback(
    async (file: File) => {
      try {
        const fileSizeMB = file.size / (1024 * 1024);
        if (fileSizeMB > maxFileSize) {
          throw new Error(`File size exceeds ${maxFileSize}MB limit`);
        }
        const allowedTypes = [
          "video/mp4",
          "video/webm",
          "video/avi",
          "video/mov",
        ];
        if (!allowedTypes.includes(file.type)) {
          throw new Error(
            "Unsupported file format. Please use MP4, WebM, AVI, or MOV"
          );
        }
        setState((prev) => ({
          ...prev,
          isUploading: true,
          uploadProgress: 0,
          file,
          error: null,
        }));
        const videoUrl = URL.createObjectURL(file);
        setState((prev) => ({
          ...prev,
          videoUrl,
          uploadProgress: 25,
        }));
        
        // Upload video (chỉ để lấy ID)
        const uploadResult = await uploadVideo({
          file,
          language,
          userId,
        }).unwrap();
        
        setState((prev) => ({
          ...prev,
          uploadProgress: 50,
          isUploading: false,
          isProcessing: true,
        }));
        
        // Xử lý video bằng AI thật
        await videoProcessor.processVideo(file, uploadResult.id);
        
      } catch (error) {
        console.error("Upload error:", error);
        setState((prev) => ({
          ...prev,
          isUploading: false,
          isProcessing: false,
          uploadProgress: 0,
          error:
            error instanceof Error
              ? error.message
              : t_translatorPage("uploadFailed"),
        }));
      }
    },
    [uploadVideo, language, userId, maxFileSize, videoProcessor, t_translatorPage]
  );
  
  const clearState = useCallback(() => {
    if (state.videoUrl) {
      URL.revokeObjectURL(state.videoUrl);
    }
    setState({
      isUploading: false,
      isProcessing: false,
      uploadProgress: 0,
      file: null,
      videoUrl: null,
      translationResult: null,
      error: null,
    });
  }, [state.videoUrl]);
  
  const removeFile = useCallback(() => {
    if (state.videoUrl) {
      URL.revokeObjectURL(state.videoUrl);
    }
    setState((prev) => ({
      ...prev,
      file: null,
      videoUrl: null,
      translationResult: null,
      uploadProgress: 0,
      error: null,
    }));
  }, [state.videoUrl]);
  
  return {
    state,
    uploadVideo: uploadVideoFile,
    processVideo: async (videoId: string): Promise<void> => {
      await videoProcessor.processVideo(state.file!, videoId);
    },
    clearState,
    removeFile,
  };
};
