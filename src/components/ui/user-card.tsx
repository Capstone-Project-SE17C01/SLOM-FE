// 🧱 components/ui/UserCard.tsx
"use client";

import { useEffect, useRef } from "react";
import { LocalVideoTrack, RemoteVideoTrack } from "twilio-video";
import { Mic, MicOff } from "lucide-react";

interface UserCardProps {
  track: LocalVideoTrack | RemoteVideoTrack;
  username: string;
  isMicOn: boolean;
}

export default function UserCard({ track, username, isMicOn }: UserCardProps) {
  const videoRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (track && videoRef.current) {
      const element = track.attach();
      element.className = "w-full h-full object-cover rounded-md";
      videoRef.current.innerHTML = ""; // Clear trước khi attach mới
      videoRef.current.appendChild(element);
    }

    return () => {
      track.detach().forEach((el) => el.remove());
    };
  }, [track]);

  return (
    <div className="rounded-xl overflow-hidden shadow-md bg-gray-500 text-white p-2 flex flex-col items-center">
      <div
        ref={videoRef}
        className="w-full h-full bg-black rounded-md mb-2 flex items-center justify-center"
      />
      <div className="flex justify-between items-center w-full px-2">
        <span className="text-sm font-medium truncate">{username}</span>
        {isMicOn ? (
          <Mic size={16} />
        ) : (
          <MicOff size={16} className="text-red-500" />
        )}
      </div>
    </div>
  );
}
