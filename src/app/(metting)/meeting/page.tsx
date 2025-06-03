"use client";

import * as React from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { FolderSelectionModal } from "@/features/meeting/components/folder-selection-form";
import { useRouter } from "next/navigation";
import { useRecording } from "@/hooks/useRecording";
import { Mic, Square, Clock, AlarmClock } from "lucide-react";
import { cn } from "@/lib/utils";
import { generateZegoToken } from "@/services/zego/config";
import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";
import { useGetMeetingQuery, useLeaveMeetingMutation, useAddRecordingMutation } from "@/features/meeting/api";

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
      // If the meeting exists but has no endTime, show a default state
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

export default function App(): JSX.Element {
  const router = useRouter();
  const [roomID, setRoomID] = React.useState<string>("");
  const [hasJoinedRoom, setHasJoinedRoom] = React.useState<boolean>(false);
  const [meetingExpired, setMeetingExpired] = React.useState<boolean>(false);
  const [meetingError, setMeetingError] = React.useState<string | null>(null);
  const { userInfo } = useSelector((state: RootState) => state.auth);

  const [leaveMeeting] = useLeaveMeetingMutation();
  const [addRecording] = useAddRecordingMutation();
  const { data: meetingData, error: meetingDataError } = useGetMeetingQuery(roomID, { 
    skip: !roomID,
    pollingInterval: 30000 
  });
  
  React.useEffect(() => {
    if (meetingDataError) {
      console.error('Error fetching meeting data:', meetingDataError);
      setMeetingError('Failed to load meeting information. Please try again later.');
    }
  }, [meetingDataError]);

  const handleRecordingSave = React.useCallback(async (recordingPath: string, duration: number) => {
    if (!roomID || !userInfo || !userInfo.id) return;
    
    try {
      await addRecording({
        id: roomID,
        request: {
          storagePath: recordingPath,
          duration,
          userId: userInfo.id
        }
      }).unwrap();
    } catch (error) {
      console.error("Failed to save recording:", error);
    }
  }, [addRecording, roomID, userInfo]);

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
    onStopRecording: handleRecordingSave
  });
  React.useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const id = params.get("roomID");
      if (id) {
        setRoomID(id);
      }
    }
  }, []);
  React.useEffect(() => {
    if (meetingData) {
      if (meetingData.status === 'Ended') {
        setMeetingExpired(true);
      }
      
      if (meetingData.endTime) {
        const endTime = new Date(meetingData.endTime).getTime();
        const now = new Date().getTime();
        
        if (now >= endTime) {
          setMeetingExpired(true);
        }
      }
    }
  }, [meetingData]);

  React.useEffect(() => {
    return () => {
      if (roomID && userInfo && userInfo.id) {
        leaveMeeting({
          id: roomID,
          request: {
            userId: userInfo.id
          }
        }).catch(err => {
          console.error("Error leaving meeting:", err);
        });
      }
    };
  }, [leaveMeeting, roomID, userInfo]);
  
  const joinZegoRoom = React.useCallback(async (element: HTMLDivElement) => {
    if (!element || !roomID || !userInfo || !userInfo.id) return;

    try {
      const kitToken = generateZegoToken(roomID);
      const zp = ZegoUIKitPrebuilt.create(kitToken);

      zp.joinRoom({
        container: element,
        sharedLinks: [
          {
            name: "Personal link",
            url: typeof window !== "undefined"
              ? `${window.location.protocol}//${window.location.host}${window.location.pathname}?roomID=${roomID}`
              : "",
          },
        ],
        scenario: {
          mode: ZegoUIKitPrebuilt.GroupCall,
        },
        onJoinRoom: () => {
          setHasJoinedRoom(true);
        }
      });
    } catch (error) {
      console.error("Failed to join meeting:", error);
      setMeetingError("Failed to join meeting. Please try again later.");
    }
  }, [roomID, userInfo, setMeetingError]);

  const myMeeting = React.useCallback((element: HTMLDivElement | null) => {
    if (element) joinZegoRoom(element);
  }, [joinZegoRoom]);
  return (
    <>      
      {meetingError && (
        <div className="fixed top-0 left-0 right-0 bg-red-500 text-white p-3 text-center z-[1001]">
          {meetingError}
        </div>
      )}
      
      <div
        className="myCallContainer"
        ref={myMeeting}
        style={{ height: "100vh", width: "100vw" }}
      ></div>      {hasJoinedRoom && !meetingExpired && (
        <div
          className="fixed bottom-5 left-5 z-[999] flex items-center gap-4 bg-opacity-80 bg-gray-900 dark:bg-gray-800 py-2 px-4 rounded-full shadow-lg"
        >
          {meetingData && (
            <div className="text-sm text-gray-200 mr-2">
              <span className="font-medium">{meetingData.title}</span>
            </div>
          )}
          
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
      )}      {meetingExpired && (
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
        >          <h2 className="text-2xl font-bold mb-4">Meeting Ended</h2>
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