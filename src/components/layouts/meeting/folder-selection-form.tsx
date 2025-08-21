import React from 'react';
import { FolderSelectionModalProps } from '../../../types/IMeeting';
import { useTheme } from '@/contexts/ThemeContext';

export const FolderSelectionModal: React.FC<FolderSelectionModalProps> = ({
  show,
  folderName,
  customFolderName,
  setCustomFolderName,
  onSelect,
  onCustomSubmit,
  onClose
}) => {
  const { isDarkMode } = useTheme();
  
  if (!show) return null;

  return (
    <div style={{
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: isDarkMode ? "rgba(0,0,0,0.8)" : "rgba(0,0,0,0.5)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 2000
    }}>
      <div style={{
        backgroundColor: isDarkMode ? "#1f2937" : "white",
        borderRadius: "8px",
        padding: "20px",
        width: "350px",
        boxShadow: isDarkMode ? "0 4px 12px rgba(0,0,0,0.3)" : "0 4px 12px rgba(0,0,0,0.15)",
        border: isDarkMode ? "1px solid #374151" : "none"
      }}>
        <h3 style={{ 
          margin: "0 0 15px", 
          color: isDarkMode ? "#f9fafb" : "#333", 
          fontSize: "18px" 
        }}>
          Save Recording
        </h3>
        <p style={{ 
          margin: "0 0 20px", 
          color: isDarkMode ? "#d1d5db" : "#666", 
          fontSize: "14px" 
        }}>
          Choose where to save your recording:
        </p>
        
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          <button 
            onClick={() => onSelect("general")}
            style={{
              padding: "10px",
              border: `1px solid ${isDarkMode ? "#4b5563" : "#ddd"}`,
              borderRadius: "4px",
              backgroundColor: isDarkMode ? "#374151" : "#f9f9f9",
              color: isDarkMode ? "#f9fafb" : "#333",
              cursor: "pointer",
              textAlign: "left",
              fontWeight: "normal",
              transition: "all 0.2s"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = isDarkMode ? "#4b5563" : "#f0f0f0";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = isDarkMode ? "#374151" : "#f9f9f9";
            }}
          >
            General
          </button>
          
          <button 
            onClick={() => onSelect("custom")}
            style={{
              padding: "10px",
              border: `1px solid ${isDarkMode ? "#4b5563" : "#ddd"}`,
              borderRadius: "4px",
              backgroundColor: folderName === "custom" 
                ? (isDarkMode ? "#4b5563" : "#f0f0f0") 
                : (isDarkMode ? "#374151" : "#f9f9f9"),
              color: isDarkMode ? "#f9fafb" : "#333",
              cursor: "pointer",
              textAlign: "left",
              fontWeight: "normal",
              transition: "all 0.2s"
            }}
            onMouseEnter={(e) => {
              if (folderName !== "custom") {
                e.currentTarget.style.backgroundColor = isDarkMode ? "#4b5563" : "#f0f0f0";
              }
            }}
            onMouseLeave={(e) => {
              if (folderName !== "custom") {
                e.currentTarget.style.backgroundColor = isDarkMode ? "#374151" : "#f9f9f9";
              }
            }}
          >
            Custom folder
          </button>
          
          {folderName === "custom" && (
            <div style={{ marginTop: "5px" }}>
              <input
                type="text"
                placeholder="Enter folder name"
                value={customFolderName}
                onChange={(e) => setCustomFolderName(e.target.value)}
                style={{
                  width: "100%",
                  padding: "8px",
                  borderRadius: "4px",
                  border: `1px solid ${isDarkMode ? "#4b5563" : "#ddd"}`,
                  backgroundColor: isDarkMode ? "#374151" : "white",
                  color: isDarkMode ? "#f9fafb" : "#333",
                  marginBottom: "10px"
                }}
              />
            </div>
          )}
        </div>
        
        <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "20px" }}>
          {folderName === "custom" && (
            <button
              onClick={onCustomSubmit}
              style={{
                backgroundColor: isDarkMode ? "#3b82f6" : "rgba(0, 0, 0, 0.85)",
                color: "white",
                border: "none",
                padding: "8px 16px",
                borderRadius: "4px",
                cursor: "pointer",
                transition: "background-color 0.2s"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = isDarkMode ? "#2563eb" : "rgba(0, 0, 0, 0.95)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = isDarkMode ? "#3b82f6" : "rgba(0, 0, 0, 0.85)";
              }}
            >
              Save
            </button>
          )}
          <button
            onClick={onClose}
            style={{
              backgroundColor: isDarkMode ? "#374151" : "white",
              color: isDarkMode ? "#f9fafb" : "black",
              border: `1px solid ${isDarkMode ? "#4b5563" : "#ddd"}`,
              padding: "8px 16px",
              borderRadius: "4px",
              cursor: "pointer",
              transition: "all 0.2s"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = isDarkMode ? "#4b5563" : "#f9f9f9";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = isDarkMode ? "#374151" : "white";
            }}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};
