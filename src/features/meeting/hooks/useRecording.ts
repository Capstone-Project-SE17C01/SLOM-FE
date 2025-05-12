import * as React from 'react';

interface CloudinaryUploadResponse {
  public_id: string;
  url: string;
  secure_url: string;
  resource_type: string;
  format: string;
  width?: number;
  height?: number;
  [key: string]: unknown; // For other Cloudinary response fields
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
      // Get screen display media stream
      const displayStream = await navigator.mediaDevices.getDisplayMedia({ 
        video: true,
        audio: true // This might not capture audio from the meeting in some browsers
      });
      
      // Get system audio as well (user microphone)
      let audioStream: MediaStream | undefined;
      try {
        audioStream = await navigator.mediaDevices.getUserMedia({ 
          audio: true,
          video: false
        });
        
        // Some browsers might give permission errors when trying to get audio while screen sharing
        console.log("Successfully captured system audio");
      } catch (audioError) {
        console.warn("Could not get user audio, proceeding with display capture only:", audioError);
      }
      
      // Combine tracks from both streams
      const combinedStream = new MediaStream();
      
      // Add all video tracks from the display stream
      displayStream.getVideoTracks().forEach(track => {
        combinedStream.addTrack(track);
      });
      
      // Add audio tracks from display stream (if any)
      displayStream.getAudioTracks().forEach(track => {
        combinedStream.addTrack(track);
      });
      
      // Add audio tracks from the audio stream (if available)
      if (audioStream) {
        audioStream.getAudioTracks().forEach(track => {
          combinedStream.addTrack(track);
        });
      }
      
      // Create a media recorder with all tracks
      const mediaRecorder = new MediaRecorder(combinedStream, {
        mimeType: 'video/webm;codecs=vp9,opus' // Specify codecs for better compatibility
      });
      
      setRecorder(mediaRecorder);
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          setRecordedChunks((prev) => [...prev, event.data]);
        }
      };
      
      mediaRecorder.onstop = () => {
        // Stop all tracks in all streams
        displayStream.getTracks().forEach(track => track.stop());
        if (audioStream) {
          audioStream.getTracks().forEach(track => track.stop());
        }
        
        setIsRecording(false);
        processRecording();
      };
      
      mediaRecorder.start(1000); // Record in 1-second chunks for better reliability
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
    // Process recording after stopping
  const processRecording = () => {
    if (recordedChunks.length === 0) return;
    
    // Create a blob from the recorded chunks with specific MIME type to ensure audio is included
    const blob = new Blob(recordedChunks, { 
      type: "video/webm; codecs=vp9,opus" 
    });
    
    // Log the blob size and type for debugging
    console.log("Recording processed:", { 
      size: `${(blob.size / 1024 / 1024).toFixed(2)} MB`,
      type: blob.type,
      chunks: recordedChunks.length 
    });
    
    setTempRecordingData(blob);
    
    // Show folder selection modal
    setShowFolderModal(true);
  };
  
  // Handle folder selection
  const handleFolderSelect = (folder: string) => {
    setFolderName(folder);
    if (folder !== "custom") {
      uploadToCloudinary(folder);
    }
  };
  
  // Handle custom folder submission
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
    
    // Import dynamically to prevent issues with server-side rendering
    const { uploadVideoToCloudinary, generateVideoFilename } = await import('@/services/cloudinary');
    
    // Create a File from the blob with proper MIME type to ensure audio is preserved
    const file = new File(
      [tempRecordingData], 
      generateVideoFilename(roomID), 
      { type: "video/webm; codecs=vp9,opus" }
    );
    
    try {
      // Log file size for debugging
      console.log(`Uploading video file: ${(file.size / 1024 / 1024).toFixed(2)} MB`);
      
      const data = await uploadVideoToCloudinary(file, folder);
      console.log("Uploaded video:", data);
      
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
