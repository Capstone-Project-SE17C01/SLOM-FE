import { useCallback, useEffect, useRef, useState } from "react";
import { 
  RealTimeTranslationState, 
  RealTimeTranslationResult, 
  UseRealTimeTranslatorReturn,
  TranslationResponse 
} from "@/features/translator/types";

// Use the same WebSocket URL as sign language recognition
const WEBSOCKET_URL = "wss://sign-detection-436879212893.australia-southeast1.run.app/ws";

interface UseRealTimeTranslatorOptions {
  onResult?: (result: RealTimeTranslationResult) => void;
  captureInterval?: number;
  userId?: string;
  language?: 'en' | 'vi';
}

export const useRealTimeTranslator = ({
  onResult,
  captureInterval = 200,
  userId,
  language = 'en'
}: UseRealTimeTranslatorOptions = {}): UseRealTimeTranslatorReturn => {
  
  // WebSocket and capture states
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const captureIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  
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

  // Connect to WebSocket
  const connect = useCallback(() => {
    if (socket) {
      socket.close();
    }

    try {
      setState(prev => ({ ...prev, connectionStatus: 'Connecting...' }));
      
      const wsUrl = userId ? `${WEBSOCKET_URL}/${userId}` : WEBSOCKET_URL;
      const newSocket = new WebSocket(wsUrl);

      newSocket.onopen = () => {
        console.log("Real-time Translator WebSocket connected");
        setState(prev => ({
          ...prev,
          isConnected: true,
          connectionStatus: 'Connected'
        }));
      };

      newSocket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data) as TranslationResponse;
          
          setState(prev => ({ ...prev, isProcessing: false }));

          if (data.error) {
            console.error("Translation error:", data.error);
            setState(prev => ({
              ...prev,
              connectionStatus: 'Error',
              currentPrediction: 'Error occurred',
              confidence: 0
            }));
            return;
          }

          const prediction = data.prediction || "No sign detected";
          const confidence = Math.round((data.confidence || 0) * 100);
          const timestamp = new Date().toLocaleTimeString();
          
          const result: RealTimeTranslationResult = {
            prediction,
            confidence,
            timestamp
          };
          
          // Update states
          setState(prev => ({
            ...prev,
            currentPrediction: prediction,
            confidence,
            lastUpdate: timestamp,
            connectionStatus: prev.isActive ? 'Recognizing...' : 'Connected',
            recentPredictions: [result, ...prev.recentPredictions.slice(0, 9)]
          }));
          
          // Call callback if provided
          if (onResult) {
            onResult(result);
          }
          
        } catch (error) {
          console.error("Error parsing translation WebSocket message:", error);
          setState(prev => ({
            ...prev,
            connectionStatus: 'Error',
            isProcessing: false
          }));
        }
      };

      newSocket.onclose = () => {
        console.log("Real-time Translator WebSocket disconnected");
        setState(prev => ({
          ...prev,
          isConnected: false,
          isActive: false,
          connectionStatus: 'Disconnected'
        }));
        
        // Stop capture
        if (captureIntervalRef.current) {
          clearInterval(captureIntervalRef.current);
          captureIntervalRef.current = null;
        }
      };

      newSocket.onerror = (error) => {
        console.error("Real-time Translator WebSocket error:", error);
        setState(prev => ({
          ...prev,
          connectionStatus: 'Error',
          isProcessing: false
        }));
      };

      setSocket(newSocket);
    } catch (error) {
      console.error("Error connecting to translation WebSocket:", error);
      setState(prev => ({
        ...prev,
        connectionStatus: 'Error'
      }));
    }
  }, [userId, onResult]);

  // Disconnect WebSocket
  const disconnect = useCallback(() => {
    if (socket) {
      socket.close();
      setSocket(null);
    }
    setState(prev => ({
      ...prev,
      isConnected: false,
      isActive: false,
      connectionStatus: 'Disconnected'
    }));
  }, [socket]);

  // Start recognition
  const startRecognition = useCallback(() => {
    if (!state.isConnected || !socket) {
      console.error("WebSocket not connected");
      return false;
    }

    // Create hidden canvas for frame capture if not exists
    if (!canvasRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = 640;
      canvas.height = 480;
      canvas.style.display = 'none';
      document.body.appendChild(canvas);
      canvasRef.current = canvas;
    }

    setState(prev => ({
      ...prev,
      isActive: true,
      connectionStatus: 'Recognizing...'
    }));

    // Start capturing frames
    captureIntervalRef.current = setInterval(() => {
      captureAndSendFrame();
    }, captureInterval);

    return true;
  }, [state.isConnected, socket, captureInterval]);

  // Stop recognition
  const stopRecognition = useCallback(() => {
    if (captureIntervalRef.current) {
      clearInterval(captureIntervalRef.current);
      captureIntervalRef.current = null;
    }
    
    setState(prev => ({
      ...prev,
      isActive: false,
      currentPrediction: 'No sign detected',
      confidence: 0,
      connectionStatus: prev.isConnected ? 'Connected' : 'Disconnected'
    }));
  }, []);

  // Capture frame from video and send to WebSocket
  const captureAndSendFrame = useCallback(() => {
    if (!socket || socket.readyState !== WebSocket.OPEN || !canvasRef.current) {
      return;
    }

    // Try to get video element from DOM
    const videoElement = document.querySelector('video') as HTMLVideoElement;
    
    if (!videoElement || videoElement.readyState < 2) {
      return;
    }

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Draw current video frame to canvas
    ctx.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
    
    // Convert to base64 and send
    try {
      setState(prev => ({ ...prev, isProcessing: true }));
      const imageData = canvas.toDataURL('image/jpeg', 0.7);
      const base64Data = imageData.split(',')[1];
      socket.send(base64Data);
    } catch (error) {
      console.error('Error sending frame for real-time translation:', error);
      setState(prev => ({ ...prev, isProcessing: false }));
    }
  }, [socket]);

  // Toggle recognition
  const toggleRecognition = useCallback(() => {
    if (state.isActive) {
      stopRecognition();
    } else {
      if (!state.isConnected) {
        connect();
        // Wait a moment for connection, then start
        setTimeout(() => {
          if (socket && socket.readyState === WebSocket.OPEN) {
            startRecognition();
          }
        }, 1000);
      } else {
        startRecognition();
      }
    }
  }, [state.isActive, state.isConnected, connect, startRecognition, stopRecognition, socket]);

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

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (captureIntervalRef.current) {
        clearInterval(captureIntervalRef.current);
      }
      if (canvasRef.current && canvasRef.current.parentNode) {
        canvasRef.current.parentNode.removeChild(canvasRef.current);
      }
      if (socket) {
        socket.close();
      }
    };
  }, [socket]);

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