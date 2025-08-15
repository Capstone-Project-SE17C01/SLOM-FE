"use client";
import React, { useState, useRef, useEffect, useCallback } from "react";
import { FilesetResolver, GestureRecognizer } from "@mediapipe/tasks-vision";

const drawConnectors = (
  ctx: CanvasRenderingContext2D,
  landmarks: Array<{ x: number; y: number; z?: number }>,
  connections: [number, number][],
  options: { color: string; lineWidth: number }
) => {
  ctx.strokeStyle = options.color;
  ctx.lineWidth = options.lineWidth;

  connections.forEach(([start, end]) => {
    const startPoint = landmarks[start];
    const endPoint = landmarks[end];

    if (startPoint && endPoint) {
      ctx.beginPath();
      ctx.moveTo(
        startPoint.x * ctx.canvas.width,
        startPoint.y * ctx.canvas.height
      );
      ctx.lineTo(endPoint.x * ctx.canvas.width, endPoint.y * ctx.canvas.height);
      ctx.stroke();
    }
  });
};

const drawLandmarks = (
  ctx: CanvasRenderingContext2D,
  landmarks: Array<{ x: number; y: number; z?: number }>,
  options: { color: string; lineWidth: number; radius: number }
) => {
  ctx.fillStyle = options.color;

  landmarks.forEach((landmark) => {
    ctx.beginPath();
    ctx.arc(
      landmark.x * ctx.canvas.width,
      landmark.y * ctx.canvas.height,
      options.radius,
      0,
      2 * Math.PI
    );
    ctx.fill();
  });
};

// Hand connections for drawing hand landmarks
const HAND_CONNECTIONS: [number, number][] = [
  [0, 1],
  [1, 2],
  [2, 3],
  [3, 4], // Thumb
  [0, 5],
  [5, 6],
  [6, 7],
  [7, 8], // Index finger
  [5, 9],
  [9, 10],
  [10, 11],
  [11, 12], // Middle finger
  [9, 13],
  [13, 14],
  [14, 15],
  [15, 16], // Ring finger
  [13, 17],
  [17, 18],
  [18, 19],
  [19, 20], // Pinky
  [0, 17], // Palm connection
];

export interface SignLanguageDetectorProps {
  onGestureDetected?: (gesture: string, confidence: number) => void;
  onHandDetection?: (detected: boolean) => void; // Thêm prop để phát hiện tay
  isActive: boolean;
  className?: string;
}

export interface DetectedGesture {
  gesture: string;
  confidence: number;
  timestamp: number;
}

