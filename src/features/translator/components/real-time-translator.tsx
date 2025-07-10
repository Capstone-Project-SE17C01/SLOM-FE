"use client";

import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTheme } from "@/contexts/ThemeContext";
import { cn } from "@/lib/utils";
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
import { RealTimeTranslatorProps } from "../types";

export default function RealTimeTranslator({
  onResult,
  language = 'en',
  captureInterval = 200,
  showConfidence = true,
  autoStart = false
}: RealTimeTranslatorProps) {
  
  const { isDarkMode } = useTheme();
  const { userInfo } = useSelector((state: RootState) => state.auth);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);

  // Initialize real-time translator
  const translator = useRealTimeTranslator({
    onResult: (result) => {
      console.log("Translation result:", result);
      if (onResult) {
        onResult(result);
      }
    },
    captureInterval,
    userId: userInfo?.id,
    language
  });

  // Auto-start if requested
  useEffect(() => {
    if (autoStart && !translator.state.isConnected) {
      translator.connect();
    }
  }, [autoStart, translator]);

  // Start camera and WebSocket connection
  const startTranslation = async () => {
    try {
      // Request camera access
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 640 },
          height: { ideal: 480 },
          facingMode: 'user'
        },
        audio: false
      });

      setMediaStream(stream);
      setCameraActive(true);

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }

      // Connect to WebSocket if not connected
      if (!translator.state.isConnected) {
        translator.connect();
        
        // Wait for connection then start recognition
        setTimeout(() => {
          if (translator.state.isConnected) {
            translator.startRecognition();
          }
        }, 1000);
      } else {
        translator.startRecognition();
      }

    } catch (error) {
      console.error("Error starting translation:", error);
      alert("Could not access camera. Please check permissions and try again.");
    }
  };

  // Stop translation and camera
  const stopTranslation = () => {
    // Stop recognition
    translator.stopRecognition();
    
    // Stop camera
    if (mediaStream) {
      mediaStream.getTracks().forEach(track => track.stop());
      setMediaStream(null);
    }
    
    setCameraActive(false);
    
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
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
  useEffect(() => {
    return () => {
      if (mediaStream) {
        mediaStream.getTracks().forEach(track => track.stop());
      }
      translator.disconnect();
    };
  }, [mediaStream, translator]);

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
              {cameraActive ? (
                <video
                  ref={videoRef}
                  autoPlay
                  muted
                  playsInline
                  className="w-full h-full object-cover"
                />
              ) : (
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
            
            {/* Control buttons */}
            <div className="flex items-center justify-center gap-4">
              {!translator.state.isActive ? (
                <Button 
                  size="lg" 
                  className="bg-blue-500 hover:bg-blue-600 text-white px-8"
                  onClick={startTranslation}
                  disabled={translator.state.connectionStatus === 'Connecting...'}
                >
                  <Play className="w-5 h-5 mr-2" />
                  Start Translation
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