"use client";

import * as React from "react";
import { FolderSelectionModal } from "@/features/meeting/components/folder-selection-form";
import { useRouter } from "next/navigation";
import { useRecording } from "@/hooks/useRecording";
import { Mic, Square, Clock, AlarmClock } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTimer } from "@/hooks/useTimer";
import { getUrlParams, joinZegoRoom } from "@/features/meeting/api";
import { generateRandomID } from "@/services/zego/config";

function ZegoMeetingTimerDisplay({ roomId, onExpired }: { roomId: string; onExpired?: () => void }) {
  const { 
    timeLeft, 
    isExpired, 
    isLoading, 
    formatTimeDisplay 
  } = useTimer({
    roomId,
    onExpired
  });
  
  const isCloseToExpire = timeLeft !== null && timeLeft < 300;
  
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

export default function App(): JSX.Element {
  const router = useRouter();
  const [roomID, setRoomID] = React.useState<string>("");
  const [hasJoinedRoom, setHasJoinedRoom] = React.useState<boolean>(false);
  const [meetingExpired, setMeetingExpired] = React.useState<boolean>(false);

  const {
    isRecording,
    startRecording,
    stopRecording,
    showFolderModal,
    setShowFolderModal,
    folderName,
    customFolderName,
    setCustomFolderName,
    handleFolderSelect,
    handleCustomFolderSubmit
  } = useRecording({
    roomID,
  });

  React.useEffect(() => {
    setRoomID(getUrlParams().get("roomID") || generateRandomID(5));
  }, []);

  const myMeeting = React.useCallback((element: HTMLDivElement | null) => {
    if (!element) return;
    if (!roomID) return;

    joinZegoRoom(element, roomID, () => {
      setHasJoinedRoom(true);
    });
  }, [roomID]);
  return (<>      
    <div
      className="myCallContainer"
      ref={myMeeting}
      style={{ height: "100vh", width: "100vw" }}
    ></div>
    {hasJoinedRoom && !meetingExpired && (
      <div
        className="fixed bottom-5 left-5 z-[999] flex items-center gap-4 bg-opacity-80 bg-gray-900 dark:bg-gray-800 py-2 px-4 rounded-full shadow-lg"
      >
        <ZegoMeetingTimerDisplay
          roomId={roomID}
          onExpired={() => {
            setMeetingExpired(true);
          }}
        />

        <div className="h-8 w-[1px] bg-gray-500 dark:bg-gray-600 mx-1"></div>

        <button
          onClick={isRecording ? stopRecording : startRecording}
          className={cn(
            "flex items-center gap-2 px-3 py-1.5 rounded-full transition-all",
            "font-medium text-sm",
            isRecording
              ? "bg-red-500 text-white hover:bg-red-600"
              : "bg-gray-200 text-gray-800 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
          )}
        >
          {isRecording ? (
            <>
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-300 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-400"></span>
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

    {meetingExpired && (
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(0,0,0,0.85)",
          zIndex: 1000,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          color: "white"
        }}
      >
        <h2 className="text-2xl font-bold mb-4">Meeting Ended</h2>
        <p className="mb-6">This meeting has reached its time limit</p>        <button
          className="px-4 py-2 bg-blue-600 rounded-md hover:bg-blue-700"
          onClick={() => router.push('/dashboard/meeting-room')}
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