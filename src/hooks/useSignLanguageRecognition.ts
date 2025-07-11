import { useCallback, useEffect, useRef, useState } from "react";
const WEBSOCKET_URL = "wss://asl-sign-language-336987311239.us-central1.run.app/ws";
export interface SignLanguageRecognitionResult {
  prediction: string;
  confidence: number;
  timestamp: string;
}
export interface UseSignLanguageRecognitionOptions {
  onResult?: (result: SignLanguageRecognitionResult) => void;
  captureInterval?: number;
}
export const useSignLanguageRecognition = (options: UseSignLanguageRecognitionOptions = {}) => {
  const { onResult, captureInterval = 200 } = options;
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState("Disconnected");
  const [isActive, setIsActive] = useState(false);
  const [currentPrediction, setCurrentPrediction] = useState("No sign detected");
  const [confidence, setConfidence] = useState(0);
  const [lastUpdate, setLastUpdate] = useState<string>("");
  const [recentPredictions, setRecentPredictions] = useState<SignLanguageRecognitionResult[]>([]);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const captureIntervalRef = useRef<NodeJS.Timeout | null>(null);
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
          setCurrentPrediction(prediction);
          setConfidence(confidence);
          setLastUpdate(timestamp);
          setRecentPredictions(prev => {
            const newPredictions = [result, ...prev.slice(0, 9)];
            return newPredictions;
          });
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
  }, [onResult, socket]);
  const captureAndSendFrame = useCallback(() => {
    if (!socket || socket.readyState !== WebSocket.OPEN || !canvasRef.current) {
      return;
    }
    const videoElement = document.querySelector('video') as HTMLVideoElement;
    if (!videoElement || videoElement.readyState < 2) {
      return;
    }
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
    try {
      const imageData = canvas.toDataURL('image/jpeg', 0.7);
      socket.send(imageData);
    } catch (error) {
      console.error('Error sending frame for sign language recognition:', error);
    }
  }, [socket]);
  const disconnect = useCallback(() => {
    if (socket) {
      socket.close();
      setSocket(null);
    }
    setIsConnected(false);
    setConnectionStatus("Disconnected");
  }, [socket]);
  const startRecognition = useCallback(() => {
    if (!isConnected || !socket) {
      console.error("WebSocket not connected");
      return false;
    }
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
    captureIntervalRef.current = setInterval(() => {
      captureAndSendFrame();
    }, captureInterval);
    return true;
  }, [isConnected, socket, captureInterval, captureAndSendFrame]);
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
  const toggleRecognition = useCallback(() => {
    if (isActive) {
      stopRecognition();
    } else {
      if (!isConnected) {
        connect();
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
    isConnected,
    isActive,
    connectionStatus,
    currentPrediction,
    confidence,
    lastUpdate,
    recentPredictions,
    connect,
    disconnect,
    startRecognition,
    stopRecognition,
    toggleRecognition,
  };
}; 
