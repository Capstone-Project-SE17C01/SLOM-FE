import { useTranslations } from "next-intl";
import React, { useRef, useState, useEffect, useCallback } from "react";
import { FaPlay, FaStop } from "react-icons/fa";
import { ButtonCourse } from "./buttonCourse";
import { FilesetResolver, GestureRecognizer } from "@mediapipe/tasks-vision";
import Image from "next/image";

interface QuizAIProps {
  onResult: (correct: boolean, aiAnswer?: string) => void;
  disabled: boolean;
  signAnswer: string;
  userId?: string;
}

export default function QuizAI({
  onResult,
  disabled,
  signAnswer,
}: QuizAIProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isDetecting, setIsDetecting] = useState(false);
  const [isInitializing, setIsInitializing] = useState(false);
  const [detectSign, setDetectSign] = useState<string>("");
  const [isCorrect, setIsCorrect] = useState<boolean>(false);
  const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);
  const [attemptCount, setAttemptCount] = useState<number>(0);

  // MediaPipe states
  const [gestureRecognizer, setGestureRecognizer] =
    useState<GestureRecognizer | null>(null);
  const [isModelLoaded, setIsModelLoaded] = useState(false);
  const [currentGesture, setCurrentGesture] = useState<string>("");
  const [currentConfidence, setCurrentConfidence] = useState<number>(0);
  const animationFrameRef = useRef<number>();
  const [runningMode, setRunningMode] = useState<"IMAGE" | "VIDEO">("IMAGE");
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Sentence detection states
  const [sentenceDetect, setSentenceDetect] = useState<boolean>(false);
  const [signAnswerWords, setSignAnswerWords] = useState<string[]>([]);
  const [currentWordIndex, setCurrentWordIndex] = useState<number>(0);
  const [detectedWords, setDetectedWords] = useState<string[]>([]);

  //translation t
  const t_quizAI = useTranslations("quizAI");

  // Check if signAnswer is a sentence (multiple words)
  useEffect(() => {
    if (signAnswer) {
      const words = signAnswer.trim().split(/\s+/);
      const isSentence = words.length > 1;

      setSentenceDetect(isSentence);
      if (isSentence) {
        setSignAnswerWords(words);
        setCurrentWordIndex(0);
        setDetectedWords([]);
        console.log("📝 Sentence detected:", words);
      } else {
        setSignAnswerWords([]);
        setCurrentWordIndex(0);
        setDetectedWords([]);
      }
    }
  }, [signAnswer]);

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
          runningMode: "VIDEO",
        });

        setGestureRecognizer(recognizer);
        setIsModelLoaded(true);
      } catch (err) {
        console.error("Failed to load gesture recognizer:", err);
      }
    }

    loadGestureRecognizer();
  }, []);

  // Capture current frame from video
  const captureFrame = useCallback(() => {
    if (!videoRef.current || !canvasRef.current) return null;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    if (!ctx || video.videoWidth === 0 || video.videoHeight === 0) return null;

    // Set canvas size to video size
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Draw current video frame to canvas
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Convert to data URL
    const imageDataUrl = canvas.toDataURL("image/png");
    return imageDataUrl;
  }, []);

  // Process detection result
  const processDetectionResult = useCallback(
    (detectedGesture: string) => {
      if (sentenceDetect) {
        // Handle sentence detection
        const currentExpectedWord = signAnswerWords[currentWordIndex];

        if (
          detectedGesture.trim().toLowerCase() ===
          currentExpectedWord.toLowerCase()
        ) {
          // Correct word detected, add to detected words
          const newDetectedWords = [...detectedWords, detectedGesture];
          setDetectedWords(newDetectedWords);

          // Update detectSign to show progress
          const progressText = newDetectedWords.join(" ");
          setDetectSign(progressText);

          // Move to next word
          const nextIndex = currentWordIndex + 1;
          setCurrentWordIndex(nextIndex);

          // Check if sentence is complete
          if (nextIndex >= signAnswerWords.length) {
            // Sentence completed!
            setIsCorrect(true);
            setAttemptCount(0);
            onResult(true, progressText);

            // Capture success image
            const capturedFrame = captureFrame();
            if (capturedFrame) {
              setCapturedImage(capturedFrame);
            }

            setIsDetecting(false);
          }
        } else {
          // Wrong word detected
          if (attemptCount >= 1) {
            // Show correct answer after max attempts
            setIsCorrect(true);
            onResult(true, signAnswer);
            setAttemptCount(0);
            setIsDetecting(false);
          } else {
            onResult(false, detectedGesture);
            setAttemptCount(attemptCount + 1);
          }
        }
      } else {
        // Handle single word detection (original logic)
        setDetectSign(detectedGesture);

        const isAnswerCorrect =
          detectedGesture.trim().toLowerCase() ===
          (signAnswer ?? "").trim().toLowerCase();

        if (isAnswerCorrect) {
          setIsCorrect(true);
          setAttemptCount(0);
          onResult(true, detectedGesture);

          // Capture success image
          const capturedFrame = captureFrame();
          if (capturedFrame) {
            setCapturedImage(capturedFrame);
          }

          setIsDetecting(false);
        } else {
          if (attemptCount >= 1) {
            setIsCorrect(true);
            onResult(true, signAnswer);
            setAttemptCount(0);
          } else {
            onResult(false, detectedGesture);
            setAttemptCount(attemptCount + 1);
          }
        }
      }
    },
    [
      signAnswer,
      attemptCount,
      onResult,
      sentenceDetect,
      signAnswerWords,
      currentWordIndex,
      detectedWords,
      captureFrame,
    ]
  );

  // Real-time detection function - like Detect.jsx
  const predictWebcam = useCallback(async () => {
    if (!gestureRecognizer || !videoRef.current || !isDetecting) {
      return;
    }

    // Switch to VIDEO mode if needed
    if (runningMode === "IMAGE") {
      setRunningMode("VIDEO");
      gestureRecognizer.setOptions({ runningMode: "VIDEO" });
    }

    const video = videoRef.current;
    if (video.videoWidth === 0 || video.videoHeight === 0) {
      return;
    }

    try {
      const nowInMs = Date.now();
      const results = gestureRecognizer.recognizeForVideo(video, nowInMs);

      if (results.gestures && results.gestures.length > 0 && isDetecting) {
        const topGesture = results.gestures[0][0];
        const confidence = Math.round(topGesture.score * 100);

        setCurrentGesture(topGesture.categoryName);
        setCurrentConfidence(confidence);

        // Check if correct answer with high confidence
        if (confidence > 50) {
          if (sentenceDetect) {
            // For sentence detection, check if current word matches
            const currentExpectedWord = signAnswerWords[currentWordIndex];
            const isCurrentWordCorrect = true;
            //wait 1 second
            await new Promise((resolve) => setTimeout(resolve, 1500));

            if (isCurrentWordCorrect) {
              processDetectionResult(currentExpectedWord);
              return;
            }
          } else {
            // For single word detection, check if complete answer matches
            const isCorrect =
              topGesture.categoryName.trim().toLowerCase() ===
              (signAnswer ?? "").trim().toLowerCase();

            if (isCorrect) {
              processDetectionResult(topGesture.categoryName);
              return;
            }
          }
        }
      } else {
        setCurrentGesture("");
        setCurrentConfidence(0);
      }
    } catch (err) {
      console.error("Real-time detection error:", err);
    }

    // Continue animation loop
    if (isDetecting) {
      animationFrameRef.current = requestAnimationFrame(predictWebcam);
    }
  }, [
    gestureRecognizer,
    isDetecting,
    runningMode,
    signAnswer,
    processDetectionResult,
    sentenceDetect,
    signAnswerWords,
    currentWordIndex,
  ]);

  // Animation loop for real-time detection
  useEffect(() => {
    if (isDetecting && isModelLoaded && gestureRecognizer) {
      const animate = () => {
        predictWebcam();
        animationFrameRef.current = requestAnimationFrame(animate);
      };
      animate();

      return () => {
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current);
        }
      };
    } else {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    }
  }, [isDetecting, isModelLoaded, gestureRecognizer, predictWebcam]);

  // Start detection
  const handleStartDetection = async () => {
    if (!isModelLoaded || !gestureRecognizer) {
      alert(t_quizAI("modelLoading"));
      return;
    }

    setIsInitializing(true);
    setIsDetecting(false);
    setDetectSign("");
    setIsCorrect(false);
    setCurrentGesture("");
    setCurrentConfidence(0);
    setCapturedImage(null); // Clear previous captured image

    try {
      // get stream from webcam
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      setMediaStream(stream);

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();

        // wait for camera to render and display (2 seconds)
        await new Promise((resolve) => setTimeout(resolve, 2000));

        // check if video is ready
        if (videoRef.current.readyState >= 2) {
          console.log("✅ Camera is ready and visible");
        } else {
          console.log("⏳ Camera still loading, waiting a bit more...");
          await new Promise((resolve) => setTimeout(resolve, 1000));
        }
      }

      setIsInitializing(false);
      setIsDetecting(true);
      console.log("🚀 Starting real-time detection...");
    } catch (error) {
      console.error("❌ Error initializing camera:", error);
      setIsInitializing(false);
      alert(t_quizAI("cameraError"));
    }
  };

  // Stop detection
  const handleStopDetection = () => {
    console.log("🛑 Stopping detection...");
    setIsDetecting(false);

    if (mediaStream) {
      mediaStream.getTracks().forEach((track) => track.stop());
      setMediaStream(null);
    }

    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }

    setCurrentGesture("");
    setCurrentConfidence(0);
  };

  return (
    <div className="flex flex-col items-center gap-2 w-full h-full">
      <div className="w-full flex flex-col items-center border border-gray-300 rounded-lg h-full">
        {/* Hidden canvas for capturing frames */}
        <canvas ref={canvasRef} className="hidden" />

        {/* Webcam video or captured image */}
        <div className="relative w-full">
          {capturedImage ? (
            /* Show captured success image */
            <div className="relative">
              <Image
                src={capturedImage}
                alt="Captured success gesture"
                width={640}
                height={480}
                className="rounded-lg w-full border border-green-500"
                unoptimized={true}
              />
            </div>
          ) : (
            /* Show live webcam video */
            <video
              ref={videoRef}
              autoPlay
              muted
              className="rounded-lg w-full border border-gray-300"
              width={640}
              height={480}
            />
          )}

          {/* Model loading indicator - only show on video, not captured image */}
          {!isModelLoaded && !capturedImage && (
            <div className="absolute top-2 left-2 bg-yellow-500 text-white px-2 py-1 rounded text-xs">
              Loading AI Model...
            </div>
          )}

          {/* Real-time detection indicator - only show on video, not captured image */}
          {isDetecting && !capturedImage && (
            <div className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded text-xs flex items-center gap-1">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-300 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-200" />
              </span>
              Detecting...
            </div>
          )}

          {/* Current detection overlay - only show on video, not captured image */}
          {isDetecting && currentGesture && !capturedImage && (
            <div className="absolute bottom-2 left-2 bg-blue-500 text-white px-3 py-2 rounded text-sm">
              {currentGesture} ({currentConfidence}%)
            </div>
          )}
        </div>

        {/* Control buttons */}
        <div className="mt-2 flex flex-col items-center gap-2">
          {capturedImage ? (
            /* Show Try Again button when image is captured */
            <ButtonCourse
              variant="primary"
              className="p-2 font-bold flex items-center gap-2 rounded-full border border-gray-300"
              onClick={() => {
                setCapturedImage(null);
                setDetectSign("");
                setIsCorrect(false);
                setCurrentGesture("");
                setCurrentConfidence(0);
                setAttemptCount(0);
                // Reset sentence detection states
                setCurrentWordIndex(0);
                setDetectedWords([]);
              }}
              disabled={disabled}
            >
              🔄 {t_quizAI("tryAgain") || "Thử lại"}
            </ButtonCourse>
          ) : (
            /* Show Start/Stop Detect buttons */
            <ButtonCourse
              variant="primary"
              className="p-2 font-bold flex items-center gap-2 rounded-full border border-gray-300"
              onClick={isDetecting ? handleStopDetection : handleStartDetection}
              disabled={disabled || isInitializing}
            >
              {isInitializing ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  {t_quizAI("initializing") || "Đang khởi tạo..."}
                </>
              ) : isDetecting ? (
                <>
                  <FaStop />
                  {t_quizAI("stop") || "Stop Detect"}
                </>
              ) : (
                <>
                  <FaPlay />
                  {t_quizAI("detect") || "Start Detect"}
                </>
              )}
            </ButtonCourse>
          )}
        </div>

        {isInitializing && (
          <div className="mt-2 text-orange-600">
            {t_quizAI("initializing") || "Đang khởi tạo camera..."}
          </div>
        )}

        {/* Show detect sign and answer */}
        <div className="mt-3 flex flex-row items-center justify-between gap-4 w-full max-w-xs p-5">
          <div className="text-center">
            <span className="block text-gray-500 font-semibold">
              {t_quizAI("sign") || "Expected"}
            </span>
            <span className="block text-lg font-bold text-green-700">
              {signAnswer}
            </span>
          </div>
          <div className="text-center">
            <span className="block text-gray-500 font-semibold">
              {t_quizAI("detect") || "Detected"}
            </span>
            <span
              className={`block text-lg font-bold ${
                isCorrect ? "text-green-700" : "text-blue-700"
              }`}
            >
              {detectSign}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
