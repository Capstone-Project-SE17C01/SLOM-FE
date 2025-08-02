"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTheme } from "@/contexts/ThemeContext";
import { cn } from "@/utils/cn";
import { 
  Camera, 
  Play, 
  Pause, 
  RotateCcw, 
  History,
  Download
} from "lucide-react";

import { useRealTimeTranslator } from "@/hooks/useRealTimeTranslator";
import TranslationDisplay from "@/components/ui/translationDisplay";
import ConnectionStatus from "@/components/ui/connectionStatus";
import { RealTimeTranslatorProps } from "../../../types/ITranslator";

export default function RealTimeTranslator({
  language = 'en',
  showConfidence = true,
  autoStart = false
}: Partial<RealTimeTranslatorProps>) {
  
  const { isDarkMode } = useTheme();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraLoading, setCameraLoading] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);

  // --- Configuration for FAKE Real-Time Sign Language Translator ---
  const FAKE_RECOGNITION_WORDS = [
    "I", "need", "help", "with", "my", "computer", "It", "is", "not",
    "working", "Can", "you", "please", "assist", "me"
  ];
  const FAKE_TRANSLATOR_INITIAL_DELAY_MS = 2500;
  const FAKE_TRANSLATOR_INTERVAL_MS = 2000;

  // Initialize real-time translator
  const translator = useRealTimeTranslator({
    words: FAKE_RECOGNITION_WORDS,
    initialDelay: FAKE_TRANSLATOR_INITIAL_DELAY_MS,
    translationInterval: FAKE_TRANSLATOR_INTERVAL_MS,
  });
  
  // destructure các giá trị primitive cần thiết từ translator cho useEffect
  const { state: { isConnected }, connect } = translator;

  // Auto-start if requested
  useEffect(() => {
    if (autoStart && !isConnected) {
      connect();
    }
  }, [autoStart, isConnected, connect]);

  // Check camera permissions and available devices on mount
  useEffect(() => {
    const checkCameraAvailability = async () => {
      try {
        // Check if mediaDevices is supported
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
          console.warn("❌ mediaDevices not supported");
          return;
        }

        // Check available video devices
        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoDevices = devices.filter(device => device.kind === 'videoinput');
        console.log("📹 Available video devices:", videoDevices.length);
        videoDevices.forEach((device, index) => {
          console.log(`  ${index + 1}. ${device.label || 'Unknown Camera'} (${device.deviceId})`);
        });

        if (videoDevices.length === 0) {
          console.warn("⚠️ No video devices found");
        }

        // Check current permissions
        if (navigator.permissions && navigator.permissions.query) {
          const permission = await navigator.permissions.query({ name: 'camera' as PermissionName });
          console.log("🔐 Camera permission status:", permission.state);
        }
      } catch (error) {
        console.error("❌ Error checking camera availability:", error);
      }
    };

    checkCameraAvailability();
  }, []);

  // Start camera and WebSocket connection
  const startTranslation = async () => {
    // --- Start Fake Translation Immediately ---
    // This ensures the demo subtitle works even if the camera fails.
    if (!translator.state.isConnected) {
      translator.connect();
    }
    translator.startRecognition();

    // --- Try to Start Camera for Visuals ---
    setCameraActive(true); // Optimistically show the video view
    setCameraLoading(true);
    setCameraError(null);

    try {
      console.log("🎥 Trying to start camera (for visual effect)...");

      if (!videoRef.current) throw new Error("Video element not found");
      if (!navigator.mediaDevices?.getUserMedia) throw new Error("Camera access not supported by this browser");

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: 'user'
        },
        audio: false
      });
      
      console.log("✅ Camera stream obtained");
      const video = videoRef.current;
      video.srcObject = stream;
      await video.play();
      
      setMediaStream(stream);
      setCameraLoading(false);

    } catch (error) {
      console.error("❌ Camera failed, but fake subtitles will continue:", error);
      setCameraLoading(false);
      
      let errorMessage = "Could not access camera. ";
      if (error instanceof Error) {
        if (error.name === 'NotAllowedError') errorMessage += "Permissions denied.";
        else if (error.name === 'NotFoundError') errorMessage += "No camera found.";
        else errorMessage = error.message;
      }
      setCameraError(errorMessage);
    }
  };

  // Stop translation and camera
  const stopTranslation = () => {
    console.log("🛑 Stopping translation...");
    
    // Stop recognition
    translator.stopRecognition();
    
    // Stop camera
    if (mediaStream) {
      console.log("📹 Stopping camera stream...");
      mediaStream.getTracks().forEach(track => {
        track.stop();
        console.log("🔌 Stopped track:", track.kind, track.label);
      });
      setMediaStream(null);
    }
    
    setCameraActive(false);
    setCameraLoading(false);
    setCameraError(null);
    
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    
    console.log("✅ Translation stopped");
  };

  // Clear translation history
  const clearHistory = () => {
    translator.clearHistory();
  };

  // Export translation history
  const exportHistory = () => {
    const history = translator.state.recentPredictions;
    const data = {
      timestamp: new Date().toISOString(),
      language,
      predictions: history
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `translation-history-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Cleanup on unmount
  // destructure disconnect từ translator cho useEffect cleanup
  const { disconnect } = translator;
  useEffect(() => {
    return () => {
      if (mediaStream) {
        mediaStream.getTracks().forEach(track => track.stop());
      }
      disconnect();
    };
  }, [mediaStream, disconnect]);

  return (
    <div className="space-y-6">
      {/* Camera Section */}
      <Card className={cn(
        "border-2 shadow-lg",
        isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
      )}>
        <CardHeader className="pb-4">
          <CardTitle className={cn(
            "flex items-center gap-3 text-xl",
            isDarkMode ? "text-white" : "text-gray-900"
          )}>
            <Camera className="w-6 h-6 text-blue-500" />
            Camera Feed
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Video preview */}
            <div className={cn(
              "aspect-video rounded-xl overflow-hidden border-2 relative",
              isDarkMode ? "bg-gray-700 border-gray-600" : "bg-gray-100 border-gray-300"
            )}>
              <video
                ref={videoRef}
                autoPlay
                muted
                playsInline
                className="w-full h-full object-cover"
                style={{ 
                  transform: 'scaleX(-1)', // Mirror effect for natural feel
                  backgroundColor: '#000000', // Ensure black background
                  minHeight: '100%',
                  minWidth: '100%',
                  display: cameraActive ? 'block' : 'none'
                }}
                onLoadedMetadata={() => {
                  console.log("📊 Video metadata loaded in component");
                }}
                onCanPlay={() => {
                  console.log("✅ Video can play");
                }}
                onPlay={() => {
                  console.log("▶️ Video started playing");
                }}
                onError={(e) => {
                  console.error("❌ Video element error:", e);
                }}
              />
              {!cameraActive && cameraLoading ? (
                <div className="w-full h-full flex items-center justify-center">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent mx-auto mb-4"></div>
                    <p className={cn(
                      "text-lg font-medium",
                      isDarkMode ? "text-gray-300" : "text-gray-600"
                    )}>
                      Initializing Camera...
                    </p>
                    <p className={cn(
                      "text-sm",
                      isDarkMode ? "text-gray-400" : "text-gray-500"
                    )}>
                      Please allow camera access when prompted
                    </p>
                  </div>
                </div>
              ) : !cameraActive && cameraError ? (
                <div className="w-full h-full flex items-center justify-center">
                  <div className="text-center max-w-md px-4">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 dark:bg-red-900 flex items-center justify-center">
                      <Camera className="w-8 h-8 text-red-500" />
                    </div>
                    <p className={cn(
                      "text-lg font-medium mb-2",
                      isDarkMode ? "text-gray-300" : "text-gray-600"
                    )}>
                      Camera Error
                    </p>
                    <p className={cn(
                      "text-sm",
                      isDarkMode ? "text-gray-400" : "text-gray-500"
                    )}>
                      {cameraError}
                    </p>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="mt-4"
                      onClick={() => {
                        setCameraError(null);
                        startTranslation();
                      }}
                    >
                      Try Again
                    </Button>
                  </div>
                </div>
              ) : !cameraActive && (
                <div className="w-full h-full flex items-center justify-center">
                  <div className="text-center">
                    <Camera className={cn(
                      "w-16 h-16 mx-auto mb-4",
                      isDarkMode ? "text-gray-500" : "text-gray-400"
                    )} />
                    <p className={cn(
                      "text-lg font-medium",
                      isDarkMode ? "text-gray-300" : "text-gray-600"
                    )}>
                      Camera Preview
                    </p>
                    <p className={cn(
                      "text-sm",
                      isDarkMode ? "text-gray-400" : "text-gray-500"
                    )}>
                      Click start to begin translation
                    </p>
                  </div>
                </div>
              )}

              {/* Processing indicator overlay */}
              {translator.state.isProcessing && (
                <div className="absolute top-4 right-4 bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-medium animate-pulse">
                  Processing...
                </div>
              )}
            </div>
            
            {/* Subtitle Display */}
            {translator.state.isActive && translator.state.fullTranscript && (
              <div className="mt-4 p-3 bg-black/70 rounded-lg text-center">
                <p className="text-white font-medium text-lg leading-relaxed">
                  {translator.state.fullTranscript}
                </p>
              </div>
            )}

            {/* Control buttons */}
            <div className="flex items-center justify-center gap-4 pt-4">
              {!translator.state.isActive && !cameraActive ? (
                <Button 
                  size="lg" 
                  className="bg-blue-500 hover:bg-blue-600 text-white px-8"
                  onClick={startTranslation}
                  disabled={cameraLoading || translator.state.connectionStatus === 'Connecting...'}
                >
                  {cameraLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></div>
                      Starting...
                    </>
                  ) : (
                    <>
                      <Play className="w-5 h-5 mr-2" />
                      Start Translation
                    </>
                  )}
                </Button>
              ) : (
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="border-red-500 text-red-500 hover:bg-red-50 px-8"
                  onClick={stopTranslation}
                >
                  <Pause className="w-5 h-5 mr-2" />
                  Stop Translation
                </Button>
              )}
              
              <Button variant="outline" size="lg" onClick={clearHistory}>
                <RotateCcw className="w-5 h-5 mr-2" />
                Clear
              </Button>
              
              {translator.state.recentPredictions.length > 0 && (
                <Button variant="outline" size="lg" onClick={exportHistory}>
                  <Download className="w-5 h-5 mr-2" />
                  Export
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Translation Results Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Current Translation */}
        <div className="space-y-4">
          <h3 className={cn(
            "text-lg font-semibold",
            isDarkMode ? "text-white" : "text-gray-900"
          )}>
            Current Translation
          </h3>
          
          <TranslationDisplay
            prediction={translator.state.currentPrediction}
            confidence={translator.state.confidence}
            timestamp={translator.state.lastUpdate}
            showConfidence={showConfidence}
          />

          {/* Connection Status */}
          <ConnectionStatus
            connectionStatus={translator.state.connectionStatus}
            isActive={translator.state.isActive}
          />
        </div>

        {/* Translation History */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className={cn(
              "text-lg font-semibold",
              isDarkMode ? "text-white" : "text-gray-900"
            )}>
              Recent Translations
            </h3>
            <div className="flex items-center gap-2">
              <History className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-500">
                {translator.state.recentPredictions.length} results
              </span>
            </div>
          </div>

          <div className={cn(
            "max-h-96 overflow-y-auto space-y-3 p-4 rounded-lg border",
            isDarkMode ? "bg-gray-800 border-gray-700" : "bg-gray-50 border-gray-200"
          )}>
            {translator.state.recentPredictions.length > 0 ? (
              translator.state.recentPredictions.map((result, index) => (
                <div
                  key={index}
                  className={cn(
                    "p-3 rounded-lg border transition-all duration-200",
                    isDarkMode ? "bg-gray-700 border-gray-600" : "bg-white border-gray-200",
                    "hover:shadow-md"
                  )}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-gray-900 dark:text-white">
                      {result.prediction}
                    </span>
                    <span className={cn(
                      "text-xs px-2 py-1 rounded-full",
                      result.confidence >= 80 ? "bg-green-100 text-green-600" :
                      result.confidence >= 60 ? "bg-yellow-100 text-yellow-600" :
                      "bg-red-100 text-red-600"
                    )}>
                      {result.confidence}%
                    </span>
                  </div>
                  <span className="text-xs text-gray-500">
                    {result.timestamp}
                  </span>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <History className={cn(
                  "w-12 h-12 mx-auto mb-3",
                  isDarkMode ? "text-gray-600" : "text-gray-400"
                )} />
                <p className={cn(
                  "text-sm",
                  isDarkMode ? "text-gray-400" : "text-gray-500"
                )}>
                  No translations yet. Start signing to see results here.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 