"use client";
import * as React from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { useRecording } from "@/hooks/useRecording";
import { useSignLanguageRecognition } from "@/hooks/useSignLanguageRecognition";
import { useEffect } from "react";
import { useSpeechToText } from "@/hooks/useSpeechToText";
import { Mic, Square, Clock, AlarmClock, Languages, MessageCircle } from "lucide-react";
import { generateZegoToken } from "@/services/zego/config";
import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";
import { SignLanguageOverlay, SignLanguageToggleButton } from "@/components/ui/signLanguageOverlay";
import { cn } from "@/utils/cn";
import { RootState } from "@/redux/store";
import { useAddRecordingMutation, useGetMeetingQuery, useLeaveMeetingMutation } from "@/api/MeetingApi";
import { FolderSelectionModal } from "@/components/layouts/meeting/folder-selection-form";

function ZegoMeetingTimerDisplay({ roomId, onExpired }: { roomId: string; onExpired?: () => void }) {
  const { data: meeting } = useGetMeetingQuery(roomId, { pollingInterval: 30000 });
  const [timeRemaining, setTimeRemaining] = React.useState<number | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isExpired, setIsExpired] = React.useState(false);

  React.useEffect(() => {
    if (meeting && meeting.endTime) {
      const endTime = new Date(meeting.endTime).getTime();
      const now = new Date().getTime();
      const timeLeft = Math.max(0, Math.floor((endTime - now) / 1000));

      setTimeRemaining(timeLeft);
      setIsLoading(false);

      if (timeLeft <= 0 || meeting.status === 'Ended') {
        setIsExpired(true);
        if (onExpired) onExpired();
      }

      const interval = setInterval(() => {
        const now = new Date().getTime();
        const timeLeft = Math.max(0, Math.floor((endTime - now) / 1000));

        setTimeRemaining(timeLeft);

        if (timeLeft <= 0) {
          setIsExpired(true);
          if (onExpired) onExpired();
          clearInterval(interval);
        }
      }, 1000);

      return () => clearInterval(interval);
    } else if (meeting) {
      setIsLoading(false);
      setTimeRemaining(null);
    }
  }, [meeting, onExpired]);

  const formatTimeDisplay = () => {
    if (timeRemaining === null) return "--:--:--";

    const hours = Math.floor(timeRemaining / 3600);
    const minutes = Math.floor((timeRemaining % 3600) / 60);
    const seconds = timeRemaining % 60;

    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const isCloseToExpire = timeRemaining !== null && timeRemaining < 300;

  if (isLoading) {
    return (
      <div className="text-sm text-gray-200 animate-pulse flex items-center gap-1.5">
        <Clock className="w-3.5 h-3.5" />
        <span>Loading...</span>
      </div>
    );
  }

  if (isExpired) {
    return (
      <div className="flex items-center gap-2">
        <div className="text-red-400 flex items-center gap-1.5">
          <AlarmClock className="w-3.5 h-3.5" />
          <span className="text-sm font-medium">Meeting ended</span>
        </div>
      </div>
    );
  }

  return (
    <div className={cn(
      "flex items-center gap-1.5 text-sm font-medium",
      isCloseToExpire
        ? "text-red-300"
        : "text-gray-200"
    )}>
      {isCloseToExpire ? (
        <AlarmClock className="w-3.5 h-3.5" />
      ) : (
        <Clock className="w-3.5 h-3.5" />
      )}
      <span>{formatTimeDisplay()}</span>
    </div>
  );
}

