import * as React from 'react';

interface CloudinaryUploadResponse {
  public_id: string;
  url: string;
  secure_url: string;
  resource_type: string;
  format: string;
  width?: number;
  height?: number;
  [key: string]: unknown;
}

interface RecordingHookProps {
  roomID: string;
  onSaveSuccess?: (data: CloudinaryUploadResponse) => void;
  onSaveFailed?: (error: unknown) => void;
}

export function useRecording({ roomID, onSaveSuccess, onSaveFailed }: RecordingHookProps) {
  const [isRecording, setIsRecording] = React.useState<boolean>(false);
  const [recorder, setRecorder] = React.useState<MediaRecorder | null>(null);
  const [recordedChunks, setRecordedChunks] = React.useState<Blob[]>([]);
  const [showFolderModal, setShowFolderModal] = React.useState<boolean>(false);
  const [folderName, setFolderName] = React.useState<string>("");
  const [customFolderName, setCustomFolderName] = React.useState<string>("");
  const [tempRecordingData, setTempRecordingData] = React.useState<Blob | null>(null);
  const startRecording = async () => {
    setRecordedChunks([]);
    
    try {
      const displayStream = await navigator.mediaDevices.getDisplayMedia({ 
        video: true,
        audio: true
      });
      
      let audioStream: MediaStream | undefined;
      try {
        audioStream = await navigator.mediaDevices.getUserMedia({ 
          audio: true,
          video: false
        });
        
      } catch (audioError) {
        console.warn("Could not get user audio, proceeding with display capture only:", audioError);
      }
      
      const combinedStream = new MediaStream();
      
      displayStream.getVideoTracks().forEach(track => {
        combinedStream.addTrack(track);
      });
      
      displayStream.getAudioTracks().forEach(track => {
        combinedStream.addTrack(track);
      });
      
      if (audioStream) {
        audioStream.getAudioTracks().forEach(track => {
          combinedStream.addTrack(track);
        });
      }
      
      const mediaRecorder = new MediaRecorder(combinedStream, {
        mimeType: 'video/webm;codecs=vp9,opus'
      });
      
      setRecorder(mediaRecorder);
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          setRecordedChunks((prev) => [...prev, event.data]);
        }
      };
      
      mediaRecorder.onstop = () => {
        displayStream.getTracks().forEach(track => track.stop());
        if (audioStream) {
          audioStream.getTracks().forEach(track => track.stop());
        }
        
        setIsRecording(false);
        processRecording();
      };
      
      mediaRecorder.start(1000);
      setIsRecording(true);
    } catch (error) {
      console.error("Error starting recording:", error);
      setIsRecording(false);
      if (onSaveFailed) onSaveFailed(error);
    }
  };
  
  const stopRecording = () => {
    if (recorder && recorder.state === "recording") {
      recorder.stop();
    }
  };

  const processRecording = () => {
    if (recordedChunks.length === 0) return;
    
    const blob = new Blob(recordedChunks, { 
      type: "video/webm; codecs=vp9,opus" 
    });
    
    setTempRecordingData(blob);
    
    setShowFolderModal(true);
  };
  
  const handleFolderSelect = (folder: string) => {
    setFolderName(folder);
    if (folder !== "custom") {
      uploadToCloudinary(folder);
    }
  };
  
  const handleCustomFolderSubmit = () => {
    if (customFolderName.trim()) {
      uploadToCloudinary(`custom/${customFolderName.trim()}`);
    } else {
      uploadToCloudinary("general");
    }
  };
    const uploadToCloudinary = async (folder: string = "general") => {
    setShowFolderModal(false);
    
    if (!tempRecordingData) return;
    
    const { uploadVideoToCloudinary, generateVideoFilename } = await import('@/services/cloudinary/config');
    
    const file = new File(
      [tempRecordingData], 
      generateVideoFilename(roomID), 
      { type: "video/webm; codecs=vp9,opus" }
    );
    
    try {   
      const data = await uploadVideoToCloudinary(file, folder);
      
      if (onSaveSuccess) onSaveSuccess(data);
      setTempRecordingData(null);
    } catch (error) {
      console.error("Error uploading to Cloudinary:", error);
      if (onSaveFailed) onSaveFailed(error);
    }
  };
  
  return {
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
  };
}
