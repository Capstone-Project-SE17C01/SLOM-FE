import { useCallback, useEffect, useState } from "react";
import { 
  RealTimeTranslationState, 
  UseRealTimeTranslatorReturn
} from "@/types/ITranslator";
export const useRealTimeTranslator = (): UseRealTimeTranslatorReturn => {
  const [state, setState] = useState<RealTimeTranslationState>({
    isConnected: false,
    isActive: false,
    isRecording: false,
    isProcessing: false,
    connectionStatus: 'Disconnected',
    currentPrediction: 'No sign detected',
    confidence: 0,
    lastUpdate: '',
    recentPredictions: []
  });
  const connect = useCallback(() => {
    console.log("📹 Camera-only mode (WebSocket disabled temporarily)");
    setState(prev => ({
      ...prev,
      isConnected: true,
      connectionStatus: 'Camera Only Mode (WebSocket Disabled)'
    }));
  }, []);
  const disconnect = useCallback(() => {
    console.log("📹 Disconnecting camera-only mode");
    setState(prev => ({
      ...prev,
      isConnected: false,
      isActive: false,
      connectionStatus: 'Disconnected'
    }));
  }, []);
  const startRecognition = useCallback(() => {
    if (!state.isConnected) {
      console.error("Not connected");
      return false;
    }
    setState(prev => ({
      ...prev,
      isActive: true,
      connectionStatus: 'Camera Only Mode (WebSocket Disabled)',
      currentPrediction: 'Camera preview active (WebSocket disabled)',
      confidence: 0,
      lastUpdate: new Date().toLocaleTimeString()
    }));
    return true;
  }, [state.isConnected]);
  const stopRecognition = useCallback(() => {
    console.log("📹 Stopping camera-only mode");
    setState(prev => ({
      ...prev,
      isActive: false,
      currentPrediction: 'Camera stopped',
      confidence: 0,
      connectionStatus: 'Camera Only Mode (WebSocket Disabled)'
    }));
  }, []);
  const toggleRecognition = useCallback(() => {
    if (state.isActive) {
      stopRecognition();
    } else {
      if (!state.isConnected) {
        connect();
        setTimeout(() => {
          startRecognition();
        }, 100);
      } else {
        startRecognition();
      }
    }
  }, [state.isActive, state.isConnected, connect, startRecognition, stopRecognition]);
  const clearHistory = useCallback(() => {
    setState(prev => ({
      ...prev,
      recentPredictions: [],
      currentPrediction: 'No sign detected',
      confidence: 0,
      lastUpdate: ''
    }));
  }, []);
  useEffect(() => {
    return () => {
      console.log("📹 Cleaning up camera-only mode");
    };
  }, []);
  return {
    state,
    connect,
    disconnect,
    startRecognition,
    stopRecognition,
    toggleRecognition,
    clearHistory
  };
}; 