export default function MeetingPage() {
  const router = useRouter();
  const { userInfo } = useSelector((state: RootState) => state.auth);

  // Meeting states
  const [roomID, setRoomID] = React.useState("");
  const [hasJoinedRoom, setHasJoinedRoom] = React.useState(false);
  const [meetingExpired, setMeetingExpired] = React.useState(false);
  const [signLanguageVisible, setSignLanguageVisible] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement | null>(null);

  // Speech-to-text states
  const [speechLang, setSpeechLang] = React.useState<"vi-VN" | "en-US">("vi-VN");
  const subscriptionKey = process.env.NEXT_PUBLIC_AZURE_SPEECH_KEY || "";
  const region = process.env.NEXT_PUBLIC_AZURE_REGION || "";
  const translatorKey = process.env.NEXT_PUBLIC_AZURE_TRANSLATOR_KEY || "";
  const fromLang = speechLang === "vi-VN" ? "en-US" : "vi-VN";
  const toLang = speechLang === "vi-VN" ? "vi" : "en";

  // API hooks
  const [leaveMeeting] = useLeaveMeetingMutation();
  const [addRecording] = useAddRecordingMutation();
  const { data: meetingData } = useGetMeetingQuery(roomID, { skip: !roomID, pollingInterval: 30000 });

  // Speech-to-text hook
  const { transcript, isListening, startListening, stopListening, resetTranscript } = useSpeechToText({
    subscriptionKey,
    region,
    translatorKey,
    fromLang,
    toLang,
  });

  // Sign Language Recognition hook
  const signLanguageRecognition = useSignLanguageRecognition({
    onResult: (result) => {
      console.log("Sign language recognition result:", result);
    },
    captureInterval: 200
  });

  // Auto show overlay when sign language recognition is activated
  React.useEffect(() => {
    if (signLanguageRecognition.isActive && !signLanguageVisible) {
      setSignLanguageVisible(true);
    }
  }, [signLanguageRecognition.isActive, signLanguageVisible]);

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

      if (timeLeft <= 0 || meetingData.status === 'Ended') {
        setMeetingExpired(true);
      }
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

  return (
    <>
      <div
        className="myCallContainer"
        ref={containerRef}
        style={{ height: "100vh", width: "100vw" }}
      />

      {/* Main control bar */}
      {hasJoinedRoom && !meetingExpired && roomID && (
        <div className="fixed bottom-3 left-5 z-[999] flex items-center gap-4 bg-opacity-80 bg-gray-900 dark:bg-gray-800 py-2 px-4 rounded-full shadow-lg">
          {meetingData && (
            <div className="text-sm text-gray-200 mr-2">
              <span className="font-medium">{meetingData.title}</span>
            </div>
          )}

          <ZegoMeetingTimerDisplay
            roomId={roomID}
            onExpired={() => setMeetingExpired(true)}
          />

          {userInfo?.vipUser && (
            <>
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

              <div className="h-8 w-[1px] bg-gray-500 dark:bg-gray-600 mx-1" />

              <button
                onClick={signLanguageRecognition.toggleRecognition}
                className={cn(
                  "flex items-center gap-2 px-3 py-1.5 rounded-full transition-all font-medium text-sm",
                  signLanguageRecognition.isActive
                    ? "bg-green-500 text-white hover:bg-green-600"
                    : "bg-gray-200 text-gray-800 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
                )}
              >
                {signLanguageRecognition.isActive ? (
                  <>
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-300 opacity-75" />
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-green-400" />
                    </span>
                    <Languages className="w-3.5 h-3.5" />
                    <span>Sign AI</span>
                  </>
                ) : (
                  <>
                    <Languages className="w-3.5 h-3.5" />
                    <span>Sign AI</span>
                  </>
                )}
              </button>
            </>
          )}
        </div>
      )}

      {/* Speech-to-text control bar */}
      {hasJoinedRoom && !meetingExpired && roomID && userInfo?.vipUser && (
        <div className="fixed bottom-3 right-0 mr-[220px] z-[999] bg-opacity-80 bg-gray-900 dark:bg-gray-800 py-2 px-4 rounded-full shadow-lg flex items-center gap-2">
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

      {/* Speech-to-text transcript display */}
      {hasJoinedRoom && !meetingExpired && roomID && transcript && userInfo?.vipUser && (
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

      {/* Sign Language Recognition Overlay */}
      {hasJoinedRoom && !meetingExpired && (
        <>
          <SignLanguageOverlay
            isActive={signLanguageRecognition.isActive}
            isConnected={signLanguageRecognition.isConnected}
            connectionStatus={signLanguageRecognition.connectionStatus}
            currentPrediction={signLanguageRecognition.currentPrediction}
            confidence={signLanguageRecognition.confidence}
            lastUpdate={signLanguageRecognition.lastUpdate}
            recentPredictions={signLanguageRecognition.recentPredictions}
            isVisible={signLanguageVisible}
            onToggleVisibility={() => setSignLanguageVisible(!signLanguageVisible)}
          />

          <SignLanguageToggleButton
            isVisible={signLanguageVisible}
            onToggle={() => setSignLanguageVisible(true)}
            isActive={signLanguageRecognition.isActive}
          />
        </>
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