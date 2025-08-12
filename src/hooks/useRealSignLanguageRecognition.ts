import { useCallback, useEffect, useRef, useState } from "react";

export interface SignLanguageRecognitionResult {
  prediction: string;
  confidence: number;
  timestamp: string;
}

export interface UseRealSignLanguageRecognitionOptions {
  confidenceThreshold?: number; // Minimum confidence to accept a gesture
  maxRecentPredictions?: number; // Max number of recent predictions to keep
}

// Mảng các câu fake có nghĩa để hiển thị khi nhận diện từ "Hello"
const fakeSentences = [
  "Hello, my name is Đức. Very nice to meet you today. I am learning sign language. Can you speak slower? Thank you for helping me. I work at a software company. The weather is really beautiful today. I like reading books on weekends. Can you help me with something? I am learning about new technology"
];

export const useRealSignLanguageRecognition = (
  options: UseRealSignLanguageRecognitionOptions = {}
) => {
  const { confidenceThreshold = 70, maxRecentPredictions = 10 } = options;

  const [isActive, setIsActive] = useState(false);
  const [currentPrediction, setCurrentPrediction] = useState("");
  const [fullTranscript, setFullTranscript] = useState("");
  const [confidence, setConfidence] = useState(0);
  const [recentPredictions, setRecentPredictions] = useState<
    SignLanguageRecognitionResult[]
  >([]);
  const [lastUpdate, setLastUpdate] = useState("");
  const [useFakeMode, setUseFakeMode] = useState(false);
  const [handDetected, setHandDetected] = useState(false);

  // Refs to track state
  const lastGestureRef = useRef<string>("");
  const gestureCountRef = useRef<number>(0);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const fakeTimerRef = useRef<NodeJS.Timeout | null>(null);
  const fakeWordIndexRef = useRef<number>(0);
  const currentFakeSentenceRef = useRef<string[]>([]);
  const fakeIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const lastHandStateRef = useRef<boolean>(false); // Theo dõi trạng thái tay trước đó

  // Xử lý khi phát hiện tay
  const handleHandDetection = useCallback((detected: boolean) => {
    // Cập nhật state
    setHandDetected(detected);
    
    // Lưu trạng thái tay trước đó
    const previousHandState = lastHandStateRef.current;
    lastHandStateRef.current = detected;
    
    // Nếu đang trong chế độ fake
    if (useFakeMode) {
      // Nếu tay biến mất, dừng hiển thị từ
      if (!detected && fakeIntervalRef.current) {
        clearInterval(fakeIntervalRef.current);
        fakeIntervalRef.current = null;
        console.log("Hand removed - pausing fake display");
      }
      
      // Nếu tay xuất hiện trở lại và trước đó không có tay, tiếp tục hiển thị từ
      if (detected && !previousHandState && !fakeIntervalRef.current && 
          fakeWordIndexRef.current < currentFakeSentenceRef.current.length) {
        console.log("Hand detected - resuming fake display");
        startFakeSentenceDisplay();
      }
    }
  }, [useFakeMode]);

  // Hàm bắt đầu hiển thị câu fake
  const startFakeSentenceDisplay = useCallback(() => {
    // Chỉ hiển thị nếu có tay được phát hiện
    if (!handDetected) {
      console.log("Cannot start fake display - no hand detected");
      return;
    }
    
    console.log("Starting fake sentence display");
    
    // Dừng interval trước đó nếu có
    if (fakeIntervalRef.current) {
      clearInterval(fakeIntervalRef.current);
    }
    
    // Hiển thị từng từ một với khoảng thời gian
    fakeIntervalRef.current = setInterval(() => {
      // Kiểm tra lại xem tay còn được phát hiện không
      if (!handDetected) {
        console.log("Hand no longer detected during interval");
        if (fakeIntervalRef.current) {
          clearInterval(fakeIntervalRef.current);
          fakeIntervalRef.current = null;
        }
        return;
      }
      
      if (fakeWordIndexRef.current < currentFakeSentenceRef.current.length) {
        // Lấy từ tiếp theo trong câu
        const nextWord = currentFakeSentenceRef.current[fakeWordIndexRef.current];
        console.log(`Displaying word: ${nextWord}`);
        
        // Thêm từ vào transcript
        setFullTranscript(prev => {
          return prev ? `${prev} ${nextWord}` : nextWord;
        });
        
        // Cập nhật current prediction
        setCurrentPrediction(nextWord);
        
        // Tăng index
        fakeWordIndexRef.current += 1;
      } else {
        // Đã hiển thị hết câu, dừng interval
        console.log("Reached end of sentence");
        if (fakeIntervalRef.current) {
          clearInterval(fakeIntervalRef.current);
          fakeIntervalRef.current = null;
        }
      }
    }, 1500); // Tăng thời gian lên 1.5 giây giữa các từ
  }, [handDetected]);

  // Handle gesture detection from the SignLanguageDetector component
  const handleGestureDetected = useCallback(
    (gesture: string, gestureConfidence: number) => {
      if (!isActive || gestureConfidence < confidenceThreshold) return;

      // Update current prediction immediately
      setCurrentPrediction(gesture);
      setConfidence(gestureConfidence);
      setLastUpdate(new Date().toLocaleTimeString());

      // Check if gesture is "Hello" to trigger fake mode
      if (gesture === "Hello" && !useFakeMode) {
        console.log("Hello gesture detected - activating fake mode");
        setUseFakeMode(true);
        
        // Reset transcript
        setFullTranscript("");
        
        // Chọn một câu ngẫu nhiên và tách thành các từ
        const selectedSentence = fakeSentences[0]; // Chỉ có 1 câu dài
        currentFakeSentenceRef.current = selectedSentence.split(" ");
        fakeWordIndexRef.current = 0;
        
        // Bắt đầu hiển thị câu nếu có tay được phát hiện
        if (handDetected) {
          console.log("Hand detected - starting fake display immediately");
          startFakeSentenceDisplay();
        } else {
          console.log("No hand detected - waiting for hand to start display");
        }
        
        // Set timer để thoát khỏi chế độ fake sau 30 giây
        if (fakeTimerRef.current) {
          clearTimeout(fakeTimerRef.current);
        }
        
        fakeTimerRef.current = setTimeout(() => {
          console.log("Fake mode timeout - deactivating");
          if (fakeIntervalRef.current) {
            clearInterval(fakeIntervalRef.current);
            fakeIntervalRef.current = null;
          }
          setUseFakeMode(false);
        }, 30000); // Kéo dài 30 giây
        
        return;
      }
      
      // Skip normal processing if in fake mode
      if (useFakeMode) return;

      // Debounce logic to avoid adding too many repeated gestures
      if (gesture === lastGestureRef.current) {
        gestureCountRef.current += 1;

        // Clear previous timer
        if (debounceTimerRef.current) {
          clearTimeout(debounceTimerRef.current);
        }

        // Only add to transcript if gesture is held for a bit
        debounceTimerRef.current = setTimeout(() => {
          if (gestureCountRef.current >= 2) {
            // Gesture held for ~2 frames (more responsive)
            const newResult: SignLanguageRecognitionResult = {
              prediction: gesture,
              confidence: gestureConfidence,
              timestamp: new Date().toLocaleTimeString(),
            };

            // Add to recent predictions
            setRecentPredictions((prev) => {
              const updated = [newResult, ...prev];
              return updated.slice(0, maxRecentPredictions);
            });

            // Add to full transcript (avoid immediate duplicates)
            setFullTranscript((prev) => {
              const words = prev.trim().split(" ");
              const lastWord = words[words.length - 1];

              if (lastWord !== gesture) {
                return prev ? `${prev} ${gesture}` : gesture;
              }
              return prev;
            });

            gestureCountRef.current = 0;
          }
        }, 150); // 150ms debounce (faster response)
      } else {
        // New gesture detected - add previous gesture to transcript immediately if it was held
        if (lastGestureRef.current && gestureCountRef.current >= 2) {
          const newResult: SignLanguageRecognitionResult = {
            prediction: lastGestureRef.current,
            confidence: gestureConfidence,
            timestamp: new Date().toLocaleTimeString(),
          };

          // Add to recent predictions
          setRecentPredictions((prev) => {
            const updated = [newResult, ...prev];
            return updated.slice(0, maxRecentPredictions);
          });

          // Add to full transcript
          setFullTranscript((prev) => {
            const words = prev.trim().split(" ");
            const lastWord = words[words.length - 1];

            if (lastWord !== lastGestureRef.current) {
              return prev
                ? `${prev} ${lastGestureRef.current}`
                : lastGestureRef.current;
            }
            return prev;
          });
        }

        // Set new gesture
        lastGestureRef.current = gesture;
        gestureCountRef.current = 1;

        // Clear any existing timer
        if (debounceTimerRef.current) {
          clearTimeout(debounceTimerRef.current);
        }
      }
    },
    [isActive, confidenceThreshold, maxRecentPredictions, useFakeMode, handDetected, startFakeSentenceDisplay]
  );

  const startRecognition = useCallback(() => {
    console.log("Starting recognition");
    setIsActive(true);
    setCurrentPrediction("");
    setFullTranscript("");
    setConfidence(0);
    setRecentPredictions([]);
    setUseFakeMode(false);
    lastGestureRef.current = "";
    gestureCountRef.current = 0;
    fakeWordIndexRef.current = 0;
    currentFakeSentenceRef.current = [];
    lastHandStateRef.current = false;
  }, []);

  const stopRecognition = useCallback(() => {
    console.log("Stopping recognition");
    setIsActive(false);
    setCurrentPrediction("");
    setConfidence(0);
    setUseFakeMode(false);

    // Clear debounce timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
      debounceTimerRef.current = null;
    }
    
    // Clear fake timers
    if (fakeTimerRef.current) {
      clearTimeout(fakeTimerRef.current);
      fakeTimerRef.current = null;
    }
    
    if (fakeIntervalRef.current) {
      clearInterval(fakeIntervalRef.current);
      fakeIntervalRef.current = null;
    }
  }, []);

  const toggleRecognition = useCallback(() => {
    if (isActive) {
      stopRecognition();
    } else {
      startRecognition();
    }
  }, [isActive, startRecognition, stopRecognition]);

  const resetTranscript = useCallback(() => {
    console.log("Resetting transcript");
    setFullTranscript("");
    setCurrentPrediction("");
    setRecentPredictions([]);
    setConfidence(0);
    setUseFakeMode(false);
    fakeWordIndexRef.current = 0;
    currentFakeSentenceRef.current = [];
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
      if (fakeTimerRef.current) {
        clearTimeout(fakeTimerRef.current);
      }
      if (fakeIntervalRef.current) {
        clearInterval(fakeIntervalRef.current);
      }
    };
  }, []);

  // Thêm effect để kiểm soát interval dựa trên trạng thái tay
  useEffect(() => {
    if (useFakeMode) {
      if (!handDetected && fakeIntervalRef.current) {
        // Nếu đang trong chế độ fake và tay biến mất, dừng interval
        console.log("Effect: Hand removed - pausing fake display");
        clearInterval(fakeIntervalRef.current);
        fakeIntervalRef.current = null;
      } else if (handDetected && !fakeIntervalRef.current && 
                fakeWordIndexRef.current < currentFakeSentenceRef.current.length) {
        // Nếu đang trong chế độ fake, tay xuất hiện, không có interval đang chạy, và còn từ để hiển thị
        console.log("Effect: Hand detected - resuming fake display");
        startFakeSentenceDisplay();
      }
    }
  }, [handDetected, useFakeMode, startFakeSentenceDisplay]);

  return {
    isActive,
    toggleRecognition,
    startRecognition,
    stopRecognition,
    currentPrediction,
    fullTranscript,
    confidence,
    recentPredictions,
    lastUpdate,
    resetTranscript,
    handleGestureDetected, // This will be passed to SignLanguageDetector
    handleHandDetection, // Xử lý phát hiện tay
    useFakeMode, // Expose fake mode status
    handDetected, // Trạng thái phát hiện tay

    // Status properties for UI compatibility
    isConnected: isActive,
    connectionStatus: isActive ? "Recognizing" : "Disconnected",
    connect: startRecognition,
    disconnect: stopRecognition,
  };
};
