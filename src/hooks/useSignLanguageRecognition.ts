import { useCallback, useEffect, useRef, useState } from "react";

// Default list of words to simulate recognition
const DEFAULT_WORDS = [
  "Hello", "teacher", "and", "friends", "Today", "we", "will", "present",
  "about", "our", "graduation", "project", "It", "is", "a", "system",
  "to", "support", "sign", "language", "learning", "We", "hope",
  "you", "will", "enjoy", "it", "Thank", "you"
];
const DEFAULT_INITIAL_DELAY = 3000;
const DEFAULT_WORD_INTERVAL = 500;

export interface UseFakeSignLanguageRecognitionOptions {
  words?: string[];
  initialDelay?: number;
  wordInterval?: number;
}

export interface SignLanguageRecognitionResult {
  prediction: string;
  confidence: number;
  timestamp: string;
}

export const useSignLanguageRecognition = (options: UseFakeSignLanguageRecognitionOptions = {}) => {
  const {
    words = DEFAULT_WORDS,
    initialDelay = DEFAULT_INITIAL_DELAY,
    wordInterval = DEFAULT_WORD_INTERVAL
  } = options;

  const [isActive, setIsActive] = useState(false);
  const [currentPrediction, setCurrentPrediction] = useState("");
  const [fullTranscript, setFullTranscript] = useState("");
  const wordIndexRef = useRef(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const startRecognition = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    
    // Reset state when starting
    setCurrentPrediction("");
    setFullTranscript("");
    wordIndexRef.current = 0;
    
    // Start generating words after a 3-second delay
    setTimeout(() => {
      timerRef.current = setInterval(() => {
        if (wordIndexRef.current < words.length) {
          const newWord = words[wordIndexRef.current];
          setCurrentPrediction(newWord);
          setFullTranscript(prev => (prev ? `${prev} ${newWord}` : newWord));
          wordIndexRef.current += 1;
        } else {
          // Stop when all words are shown
          if (timerRef.current) clearInterval(timerRef.current);
        }
      }, wordInterval); // Use customizable interval
    }, initialDelay); // Use customizable delay
  }, [words, initialDelay, wordInterval]);

  const stopRecognition = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    // Optionally reset or keep the transcript
    // setCurrentPrediction(""); 
  }, []);

  const toggleRecognition = useCallback(() => {
    setIsActive(prev => {
      const newIsActive = !prev;
      if (newIsActive) {
        startRecognition();
      } else {
        stopRecognition();
      }
      return newIsActive;
    });
  }, [startRecognition, stopRecognition]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  return {
    isActive,
    toggleRecognition,
    currentPrediction,
    fullTranscript, // This will be used for the subtitle display
    
    // --- Mock data to prevent breaking the UI ---
    isConnected: isActive,
    connectionStatus: isActive ? "Recognizing" : "Disconnected",
    confidence: isActive ? 100 : 0,
    lastUpdate: new Date().toLocaleTimeString(),
    recentPredictions: [],
    connect: () => {},
    disconnect: () => {},
    startRecognition: () => {},
    stopRecognition: () => {}
  };
}; 
