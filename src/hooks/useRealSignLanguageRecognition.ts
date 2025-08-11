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

  // Refs to track state
  const lastGestureRef = useRef<string>("");
  const gestureCountRef = useRef<number>(0);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Handle gesture detection from the SignLanguageDetector component
  const handleGestureDetected = useCallback(
    (gesture: string, gestureConfidence: number) => {
      if (!isActive || gestureConfidence < confidenceThreshold) return;

      // Update current prediction immediately
      setCurrentPrediction(gesture);
      setConfidence(gestureConfidence);
      setLastUpdate(new Date().toLocaleTimeString());

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
    [isActive, confidenceThreshold, maxRecentPredictions]
  );

  const startRecognition = useCallback(() => {
    setIsActive(true);
    setCurrentPrediction("");
    setFullTranscript("");
    setConfidence(0);
    setRecentPredictions([]);
    lastGestureRef.current = "";
    gestureCountRef.current = 0;
  }, []);

  const stopRecognition = useCallback(() => {
    setIsActive(false);
    setCurrentPrediction("");
    setConfidence(0);

    // Clear debounce timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
      debounceTimerRef.current = null;
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
    setFullTranscript("");
    setCurrentPrediction("");
    setRecentPredictions([]);
    setConfidence(0);
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

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

    // Status properties for UI compatibility
    isConnected: isActive,
    connectionStatus: isActive ? "Recognizing" : "Disconnected",
    connect: startRecognition,
    disconnect: stopRecognition,
  };
};
