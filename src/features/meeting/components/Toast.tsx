import React, { useEffect } from 'react';

interface ToastProps {
  message: string;
  show: boolean;
  onHide: () => void;
  duration?: number;
}

export const Toast: React.FC<ToastProps> = ({ 
  message, 
  show, 
  onHide, 
  duration = 3000 
}) => {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        onHide();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [show, duration, onHide]);

  if (!show) return null;
  
  return (
    <div style={{ 
      position: "fixed", 
      top: "80px", 
      left: "50%", 
      transform: "translateX(-50%)", 
      backgroundColor: "rgba(0,0,0,0.75)", 
      color: "white", 
      padding: "12px 24px", 
      borderRadius: "8px",
      zIndex: 1000,
      boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
      animation: "fadeIn 0.3s ease-in-out"
    }}>
      {message}
    </div>
  );
};
