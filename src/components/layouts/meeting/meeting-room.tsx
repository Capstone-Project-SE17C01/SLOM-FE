"use client";

import React from 'react';
import { cn } from "@/utils/cn";
import { useTheme } from "@/contexts/ThemeContext";
import { Button } from "@/components/ui/button";

export interface MeetingRoomGridProps {
  rooms: Array<{
    id: string;
    name: string;
    participantCount: number;
    description?: string;
    duration?: number;
  }>;
  onRoomClick: (roomId: string) => void;
}

export const MeetingRoomGrid: React.FC<MeetingRoomGridProps> = ({
  rooms,
  onRoomClick,
}) => {
  const { isDarkMode } = useTheme();
  
  const renderCard = (room: {
    id: string;
    name: string;
    participantCount: number;
    description?: string;
    duration?: number;
  }) => {
    return (
      <div 
        key={room.id}
        className={cn(
          "border rounded-lg cursor-pointer hover:shadow-md transition-all group",
          isDarkMode ? "border-gray-700 hover:bg-gray-800" : "border-gray-200 hover:bg-gray-50"
        )}
        onClick={() => onRoomClick(room.id)}
      >
        <div className="aspect-square relative overflow-hidden flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-t-lg">
          <div className="h-20 w-20 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
            <svg 
              className="h-10 w-10 text-gray-400" 
              xmlns="http://www.w3.org/2000/svg" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
        </div>
        <div className="p-3">
          <h3 className="font-medium mb-1 text-center">{room.name}</h3>
          <p className={cn(
            "text-sm text-center",
            isDarkMode ? "text-gray-400" : "text-gray-500"
          )}>
            {room.participantCount} participants
          </p>
          
          {room.description && (
            <p className={cn(
              "text-xs text-center mt-1 line-clamp-1",
              isDarkMode ? "text-gray-400" : "text-gray-500"
            )}>
              {room.description}
            </p>
          )}
          
          {room.duration && (
            <div className="flex items-center justify-center mt-1">
              <span className={cn(
                "text-xs px-2 py-0.5 rounded-full",
                isDarkMode ? "bg-gray-700 text-gray-300" : "bg-gray-100 text-gray-700"
              )}>
                {room.duration < 60 ? `${room.duration}m` : `${Math.floor(room.duration/60)}h${room.duration%60 ? ` ${room.duration%60}m` : ''}`}
              </span>
            </div>
          )}
          
          <div className="mt-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full border-[#6947A8] text-[#6947A8] hover:bg-[#6947A8] hover:text-white"
            >
              Join
            </Button>
          </div>
        </div>
      </div>
    );
  };
  
  return (
    <div className={cn(
      "p-6 rounded-lg border",
      isDarkMode ? "bg-gray-800/50 border-gray-700" : "bg-white border-gray-200"
    )}>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
        {rooms.map(room => renderCard(room))}
      </div>
    </div>
  );
};

export interface MeetingRoomActionsProps {
  onStartMeeting: () => void;
  onJoinMeeting: () => void;
  onScheduleMeeting: () => void;
  disableStart?: boolean;
  disableJoin?: boolean;
  disableSchedule?: boolean;
  disableReason?: string;
}

export const MeetingRoomActions: React.FC<MeetingRoomActionsProps> = ({
  onStartMeeting,
  onJoinMeeting,
  onScheduleMeeting,
  disableStart = false,
  disableJoin = false,
  disableSchedule = false,
  disableReason = "",
}) => {
  const { isDarkMode } = useTheme();

  return (
    <div className="space-y-3 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
      <Button
        onClick={onStartMeeting}
        className="w-full text-left flex items-center py-5 px-4 bg-transparent hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700 rounded-lg"
        variant="outline"
        disabled={disableStart}
        title={disableStart && disableReason ? disableReason : undefined}
      >
        <div className="flex-shrink-0 mr-4 h-10 w-10 flex items-center justify-center bg-blue-100 dark:bg-blue-900/30 rounded-full">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M15 10L19.5528 7.72361C20.2177 7.39116 21 7.87465 21 8.61803V15.382C21 16.1253 20.2177 16.6088 19.5528 16.2764L15 14M5 18H13C14.1046 18 15 17.1046 15 16V8C15 6.89543 14.1046 6 13 6H5C3.89543 6 3 6.89543 3 8V16C3 17.1046 3.89543 18 5 18Z" stroke="#0066ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <div className="flex-1">
          <div className="font-medium text-base">Start a meeting</div>
          <div className={cn(
            "text-xs",
            isDarkMode ? "text-gray-400" : "text-gray-500"
          )}>Create a new meeting</div>
        </div>
      </Button>

      <Button
        onClick={onJoinMeeting}
        className="w-full text-left flex items-center py-5 px-4 bg-transparent hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700 rounded-lg"
        variant="outline"
        disabled={disableJoin}
        title={disableJoin && disableReason ? disableReason : undefined}
      >
        <div className="flex-shrink-0 mr-4 h-10 w-10 flex items-center justify-center bg-green-100 dark:bg-green-900/30 rounded-full">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M13 7L18 12M18 12L13 17M18 12H6" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <div className="flex-1">
          <div className="font-medium text-base">Join a meeting</div>
          <div className={cn(
            "text-xs",
            isDarkMode ? "text-gray-400" : "text-gray-500"
          )}>Join using meeting code or link</div>
        </div>
      </Button>

      <Button
        onClick={onScheduleMeeting}
        className="w-full text-left flex items-center py-5 px-4 bg-transparent hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700 rounded-lg"
        variant="outline"
        disabled={disableSchedule}
        title={disableSchedule && disableReason ? disableReason : undefined}
      >
        <div className="flex-shrink-0 mr-4 h-10 w-10 flex items-center justify-center bg-purple-100 dark:bg-purple-900/30 rounded-full">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M8 7V3M16 7V3M7 11H17M5 21H19C20.1046 21 21 20.1046 21 19V7C21 5.89543 20.1046 5 19 5H5C3.89543 5 3 5.89543 3 7V19C3 20.1046 3.89543 21 5 21Z" stroke="#6947A8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <div className="flex-1">
          <div className="font-medium text-base">Schedule a meeting</div>
          <div className={cn(
            "text-xs",
            isDarkMode ? "text-gray-400" : "text-gray-500"
          )}>Plan a meeting for later</div>
        </div>
      </Button>
    </div>
  );
};
