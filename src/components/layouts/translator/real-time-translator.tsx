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
  Volume2,
  VolumeX,
  FileText,
} from "lucide-react";

import SignLanguageDetector from "@/components/SignLanguageDetector/SignLanguageDetector";
import TranslationDisplay from "@/components/ui/translationDisplay";
import ConnectionStatus from "@/components/ui/connectionStatus";
import { RealTimeTranslatorProps } from "../../../types/ITranslator";
import { useTranslations } from "next-intl";
import { useSpeechSynthesis } from "@/hooks/useSpeechSynthesis";
import { exportRealTimeTranslationToDocx } from "@/utils/docxExport";

export default function RealTimeTranslator({
  language = "en",
  showConfidence = true,
  autoStart = false,
}: Partial<RealTimeTranslatorProps>) {
  const t_translatorPage = useTranslations("translatorPage");
  const { isDarkMode } = useTheme();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraLoading, setCameraLoading] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);
  const [isDetectorActive, setIsDetectorActive] = useState(false);
  const [currentPrediction, setCurrentPrediction] = useState("");
  const [confidence, setConfidence] = useState(0);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const [fullTranscript, setFullTranscript] = useState("");
  const [recentPredictions, setRecentPredictions] = useState<Array<{
    prediction: string;
    confidence: number;
    timestamp: string;
  }>>([]);
  const [isSpeechEnabled, setIsSpeechEnabled] = useState(true);
  
  // Khởi tạo speech synthesis
  const speechSynthesis = useSpeechSynthesis({
    language: language === 'en' ? 'en-US' : 'vi-VN',
    rate: 1,
    pitch: 1,
    volume: 1
  });

  // Auto-start if requested
  useEffect(() => {
    if (autoStart && !isDetectorActive) {
      startTranslation();
    }
  }, [autoStart, isDetectorActive]);

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
        const videoDevices = devices.filter(
          (device) => device.kind === "videoinput"
        );
        console.log("📹 Available video devices:", videoDevices.length);
        videoDevices.forEach((device, index) => {
          console.log(
            `  ${index + 1}. ${device.label || "Unknown Camera"} (${
              device.deviceId
            })`
          );
        });

        if (videoDevices.length === 0) {
          console.warn("⚠️ No video devices found");
        }

        // Check current permissions
        if (navigator.permissions && navigator.permissions.query) {
          const permission = await navigator.permissions.query({
            name: "camera" as PermissionName,
          });
          console.log("🔐 Camera permission status:", permission.state);
        }
      } catch (error) {
        console.error("❌ Error checking camera availability:", error);
      }
    };

    checkCameraAvailability();
  }, []);

  // Handle gesture detection from the SignLanguageDetector
  const handleGestureDetected = (gesture: string, detectedConfidence: number) => {
    console.log(`🔤 Gesture detected: "${gesture}" with ${detectedConfidence}% confidence`);
    setCurrentPrediction(gesture);
    setConfidence(detectedConfidence);
    const now = new Date();
    setLastUpdate(now);
    
    // Add to full transcript if it's a new word
    if (gesture && gesture !== currentPrediction) {
      setFullTranscript(prev => 
        prev ? `${prev} ${gesture}` : gesture
      );
      
      // Tự động phát âm nếu đã bật chức năng này
      if (isSpeechEnabled && detectedConfidence >= 70) {
        speechSynthesis.speak(gesture);
      }
    }
    
    // Add to recent predictions
    const timestamp = now.toLocaleTimeString();
    
    setRecentPredictions(prev => [
      {
        prediction: gesture,
        confidence: detectedConfidence,
        timestamp
      },
      ...prev.slice(0, 19) // Keep only the 20 most recent predictions
    ]);
  };

  // Handle hand detection status
  const handleHandDetection = (detected: boolean) => {
    console.log(`👋 Hand detection status changed: ${detected ? "Detected" : "Not detected"}`);
    // This could be used to show a visual indicator when hands are detected
  };

  // Start camera and sign language recognition
  const startTranslation = async () => {
    setCameraActive(true); // Optimistically show the video view
    setCameraLoading(true);
    setCameraError(null);

    try {
      console.log("🎥 Starting camera and sign language detection...");

      if (!videoRef.current) throw new Error("Video element not found");
      if (!navigator.mediaDevices?.getUserMedia)
        throw new Error("Camera access not supported by this browser");

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: "user",
        },
        audio: false,
      });

      console.log("✅ Camera stream obtained for main video");
      const video = videoRef.current;
      video.srcObject = stream;
      
      try {
        await video.play();
        console.log("▶️ Main video started playing");
      } catch (playError) {
        console.error("❌ Error playing main video:", playError);
        // Continue anyway as the detector has its own video element
      }

      setMediaStream(stream);
      setCameraLoading(false);
      
      // Slight delay before activating detector to ensure everything is ready
      setTimeout(() => {
        console.log("🚀 Activating sign language detector");
        setIsDetectorActive(true);
      }, 500);
      
    } catch (error) {
      console.error("❌ Camera failed:", error);
      setCameraLoading(false);

      let errorMessage = "Could not access camera. ";
      if (error instanceof Error) {
        if (error.name === "NotAllowedError")
          errorMessage += "Permissions denied.";
        else if (error.name === "NotFoundError")
          errorMessage += "No camera found.";
        else errorMessage = error.message;
      }
      setCameraError(errorMessage);
    }
  };

  // Stop translation and camera
  const stopTranslation = () => {
    console.log("🛑 Stopping translation and camera...");
    
    // First stop the detector to ensure clean shutdown
    setIsDetectorActive(false);
    
    // Then stop camera after a small delay to ensure detector is fully stopped
    setTimeout(() => {
      if (mediaStream) {
        console.log("📹 Stopping camera stream...");
        mediaStream.getTracks().forEach((track) => {
          track.stop();
          console.log(`🔌 Stopped track: ${track.kind} (${track.label})`);
        });
        setMediaStream(null);
      }

      setCameraActive(false);
      setCameraLoading(false);
      setCameraError(null);

      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }

      console.log("✅ Translation stopped completely");
    }, 200);
  };

  // Clear translation history
  const clearHistory = () => {
    setRecentPredictions([]);
    setFullTranscript("");
    setCurrentPrediction("");
  };

  // Export translation history
  const exportHistory = () => {
    // Xuất ra file Word thay vì JSON
    exportRealTimeTranslationToDocx(
      recentPredictions,
      fullTranscript,
      language
    );
  };

  // Toggle speech synthesis
  const toggleSpeech = () => {
    setIsSpeechEnabled(!isSpeechEnabled);
    if (speechSynthesis.isSpeaking) {
      speechSynthesis.cancel();
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (mediaStream) {
        mediaStream.getTracks().forEach((track) => track.stop());
      }
      setIsDetectorActive(false);
    };
  }, [mediaStream]);

  return (
    <div className="space-y-6 max-w-full">
      {/* Camera Section */}
      <Card
        className={cn(
          "border shadow-md",
          isDarkMode
            ? "bg-gray-800 border-gray-700"
            : "bg-white border-gray-200"
        )}
      >
        <CardHeader className="pb-3">
          <CardTitle
            className={cn(
              "flex items-center gap-3 text-xl",
              isDarkMode ? "text-white" : "text-gray-900"
            )}
          >
            <Camera className="w-6 h-6 text-purple-500" />
            {t_translatorPage("cameraFeed")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Video preview */}
            <div
              className={cn(
                "aspect-video rounded-xl overflow-hidden border-2 relative",
                isDarkMode
                  ? "bg-gray-700 border-gray-600"
                  : "bg-gray-100 border-gray-300"
              )}
            >
              <video
                ref={videoRef}
                autoPlay
                muted
                playsInline
                className="w-full h-full object-cover"
                style={{
                  transform: "scaleX(-1)", // Mirror effect for natural feel
                  backgroundColor: "#000000", // Ensure black background
                  minHeight: "100%",
                  minWidth: "100%",
                  display: cameraActive ? "block" : "none",
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
                    <p
                      className={cn(
                        "text-lg font-medium",
                        isDarkMode ? "text-gray-300" : "text-gray-600"
                      )}
                    >
                      {t_translatorPage("initializingCamera")}...
                    </p>
                    <p
                      className={cn(
                        "text-sm",
                        isDarkMode ? "text-gray-400" : "text-gray-500"
                      )}
                    >
                      {t_translatorPage("pleaseAllowCameraAccessWhenPrompted")}
                    </p>
                  </div>
                </div>
              ) : !cameraActive && cameraError ? (
                <div className="w-full h-full flex items-center justify-center">
                  <div className="text-center max-w-md px-4">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 dark:bg-red-900 flex items-center justify-center">
                      <Camera className="w-8 h-8 text-red-500" />
                    </div>
                    <p
                      className={cn(
                        "text-lg font-medium mb-2",
                        isDarkMode ? "text-gray-300" : "text-gray-600"
                      )}
                    >
                      {t_translatorPage("cameraError")}
                    </p>
                    <p
                      className={cn(
                        "text-sm",
                        isDarkMode ? "text-gray-400" : "text-gray-500"
                      )}
                    >
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
                      {t_translatorPage("tryAgain")}
                    </Button>
                  </div>
                </div>
              ) : (
                !cameraActive && (
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="text-center">
                      <Camera
                        className={cn(
                          "w-16 h-16 mx-auto mb-4",
                          isDarkMode ? "text-gray-500" : "text-gray-400"
                        )}
                      />
                      <p
                        className={cn(
                          "text-lg font-medium",
                          isDarkMode ? "text-gray-300" : "text-gray-600"
                        )}
                      >
                        {t_translatorPage("cameraPreview")}
                      </p>
                      <p
                        className={cn(
                          "text-sm",
                          isDarkMode ? "text-gray-400" : "text-gray-500"
                        )}
                      >
                        {t_translatorPage("clickStartToBeginTranslation")}
                      </p>
                    </div>
                  </div>
                )
              )}

              {/* Processing indicator overlay */}
              {isDetectorActive && (
                <div className="absolute top-4 right-4 bg-purple-500 dark:bg-purple-600 text-white px-3 py-1 rounded-full text-sm font-medium animate-pulse">
                  {t_translatorPage("processing")}...
                </div>
              )}
              
              {/* Inline SignLanguageDetector */}
              {isDetectorActive && (
                <SignLanguageDetector
                  isActive={isDetectorActive}
                  onGestureDetected={handleGestureDetected}
                  onHandDetection={handleHandDetection}
                  inlineMode={true}
                  position="bottom-right"
                />
              )}
            </div>

            {/* Control buttons */}
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              {!isDetectorActive && !cameraActive ? (
                <Button
                  size="lg"
                  className={cn(
                    "px-6",
                    isDarkMode 
                      ? "bg-purple-600 hover:bg-purple-700 text-white" 
                      : "bg-purple-500 hover:bg-purple-600 text-white"
                  )}
                  onClick={startTranslation}
                  disabled={cameraLoading}
                >
                  {cameraLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></div>
                      {t_translatorPage("starting")}...
                    </>
                  ) : (
                    <>
                      <Play className="w-5 h-5 mr-2" />
                      {t_translatorPage("startTranslation")}
                    </>
                  )}
                </Button>
              ) : (
                <Button
                  size="lg"
                  variant="outline"
                  className={cn(
                    "px-6",
                    isDarkMode
                      ? "border-red-500 text-red-400 hover:bg-red-900/20"
                      : "border-red-500 text-red-500 hover:bg-red-50"
                  )}
                  onClick={stopTranslation}
                >
                  <Pause className="w-5 h-5 mr-2" />
                  {t_translatorPage("stopTranslation")}
                </Button>
              )}

              <Button 
                variant="outline" 
                size="lg" 
                onClick={clearHistory}
                className={cn(
                  isDarkMode
                    ? "border-gray-600 text-gray-300 hover:bg-gray-800"
                    : "border-gray-300 hover:bg-gray-100"
                )}
              >
                <RotateCcw className="w-5 h-5 mr-2" />
                {t_translatorPage("clear")}
              </Button>

              {recentPredictions.length > 0 && (
                <Button 
                  variant="outline" 
                  size="lg" 
                  onClick={exportHistory}
                  className={cn(
                    isDarkMode
                      ? "border-purple-600 text-purple-400 hover:bg-purple-900/20"
                      : "border-purple-500 text-purple-500 hover:bg-purple-50"
                  )}
                >
                  <FileText className="w-5 h-5 mr-2" />
                  {t_translatorPage("exportToWord")}
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Translation Results Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Current Translation */}
        <div className="space-y-4">
          <h3
            className={cn(
              "text-lg font-semibold",
              isDarkMode ? "text-white" : "text-gray-900"
            )}
          >
            {t_translatorPage("currentTranslation")}
          </h3>

          <TranslationDisplay
            prediction={currentPrediction}
            confidence={confidence}
            timestamp={lastUpdate ? lastUpdate.toLocaleTimeString() : ""}
            showConfidence={showConfidence}
            className={isDarkMode ? "border-purple-800" : "border-purple-200"}
          />
          
          {/* Speech Indicator */}
          {currentPrediction && (
            <div className="flex items-center justify-end mt-1">
              <div 
                className={cn(
                  "flex items-center gap-1 text-xs px-2 py-1 rounded-full cursor-pointer",
                  isSpeechEnabled 
                    ? isDarkMode ? "bg-purple-900/30 text-purple-300" : "bg-purple-100 text-purple-700"
                    : isDarkMode ? "bg-gray-800 text-gray-400" : "bg-gray-100 text-gray-500"
                )}
                onClick={toggleSpeech}
                title={isSpeechEnabled ? t_translatorPage("speechEnabled") : t_translatorPage("speechDisabled")}
              >
                {isSpeechEnabled ? (
                  <>
                    <Volume2 className="w-3 h-3" />
                    <span>{t_translatorPage("autoSpeak")}</span>
                  </>
                ) : (
                  <>
                    <VolumeX className="w-3 h-3" />
                    <span>{t_translatorPage("speechOff")}</span>
                  </>
                )}
              </div>
            </div>
          )}

          {/* Full Transcript Subtitle */}
          {isDetectorActive && fullTranscript && (
            <div className="space-y-2 pt-2">
              <h4
                className={cn(
                  "text-md font-semibold",
                  isDarkMode ? "text-purple-300" : "text-purple-700"
                )}
              >
                {t_translatorPage("fullTranscript")}
              </h4>
              <div className={cn(
                "p-4 rounded-lg min-h-[60px]",
                isDarkMode ? "bg-gray-900 border border-gray-800" : "bg-gray-100"
              )}>
                <p className="text-gray-800 dark:text-gray-200 leading-relaxed">
                  {fullTranscript}
                </p>
              </div>
            </div>
          )}

          {/* Connection Status */}
          <ConnectionStatus
            connectionStatus={
              isDetectorActive 
                ? "Recognizing..." 
                : mediaStream 
                ? "Connected" 
                : "Disconnected"
            }
            isActive={isDetectorActive}
            className={cn(
              isDetectorActive 
                ? isDarkMode ? "bg-purple-900/30 text-purple-300" : "bg-purple-100 text-purple-700"
                : null
            )}
          />
        </div>

        {/* Translation History */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3
              className={cn(
                "text-lg font-semibold",
                isDarkMode ? "text-white" : "text-gray-900"
              )}
            >
              {t_translatorPage("recentTranslations")}
            </h3>
            <div className="flex items-center gap-2">
              <History className="w-4 h-4 text-purple-500" />
              <span className="text-sm text-gray-500">
                {recentPredictions.length}{" "}
                {t_translatorPage("results")}
              </span>
            </div>
          </div>

          <div
            className={cn(
              "max-h-[340px] overflow-y-auto space-y-3 p-10 rounded-lg border",
              isDarkMode
                ? "bg-gray-800 border-gray-700"
                : "bg-gray-50 border-gray-200"
            )}
          >
            {recentPredictions.length > 0 ? (
              recentPredictions.map((result, index) => (
                <div
                  key={index}
                  className={cn(
                    "p-3 rounded-lg border transition-all duration-200",
                    isDarkMode
                      ? "bg-gray-700 border-gray-600"
                      : "bg-white border-gray-200",
                    "hover:shadow-md"
                  )}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-gray-900 dark:text-white">
                      {result.prediction}
                    </span>
                    <span
                      className={cn(
                        "text-xs px-2 py-1 rounded-full",
                        result.confidence >= 80
                          ? isDarkMode ? "bg-green-900/30 text-green-400" : "bg-green-100 text-green-600"
                          : result.confidence >= 60
                          ? isDarkMode ? "bg-yellow-900/30 text-yellow-400" : "bg-yellow-100 text-yellow-600"
                          : isDarkMode ? "bg-red-900/30 text-red-400" : "bg-red-100 text-red-600"
                      )}
                    >
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
                <History
                  className={cn(
                    "w-12 h-12 mx-auto mb-3",
                    isDarkMode ? "text-gray-600" : "text-gray-400"
                  )}
                />
                <p
                  className={cn(
                    "text-sm",
                    isDarkMode ? "text-gray-400" : "text-gray-500"
                  )}
                >
                  {t_translatorPage("noTranslationsYet")}.{" "}
                  {t_translatorPage("startSigningToSeeResultsHere")}.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Không cần đoạn SignLanguageDetector riêng ở cuối nữa vì đã đặt trong UI camera */}
    </div>
  );
}