const SignLanguageDetector: React.FC<SignLanguageDetectorProps> = ({
  onGestureDetected,
  onHandDetection,
  isActive,
  className = "",
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [gestureRecognizer, setGestureRecognizer] =
    useState<GestureRecognizer | null>(null);
  const [runningMode, setRunningMode] = useState<"IMAGE" | "VIDEO">("IMAGE");
  const [isModelLoaded, setIsModelLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const animationFrameRef = useRef<number>();
  const streamRef = useRef<MediaStream | null>(null);
  const lastHandDetectedRef = useRef<boolean>(false);

  // Load MediaPipe gesture recognizer
  useEffect(() => {
    async function loadGestureRecognizer() {
      try {
        const vision = await FilesetResolver.forVisionTasks(
          "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
        );

        const recognizer = await GestureRecognizer.createFromOptions(vision, {
          baseOptions: {
            modelAssetPath: "/sign_language_recognizer_25-04-2023.task",
          },
          numHands: 2,
          runningMode: "IMAGE", // Start with IMAGE mode
        });

        setGestureRecognizer(recognizer);
        setIsModelLoaded(true);
        setError(null);
      } catch (err) {
        console.error("Failed to load gesture recognizer:", err);
        setError("Failed to load AI model");
        setIsModelLoaded(false);
      }
    }

    loadGestureRecognizer();
  }, []);

  // Setup webcam stream
  const setupWebcam = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 640 },
          height: { ideal: 480 },
          facingMode: "user",
        },
        audio: false,
      });

      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => {
          if (videoRef.current) {
            videoRef.current.play();
          }
        };
      }

      setError(null);
    } catch (err) {
      console.error("Failed to access webcam:", err);
      setError("Failed to access camera");
    }
  }, []);

  // Cleanup webcam stream
  const cleanupWebcam = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }

    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  }, []);

  // Prediction function
  const predictWebcam = useCallback(() => {
    if (!gestureRecognizer || !videoRef.current || !canvasRef.current) {
      return;
    }

    // Switch to VIDEO mode if needed
    if (runningMode === "IMAGE") {
      setRunningMode("VIDEO");
      gestureRecognizer.setOptions({ runningMode: "VIDEO" });
    }

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const canvasCtx = canvas.getContext("2d");

    if (!canvasCtx || video.videoWidth === 0 || video.videoHeight === 0) {
      return;
    }

    // Set canvas dimensions to match video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    try {
      const nowInMs = Date.now();
      const results = gestureRecognizer.recognizeForVideo(video, nowInMs);

      // Clear canvas
      canvasCtx.save();
      canvasCtx.clearRect(0, 0, canvas.width, canvas.height);

      // Kiểm tra phát hiện tay
      const handsDetected = results.landmarks && results.landmarks.length > 0;

      // Chỉ gửi thông báo khi trạng thái thay đổi để tránh gọi callback quá nhiều
      if (handsDetected !== lastHandDetectedRef.current) {
        lastHandDetectedRef.current = handsDetected;
        if (onHandDetection) {
          onHandDetection(handsDetected);
        }
      }

      // Draw hand landmarks
      if (results.landmarks) {
        for (const landmarks of results.landmarks) {
          drawConnectors(canvasCtx, landmarks, HAND_CONNECTIONS, {
            color: "#00FF00",
            lineWidth: 2,
          });
          drawLandmarks(canvasCtx, landmarks, {
            color: "#FF0000",
            lineWidth: 1,
            radius: 2,
          });
        }
      }

      // Handle gesture detection
      if (results.gestures && results.gestures.length > 0) {
        const topGesture = results.gestures[0][0];
        const gesture = topGesture.categoryName;
        const confidence = Math.round(topGesture.score * 100);

        if (onGestureDetected && confidence > 60) {
          // Only report high-confidence gestures
          onGestureDetected(gesture, confidence);
        }
      }

      canvasCtx.restore();
    } catch (err) {
      console.error("Prediction error:", err);
    }
  }, [gestureRecognizer, runningMode, onGestureDetected, onHandDetection]);

  // Animation loop
  useEffect(() => {
    if (isActive && isModelLoaded && gestureRecognizer) {
      const animate = () => {
        predictWebcam();
        animationFrameRef.current = requestAnimationFrame(animate);
      };

      setupWebcam().then(() => {
        // Wait a bit for video to be ready
        setTimeout(() => {
          animate();
        }, 500);
      });

      return () => {
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current);
        }
        cleanupWebcam();
      };
    } else {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      cleanupWebcam();
    }
  }, [
    isActive,
    isModelLoaded,
    gestureRecognizer,
    predictWebcam,
    setupWebcam,
    cleanupWebcam,
  ]);

  // Cleanup effect to reset hand detection state when component is unmounted or deactivated
  useEffect(() => {
    return () => {
      if (onHandDetection && lastHandDetectedRef.current) {
        onHandDetection(false);
        lastHandDetectedRef.current = false;
      }
    };
  }, [onHandDetection]);

  // Don't render anything if not active
  if (!isActive) {
    return null;
  }

  return (
    <div className={`fixed inset-0 pointer-events-none z-[998] ${className}`}>
      {/* Video stream - hidden but used for processing */}
      <video ref={videoRef} className="hidden" autoPlay muted playsInline />

      {/* Canvas overlay for hand landmarks - positioned in corner */}
      <div className="fixed top-4 right-4 bg-black/20 rounded-lg overflow-hidden border border-white/20">
        <canvas
          ref={canvasRef}
          className="w-48 h-36 object-cover"
          style={{
            transform: "scaleX(-1)", // Mirror the canvas
          }}
        />

        {/* Status indicator */}
        <div className="absolute top-2 left-2">
          {!isModelLoaded ? (
            <div className="bg-yellow-500 text-white px-2 py-1 rounded text-xs">
              Loading AI...
            </div>
          ) : error ? (
            <div className="bg-red-500 text-white px-2 py-1 rounded text-xs">
              {error}
            </div>
          ) : (
            <div className="bg-green-500 text-white px-2 py-1 rounded text-xs flex items-center gap-1">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-300 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-200" />
              </span>
              AI Active
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SignLanguageDetector;
