import React, { useRef, useState } from "react";
import { FaPlay, FaStop } from "react-icons/fa";
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
  userId,
}: QuizAIProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [detectSign, setDetectSign] = useState<string>("");
  const isStreamingRef = useRef(false);
  const [isCorrect, setIsCorrect] = useState<boolean>(false);
  const [correctImage, setCorrectImage] = useState<string | null>(null);

  const setStreaming = (val: boolean) => {
    isStreamingRef.current = val;
    setIsStreaming(val);
  };

  const sendFrame = () => {
    if (!videoRef.current || !wsRef.current || wsRef.current.readyState !== 1)
      return;
    const canvas = document.createElement("canvas");
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL("image/jpeg");
      const base64 = dataUrl.split(",")[1];
      wsRef.current.send(base64);
    }
    if (isStreamingRef.current) setTimeout(sendFrame, 1500);
  };

  const handleStartStreaming = async () => {
    setStreaming(true);
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    streamRef.current = stream;
    if (videoRef.current) videoRef.current.srcObject = stream;

    const ws = new WebSocket(`ws://localhost:8000/ws/${userId}`);
    wsRef.current = ws;

    ws.onopen = () => {
      setStreaming(true);
      sendFrame();
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setDetectSign(data.predict);
      if (
        typeof data.predict === "string" &&
        data.predict.trim().toLowerCase() ===
          (signAnswer ?? "").trim().toLowerCase()
      ) {
        setIsCorrect(true);
        if (data.image) {
          setCorrectImage(`data:image/jpeg;base64,${data.image}`);
        }
        setStreaming(false);
        wsRef.current?.close();
        streamRef.current?.getTracks().forEach((track) => track.stop());
        onResult(true, data.predict);
      } else {
        setIsCorrect(false);
      }
    };

    ws.onerror = (e) => {
      console.error("WebSocket error===>", e);
      setStreaming(false);
      wsRef.current?.close();
      streamRef.current?.getTracks().forEach((track) => track.stop());
      onResult(false, "onError");
    };

    ws.onclose = (event) => {
      console.error("WebSocket closed===>", event);
      setStreaming(false);
      wsRef.current?.close();
      streamRef.current?.getTracks().forEach((track) => track.stop());
      onResult(false, "onClose");
    };
  };

  const handleStopStreaming = () => {
    setStreaming(false);
    wsRef.current?.close();
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
    }
  };

  return (
    <div className="flex flex-col items-center gap-2 w-full h-full">
      {/* Camera preview */}
      <div className="w-full flex flex-col items-center mb-2 border border-gray-300 rounded-lg p-5 h-full">
        {!correctImage ? (
          <video
            ref={videoRef}
            autoPlay
            muted
            className="rounded-lg border border-gray-300 w-full max-w-xs h-full"
          />
        ) : (
          <Image
            src={correctImage}
            alt="Correct prediction"
            width={320}
            height={240}
            className="rounded-lg border border-green-700 w-full max-w-xs"
          />
        )}
        {!correctImage && (
          <button
            className="mt-2 p-2 rounded font-bold flex items-center gap-2 rounded-full border border-gray-300"
            onClick={isStreaming ? handleStopStreaming : handleStartStreaming}
            disabled={disabled}
          >
            {isStreaming ? <FaStop /> : <FaPlay />}
          </button>
        )}
        {/* show detect sign and answer */}
        {
          <div className="mt-3 flex flex-row items-center justify-between gap-4 w-full max-w-xs">
            <div className="text-center">
              <span className="block text-gray-500 font-semibold">Sign</span>
              <span className="block text-lg font-bold text-green-700">
                {signAnswer}
              </span>
            </div>
            <div className="text-center">
              <span className="block text-gray-500 font-semibold">Detect</span>
              <span
                className={`block text-lg font-bold ${
                  isCorrect ? "text-green-700" : "text-blue-700"
                }`}
              >
                {detectSign}
              </span>
            </div>
          </div>
        }
      </div>
    </div>
  );
}
