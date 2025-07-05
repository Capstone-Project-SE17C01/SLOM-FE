import { useTranslations } from "next-intl";
import React, { useRef, useState, useEffect } from "react";
import { FaPlay, FaStop } from "react-icons/fa";
import { ButtonCourse } from "./buttonCourse";

interface QuizAIProps {
  onResult: (correct: boolean, aiAnswer?: string) => void;
  disabled: boolean;
  signAnswer: string;
  userId?: string;
}

interface AIResponse {
  error?: string;
  predict?: string;
  video?: string;
}

export default function QuizAI({
  onResult,
  disabled,
  signAnswer,
  userId,
}: QuizAIProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isInitializing, setIsInitializing] = useState(false);
  const [detectSign, setDetectSign] = useState<string>("");
  const [isCorrect, setIsCorrect] = useState<boolean>(false);
  const [resultVideo, setResultVideo] = useState<string | null>(null);
  const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const [recordingDuration, setRecordingDuration] = useState<number>(3);
  const [recordingProgress, setRecordingProgress] = useState<number>(0);
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);
  //translation t
  const t_quizAI = useTranslations("quizAI");

  // Cập nhật tiến trình ghi hình
  useEffect(() => {
    if (isRecording) {
      const startTime = Date.now();
      progressIntervalRef.current = setInterval(() => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(
          (elapsed / (recordingDuration * 1000)) * 100,
          100
        );
        setRecordingProgress(progress);
        if (progress >= 100) {
          if (progressIntervalRef.current) {
            clearInterval(progressIntervalRef.current);
          }
        }
      }, 100);
    } else {
      setRecordingProgress(0);
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
    }
    return () => {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
    };
  }, [isRecording, recordingDuration]);

  // Bắt đầu ghi hình
  const handleStartRecording = async () => {
    setIsInitializing(true);
    setIsRecording(false);
    setIsProcessing(false);
    setResultVideo(null);
    setDetectSign("");
    setIsCorrect(false);
    chunksRef.current = [];

    try {
      // Lấy stream từ webcam
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      setMediaStream(stream);

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();

        // Đợi camera render và hiển thị (2 giây)
        console.log("📹 Camera initialized, waiting for render...");
        await new Promise((resolve) => setTimeout(resolve, 2000));

        // Kiểm tra xem video đã sẵn sàng chưa
        if (videoRef.current.readyState >= 2) {
          // HAVE_CURRENT_DATA
          console.log("✅ Camera is ready and visible");
        } else {
          console.log("⏳ Camera still loading, waiting a bit more...");
          await new Promise((resolve) => setTimeout(resolve, 1000));
        }
      }

      setIsInitializing(false);
      setIsRecording(true);

      // Tạo MediaRecorder
      const mediaRecorder = new window.MediaRecorder(stream, {
        mimeType: "video/webm",
      });
      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };
      mediaRecorder.onstop = async () => {
        setIsProcessing(true);
        // Dừng stream
        stream.getTracks().forEach((track) => track.stop());
        // Tạo blob video
        const blob = new Blob(chunksRef.current, { type: "video/webm" });
        // Đọc blob thành base64
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64data = (reader.result as string).split(",")[1];
          // Gửi qua websocket
          sendVideoToWS(base64data);
        };
        reader.readAsDataURL(blob);
      };
      // Bắt đầu ghi
      mediaRecorder.start();
      // Ghi theo thời lượng đã chọn
      setTimeout(() => {
        mediaRecorder.stop();
        setIsRecording(false);
      }, recordingDuration * 1000);
    } catch (error) {
      console.error("❌ Error initializing camera:", error);
      setIsInitializing(false);
      alert(t_quizAI("cameraError") || "Không thể truy cập camera");
    }
  };

  // Send video to websocket
  const sendVideoToWS = (base64data: string) => {
    const ws = new WebSocket(
      `wss://sign-detection-436879212893.australia-southeast1.run.app/ws/${userId}`
    );

    wsRef.current = ws;
    ws.onopen = () => {
      ws.send(base64data);
    };
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data) as AIResponse;
      setIsProcessing(false);
      if (data.error) {
        onResult(false, data.error);
        setResultVideo(null);
        setDetectSign("");
        setIsCorrect(false);
        ws.close();
        return;
      }
      setDetectSign(data.predict ?? "");
      if (
        typeof data.predict === "string" &&
        data.predict.trim().toLowerCase() ===
          (signAnswer ?? "").trim().toLowerCase()
      ) {
        setIsCorrect(true);
      } else {
        setIsCorrect(false);
      }
      if (data.video) {
        // Backend return video MP4 with codec H.264 (after install OpenH264)
        const videoUrl = `data:video/mp4;codecs=avc1;base64,${data.video}`;
        console.log("Setting video URL:", videoUrl.substring(0, 50) + "...");
        setResultVideo(videoUrl);
      } else {
        console.log(" no data.video", data.video?.substring(0, 50) + "...");
      }
      onResult(
        typeof data.predict === "string" &&
          data.predict.trim().toLowerCase() ===
            (signAnswer ?? "").trim().toLowerCase(),
        data.predict
      );
      ws.close();
    };
    ws.onerror = () => {
      setIsProcessing(false);
      onResult(false, "onError");
      ws.close();
    };
    ws.onclose = () => {
      setIsProcessing(false);
    };
  };

  // Stop recording manually
  const handleStopRecording = () => {
    setIsRecording(false);
    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state === "recording"
    ) {
      mediaRecorderRef.current.stop();
    }
    if (mediaStream) {
      mediaStream.getTracks().forEach((track) => track.stop());
    }
  };

  return (
    <div className="flex flex-col items-center gap-2 w-full h-full">
      <div className="w-full flex flex-col items-center border border-gray-300 rounded-lg h-full">
        {/* Show preview webcam or result video */}
        {!resultVideo ? (
          <video
            ref={videoRef}
            autoPlay
            muted
            className="rounded-lg w-full border border-gray-300"
          />
        ) : (
          <div className="flex flex-col items-center gap-2 p-5 w-full h-full border border-gray-300 rounded-lg">
            <video
              src={resultVideo}
              controls
              autoPlay
              loop
              className="rounded-lg border border-green-700 w-full"
              onError={(e) => {
                const videoElement = e.target as HTMLVideoElement;
                console.error("Video error:", {
                  error: videoElement.error,
                  networkState: videoElement.networkState,
                  readyState: videoElement.readyState,
                  src: resultVideo?.substring(0, 50) + "...",
                });
                alert(t_quizAI("videoError"));
              }}
            />
            <ButtonCourse
              variant="primary"
              className="mt-2 p-2 rounded font-bold flex items-center gap-2 rounded-full border border-gray-300 bg-blue-500 text-white hover:bg-blue-600"
              onClick={() => setResultVideo(null)}
              disabled={disabled || isProcessing || isInitializing}
            >
              <FaPlay /> {t_quizAI("reRecord")}
            </ButtonCourse>
          </div>
        )}
        {/* Control button */}
        {!resultVideo && (
          <div className="mt-2 flex flex-col items-center gap-2">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">
                {t_quizAI("recordDuration")}
              </span>
              <input
                type="range"
                min="3"
                max="5"
                step="1"
                value={recordingDuration}
                onChange={(e) => setRecordingDuration(Number(e.target.value))}
                className="w-24 bg-primary-500"
                disabled={isRecording || isInitializing}
              />
              <span className="text-sm font-bold">{recordingDuration}s</span>
            </div>
            <ButtonCourse
              variant="primary"
              className="p-2 rounded font-bold flex items-center gap-2 rounded-full border border-gray-300"
              onClick={isRecording ? handleStopRecording : handleStartRecording}
              disabled={disabled || isProcessing || isInitializing}
            >
              {isInitializing ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  {t_quizAI("initializing") || "Đang khởi tạo..."}
                </>
              ) : isRecording ? (
                <>
                  <FaStop />
                  {t_quizAI("stop")}
                </>
              ) : (
                <>
                  <FaPlay />
                  {`${t_quizAI("record")} ${recordingDuration}s`}
                </>
              )}
            </ButtonCourse>
            {isRecording && (
              <div className="w-full max-w-xs bg-gray-200 rounded-full h-2.5">
                <div
                  className="bg-blue-600 h-2.5 rounded-full"
                  style={{ width: `${recordingProgress}%` }}
                ></div>
              </div>
            )}
          </div>
        )}
        {isProcessing && (
          <div className="mt-2 text-blue-600">{t_quizAI("processing")}</div>
        )}
        {isInitializing && (
          <div className="mt-2 text-orange-600">
            {t_quizAI("initializing") || "Đang khởi tạo camera..."}
          </div>
        )}
        {/* Show detect sign and answer */}
        <div className="mt-3 flex flex-row items-center justify-between gap-4 w-full max-w-xs p-5">
          <div className="text-center">
            <span className="block text-gray-500 font-semibold">
              {t_quizAI("sign")}
            </span>
            <span className="block text-lg font-bold text-green-700">
              {signAnswer}
            </span>
          </div>
          <div className="text-center">
            <span className="block text-gray-500 font-semibold">
              {t_quizAI("detect")}
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
