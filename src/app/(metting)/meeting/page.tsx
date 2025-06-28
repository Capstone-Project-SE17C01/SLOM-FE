"use client";
import * as React from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { FolderSelectionModal } from "@/features/meeting/components/folder-selection-form";
import { useRouter } from "next/navigation";
import { useRecording } from "@/hooks/useRecording";
import { Mic, Square, Clock, MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { generateZegoToken } from "@/services/zego/config";
import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";
import { useGetMeetingQuery, useLeaveMeetingMutation, useAddRecordingMutation } from "@/features/meeting/api";
import { useEffect } from "react";
import { useSpeechToText } from "@/hooks/useSpeechToText";

export default function MeetingPage() {
  const router = useRouter();
  const { userInfo } = useSelector((state: RootState) => state.auth);
  const [roomID, setRoomID] = React.useState("");
  const [hasJoinedRoom, setHasJoinedRoom] = React.useState(false);
  const [meetingExpired, setMeetingExpired] = React.useState(false);
  const [timeRemaining, setTimeRemaining] = React.useState<number | null>(null);
  const containerRef = React.useRef<HTMLDivElement | null>(null);
  const [speechLang, setSpeechLang] = React.useState<"vi-VN" | "en-US">("vi-VN");
  const subscriptionKey = process.env.NEXT_PUBLIC_AZURE_SPEECH_KEY || "";
  const region = process.env.NEXT_PUBLIC_AZURE_REGION || "";
  const translatorKey = process.env.NEXT_PUBLIC_AZURE_TRANSLATOR_KEY || "";
  const fromLang = speechLang === "vi-VN" ? "en-US" : "vi-VN";
  const toLang = speechLang === "vi-VN" ? "vi" : "en";
  const { transcript, isListening, startListening, stopListening, resetTranscript } = useSpeechToText({
    subscriptionKey,
    region,
    translatorKey,
    fromLang,
    toLang,
  });
  const [leaveMeeting] = useLeaveMeetingMutation();
  const [addRecording] = useAddRecordingMutation();
  const { data: meetingData } = useGetMeetingQuery(roomID, { skip: !roomID, pollingInterval: 30000 });

  const handleRecordingSave = React.useCallback(async (recordingPath: string, duration: number) => {
    if (!roomID || !userInfo?.id) return;
    try {
      await addRecording({
        id: roomID,
        request: { storagePath: recordingPath, duration, userId: userInfo.id }
      }).unwrap();
    } catch (error) {
      console.error("Failed to save recording:", error);
    }
  }, [addRecording, roomID, userInfo]);

  const {
    isRecording, startRecording, stopRecording, showFolderModal, setShowFolderModal,
    folderName, customFolderName, setCustomFolderName, handleFolderSelect, handleCustomFolderSubmit
  } = useRecording({ roomID, onStopRecording: handleRecordingSave });

  React.useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const id = params.get("roomID");
      if (id) setRoomID(id);
    }
  }, []);

  React.useEffect(() => {
    if (meetingData?.endTime) {
      const endTime = new Date(meetingData.endTime).getTime();
      const now = new Date().getTime();
      const timeLeft = Math.max(0, Math.floor((endTime - now) / 1000));
      setTimeRemaining(timeLeft);
      
      if (timeLeft <= 0 || meetingData.status === 'Ended') {
        setMeetingExpired(true);
      }

      const interval = setInterval(() => {
        const now = new Date().getTime();
        const timeLeft = Math.max(0, Math.floor((endTime - now) / 1000));
        setTimeRemaining(timeLeft);
        if (timeLeft <= 0) {
          setMeetingExpired(true);
          clearInterval(interval);
        }
      }, 1000);
      
      return () => clearInterval(interval);
    }
  }, [meetingData]);

  React.useEffect(() => {
    return () => {
      if (isListening) stopListening();
      resetTranscript();
      if (roomID && userInfo?.id) {
        leaveMeeting({ id: roomID, request: { userId: userInfo.id } });
      }
    };
  }, [leaveMeeting, roomID, userInfo, isListening, stopListening, resetTranscript]);

  const joinZegoRoom = React.useCallback(async (element: HTMLDivElement) => {
    if (!element || !roomID || !userInfo?.id) return;
    try {
      const kitToken = generateZegoToken(roomID);
      const zp = ZegoUIKitPrebuilt.create(kitToken);
      zp.joinRoom({
        container: element,
        sharedLinks: [{
          name: "Personal link",
          url: typeof window !== "undefined" ? `${window.location.protocol}//${window.location.host}${window.location.pathname}?roomID=${roomID}` : "",
        }],
        scenario: { mode: ZegoUIKitPrebuilt.GroupCall },
        onJoinRoom: () => setHasJoinedRoom(true),
        onLeaveRoom: () => {
          setHasJoinedRoom(false);
          if (isListening) stopListening();
          resetTranscript();
        }
      });
    } catch (error) {
      console.error("Failed to join meeting:", error);
    }
  }, [roomID, userInfo, isListening, stopListening, resetTranscript]);

  useEffect(() => {
    if (containerRef.current && roomID && userInfo?.id) {
      joinZegoRoom(containerRef.current);
    }
  }, [roomID, userInfo?.id, joinZegoRoom]);

  const formatTime = (time: number | null) => {
    if (!time) return "--:--:--";
    const hours = Math.floor(time / 3600);
    const minutes = Math.floor((time % 3600) / 60);
    const seconds = time % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <>
      <div
        className="myCallContainer"
        ref={containerRef}
        style={{ height: "100vh", width: "100vw" }}
      />
      
      {hasJoinedRoom && !meetingExpired && roomID && (
        <div className="fixed bottom-3 left-5 z-[999] flex items-center gap-4 bg-opacity-80 bg-gray-900 dark:bg-gray-800 py-2 px-4 rounded-full shadow-lg">
          {meetingData && (
            <div className="text-sm text-gray-200 mr-2">
              <span className="font-medium">{meetingData.title}</span>
            </div>
          )}
          
          <div className="flex items-center gap-1.5 text-sm font-medium text-gray-200">
            <Clock className="w-3.5 h-3.5" />
            <span>{formatTime(timeRemaining)}</span>
          </div>

          <div className="h-8 w-[1px] bg-gray-500 dark:bg-gray-600 mx-1" />

          <button
            onClick={isRecording ? stopRecording : startRecording}
            className={cn(
              "flex items-center gap-2 px-3 py-1.5 rounded-full transition-all font-medium text-sm",
              isRecording ? "bg-red-500 text-white hover:bg-red-600" : "bg-gray-200 text-gray-800 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
            )}
          >
            {isRecording ? (
              <>
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-300 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-red-400" />
                </span>
                <Square className="w-3.5 h-3.5" />
                <span>Stop</span>
              </>
            ) : (
              <>
                <Mic className="w-3.5 h-3.5" />
                <span>Record</span>
              </>
            )}
          </button>
        </div>
      )}

      {hasJoinedRoom && !meetingExpired && roomID && (
        <div className="fixed bottom-3 right-60 z-[999] bg-opacity-80 bg-gray-900 dark:bg-gray-800 py-2 px-4 rounded-full shadow-lg flex items-center gap-2">
          <select
            value={speechLang}
            onChange={e => setSpeechLang(e.target.value as "vi-VN" | "en-US")}
            className="h-8 rounded-full bg-gray-200 text-gray-800 text-sm font-medium px-3"
          >
            <option value="vi-VN">Tiếng Việt</option>
            <option value="en-US">English</option>
          </select>
          <button
            onClick={() => isListening ? stopListening() : startListening()}
            className={cn(
              "flex items-center gap-2 px-3 py-1.5 rounded-full transition-all font-medium text-sm",
              isListening ? "bg-blue-500 text-white hover:bg-blue-600" : "bg-gray-200 text-gray-800 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
            )}
          >
            <MessageCircle className="w-3.5 h-3.5" />
            <span>{isListening ? "Stop Speech" : "Speech to Text"}</span>
          </button>
        </div>
      )}

      {hasJoinedRoom && !meetingExpired && roomID && transcript && (
        <div className="fixed bottom-20 left-5 right-5 z-[997] max-w-2xl mx-auto">
          <div className="bg-black/80 text-white p-4 rounded-lg backdrop-blur-sm">
            <div className="flex items-center gap-2 mb-2">
              <MessageCircle className="w-4 h-4" />
              <span className="text-sm font-medium">Speech to Text</span>
              {isListening && (
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500" />
                </span>
              )}
            </div>
            <p className="text-sm leading-relaxed">{transcript}</p>
          </div>
        </div>
      )}

      {meetingExpired && (
        <div className="fixed inset-0 bg-black/85 z-[1000] flex flex-col justify-center items-center text-white">
          <h2 className="text-2xl font-bold mb-4">Meeting Ended</h2>
          {meetingData && (
            <p className="mb-3 text-lg text-center max-w-md">
              The meeting &ldquo;{meetingData.title}&rdquo; has ended
            </p>
          )}
          <p className="mb-6">This meeting has reached its time limit</p>
          <button
            className="px-4 py-2 bg-blue-600 rounded-md hover:bg-blue-700"
            onClick={() => router.push('/meeting-room')}
          >
            Return to Meeting Rooms
          </button>
        </div>
      )}

      <FolderSelectionModal
        show={showFolderModal}
        folderName={folderName}
        customFolderName={customFolderName}
        setCustomFolderName={setCustomFolderName}
        onSelect={handleFolderSelect}
        onCustomSubmit={handleCustomFolderSubmit}
        onClose={() => setShowFolderModal(false)}
      />
    </>
  );
}