"use client";

import React, { useState } from 'react';
import { cn } from "@/utils/cn";
import { useTheme } from "@/contexts/ThemeContext";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

interface RoomCreationModalProps {
  show: boolean;
  onClose: () => void;
  onCreateRoom: (roomName: string, description: string, duration: number) => void;
}

export const RoomCreationModal: React.FC<RoomCreationModalProps> = ({
  show,
  onClose,
  onCreateRoom,
}) => {
  const { isDarkMode } = useTheme();
  const [roomName, setRoomName] = useState('');
  const [description, setDescription] = useState('');
  const [duration, setDuration] = useState(30);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!show) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    
    try {
      await onCreateRoom(roomName, description, duration);
      
      setRoomName('');
      setDescription('');
      setDuration(30);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create room');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <Card className={cn(
        "w-full max-w-md mx-auto",
        isDarkMode ? "bg-gray-800 text-white" : "bg-white"
      )}>
        <CardHeader className="relative pb-2">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Create Room</h3>
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
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="room-name" className="text-sm font-medium block mb-1">
                Room Name
              </label>
              <Input
                id="room-name"
                placeholder="Enter room name"
                value={roomName}
                onChange={(e) => setRoomName(e.target.value)}
                required
                className="w-full"
              />
            </div>

            <div>
              <label htmlFor="description" className="text-sm font-medium block mb-1">
                Description
              </label>
              <Input
                id="description"
                placeholder="Enter description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full"
              />
            </div>
            <div>
              <label htmlFor="duration" className="text-sm font-medium block mb-1">
                Duration
              </label>
              <div className="flex items-center">
                <select
                  id="duration"
                  value={duration}
                  onChange={(e) => setDuration(Number(e.target.value))}
                  className={cn(
                    "w-full p-2 border rounded",
                    isDarkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300"
                  )}
                >
                  <option value="15">15 mins</option>
                  <option value="30">30 mins</option>
                  <option value="45">45 mins</option>
                  <option value="60">1 hour</option>
                  <option value="90">1.5 hours</option>
                  <option value="120">2 hours</option>
                  <option value="180">3 hours</option>
                  <option value="240">4 hours</option>
                  <option value="480">8 hours</option>
                </select>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Meeting will automatically end after the selected duration
              </p>
            </div>
            <div className="pt-4">
              {error && (
                <div className="text-red-500 text-sm mb-2">
                  {error}
                </div>
              )}
              <Button 
                type="submit" 
                className="w-full bg-[#6947A8] hover:bg-[#5a3c96] text-white"
                disabled={isLoading}
              >
                {isLoading ? 'Creating...' : 'Create Room'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
