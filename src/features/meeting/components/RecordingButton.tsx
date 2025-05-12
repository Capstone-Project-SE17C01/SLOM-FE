import React from 'react';

interface RecordingButtonProps {
  isRecording: boolean;
  onClick: () => void;
}

export const RecordingButton: React.FC<RecordingButtonProps> = ({ isRecording, onClick }) => {
  return (
    <button
      onClick={onClick}
      style={{
        backgroundColor: isRecording ? "rgba(0, 0, 0, 0.7)" : "rgba(255, 255, 255, 0.9)",
        color: isRecording ? "white" : "black",
        padding: "10px 16px",
        border: "none",
        borderRadius: "6px",
        cursor: "pointer",
        fontWeight: "bold",
        boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
        display: "flex",
        alignItems: "center",
        gap: "6px"
      }}
    >
      <span style={{ 
        height: "10px", 
        width: "10px", 
        borderRadius: "50%", 
        backgroundColor: isRecording ? "#f44336" : "#4caf50", 
        display: "inline-block" 
      }}></span>
      {isRecording ? "Stop Recording" : "Start Recording"}
    </button>
  );
};
