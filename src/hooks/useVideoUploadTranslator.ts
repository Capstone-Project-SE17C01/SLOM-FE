import { useCallback, useState } from "react";
import { 
  VideoUploadState, 
  UseVideoUploadReturn,
  VideoTranslationResult 
} from "@/features/translator/types";
import { 
  useUploadVideoForTranslationMutation, 
  useProcessVideoTranslationMutation 
} from "@/features/translator/api";

interface UseVideoUploadTranslatorOptions {
  onResult?: (result: VideoTranslationResult) => void;
  language?: 'en' | 'vi';
  maxFileSize?: number; // in MB
  userId?: string;
}

export const useVideoUploadTranslator = ({
  onResult,
  language = 'en',
  maxFileSize = 100,
  userId
}: UseVideoUploadTranslatorOptions = {}): UseVideoUploadReturn => {
  
  // API mutations
  const [uploadVideo] = useUploadVideoForTranslationMutation();
  const [processVideo] = useProcessVideoTranslationMutation();
  
  // Upload state
  const [state, setState] = useState<VideoUploadState>({
    isUploading: false,
    isProcessing: false,
    uploadProgress: 0,
    file: null,
    videoUrl: null,
    translationResult: null,
    error: null
  });

  // Upload video file
  const uploadVideoFile = useCallback(async (file: File) => {
    try {
      // Validate file size
      const fileSizeMB = file.size / (1024 * 1024);
      if (fileSizeMB > maxFileSize) {
        throw new Error(`File size exceeds ${maxFileSize}MB limit`);
      }

      // Validate file type
      const allowedTypes = ['video/mp4', 'video/webm', 'video/avi', 'video/mov'];
      if (!allowedTypes.includes(file.type)) {
        throw new Error('Unsupported file format. Please use MP4, WebM, AVI, or MOV');
      }

      setState(prev => ({
        ...prev,
        isUploading: true,
        uploadProgress: 0,
        file,
        error: null
      }));

      // Create video URL for preview
      const videoUrl = URL.createObjectURL(file);
      setState(prev => ({
        ...prev,
        videoUrl,
        uploadProgress: 25
      }));

      // Upload to Cloudinary
      const uploadResult = await uploadVideo({
        file,
        language,
        userId
      }).unwrap();

      setState(prev => ({
        ...prev,
        uploadProgress: 100,
        isUploading: false
      }));

      // Auto-start processing after upload
      await processVideoFile(uploadResult.id);

    } catch (error) {
      console.error('Upload error:', error);
      setState(prev => ({
        ...prev,
        isUploading: false,
        uploadProgress: 0,
        error: error instanceof Error ? error.message : 'Upload failed'
      }));
    }
  }, [uploadVideo, language, userId, maxFileSize]);

  // Process uploaded video
  const processVideoFile = useCallback(async (videoId: string) => {
    try {
      setState(prev => ({
        ...prev,
        isProcessing: true,
        error: null
      }));

      const processResult = await processVideo({
        videoId,
        language
      }).unwrap();

      if (processResult.result) {
        setState(prev => ({
          ...prev,
          isProcessing: false,
          translationResult: processResult.result!
        }));

        // Call result callback
        if (onResult) {
          onResult(processResult.result);
        }
      } else {
        throw new Error('Processing failed - no result returned');
      }

    } catch (error) {
      console.error('Processing error:', error);
      setState(prev => ({
        ...prev,
        isProcessing: false,
        error: error instanceof Error ? error.message : 'Processing failed'
      }));
    }
  }, [processVideo, language, onResult]);

  // Clear all state
  const clearState = useCallback(() => {
    // Revoke object URL to prevent memory leaks
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
      error: null
    });
  }, [state.videoUrl]);

  // Remove file and clear preview
  const removeFile = useCallback(() => {
    if (state.videoUrl) {
      URL.revokeObjectURL(state.videoUrl);
    }

    setState(prev => ({
      ...prev,
      file: null,
      videoUrl: null,
      translationResult: null,
      uploadProgress: 0,
      error: null
    }));
  }, [state.videoUrl]);

  return {
    state,
    uploadVideo: uploadVideoFile,
    processVideo: processVideoFile,
    clearState,
    removeFile
  };
}; 