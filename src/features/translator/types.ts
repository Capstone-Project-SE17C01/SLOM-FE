// Translation request and response types
export interface TranslationRequest {
  video: string; // Base64 encoded video
  userId?: string;
  language?: 'en' | 'vi';
}

export interface TranslationResponse {
  prediction: string;
  confidence: number;
  timestamp: string;
  video?: string; // Base64 encoded processed video
  error?: string;
}

// Real-time translation types
export interface RealTimeTranslationResult {
  prediction: string;
  confidence: number;
  timestamp: string;
  isCorrect?: boolean;
}

export interface RealTimeTranslationState {
  isConnected: boolean;
  isActive: boolean;
  isRecording: boolean;
  isProcessing: boolean;
  connectionStatus: 'Disconnected' | 'Connecting...' | 'Connected' | 'Recognizing...' | 'Error';
  currentPrediction: string;
  confidence: number;
  lastUpdate: string;
  recentPredictions: RealTimeTranslationResult[];
}

// Upload video translation types
export interface VideoUploadState {
  isUploading: boolean;
  isProcessing: boolean;
  uploadProgress: number;
  file: File | null;
  videoUrl: string | null;
  translationResult: VideoTranslationResult | null;
  error: string | null;
}

export interface VideoTranslationResult {
  id: string;
  filename: string;
  uploadUrl: string;
  processedUrl?: string;
  translations: TranslationSegment[];
  summary?: string;
  duration: number;
  fileSize: number;
  status: 'uploading' | 'processing' | 'completed' | 'error';
  createdAt: string;
  completedAt?: string;
}

export interface TranslationSegment {
  startTime: number;
  endTime: number;
  prediction: string;
  confidence: number;
  boundingBox?: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}

// API request/response types for video upload
export interface UploadVideoRequest {
  file: File;
  language?: 'en' | 'vi';
  userId?: string;
}

export interface UploadVideoResponse {
  id: string;
  uploadUrl: string;
  filename: string;
  fileSize: number;
  status: 'uploaded';
  createdAt: string;
}

export interface ProcessVideoRequest {
  videoId: string;
  language?: 'en' | 'vi';
}

export interface ProcessVideoResponse {
  id: string;
  status: 'processing' | 'completed' | 'error';
  progress?: number;
  result?: VideoTranslationResult;
  error?: string;
}

// WebSocket message types
export interface WebSocketMessage {
  type: 'video_frame' | 'translation_result' | 'error' | 'connection_status';
  data: string | TranslationResponse | { message: string; code?: string } | { status: string; message?: string };
  timestamp: string;
}

export interface WebSocketFrame {
  type: 'video_frame';
  data: string; // Base64 encoded frame
  timestamp: string;
}

export interface WebSocketTranslationResult {
  type: 'translation_result';
  data: TranslationResponse;
  timestamp: string;
}

export interface WebSocketError {
  type: 'error';
  data: {
    message: string;
    code?: string;
  };
  timestamp: string;
}

export interface WebSocketConnectionStatus {
  type: 'connection_status';
  data: {
    status: 'connected' | 'disconnected' | 'error';
    message?: string;
  };
  timestamp: string;
}

// Translation history types
export interface TranslationHistory {
  id: string;
  type: 'realtime' | 'upload';
  result: RealTimeTranslationResult | VideoTranslationResult;
  createdAt: string;
}

// Settings and preferences
export interface TranslatorSettings {
  language: 'en' | 'vi';
  autoSave: boolean;
  maxVideoSize: number; // in MB
  captureInterval: number; // in ms for real-time
  confidenceThreshold: number; // minimum confidence to display
}

// Hook return types
export interface UseRealTimeTranslatorReturn {
  state: RealTimeTranslationState;
  connect: () => void;
  disconnect: () => void;
  startRecognition: () => boolean;
  stopRecognition: () => void;
  toggleRecognition: () => void;
  clearHistory: () => void;
}

export interface UseVideoUploadReturn {
  state: VideoUploadState;
  uploadVideo: (file: File) => Promise<void>;
  processVideo: (videoId: string) => Promise<void>;
  clearState: () => void;
  removeFile: () => void;
}

// Component props types
export interface RealTimeTranslatorProps {
  onResult?: (result: RealTimeTranslationResult) => void;
  language?: 'en' | 'vi';
  captureInterval?: number;
  showConfidence?: boolean;
  autoStart?: boolean;
}

export interface VideoUploadTranslatorProps {
  onResult?: (result: VideoTranslationResult) => void;
  language?: 'en' | 'vi';
  maxFileSize?: number;
  acceptedFormats?: string[];
  showPreview?: boolean;
}

export interface TranslationDisplayProps {
  prediction: string;
  confidence: number;
  timestamp: string;
  showConfidence?: boolean;
  className?: string;
}

export interface VideoPreviewProps {
  file: File | null;
  videoUrl: string | null;
  isProcessing?: boolean;
  onRemove?: () => void;
  className?: string;
} 