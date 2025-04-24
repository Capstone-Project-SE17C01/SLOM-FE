"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Video, { Room, LocalVideoTrack, RemoteVideoTrack, createLocalVideoTrack } from "twilio-video";
import MeetingLayout from "@/components/layouts/meeting/meeting-layout";
import UserCard from "@/components/ui/user-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTheme } from "@/contexts/ThemeContext";
import { cn } from "@/utils/cn";
import { VideoIcon, VideoOffIcon, PhoneIcon, Mic as MicrophoneIcon, MicOff as MicrophoneOffIcon } from "lucide-react";

export default function Meeting() {
  const theme = useTheme();
  
  let isDarkMode = false;
  try {
    isDarkMode = theme?.isDarkMode ?? false;
  } catch (error) {
    console.error("Error getting theme context:", error);
  }
  
  const [room, setRoom] = useState<Room | null>(null);
  const [status, setStatus] = useState("Chưa kết nối");
  const [hasMediaPermission, setHasMediaPermission] = useState(false);
  const [userName, setUserName] = useState("");
  const [isJoining, setIsJoining] = useState(false);
  const [localVideoTrack, setLocalVideoTrack] = useState<LocalVideoTrack | null>(null);
  const [previewTrack, setPreviewTrack] = useState<LocalVideoTrack | null>(null);
  const [remoteParticipants, setRemoteParticipants] = useState<
    {
      id: string;
      username: string;
      track: RemoteVideoTrack;
      isMicOn: boolean;
    }[]
  >([]);
  const [isMicOn, setIsMicOn] = useState(true);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const previewRef = useRef<HTMLVideoElement>(null);
  const previewStarted = useRef(false);

  // Optimize preview camera by creating track once
  const startVideoPreview = async () => {
    // Prevent multiple preview attempts
    if (previewStarted.current) return;
    previewStarted.current = true;
    
    try {
      // Create local video track directly using Twilio's method
      const track = await createLocalVideoTrack({
        width: 640,
        height: 480,
        frameRate: 24 // Lower frame rate for smoother preview
      });
      
      setPreviewTrack(track);
      setHasMediaPermission(true);
      
      // Check if audio is also accessible
      await navigator.mediaDevices.getUserMedia({ audio: true })
        .then(stream => {
          stream.getTracks().forEach(t => t.stop());
        });
      
      return true;
    } catch (err) {
      console.error("Camera preview error:", err);
      setStatus("Không thể truy cập camera/microphone. Vui lòng kiểm tra quyền.");
      setHasMediaPermission(false);
      previewStarted.current = false;
      return false;
    }
  };

  // Attach preview track to video element
  useEffect(() => {
    if (previewTrack && previewRef.current) {
      // Clean up any existing attachments first to prevent duplicate
      const existingElements = previewTrack.detach();
      existingElements.forEach(element => element.remove());
      
      // Attach to our ref
      previewTrack.attach(previewRef.current);
    }
    
    return () => {
      if (previewTrack) {
        previewTrack.detach();
      }
    };
  }, [previewTrack]);

  // Start preview when component mounts
  useEffect(() => {
    startVideoPreview();
    return () => {
      if (previewTrack) {
        previewTrack.detach();
        previewTrack.stop();
        previewStarted.current = false;
      }
    };
  }, [previewTrack]);

  // Kiểm tra quyền media - now just checks permission without creating preview
  const checkMediaPermissions = useCallback(async () => {
    if (hasMediaPermission) return true;
    
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      stream.getTracks().forEach((t) => t.stop());
      setHasMediaPermission(true);
      return true;
    } catch {
      setStatus("Không thể truy cập camera/microphone. Vui lòng kiểm tra quyền.");
      setHasMediaPermission(false);
      return false;
    }
  }, [hasMediaPermission, setStatus]);

  // Kết nối phòng họp
  const joinRoom = async () => {
    if (!userName.trim()) return setStatus("Vui lòng nhập tên người dùng");
    if (!hasMediaPermission && !(await checkMediaPermissions())) return;

    setIsJoining(true);
    setStatus("Đang kết nối...");

    try {
      // Properly clean up preview track before connecting
      if (previewTrack) {
        previewTrack.detach();
        previewTrack.stop();
        previewStarted.current = false;
      }

      const res = await fetch(
        `/api/meeting?identity=${encodeURIComponent(userName)}`
      );
      const { token } = await res.json();
      const connectedRoom = await Video.connect(token, {
        name: "MyMeetingRoom",
        audio: true,
        video: { width: 640 },
      });

      setRoom(connectedRoom);
      setStatus(`Đã kết nối đến phòng: ${connectedRoom.name} [${connectedRoom.participants.size} participants]`);

      // Lấy local video track và lưu lại
      connectedRoom.localParticipant.videoTracks.forEach((publication) => {
        if (publication.track.kind === "video") {
          setLocalVideoTrack(publication.track as LocalVideoTrack);
        }
      });

      // Hiển thị các participant đã ở sẵn trong phòng
      connectedRoom.participants.forEach((participant) => {
        participant.tracks.forEach((publication) => {
          if (publication.isSubscribed && publication.track?.kind === "video") {
            setRemoteParticipants((prev) => [
              ...prev,
              {
                id: participant.sid,
                username: participant.identity,
                track: publication.track as RemoteVideoTrack,
                isMicOn: Array.from(participant.audioTracks.values()).some(
                  (pub) => pub.track?.isEnabled
                ),
              },
            ]);
          }
        });

        participant.on("trackSubscribed", (track) => {
          if (track.kind === "video") {
            setRemoteParticipants((prev) => [
              ...prev,
              {
                id: participant.sid,
                username: participant.identity,
                track: track as RemoteVideoTrack,
                isMicOn: Array.from(participant.audioTracks.values()).some(
                  (pub) => pub.track?.isEnabled
                ),
              },
            ]);
          }
        });
      });

      // Khi participant mới kết nối
      connectedRoom.on("participantConnected", (participant) => {
        console.log(`Participant ${participant.identity} connected`);
        
        // Update status to show participant count
        setStatus(`Đã kết nối đến phòng: ${connectedRoom.name} [${connectedRoom.participants.size + 1} participants]`);
        
        participant.on("trackSubscribed", (track) => {
          if (track.kind === "video") {
            setRemoteParticipants((prev) => [
              ...prev,
              {
                id: participant.sid,
                username: participant.identity,
                track: track as RemoteVideoTrack,
                isMicOn: Array.from(participant.audioTracks.values()).some(
                  (pub) => pub.track?.isEnabled
                ),
              },
            ]);
          }
        });
      });

      // Khi participant rời đi - improved handler for immediate UI updates
      connectedRoom.on("participantDisconnected", (participant) => {
        console.log(`Participant ${participant.identity} disconnected`);
        
        // Immediate state update with functional update pattern
        setRemoteParticipants(prev => 
          prev.filter(p => p.id !== participant.sid)
        );
        
        // Force a re-render after a small delay to ensure layout updates
        setTimeout(() => {
          setStatus(current => `${current.split(' [')[0]} [${connectedRoom.participants.size} participants]`);
        }, 100);
      });

      // Khi ngắt kết nối khỏi phòng
      connectedRoom.on("disconnected", () => {
        setRoom(null);
        setStatus("Đã ngắt kết nối");
        setLocalVideoTrack(null);
        setRemoteParticipants([]);
      });
    } catch (err) {
      setStatus("Lỗi kết nối: " + (err as Error).message);
    } finally {
      setIsJoining(false);
    }
  };

  // Thoát phòng
  const leaveRoom = () => {
    if (room) room.disconnect();
  };

  // Toggle microphone
  const toggleMic = () => {
    if (room) {
      room.localParticipant.audioTracks.forEach(publication => {
        if (publication.track) {
          if (isMicOn) {
            publication.track.disable();
          } else {
            publication.track.enable();
          }
        }
      });
      setIsMicOn(!isMicOn);
    }
  };

  // Toggle video
  const toggleVideo = () => {
    if (room) {
      room.localParticipant.videoTracks.forEach(publication => {
        if (publication.track) {
          if (isVideoOn) {
            publication.track.disable();
          } else {
            publication.track.enable();
          }
        }
      });
      setIsVideoOn(!isVideoOn);
    }
  };

  useEffect(() => {
    checkMediaPermissions();
    return () => {
      if (previewTrack) {
        previewTrack.detach();
        previewTrack.stop();
      }
      room?.disconnect();
    };
  }, [previewTrack, room, checkMediaPermissions]);

  // Add an effect to handle layout changes when participants list changes
  useEffect(() => {
    if (room && remoteParticipants) {
      console.log(`Layout should update: ${remoteParticipants.length + 1} participants total`);
    }
  }, [remoteParticipants, room]);

  // Giao diện
  return (
    <div className={cn(
      "flex flex-col h-screen",
      isDarkMode ? "bg-gray-900 text-white" : "bg-white text-gray-800"
    )}>
      {/* Header */}
      <div className={cn(
        "py-3 px-6 flex justify-between items-center shadow-lg border-b",
        isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
      )}>
        <div className="flex items-center space-x-2">
          <span className="text-xl font-bold text-yellow-500">SLOM</span>
          <span className={cn("text-opacity-50", isDarkMode ? "text-gray-400" : "text-gray-500")}>|</span>
          <span className="text-lg">{room ? room.name : "Meeting Room"}</span>
        </div>
        <div className={cn(
          "text-sm",
          isDarkMode ? "text-gray-400" : "text-gray-500"
        )}>
          {status}
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 overflow-hidden flex flex-col p-4">
        {!room ? (
          <div className="flex flex-col items-center justify-center h-full max-w-md mx-auto w-full">
            <div className={cn(
              "p-8 rounded-xl shadow-xl w-full border",
              isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
            )}>
              <h2 className="text-2xl font-bold mb-6 text-center">Join Meeting</h2>
              
              {/* Camera preview */}
              <div className={cn(
                "aspect-video mb-4 rounded-lg overflow-hidden relative",
                isDarkMode ? "bg-gray-700" : "bg-gray-100"
              )}>
                <video
                  ref={previewRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover"
                />
                
                {!hasMediaPermission && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                    <button
                      onClick={startVideoPreview}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
                    >
                      Enable Camera
                    </button>
                  </div>
                )}
                
                {hasMediaPermission && (
                  <div className={cn(
                    "absolute bottom-2 left-2 px-2 py-1 text-xs rounded",
                    isDarkMode ? "bg-black/50 text-white" : "bg-white/50 text-black"
                  )}>
                    Preview
                  </div>
                )}
              </div>
              
              <div className="space-y-4">
                <div>
                  <label htmlFor="username" className={cn(
                    "text-sm block mb-1",
                    isDarkMode ? "text-gray-400" : "text-gray-600"
                  )}>
                    Your Name
                  </label>
                  <Input
                    id="username"
                    type="text"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    placeholder="Enter your name"
                    className={cn(
                      "w-full",
                      isDarkMode 
                        ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400" 
                        : "bg-white border-gray-300 text-black placeholder-gray-500"
                    )}
                  />
                </div>
                <Button
                  onClick={joinRoom}
                  disabled={!hasMediaPermission || isJoining}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                >
                  {isJoining ? "Connecting..." : "Join Meeting"}
                </Button>
                
                {!hasMediaPermission && (
                  <p className="text-red-500 text-sm mt-2">
                    Please allow access to camera and microphone
                  </p>
                )}
              </div>
            </div>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-hidden relative">
              <MeetingLayout numberOfParticipants={remoteParticipants.length + 1}>
                {localVideoTrack && (
                  <UserCard
                    track={localVideoTrack}
                    username={userName || "You"}
                    isMicOn={isMicOn}
                    isDarkMode={isDarkMode}
                  />
                )}
                {remoteParticipants.map((p) => (
                  <UserCard
                    key={p.id}
                    track={p.track}
                    username={p.username}
                    isMicOn={p.isMicOn}
                    isDarkMode={isDarkMode}
                  />
                ))}
              </MeetingLayout>
            </div>

            {/* Meeting controls */}
            <div className={cn(
              "mt-4 flex justify-center py-4 rounded-lg",
              isDarkMode ? "bg-gray-800" : "bg-gray-100"
            )}>
              <div className="flex items-center space-x-4">
                <Button
                  onClick={toggleMic}
                  variant="outline"
                  className={cn(
                    "rounded-full p-3 h-12 w-12",
                    isMicOn 
                      ? (isDarkMode ? "bg-gray-700" : "bg-white border-gray-300") 
                      : "bg-red-600 hover:bg-red-700 border-red-600"
                  )}
                >
                  {isMicOn ? <MicrophoneIcon size={20} /> : <MicrophoneOffIcon size={20} />}
                </Button>
                
                <Button
                  onClick={toggleVideo}
                  variant="outline"
                  className={cn(
                    "rounded-full p-3 h-12 w-12",
                    isVideoOn 
                      ? (isDarkMode ? "bg-gray-700" : "bg-white border-gray-300") 
                      : "bg-red-600 hover:bg-red-700 border-red-600"
                  )}
                >
                  {isVideoOn ? <VideoIcon size={20} /> : <VideoOffIcon size={20} />}
                </Button>
                
                <Button
                  onClick={leaveRoom}
                  className="bg-red-600 hover:bg-red-700 rounded-full p-3 h-12 w-12"
                >
                  <PhoneIcon size={20} />
                </Button>
              </div>
            </div>
          </>
        )}
      </div>
      
      {/* Participants info panel */}
      {room && remoteParticipants.length > 0 && (
        <div className={cn(
          "hidden md:block absolute right-0 top-16 p-4 rounded-l-lg shadow-lg border-l border-t border-b",
          isDarkMode 
            ? "bg-gray-800 border-gray-700 text-gray-300" 
            : "bg-white border-gray-200 text-gray-700"
        )}>
          <h3 className="text-lg font-semibold mb-2">Participants ({remoteParticipants.length + 1})</h3>
          <ul className="space-y-2">
            <li className="flex items-center space-x-2">
              <div className="w-2 h-2 rounded-full bg-green-500"></div>
              <span>{userName || "You"} (You)</span>
            </li>
            {remoteParticipants.map(p => (
              <li key={p.id} className="flex items-center space-x-2">
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                <span>{p.username}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
