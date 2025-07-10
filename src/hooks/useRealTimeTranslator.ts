import { useCallback, useEffect, useState } from "react";
import { 
  RealTimeTranslationState, 
  UseRealTimeTranslatorReturn
} from "@/features/translator/types";

export const useRealTimeTranslator = (): UseRealTimeTranslatorReturn => {
  
  // Translation state
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

  // Temporary: Skip WebSocket connection, just show camera
  const connect = useCallback(() => {
    console.log("📹 Camera-only mode (WebSocket disabled temporarily)");
    
    // Just set connected state for camera to work
    setState(prev => ({
      ...prev,
      isConnected: true,
      connectionStatus: 'Camera Only Mode (WebSocket Disabled)'
    }));
  }, []);

  // Disconnect camera
  const disconnect = useCallback(() => {
    console.log("📹 Disconnecting camera-only mode");
    
    setState(prev => ({
      ...prev,
      isConnected: false,
      isActive: false,
      connectionStatus: 'Disconnected'
    }));
  }, []);

  // Camera-only mode - no data processing

  // Start recognition (Camera only mode - no WebSocket)
  const startRecognition = useCallback(() => {
    if (!state.isConnected) {
      console.error("Not connected");
      return false;
    }

    console.log("📹 Starting camera-only mode (no data processing)");
    
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

  // Stop recognition (Camera only mode)
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

  // Toggle recognition (Camera only)
  const toggleRecognition = useCallback(() => {
    if (state.isActive) {
      stopRecognition();
    } else {
      if (!state.isConnected) {
        connect();
        // Start camera preview immediately
        setTimeout(() => {
          startRecognition();
        }, 100);
      } else {
        startRecognition();
      }
    }
  }, [state.isActive, state.isConnected, connect, startRecognition, stopRecognition]);

  // Clear translation history
  const clearHistory = useCallback(() => {
    setState(prev => ({
      ...prev,
      recentPredictions: [],
      currentPrediction: 'No sign detected',
      confidence: 0,
      lastUpdate: ''
    }));
  }, []);

  // Camera-only mode - minimal cleanup
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