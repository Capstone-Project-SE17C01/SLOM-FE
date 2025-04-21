"use client";

// Import các hook và thư viện cần thiết từ React và Twilio Video
import { useEffect, useState } from "react";
import Video, { Room, LocalVideoTrack, RemoteVideoTrack } from "twilio-video";
import MeetingLayout from "@/components/layouts/meeting/meeting-layout";
import UserCard from "@/components/ui/user-card";

export default function Meeting() {
  // State lưu thông tin phòng họp
  const [room, setRoom] = useState<Room | null>(null);
  const [status, setStatus] = useState("Chưa kết nối");
  const [hasMediaPermission, setHasMediaPermission] = useState(false);
  const [userName, setUserName] = useState("");
  const [isJoining, setIsJoining] = useState(false);
  const [localVideoTrack, setLocalVideoTrack] =
    useState<LocalVideoTrack | null>(null);
  const [remoteParticipants, setRemoteParticipants] = useState<
    {
      id: string;
      username: string;
      track: RemoteVideoTrack;
      isMicOn: boolean;
    }[]
  >([]);

  // Kiểm tra quyền media
  const checkMediaPermissions = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      stream.getTracks().forEach((t) => t.stop());
      setHasMediaPermission(true);
      return true;
    } catch {
      setStatus(
        "Không thể truy cập camera/microphone. Vui lòng kiểm tra quyền."
      );
      setHasMediaPermission(false);
      return false;
    }
  };

  // Kết nối phòng họp
  const joinRoom = async () => {
    if (!userName.trim()) return setStatus("Vui lòng nhập tên người dùng");
    if (!hasMediaPermission && !(await checkMediaPermissions())) return;

    setIsJoining(true);
    setStatus("Đang kết nối...");

    try {
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
      setStatus(`Đã kết nối đến phòng: ${connectedRoom.name}`);

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

      // Khi participant rời đi
      connectedRoom.on("participantDisconnected", (participant) => {
        setRemoteParticipants((prev) =>
          prev.filter((p) => p.id !== participant.sid)
        );
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

  useEffect(() => {
    checkMediaPermissions();
    return () => {
      room?.disconnect();
    };
  }, [room]);

  // Giao diện
  return (
    <div className="p-4 space-y-4 h-screen bg-gray-800">
      <h1 className="text-2xl font-bold">Meeting Room</h1>
      <p>{status}</p>

      {!room ? (
        <div className="flex items-center space-x-2">
          <input
            type="text"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            placeholder="Nhập tên của bạn"
            className="p-2 border border-gray-300 rounded-md"
          />
          <button
            onClick={joinRoom}
            disabled={!hasMediaPermission || isJoining}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
          >
            {isJoining ? "Đang kết nối..." : "Tham gia phòng họp"}
          </button>
        </div>
      ) : (
        <button
          onClick={leaveRoom}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md"
        >
          Rời phòng
        </button>
      )}

      <div className="mt-6">
        <h3 className="text-lg font-semibold mb-2">Thành viên</h3>
        <MeetingLayout numberOfParticipants={remoteParticipants.length + 1}>
          {localVideoTrack && (
            <UserCard
              track={localVideoTrack}
              username={userName || "Bạn"}
              isMicOn={true}
            />
          )}
          {remoteParticipants.map((p) => (
            <UserCard
              key={p.id}
              track={p.track}
              username={p.username}
              isMicOn={p.isMicOn}
            />
          ))}
        </MeetingLayout>
      </div>
    </div>
  );
}
