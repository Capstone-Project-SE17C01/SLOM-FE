"use client";

import { useCallback, useEffect, useRef, useState } from "react";

// WebSocket URL từ dự án gốc
const WEBSOCKET_URL = "wss://asl-sign-language-336987311239.us-central1.run.app/ws";

export default function TestWebSocket() {
  // WebSocket states
  const [socket, setSocket] = useState(null);
  const [socketConnected, setSocketConnected] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState("Disconnected");
  
  // Camera states
  const [hasCamera, setHasCamera] = useState(false);
  const [cameraError, setCameraError] = useState("");
  
  // Recognition states
  const [isRecognitionActive, setIsRecognitionActive] = useState(false);
  const [signPrediction, setSignPrediction] = useState("No sign detected");
  const [signConfidence, setSignConfidence] = useState(0);
  const [lastFrameTime, setLastFrameTime] = useState("");
  
  // Refs
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const captureIntervalRef = useRef(null);

  // 1. Khởi tạo camera
  const initCamera = useCallback(async () => {
    try {
      setConnectionStatus("Requesting camera access...");
      
      // Yêu cầu quyền truy cập camera
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: 640,
          height: 480,
          frameRate: 24
        }
      });
      
      streamRef.current = stream;
      
      // Gắn stream vào video element
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      
      setHasCamera(true);
      setCameraError("");
      setConnectionStatus("Camera ready");
      
    } catch (error) {
      console.error("Camera access error:", error);
      setCameraError("Cannot access camera. Please check permissions.");
      setConnectionStatus("Camera access denied");
      setHasCamera(false);
    }
  }, []);

  // 2. Connect đến WebSocket
  const connectWebSocket = useCallback(() => {
    if (socket) {
      socket.close();
    }

    try {
      setConnectionStatus("Connecting to WebSocket...");
      const newSocket = new WebSocket(WEBSOCKET_URL);

      newSocket.onopen = () => {
        console.log("WebSocket connected successfully");
        setSocketConnected(true);
        setConnectionStatus("WebSocket connected");
      };

      newSocket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          
          let prediction = "No sign detected";
          let confidence = 0;
          
          // Xử lý response từ server
          if (data.prediction) {
            prediction = data.prediction;
            confidence = Math.round(data.confidence * 100);
          } else if (data.current_word) {
            prediction = data.current_word;
            confidence = data.confidence ? Math.round(data.confidence * 100) : 0;
          }
          
          // Cập nhật UI
          setSignPrediction(prediction);
          setSignConfidence(confidence);
          setLastFrameTime(new Date().toLocaleTimeString());
          
          console.log(`Received: ${prediction} (${confidence}%)`);
        } catch (error) {
          console.error("Error parsing WebSocket message:", error);
        }
      };

      newSocket.onclose = () => {
        console.log("WebSocket disconnected");
        setSocketConnected(false);
        setConnectionStatus("WebSocket disconnected");
        setIsRecognitionActive(false);
        
        // Dừng capture nếu đang active
        if (captureIntervalRef.current) {
          clearInterval(captureIntervalRef.current);
          captureIntervalRef.current = null;
        }
      };

      newSocket.onerror = (error) => {
        console.error("WebSocket error:", error);
        setConnectionStatus("WebSocket error");
      };

      setSocket(newSocket);
    } catch (error) {
      console.error("Error connecting to WebSocket:", error);
      setConnectionStatus("Connection failed");
    }
  }, []);

  // 3. Toggle recognition
  const toggleRecognition = useCallback(() => {
    if (isRecognitionActive) {
      // Dừng recognition
      if (captureIntervalRef.current) {
        clearInterval(captureIntervalRef.current);
        captureIntervalRef.current = null;
      }
      setIsRecognitionActive(false);
      setSignPrediction("No sign detected");
      setSignConfidence(0);
      setConnectionStatus("Recognition stopped");
    } else {
      // Bắt đầu recognition
      if (socketConnected && hasCamera) {
        setIsRecognitionActive(true);
        setConnectionStatus("Recognition active");
        
        // Capture frame mỗi 100ms (10 FPS)
        captureIntervalRef.current = setInterval(() => {
          const video = videoRef.current;
          const canvas = canvasRef.current;
          
          if (!video || !canvas || !socket || socket.readyState !== WebSocket.OPEN) {
            return;
          }
          
          // Kiểm tra video đã ready chưa
          if (video.readyState < 2) {
            console.log("Video not ready yet");
            return;
          }
          
          const ctx = canvas.getContext("2d");
          if (!ctx) return;
          
          // Set canvas size theo video
          canvas.width = video.videoWidth || 640;
          canvas.height = video.videoHeight || 480;
          
          // Vẽ frame hiện tại lên canvas
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          
          // Chuyển thành base64 JPEG
          const imageData = canvas.toDataURL("image/jpeg", 0.7);
          
          // Gửi đến WebSocket
          try {
            socket.send(imageData);
            console.log("Frame sent at", new Date().toLocaleTimeString());
          } catch (error) {
            console.error("Error sending frame:", error);
          }
        }, 100);
      } else {
        alert("Please ensure camera and WebSocket are connected first!");
      }
    }
  }, [isRecognitionActive, socketConnected, hasCamera, socket]);

  // 4. Cleanup khi component unmount
  useEffect(() => {
    return () => {
      // Dừng camera stream
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      
      // Đóng WebSocket
      if (socket) {
        socket.close();
      }
      
      // Clear interval
      if (captureIntervalRef.current) {
        clearInterval(captureIntervalRef.current);
      }
    };
  }, []);

  // 5. Auto init camera khi component mount
  useEffect(() => {
    initCamera();
  }, [initCamera]);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-800 dark:text-white">
          WebSocket Sign Language Test
        </h1>
        
        {/* Status Panel */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Connection Status</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="text-center">
              <div className={`w-4 h-4 rounded-full mx-auto mb-2 ${hasCamera ? 'bg-green-500' : 'bg-red-500'}`}></div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Camera</p>
              <p className="font-medium text-gray-800 dark:text-white">{hasCamera ? 'Ready' : 'Not Available'}</p>
            </div>
            
            <div className="text-center">
              <div className={`w-4 h-4 rounded-full mx-auto mb-2 ${socketConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
              <p className="text-sm text-gray-600 dark:text-gray-400">WebSocket</p>
              <p className="font-medium text-gray-800 dark:text-white">{socketConnected ? 'Connected' : 'Disconnected'}</p>
            </div>
            
            <div className="text-center">
              <div className={`w-4 h-4 rounded-full mx-auto mb-2 ${isRecognitionActive ? 'bg-blue-500 animate-pulse' : 'bg-gray-500'}`}></div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Recognition</p>
              <p className="font-medium text-gray-800 dark:text-white">{isRecognitionActive ? 'Active' : 'Stopped'}</p>
            </div>
          </div>
          
          <p className="text-center text-gray-600 dark:text-gray-400 mb-4">
            Status: {connectionStatus}
          </p>
          
          {cameraError && (
            <p className="text-red-500 text-center mb-4">{cameraError}</p>
          )}
        </div>

        {/* Control Buttons */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-6">
          <div className="flex justify-center space-x-4">
            <button
              onClick={initCamera}
              className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors"
              disabled={hasCamera}
            >
              {hasCamera ? 'Camera Ready' : 'Initialize Camera'}
            </button>
            
            <button
              onClick={connectWebSocket}
              className="px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium transition-colors"
              disabled={socketConnected}
            >
              {socketConnected ? 'WebSocket Connected' : 'Connect WebSocket'}
            </button>
            
            <button
              onClick={toggleRecognition}
              className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                isRecognitionActive 
                  ? 'bg-red-500 hover:bg-red-600 text-white' 
                  : 'bg-yellow-500 hover:bg-yellow-600 text-white'
              }`}
              disabled={!hasCamera || !socketConnected}
            >
              {isRecognitionActive ? 'Stop Recognition' : 'Start Recognition'}
            </button>
          </div>
        </div>

        {/* Video và Results */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Video Panel */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">Camera Feed</h3>
            
            <div className="relative bg-gray-900 rounded-lg overflow-hidden aspect-video">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-contain"
              />
              
              {!hasCamera && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <p className="text-white text-center">
                    Camera not available<br />
                    <small>Please allow camera access</small>
                  </p>
                </div>
              )}
              
              {isRecognitionActive && (
                <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded text-sm">
                  REC
                </div>
              )}
            </div>
            
            {/* Hidden canvas for frame capture */}
            <canvas
              ref={canvasRef}
              className="hidden"
              width={640}
              height={480}
            />
          </div>

          {/* Results Panel */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">Recognition Results</h3>
            
            <div className="space-y-4">
              {/* Current Prediction */}
              <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4">
                <h4 className="font-medium text-gray-800 dark:text-white mb-2">Current Sign</h4>
                <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {signPrediction}
                </p>
                {signConfidence > 0 && (
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    Confidence: {signConfidence}%
                  </p>
                )}
              </div>
              
              {/* Last Update Time */}
              <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4">
                <h4 className="font-medium text-gray-800 dark:text-white mb-2">Last Update</h4>
                <p className="text-gray-600 dark:text-gray-400">
                  {lastFrameTime || 'No updates yet'}
                </p>
              </div>
              
              {/* Instructions */}
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                <h4 className="font-medium text-blue-800 dark:text-blue-200 mb-2">Instructions</h4>
                <ol className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
                  <li>1. Allow camera access</li>
                  <li>2. Connect to WebSocket</li>
                  <li>3. Start recognition</li>
                  <li>4. Perform sign language gestures</li>
                </ol>
              </div>
            </div>
          </div>
        </div>
        
        {/* Debug Info */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mt-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">Debug Information</h3>
          <div className="text-sm text-gray-600 dark:text-gray-400 space-y-2">
            <p><strong>WebSocket URL:</strong> {WEBSOCKET_URL}</p>
            <p><strong>Socket State:</strong> {socket?.readyState === WebSocket.OPEN ? 'Open' : socket?.readyState === WebSocket.CONNECTING ? 'Connecting' : 'Closed'}</p>
            <p><strong>Recognition Active:</strong> {isRecognitionActive ? 'Yes' : 'No'}</p>
            <p><strong>Camera Stream:</strong> {streamRef.current ? 'Active' : 'Inactive'}</p>
          </div>
        </div>
      </div>
    </div>
  );
} 