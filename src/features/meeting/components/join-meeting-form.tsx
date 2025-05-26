"use client";

import React, { useState } from 'react';
import { cn } from "@/utils/cn";
import { useTheme } from "@/contexts/ThemeContext";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { JoinMeetingModalProps } from '../types';

export const JoinMeetingModal: React.FC<JoinMeetingModalProps> = ({
  show,
  onClose,
  onJoinRoom,
}) => {
  const { isDarkMode } = useTheme();
  const [roomCode, setRoomCode] = useState('');

  if (!show) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onJoinRoom(roomCode);
    setRoomCode('');
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <Card className={cn(
        "w-full max-w-md mx-auto",
        isDarkMode ? "bg-gray-800 text-white" : "bg-white"
      )}>
        <CardHeader className="relative border-b">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Join Meeting</h3>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={onClose} 
              className="absolute right-2 top-2"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="room-code" className="text-sm font-medium block mb-2">
                Room Code
              </label>
              <Input
                id="room-code"
                placeholder="Enter room code"
                value={roomCode}
                onChange={(e) => setRoomCode(e.target.value)}
                required
                className="w-full"
              />
              <p className={cn(
                "mt-2 text-xs",
                isDarkMode ? "text-gray-400" : "text-gray-500"
              )}>
                Enter the code or link shared with you to join the meeting
              </p>
            </div>

            <div className="pt-4">
              <Button 
                type="submit" 
                className="w-full bg-[#6947A8] hover:bg-[#5a3c96] text-white"
              >
                Join Meeting
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
