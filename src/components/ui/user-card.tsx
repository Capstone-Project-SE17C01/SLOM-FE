"use client";

import { useEffect, useRef } from 'react';
import { LocalVideoTrack, RemoteVideoTrack } from 'twilio-video';
import { MicOff } from 'lucide-react';
import { cn } from '@/utils/cn';

interface UserCardProps {
  track: LocalVideoTrack | RemoteVideoTrack;
  username: string;
  isMicOn: boolean;
  isDarkMode?: boolean;
}

export default function UserCard({ track, username, isMicOn, isDarkMode = false }: UserCardProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current && track) {
      track.attach(videoRef.current);
      return () => {
        track.detach();
      };
    }
  }, [track]);

  return (
    <div className={cn(
      "relative rounded-lg overflow-hidden border h-full shadow-lg group",
      isDarkMode ? "border-gray-700 bg-gray-800" : "border-gray-200 bg-gray-100"
    )}>
      <video
        ref={videoRef}
        autoPlay
        playsInline
        className="w-full h-full object-cover"
      />
      
      <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/70 to-transparent">
        <div className="flex justify-between items-center">
          <span className="font-medium text-white">{username}</span>
          {!isMicOn && (
            <div className="bg-red-600 rounded-full p-1">
              <MicOff size={16} className="text-white" />
            </div>
          )}
        </div>
      </div>
      
      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
        <div className="bg-black/60 rounded-lg p-2 hidden group-hover:block">
        </div>
      </div>
    </div>
  );
}
