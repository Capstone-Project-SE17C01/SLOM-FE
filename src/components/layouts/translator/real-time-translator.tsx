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
  Download,
} from "lucide-react";

import { useRealSignLanguageRecognition } from "@/hooks/useRealSignLanguageRecognition";
import SignLanguageDetector from "@/components/SignLanguageDetector/SignLanguageDetector";
import TranslationDisplay from "@/components/ui/translationDisplay";
import ConnectionStatus from "@/components/ui/connectionStatus";
import { RealTimeTranslatorProps } from "../../../types/ITranslator";
import { useTranslations } from "next-intl";

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

  // Initialize real sign language recognition
  const signLanguageRecognition = useRealSignLanguageRecognition({
    confidenceThreshold: 70, // Only accept gestures with >70% confidence
    maxRecentPredictions: 20 // Keep last 20 predictions
  });

  // Auto-start if requested
  useEffect(() => {
    if (autoStart && !signLanguageRecognition.isActive) {
      signLanguageRecognition.startRecognition();
    }
  }, [autoStart, signLanguageRecognition.isActive, signLanguageRecognition]);

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

  // Start camera and sign language recognition
  const startTranslation = async () => {
    // Start real sign language recognition
    if (!signLanguageRecognition.isActive) {
      signLanguageRecognition.startRecognition();
    }

    // --- Try to Start Camera for Visuals ---
    setCameraActive(true); // Optimistically show the video view
    setCameraLoading(true);
    setCameraError(null);

    try {
      console.log("🎥 Trying to start camera (for visual effect)...");

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

      console.log("✅ Camera stream obtained");
      const video = videoRef.current;
      video.srcObject = stream;
      await video.play();

      setMediaStream(stream);
      setCameraLoading(false);
    } catch (error) {
      console.error(
        "❌ Camera failed, but fake subtitles will continue:",
        error
      );
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
    console.log("🛑 Stopping translation...");

    // Stop sign language recognition
    signLanguageRecognition.stopRecognition();

    // Stop camera
    if (mediaStream) {
      console.log("📹 Stopping camera stream...");
      mediaStream.getTracks().forEach((track) => {
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
    signLanguageRecognition.resetTranscript();
  };

  // Export translation history
  const exportHistory = () => {
    const history = signLanguageRecognition.recentPredictions;
    const data = {
      timestamp: new Date().toISOString(),
      language,
      predictions: history,
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `translation-history-${
      new Date().toISOString().split("T")[0]
    }.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (mediaStream) {
        mediaStream.getTracks().forEach((track) => track.stop());
      }
      signLanguageRecognition.stopRecognition();
    };
  }, [mediaStream, signLanguageRecognition]);

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
            <Camera className="w-6 h-6 text-blue-500" />
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
              {signLanguageRecognition.isActive && (
                <div className="absolute top-4 right-4 bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-medium animate-pulse">
                  {t_translatorPage("processing")}...
                </div>
              )}
            </div>

            {/* Control buttons */}
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              {!signLanguageRecognition.isActive && !cameraActive ? (
                <Button
                  size="lg"
                  className="bg-blue-500 hover:bg-blue-600 text-white px-6"
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
                  className="border-red-500 text-red-500 hover:bg-red-50 px-6"
                  onClick={stopTranslation}
                >
                  <Pause className="w-5 h-5 mr-2" />
                  {t_translatorPage("stopTranslation")}
                </Button>
              )}

              <Button variant="outline" size="lg" onClick={clearHistory}>
                <RotateCcw className="w-5 h-5 mr-2" />
                {t_translatorPage("clear")}
              </Button>

              {signLanguageRecognition.recentPredictions.length > 0 && (
                <Button variant="outline" size="lg" onClick={exportHistory}>
                  <Download className="w-5 h-5 mr-2" />
                  {t_translatorPage("export")}
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
            prediction={signLanguageRecognition.currentPrediction}
            confidence={signLanguageRecognition.confidence}
            timestamp={signLanguageRecognition.lastUpdate}
            showConfidence={showConfidence}
          />

          {/* Full Transcript Subtitle */}
          {signLanguageRecognition.isActive && signLanguageRecognition.fullTranscript && (
            <div className="space-y-2 pt-2">
              <h4
                className={cn(
                  "text-md font-semibold",
                  isDarkMode ? "text-gray-300" : "text-gray-700"
                )}
              >
                {t_translatorPage("fullTranscript")}
              </h4>
              <div className="p-4 bg-gray-100 dark:bg-gray-900 rounded-lg min-h-[60px]">
                <p className="text-gray-800 dark:text-gray-200 leading-relaxed">
                  {signLanguageRecognition.fullTranscript}
                </p>
              </div>
            </div>
          )}

          {/* Connection Status */}
          <ConnectionStatus
            connectionStatus={
              signLanguageRecognition.isActive 
                ? "Recognizing..." 
                : signLanguageRecognition.isConnected 
                ? "Connected" 
                : "Disconnected"
            }
            isActive={signLanguageRecognition.isActive}
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
              <History className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-500">
                {signLanguageRecognition.recentPredictions.length}{" "}
                {t_translatorPage("results")}
              </span>
            </div>
          </div>

          <div
            className={cn(
              "max-h-80 overflow-y-auto space-y-3 p-10 rounded-lg border",
              isDarkMode
                ? "bg-gray-800 border-gray-700"
                : "bg-gray-50 border-gray-200"
            )}
          >
            {signLanguageRecognition.recentPredictions.length > 0 ? (
              signLanguageRecognition.recentPredictions.map((result, index) => (
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
                          ? "bg-green-100 text-green-600"
                          : result.confidence >= 60
                          ? "bg-yellow-100 text-yellow-600"
                          : "bg-red-100 text-red-600"
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

      {/* Sign Language Detector */}
      {signLanguageRecognition.isActive && (
        <SignLanguageDetector
          isActive={signLanguageRecognition.isActive}
          onGestureDetected={signLanguageRecognition.handleGestureDetected}
          onHandDetection={signLanguageRecognition.handleHandDetection}
        />
      )}
    </div>
  );
}
