import { useCallback, useEffect, useRef, useState } from "react";
import { 
  RealTimeTranslationState, 
  RealTimeTranslationResult, 
  UseRealTimeTranslatorReturn,
  TranslationResponse 
} from "@/features/translator/types";

// Use the same WebSocket URL as sign language recognition
const WEBSOCKET_URL = "wss://sign-detection-436879212893.australia-southeast1.run.app/ws";

// Demo predictions for when server is unavailable
const DEMO_PREDICTIONS = [
  { prediction: "Hello", confidence: 85 },
  { prediction: "Thank you", confidence: 92 },
  { prediction: "Yes", confidence: 78 },
  { prediction: "No", confidence: 88 },
  { prediction: "Please", confidence: 81 },
  { prediction: "Sorry", confidence: 89 },
  { prediction: "Good morning", confidence: 94 },
  { prediction: "How are you?", confidence: 76 },
  { prediction: "I love you", confidence: 91 },
  { prediction: "Water", confidence: 83 }
];

interface UseRealTimeTranslatorOptions {
  onResult?: (result: RealTimeTranslationResult) => void;
  captureInterval?: number;
  userId?: string;
  language?: 'en' | 'vi';
}

export const useRealTimeTranslator = ({
  onResult,
  captureInterval = 200,
  userId
}: UseRealTimeTranslatorOptions = {}): UseRealTimeTranslatorReturn => {
  
  // WebSocket and capture states
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [demoMode, setDemoMode] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const captureIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const demoIntervalRef = useRef<NodeJS.Timeout | null>(null);
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

  // Activate demo mode
  const activateDemoMode = useCallback(() => {
    console.log("🎭 Activating demo mode for real-time translation");
    setDemoMode(true);
    setState(prev => ({
      ...prev,
      isConnected: true,
      connectionStatus: 'Demo Mode (Server Unavailable)'
    }));
  }, []);

  // Connect to WebSocket with fallback to demo mode
  const connect = useCallback(() => {
    if (socket) {
      socket.close();
    }

    // Clear demo mode state
    setDemoMode(false);
    if (demoIntervalRef.current) {
      clearInterval(demoIntervalRef.current);
      demoIntervalRef.current = null;
    }

    try {
      setState(prev => ({ ...prev, connectionStatus: 'Connecting...' }));
      
      const wsUrl = userId ? `${WEBSOCKET_URL}/${userId}` : WEBSOCKET_URL;
      console.log("🔌 Attempting to connect to:", wsUrl);
      
      const newSocket = new WebSocket(wsUrl);

      // Set a connection timeout
      const connectionTimeout = setTimeout(() => {
        console.log("⏰ Connection timeout, switching to demo mode");
        newSocket.close();
        activateDemoMode();
      }, 5000); // 5 second timeout

      newSocket.onopen = () => {
        clearTimeout(connectionTimeout);
        console.log("✅ Real-time Translator WebSocket connected");
        setRetryCount(0);
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
        clearTimeout(connectionTimeout);
        console.log("🔌 Real-time Translator WebSocket disconnected");
        
        // If we haven't reached max retries and not in demo mode, try demo mode
        if (retryCount < 2 && !demoMode) {
          console.log("🔄 Switching to demo mode after connection failure");
          activateDemoMode();
        } else {
          setState(prev => ({
            ...prev,
            isConnected: false,
            isActive: false,
            connectionStatus: 'Disconnected'
          }));
        }
        
        // Stop capture
        if (captureIntervalRef.current) {
          clearInterval(captureIntervalRef.current);
          captureIntervalRef.current = null;
        }
      };

      newSocket.onerror = (error) => {
        clearTimeout(connectionTimeout);
        console.error("❌ Real-time Translator WebSocket error:", error);
        setRetryCount(prev => prev + 1);
        
        // Switch to demo mode after error
        console.log("🎭 Activating demo mode due to connection error");
        activateDemoMode();
      };

      setSocket(newSocket);
    } catch (error) {
      console.error("❌ Error connecting to translation WebSocket:", error);
      console.log("🎭 Activating demo mode due to connection error");
      activateDemoMode();
    }
  }, [userId, onResult, retryCount, demoMode, activateDemoMode, socket]);

  // Disconnect WebSocket and demo mode
  const disconnect = useCallback(() => {
    if (socket) {
      socket.close();
      setSocket(null);
    }
    
    // Stop demo mode
    setDemoMode(false);
    if (demoIntervalRef.current) {
      clearInterval(demoIntervalRef.current);
      demoIntervalRef.current = null;
    }
    
    // Stop capture
    if (captureIntervalRef.current) {
      clearInterval(captureIntervalRef.current);
      captureIntervalRef.current = null;
    }
    
    setState(prev => ({
      ...prev,
      isConnected: false,
      isActive: false,
      connectionStatus: 'Disconnected'
    }));
  }, [socket]);

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

  // Start recognition (real or demo mode)
  const startRecognition = useCallback(() => {
    if (!state.isConnected) {
      console.error("Not connected");
      return false;
    }

    setState(prev => ({
      ...prev,
      isActive: true,
      connectionStatus: demoMode ? 'Demo Mode (Server Unavailable)' : 'Recognizing...'
    }));

    if (demoMode) {
      // Start demo mode predictions
      console.log("🎭 Starting demo mode predictions");
      demoIntervalRef.current = setInterval(() => {
        const randomPrediction = DEMO_PREDICTIONS[Math.floor(Math.random() * DEMO_PREDICTIONS.length)];
        const timestamp = new Date().toLocaleTimeString();
        
        const result: RealTimeTranslationResult = {
          prediction: randomPrediction.prediction,
          confidence: randomPrediction.confidence,
          timestamp
        };

        setState(prev => ({
          ...prev,
          currentPrediction: randomPrediction.prediction,
          confidence: randomPrediction.confidence,
          lastUpdate: timestamp,
          isProcessing: false,
          recentPredictions: [result, ...prev.recentPredictions.slice(0, 9)]
        }));

        // Call callback if provided
        if (onResult) {
          onResult(result);
        }
      }, captureInterval * 3); // Slower for demo
      
      return true;
    }

    // Real WebSocket mode
    if (!socket) {
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

    // Start capturing frames
    captureIntervalRef.current = setInterval(() => {
      captureAndSendFrame();
    }, captureInterval);

    return true;
  }, [state.isConnected, socket, demoMode, captureInterval, captureAndSendFrame, onResult]);

  // Stop recognition (real or demo mode)
  const stopRecognition = useCallback(() => {
    // Stop real mode interval
    if (captureIntervalRef.current) {
      clearInterval(captureIntervalRef.current);
      captureIntervalRef.current = null;
    }
    
    // Stop demo mode interval
    if (demoIntervalRef.current) {
      clearInterval(demoIntervalRef.current);
      demoIntervalRef.current = null;
    }
    
    setState(prev => ({
      ...prev,
      isActive: false,
      currentPrediction: 'No sign detected',
      confidence: 0,
      connectionStatus: demoMode ? 'Demo Mode (Server Unavailable)' : 
                       prev.isConnected ? 'Connected' : 'Disconnected'
    }));
  }, [demoMode]);

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
      if (demoIntervalRef.current) {
        clearInterval(demoIntervalRef.current);
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