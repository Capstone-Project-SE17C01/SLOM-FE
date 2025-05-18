import { addParticipantToZegoRoom, getZegoMeetingRoomById, getZegoRoomTimeLeft } from "@/features/meeting/api";
import { generateRandomID } from "@/services/zego/config";
import { useState, useEffect, useRef, useCallback } from "react";


interface MeetingTimerProps {
  roomId: string;
  onExpired?: () => void;
  onTimeUpdate?: (timeLeft: number) => void;
}

export function useTimer({ roomId, onExpired, onTimeUpdate }: MeetingTimerProps) {
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [isExpired, setIsExpired] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [participantId, setParticipantId] = useState<string | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const heartbeatIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const clearTimers = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    
    if (heartbeatIntervalRef.current) {
      clearInterval(heartbeatIntervalRef.current);
      heartbeatIntervalRef.current = null;
    }
  }, []);

  const startCountdown = useCallback((seconds: number) => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    setTimeLeft(seconds);

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev === null || prev <= 1) {
          clearInterval(timerRef.current!);
          if (prev === 1) {
            setIsExpired(true);
            if (onExpired) onExpired();
          }
          return 0;
        }
        
        if (onTimeUpdate && prev - 1 > 0) onTimeUpdate(prev - 1);
        
        return prev - 1;
      });
    }, 1000);
  }, [onExpired, onTimeUpdate]);

  const checkRoomStatus = useCallback((userId?: string) => {
    if (!roomId) return;
    
    try {
      const room = getZegoMeetingRoomById(roomId);
      
      if (!room || new Date(room.expiresAt) <= new Date()) {
        setIsExpired(true);
        clearTimers();
        if (onExpired) onExpired();
        return;
      }
      
      const participantIdToUse = userId || participantId || generateRandomID(8);
      if (!participantId) {
        setParticipantId(participantIdToUse);
      }
      
      addParticipantToZegoRoom(
        roomId, 
        participantIdToUse, 
        `User-${participantIdToUse.substring(0, 4)}`
      );
      
      const secondsLeft = getZegoRoomTimeLeft(roomId);
      setTimeLeft(secondsLeft);
      
      if (onTimeUpdate) onTimeUpdate(secondsLeft);
      
      startCountdown(secondsLeft);
    } catch (error) {
      console.error('Error in room status check:', error);
    } finally {
      setIsLoading(false);
    }
  }, [roomId, participantId, onExpired, onTimeUpdate, clearTimers, startCountdown]);

  const formatTimeDisplay = useCallback(() => {
    if (timeLeft === null) return '--:--';
    
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }, [timeLeft]);

  useEffect(() => {
    if (!roomId) return;
    
    checkRoomStatus();
    
    heartbeatIntervalRef.current = setInterval(() => {
      checkRoomStatus();
    }, 30000);
    
    return () => {
      clearTimers();
    };
  }, [roomId, checkRoomStatus, clearTimers]);

  return {
    timeLeft,
    isExpired,
    isLoading,
    formatTimeDisplay,
    participantId
  };
}
