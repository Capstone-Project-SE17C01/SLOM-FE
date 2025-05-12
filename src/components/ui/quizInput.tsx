import React, { useRef, useState } from "react";

interface QuizInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onCheck: () => void;
  disabled: boolean;
  redEffect: boolean;
  checkLabel: string;
  showSignAnswer?: boolean;
  signAnswer?: string;
}

export default function QuizInput({
  value,
  onChange,
  onCheck,
  disabled,
  redEffect,
  checkLabel,
  showSignAnswer,
  signAnswer,
}: QuizInputProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(
    null
  );
  const [recordedChunks, setRecordedChunks] = useState<Blob[]>([]);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);

  // Start recording
  const handleStartRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });
    if (videoRef.current) videoRef.current.srcObject = stream;
    const recorder = new MediaRecorder(stream, { mimeType: "video/webm" });
    setMediaRecorder(recorder);
    setRecordedChunks([]);
    recorder.ondataavailable = (e) => {
      if (e.data.size > 0) setRecordedChunks((prev) => [...prev, e.data]);
    };
    recorder.onstop = () => {
      const blob = new Blob(recordedChunks, { type: "video/webm" });
      setVideoUrl(URL.createObjectURL(blob));
      stream.getTracks().forEach((track) => track.stop());
    };
    recorder.start();
    setIsRecording(true);

    // Tự động dừng sau 5s (25fps không cần set vì MediaRecorder tự xử lý)
    setTimeout(() => {
      recorder.stop();
      setIsRecording(false);
    }, 5000);
  };

  // Stop recording (nếu muốn cho user bấm dừng)
  const handleStopRecording = () => {
    if (mediaRecorder && isRecording) {
      mediaRecorder.stop();
      setIsRecording(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-2 w-full">
      {/* Camera preview */}
      <div className="w-full flex flex-col items-center mb-2">
        <video
          ref={videoRef}
          autoPlay
          muted
          className="rounded-lg border border-gray-300 w-full max-w-xs"
          style={{ height: 180 }}
        />
        {videoUrl && (
          <video
            src={videoUrl}
            controls
            className="mt-2 rounded-lg w-full max-w-xs"
          />
        )}
        <button
          className={`mt-2 px-4 py-2 rounded font-bold ${
            isRecording ? "bg-red-500 text-white" : "bg-green-500 text-white"
          }`}
          onClick={isRecording ? handleStopRecording : handleStartRecording}
        >
          {isRecording ? "Đang quay..." : "Ghi hình"}
        </button>
        {/* Hiện đáp án đúng dưới video nếu là dạng Sign */}
        {showSignAnswer && (
          <div className="mt-3 flex flex-row items-center justify-between gap-4 w-full max-w-xs">
            <div className="text-center">
              <span className="block text-gray-500 font-semibold">Sign</span>
              <span className="block text-lg font-bold text-green-700">
                {signAnswer}
              </span>
            </div>
            <div className="text-center">
              <span className="block text-gray-500 font-semibold">Detect</span>
              <span className="block text-lg font-bold text-blue-700">
                {/* Placeholder detectSign, có thể truyền prop detectSign sau */}
                ...
              </span>
            </div>
          </div>
        )}
      </div>
      {/* Chỉ render input/nút check nếu không phải dạng Sign */}
      {!showSignAnswer && (
        <>
          <input
            type="text"
            value={value}
            onChange={onChange}
            className="border border-gray-300 rounded-lg px-4 py-2 w-full"
            placeholder="Nhập đáp án..."
            disabled={disabled}
          />
          <button
            className={`hover:bg-yellow-300 transition text-black font-bold px-6 py-2 rounded-lg shadow w-full
              ${
                redEffect
                  ? "bg-red-500 text-white border-red-500 shake"
                  : "bg-yellow-400"
              }
            `}
            onClick={onCheck}
            disabled={disabled}
          >
            {checkLabel}
          </button>
        </>
      )}
    </div>
  );
}
