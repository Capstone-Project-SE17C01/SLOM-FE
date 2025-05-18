import React from 'react';
import { FolderSelectionModalProps } from '../types';

export const FolderSelectionModal: React.FC<FolderSelectionModalProps> = ({
  show,
  folderName,
  customFolderName,
  setCustomFolderName,
  onSelect,
  onCustomSubmit,
  onClose
}) => {
  if (!show) return null;

  return (
    <div style={{
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: "rgba(0,0,0,0.5)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 2000
    }}>
      <div style={{
        backgroundColor: "white",
        borderRadius: "8px",
        padding: "20px",
        width: "350px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.15)"
      }}>
        <h3 style={{ margin: "0 0 15px", color: "#333", fontSize: "18px" }}>Save Recording</h3>
        <p style={{ margin: "0 0 20px", color: "#666", fontSize: "14px" }}>Choose where to save your recording:</p>
        
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          <button 
            onClick={() => onSelect("general")}
            style={{
              padding: "10px",
              border: "1px solid #ddd",
              borderRadius: "4px",
              backgroundColor: "#f9f9f9",
              cursor: "pointer",
              textAlign: "left",
              fontWeight: "normal"
            }}
          >
            General
          </button>
          
          <button 
            onClick={() => onSelect("custom")}
            style={{
              padding: "10px",
              border: "1px solid #ddd",
              borderRadius: "4px",
              backgroundColor: folderName === "custom" ? "#f0f0f0" : "#f9f9f9",
              cursor: "pointer",
              textAlign: "left",
              fontWeight: "normal"
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
                  border: "1px solid #ddd",
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
                backgroundColor: "rgba(0, 0, 0, 0.85)",
                color: "white",
                border: "none",
                padding: "8px 16px",
                borderRadius: "4px",
                cursor: "pointer"
              }}
            >
              Save
            </button>
          )}
          <button
            onClick={onClose}
            style={{
              backgroundColor: "white",
              color: "black",
              border: "1px solid #ddd",
              padding: "8px 16px",
              borderRadius: "4px",
              cursor: "pointer"
            }}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};
