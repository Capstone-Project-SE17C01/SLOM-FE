import { useCallback, useState, useRef, useEffect } from "react";
import { FilesetResolver, GestureRecognizer } from "@mediapipe/tasks-vision";
import { 
  VideoTranslationResult, 
  TranslationSegment,
} from "@/types/ITranslator";

interface UseVideoSignLanguageProcessorOptions {
  onResult?: (result: VideoTranslationResult) => void;
  onProgress?: (progress: number) => void;
  language?: "en" | "vi";
  confidenceThreshold?: number;
}

interface ProcessingState {
  isLoading: boolean;
  isProcessing: boolean;
  progress: number;
  error: string | null;
  recognizer: GestureRecognizer | null;
  result: VideoTranslationResult | null;
}

export const useVideoSignLanguageProcessor = ({
  onResult,
  onProgress,
  confidenceThreshold = 70,
}: UseVideoSignLanguageProcessorOptions = {}) => {
  const [state, setState] = useState<ProcessingState>({
    isLoading: true,
    isProcessing: false,
    progress: 0,
    error: null,
    recognizer: null,
    result: null,
  });
  
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const detectedGestures = useRef<TranslationSegment[]>([]);
  const processingInterval = useRef<number | null>(null);
  const videoMetadata = useRef<{
    duration: number;
    fileSize: number;
    filename: string;
    uploadUrl: string;
  } | null>(null);

  // Khởi tạo model
  useEffect(() => {
    const initModel = async () => {
      try {
        console.log("🔍 Loading MediaPipe vision tasks...");
        const vision = await FilesetResolver.forVisionTasks(
          "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
        );
        console.log("✅ MediaPipe vision tasks loaded successfully");

        console.log("🤖 Creating gesture recognizer with model...");
        console.log("📂 Model path: /sign_language_recognizer_25-04-2023.task");
        
        const recognizer = await GestureRecognizer.createFromOptions(vision, {
          baseOptions: {
            modelAssetPath: "/sign_language_recognizer_25-04-2023.task",
            delegate: "GPU"
          },
          numHands: 2,
          runningMode: "VIDEO",
        });
        
        console.log("✅ Gesture recognizer created successfully");
        
        setState(prev => ({
          ...prev,
          isLoading: false,
          recognizer,
        }));
      } catch (err) {
        console.error("❌ Failed to load gesture recognizer:", err);
        setState(prev => ({
          ...prev,
          isLoading: false,
          error: `Failed to load AI model: ${err instanceof Error ? err.message : String(err)}`,
        }));
      }
    };

    initModel();
    
    // Cleanup
    return () => {
      if (processingInterval.current) {
        clearInterval(processingInterval.current);
      }
    };
  }, []);

  // Chuẩn bị video element
  const prepareVideoElement = useCallback(() => {
    if (!videoRef.current) {
      videoRef.current = document.createElement('video');
      videoRef.current.playsInline = true;
      videoRef.current.muted = true;
    }
    
    if (!canvasRef.current) {
      canvasRef.current = document.createElement('canvas');
    }
    
    return videoRef.current;
  }, []);

  // Xử lý một frame video
  const processVideoFrame = useCallback((video: HTMLVideoElement, recognizer: GestureRecognizer, currentTime: number) => {
    try {
      if (video.videoWidth === 0 || video.videoHeight === 0) {
        return null;
      }
      
      const canvas = canvasRef.current!;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      
      if (!ctx) return null;
      
      // Vẽ frame hiện tại lên canvas
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      // Nhận diện cử chỉ
      const nowInMs = Date.now();
      const results = recognizer.recognizeForVideo(video, nowInMs);
      
      // Nếu phát hiện cử chỉ
      if (results.gestures && results.gestures.length > 0) {
        const topGesture = results.gestures[0][0];
        const gesture = topGesture.categoryName;
        const confidence = Math.round(topGesture.score * 100);
        
        // Chỉ lấy các cử chỉ có độ tin cậy cao
        if (confidence >= confidenceThreshold) {
          console.log(`🔍 [${currentTime.toFixed(2)}s] Detected: "${gesture}" (${confidence}%)`);
          
          // Tạo bounding box nếu có landmarks
          let boundingBox = undefined;
          if (results.landmarks && results.landmarks.length > 0) {
            const landmarks = results.landmarks[0];
            const xs = landmarks.map(l => l.x * canvas.width);
            const ys = landmarks.map(l => l.y * canvas.height);
            const minX = Math.min(...xs);
            const minY = Math.min(...ys);
            const maxX = Math.max(...xs);
            const maxY = Math.max(...ys);
            
            boundingBox = {
              x: minX,
              y: minY,
              width: maxX - minX,
              height: maxY - minY
            };
          }
          
          return {
            startTime: currentTime,
            endTime: currentTime + 1, // Giả định mỗi cử chỉ kéo dài 1 giây
            prediction: gesture,
            confidence: confidence / 100, // Chuyển về dạng 0-1
            boundingBox
          };
        }
      }
      
      return null;
    } catch (err) {
      console.error("❌ Error processing video frame:", err);
      return null;
    }
  }, [confidenceThreshold]);

  // Xử lý video
  const processVideo = useCallback(async (file: File, videoId: string) => {
    if (!state.recognizer) {
      setState(prev => ({
        ...prev,
        error: "AI model not loaded yet"
      }));
      return;
    }
    
    try {
      setState(prev => ({
        ...prev,
        isProcessing: true,
        progress: 0,
        error: null
      }));
      
      // Chuẩn bị video
      const video = prepareVideoElement();
      const videoUrl = URL.createObjectURL(file);
      video.src = videoUrl;
      
      // Đợi video load metadata
      await new Promise((resolve, reject) => {
        video.onloadedmetadata = resolve;
        video.onerror = reject;
      });
      
      // Lưu thông tin video
      videoMetadata.current = {
        duration: video.duration,
        fileSize: file.size,
        filename: file.name,
        uploadUrl: videoUrl
      };
      
      // Reset danh sách cử chỉ
      detectedGestures.current = [];
      
      // Xử lý video theo từng đoạn
      const duration = video.duration;
      const sampleRate = 0.5; // Mỗi 0.5 giây lấy một mẫu
      const totalSamples = Math.ceil(duration / sampleRate);
      let processedSamples = 0;
      
      // Xử lý từng frame
      for (let time = 0; time < duration; time += sampleRate) {
        // Cập nhật tiến độ
        processedSamples++;
        const progress = Math.round((processedSamples / totalSamples) * 100);
        setState(prev => ({ ...prev, progress }));
        if (onProgress) onProgress(progress);
        
        // Đặt thời gian video
        video.currentTime = time;
        
        // Đợi video seek xong
        await new Promise(resolve => {
          const onSeeked = () => {
            video.removeEventListener('seeked', onSeeked);
            resolve(null);
          };
          video.addEventListener('seeked', onSeeked);
        });
        
        // Xử lý frame
        const gesture = processVideoFrame(video, state.recognizer, time);
        if (gesture) {
          detectedGestures.current.push(gesture);
        }
      }
      
      // Tạo kết quả
      const result: VideoTranslationResult = {
        id: videoId,
        filename: file.name,
        uploadUrl: videoUrl,
        processedUrl: videoUrl,
        translations: mergeGestures(detectedGestures.current),
        summary: generateSummary(detectedGestures.current),
        duration: video.duration,
        fileSize: file.size,
        status: 'completed',
        createdAt: new Date().toISOString(),
        completedAt: new Date().toISOString()
      };
      
      // Cập nhật state
      setState(prev => ({
        ...prev,
        isProcessing: false,
        progress: 100,
        result
      }));
      
      // Gọi callback
      if (onResult) onResult(result);
      
      // Giải phóng URL
      URL.revokeObjectURL(videoUrl);
      
      return result;
    } catch (err) {
      console.error("❌ Error processing video:", err);
      setState(prev => ({
        ...prev,
        isProcessing: false,
        error: err instanceof Error ? err.message : String(err)
      }));
      return null;
    }
  }, [state.recognizer, prepareVideoElement, processVideoFrame, onProgress, onResult]);

  // Hợp nhất các cử chỉ liên tiếp giống nhau
  const mergeGestures = (gestures: TranslationSegment[]): TranslationSegment[] => {
    if (gestures.length === 0) return [];
    
    const result: TranslationSegment[] = [];
    let current = { ...gestures[0] };
    
    for (let i = 1; i < gestures.length; i++) {
      const gesture = gestures[i];
      
      // Nếu cử chỉ giống nhau và liên tiếp, hợp nhất
      if (gesture.prediction === current.prediction && 
          Math.abs(gesture.startTime - current.endTime) < 1.0) {
        current.endTime = gesture.endTime;
        // Cập nhật độ tin cậy (lấy cao nhất)
        current.confidence = Math.max(current.confidence, gesture.confidence);
      } else {
        // Thêm cử chỉ hiện tại vào kết quả và tạo cử chỉ mới
        result.push(current);
        current = { ...gesture };
      }
    }
    
    // Thêm cử chỉ cuối cùng
    result.push(current);
    
    return result;
  };

  // Tạo tóm tắt từ các cử chỉ
  const generateSummary = (gestures: TranslationSegment[]): string => {
    if (gestures.length === 0) return "No sign language detected in video.";
    
    // Lấy các từ duy nhất
    const uniqueWords = new Set(gestures.map(g => g.prediction));
    const wordCount = uniqueWords.size;
    
    // Lấy 5 từ đầu tiên
    const firstWords = gestures.slice(0, 5).map(g => g.prediction);
    
    return `The video contains ${gestures.length} sign language gestures with ${wordCount} unique words/phrases including: ${firstWords.join(", ")}${gestures.length > 5 ? '...' : '.'}`;
  };

  return {
    state: {
      isLoading: state.isLoading,
      isProcessing: state.isProcessing,
      progress: state.progress,
      error: state.error,
      result: state.result,
    },
    processVideo,
  };
}; 