"use client";

import * as React from "react";
import { getUrlParams, generateRandomID, joinZegoRoom } from "@/services/zego";
import { useRecording } from "@/features/meeting";
import { FolderSelectionModal } from "@/features/meeting/components/FolderSelectionModal";
import { RecordingButton } from "@/features/meeting/components/RecordingButton";
import { Toast } from "@/features/meeting/components/Toast";

export default function App(): JSX.Element {
  const [roomID, setRoomID] = React.useState<string>("");
  const [hasJoinedRoom, setHasJoinedRoom] = React.useState<boolean>(false);
  const [toastMessage, setToastMessage] = React.useState<string>("");
  const [showToast, setShowToast] = React.useState<boolean>(false);
  
  // Recording functionality using the custom hook
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
    onSaveSuccess: () => {
      setToastMessage("Recording saved successfully");
      setShowToast(true);
    },
    onSaveFailed: () => {
      setToastMessage("Upload failed");
      setShowToast(true);
    }
  });
  
  // Set room ID after component mounts to avoid SSR issues
  React.useEffect(() => {
    setRoomID(getUrlParams().get("roomID") || generateRandomID(5));
  }, []);
  
  // Meeting setup using the Zego service
  const myMeeting = React.useCallback((element: HTMLDivElement | null) => {
    if (!element) return;
    if (!roomID) return; // Don't proceed if roomID isn't set yet
    
    joinZegoRoom(element, roomID, () => {
      setHasJoinedRoom(true);
    });
  }, [roomID]);
  return (
    <>
      <div
        className="myCallContainer"
        ref={myMeeting}
        style={{ height: "100vh", width: "100vw" }}
      ></div>
      
      {hasJoinedRoom && (
        <div 
          style={{ 
            position: "fixed", 
            top: "20px", 
            right: "20px", 
            zIndex: 999,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "10px"
          }}
        >
          <RecordingButton 
            isRecording={isRecording} 
            onClick={isRecording ? stopRecording : startRecording} 
          />
        </div>
      )}
      
      {/* Folder Selection Modal */}
      <FolderSelectionModal
        show={showFolderModal}
        folderName={folderName}
        customFolderName={customFolderName}
        setCustomFolderName={setCustomFolderName}
        onSelect={handleFolderSelect}
        onCustomSubmit={handleCustomFolderSubmit}
        onClose={() => setShowFolderModal(false)}
      />
      
      {/* Toast Notification */}
      <Toast
        message={toastMessage}
        show={showToast}
        onHide={() => setShowToast(false)}
      />
    </>
  );
}