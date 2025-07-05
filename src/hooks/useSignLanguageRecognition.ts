import { useCallback, useEffect, useRef, useState } from "react";

const WEBSOCKET_URL = "wss://asl-sign-language-336987311239.us-central1.run.app/ws";

export interface SignLanguageRecognitionResult {
  prediction: string;
  confidence: number;
  timestamp: string;
}

export interface UseSignLanguageRecognitionOptions {
  onResult?: (result: SignLanguageRecognitionResult) => void;
  captureInterval?: number; // milliseconds, default 200ms
}

export const useSignLanguageRecognition = (options: UseSignLanguageRecognitionOptions = {}) => {
  const { onResult, captureInterval = 200 } = options;
  
  // WebSocket states
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState("Disconnected");
  
  // Recognition states
  const [isActive, setIsActive] = useState(false);
  const [currentPrediction, setCurrentPrediction] = useState("No sign detected");
  const [confidence, setConfidence] = useState(0);
  const [lastUpdate, setLastUpdate] = useState<string>("");
  
  // Recent predictions for smoother display
  const [recentPredictions, setRecentPredictions] = useState<SignLanguageRecognitionResult[]>([]);
  
  // Refs
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const captureIntervalRef = useRef<NodeJS.Timeout | null>(null);
  
  // Connect to WebSocket
  const connect = useCallback(() => {
    if (socket) {
      socket.close();
    }

    try {
      setConnectionStatus("Connecting...");
      const newSocket = new WebSocket(WEBSOCKET_URL);

      newSocket.onopen = () => {
        console.log("Sign Language WebSocket connected");
        setIsConnected(true);
        setConnectionStatus("Connected");
      };

      newSocket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          
          let prediction = "No sign detected";
          let confidence = 0;
          
          // Parse response from server
          if (data.prediction) {
            prediction = data.prediction;
            confidence = Math.round(data.confidence * 100);
          } else if (data.current_word) {
            prediction = data.current_word;
            confidence = data.confidence ? Math.round(data.confidence * 100) : 0;
          }
          
          const timestamp = new Date().toLocaleTimeString();
          const result: SignLanguageRecognitionResult = {
            prediction,
            confidence,
            timestamp
          };
          
          // Update states
          setCurrentPrediction(prediction);
          setConfidence(confidence);
          setLastUpdate(timestamp);
          
          // Add to recent predictions (keep last 10)
          setRecentPredictions(prev => {
            const newPredictions = [result, ...prev.slice(0, 9)];
            return newPredictions;
          });
          
          // Call callback if provided
          if (onResult) {
            onResult(result);
          }
          
        } catch (error) {
          console.error("Error parsing sign language WebSocket message:", error);
        }
      };

      newSocket.onclose = () => {
        console.log("Sign Language WebSocket disconnected");
        setIsConnected(false);
        setConnectionStatus("Disconnected");
        setIsActive(false);
        
        // Stop capture
        if (captureIntervalRef.current) {
          clearInterval(captureIntervalRef.current);
          captureIntervalRef.current = null;
        }
      };

      newSocket.onerror = (error) => {
        console.error("Sign Language WebSocket error:", error);
        setConnectionStatus("Error");
      };

      setSocket(newSocket);
    } catch (error) {
      console.error("Error connecting to sign language WebSocket:", error);
      setConnectionStatus("Connection failed");
    }
  }, [onResult]);

  // Disconnect WebSocket
  const disconnect = useCallback(() => {
    if (socket) {
      socket.close();
      setSocket(null);
    }
    setIsConnected(false);
    setConnectionStatus("Disconnected");
  }, [socket]);

  // Start recognition
  const startRecognition = useCallback(() => {
    if (!isConnected || !socket) {
      console.error("WebSocket not connected");
      return false;
    }

    // Create hidden canvas for frame capture
    if (!canvasRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = 640;
      canvas.height = 480;
      canvas.style.display = 'none';
      document.body.appendChild(canvas);
      canvasRef.current = canvas;
    }

    setIsActive(true);
    setConnectionStatus("Recognizing...");

    // Start capturing frames
    captureIntervalRef.current = setInterval(() => {
      captureAndSendFrame();
    }, captureInterval);

    return true;
  }, [isConnected, socket, captureInterval]);

  // Stop recognition
  const stopRecognition = useCallback(() => {
    if (captureIntervalRef.current) {
      clearInterval(captureIntervalRef.current);
      captureIntervalRef.current = null;
    }
    
    setIsActive(false);
    setCurrentPrediction("No sign detected");
    setConfidence(0);
    setConnectionStatus(isConnected ? "Connected" : "Disconnected");
  }, [isConnected]);

  // Capture frame from video and send to WebSocket
  const captureAndSendFrame = useCallback(() => {
    if (!socket || socket.readyState !== WebSocket.OPEN || !canvasRef.current) {
      return;
    }

    // Try to get video element from Zego or other video sources
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
      const imageData = canvas.toDataURL('image/jpeg', 0.7);
      socket.send(imageData);
    } catch (error) {
      console.error('Error sending frame for sign language recognition:', error);
    }
  }, [socket]);

  // Toggle recognition
  const toggleRecognition = useCallback(() => {
    if (isActive) {
      stopRecognition();
    } else {
      if (!isConnected) {
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
  }, [isActive, isConnected, connect, startRecognition, stopRecognition, socket]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (captureIntervalRef.current) {
        clearInterval(captureIntervalRef.current);
      }
      if (socket) {
        socket.close();
      }
      if (canvasRef.current && canvasRef.current.parentNode) {
        canvasRef.current.parentNode.removeChild(canvasRef.current);
      }
    };
  }, [socket]);

  return {
    // States
    isConnected,
    isActive,
    connectionStatus,
    currentPrediction,
    confidence,
    lastUpdate,
    recentPredictions,
    
    // Actions
    connect,
    disconnect,
    startRecognition,
    stopRecognition,
    toggleRecognition,
  };
}; 