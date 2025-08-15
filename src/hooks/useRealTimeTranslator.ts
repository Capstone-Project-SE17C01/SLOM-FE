import { useCallback, useEffect, useState, useRef } from "react";
import {
  RealTimeTranslationState,
  UseRealTimeTranslatorReturn,
  PredictionResult,
  UseFakeTranslatorOptions,
} from "@/types/ITranslator";
import { useTranslations } from "next-intl";

const FAKE_WORDS = [
  "This",
  "is",
  "a",
  "real-time",
  "sign",
  "language",
  "translator",
  "It",
  "can",
  "recognize",
  "various",
  "signs",
  "and",
  "convert",
  "them",
  "into",
  "text",
  "for",
  "easier",
  "communication",
];

const DEFAULT_INITIAL_DELAY = 2000;
const DEFAULT_TRANSLATION_INTERVAL = 1500;

export const useRealTimeTranslator = (
  options: UseFakeTranslatorOptions = {}
): UseRealTimeTranslatorReturn => {
  const t = useTranslations("translatorPage");
  const {
    words = FAKE_WORDS,
    initialDelay = DEFAULT_INITIAL_DELAY,
    translationInterval = DEFAULT_TRANSLATION_INTERVAL,
  } = options;

  const [state, setState] = useState<RealTimeTranslationState>({
    isConnected: false,
    isActive: false,
    isRecording: false,
    isProcessing: false,
    connectionStatus: "Disconnected",
    currentPrediction: "...",
    fullTranscript: "",
    confidence: 0,
    lastUpdate: "",
    recentPredictions: [],
  });

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const wordIndexRef = useRef(0);
  const isConnectedRef = useRef(false);

  useEffect(() => {
    isConnectedRef.current = state.isConnected;
  }, [state.isConnected]);

  const connect = useCallback(() => {
    setState((prev) => ({
      ...prev,
      isConnected: true,
      connectionStatus: "Connected",
    }));
  }, []);

  const disconnect = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    setState((prev) => ({
      ...prev,
      isConnected: false,
      isActive: false,
      connectionStatus: "Disconnected",
    }));
  }, []);

  const startRecognition = useCallback(() => {
    if (!isConnectedRef.current) {
      console.error("Not connected");
      return false;
    }

    if (timerRef.current) clearInterval(timerRef.current);
    wordIndexRef.current = 0;

    setState((prev) => ({
      ...prev,
      isActive: true,
      recentPredictions: [],
      currentPrediction: t("startingRecognition"),
      fullTranscript: "",
    }));

    setTimeout(() => {
      timerRef.current = setInterval(() => {
        if (wordIndexRef.current < words.length) {
          const newWord = words[wordIndexRef.current];
          const newResult: PredictionResult = {
            prediction: newWord,
            confidence: Math.floor(Math.random() * 11) + 90, // Random confidence 90-100
            timestamp: new Date().toLocaleTimeString(),
          };

          setState((prev) => ({
            ...prev,
            isProcessing: true,
            currentPrediction: newWord,
            fullTranscript: prev.fullTranscript
              ? `${prev.fullTranscript} ${newWord}`
              : newWord,
            confidence: newResult.confidence,
            lastUpdate: newResult.timestamp,
            recentPredictions: [newResult, ...prev.recentPredictions],
          }));

          setTimeout(
            () => setState((prev) => ({ ...prev, isProcessing: false })),
            500
          );

          wordIndexRef.current += 1;
        } else {
          if (timerRef.current) clearInterval(timerRef.current);
          setState((prev) => ({
            ...prev,
            isActive: false,
            currentPrediction: t("recognitionFinished"),
          }));
        }
      }, translationInterval);
    }, initialDelay);

    return true;
  }, [words, initialDelay, translationInterval, t]);

  const stopRecognition = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    setState((prev) => ({
      ...prev,
      isActive: false,
      isProcessing: false,
      currentPrediction: t("stopTranslation"),
    }));
  }, [t]);

  const toggleRecognition = useCallback(() => {
    if (state.isActive) {
      stopRecognition();
    } else {
      if (!state.isConnected) {
        connect();
        setTimeout(() => startRecognition(), 100);
      } else {
        startRecognition();
      }
    }
  }, [
    state.isActive,
    state.isConnected,
    connect,
    startRecognition,
    stopRecognition,
  ]);

  const clearHistory = useCallback(() => {
    setState((prev) => ({
      ...prev,
      recentPredictions: [],
      currentPrediction: t("historyCleared"),
      fullTranscript: "",
      confidence: 0,
      lastUpdate: "",
    }));
  }, [t]);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  return {
    state,
    connect,
    disconnect,
    startRecognition,
    stopRecognition,
    toggleRecognition,
    clearHistory,
  };
};
