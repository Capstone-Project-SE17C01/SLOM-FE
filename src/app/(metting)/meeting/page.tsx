'use client';

import { useEffect, useState, useRef } from 'react';
import Video, { Room, LocalVideoTrack, RemoteVideoTrack } from 'twilio-video';

export default function Meeting() {
  const [room, setRoom] = useState<Room | null>(null);
  const [status, setStatus] = useState('Chưa kết nối');
  const [hasMediaPermission, setHasMediaPermission] = useState(false);
  const [userName, setUserName] = useState('');
  const [isJoining, setIsJoining] = useState(false);
  const localMediaRef = useRef<HTMLDivElement>(null);
  const remoteMediaRef = useRef<HTMLDivElement>(null);

  const checkMediaPermissions = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: true, 
        audio: true 
      });
      stream.getTracks().forEach(track => track.stop());
      setHasMediaPermission(true);
      return true;
    } catch (error) {
      setStatus('Không thể truy cập camera/microphone. Vui lòng kiểm tra quyền truy cập.');
      setHasMediaPermission(false);
      return false;
    }
  };

  const joinRoom = async () => {
    if (!userName.trim()) {
      setStatus('Vui lòng nhập tên người dùng');
      return;
    }

    if (!hasMediaPermission) {
      const hasPermission = await checkMediaPermissions();
      if (!hasPermission) return;
    }

    setIsJoining(true);
    setStatus('Đang kết nối...');

    try {
      const response = await fetch(`/api/meeting?identity=${encodeURIComponent(userName)}`);
      if (!response.ok) {
        throw new Error('Failed to get token');
      }
      const { token } = await response.json();

      // Connect to the Room with the token and local media
      const room = await Video.connect(token, {
        name: 'MyMeetingRoom',
        audio: true,
        video: { width: 640 }
      });

      setRoom(room);
      setStatus(`Đã kết nối đến phòng: ${room.name} với tên ${userName}`);

      // Handle the LocalParticipant's media
      room.localParticipant.tracks.forEach(publication => {
        if (publication.track && localMediaRef.current && publication.track.kind === 'video') {
          const element = (publication.track as LocalVideoTrack).attach();
          localMediaRef.current.appendChild(element);
        }
      });

      // Handle already connected Participants
      room.participants.forEach(participant => {
        console.log(`Participant "${participant.identity}" is already in the Room`);
        participant.tracks.forEach(publication => {
          if (publication.isSubscribed && publication.track && remoteMediaRef.current && publication.track.kind === 'video') {
            const element = (publication.track as RemoteVideoTrack).attach();
            remoteMediaRef.current.appendChild(element);
          }
        });

        participant.on('trackSubscribed', track => {
          if (remoteMediaRef.current && track.kind === 'video') {
            const element = (track as RemoteVideoTrack).attach();
            remoteMediaRef.current.appendChild(element);
          }
        });
      });

      // Handle newly connected Participants
      room.on('participantConnected', participant => {
        console.log(`Participant "${participant.identity}" connected`);
        setStatus(`Người dùng ${participant.identity} đã tham gia phòng`);

        participant.tracks.forEach(publication => {
          if (publication.isSubscribed && publication.track && remoteMediaRef.current && publication.track.kind === 'video') {
            const element = (publication.track as RemoteVideoTrack).attach();
            remoteMediaRef.current.appendChild(element);
          }
        });

        participant.on('trackSubscribed', track => {
          if (remoteMediaRef.current && track.kind === 'video') {
            const element = (track as RemoteVideoTrack).attach();
            remoteMediaRef.current.appendChild(element);
          }
        });
      });

      // Handle participant disconnection
      room.on('participantDisconnected', participant => {
        console.log(`Participant "${participant.identity}" disconnected`);
        setStatus(`Người dùng ${participant.identity} đã rời phòng`);
      });

      // Handle disconnection
      room.on('disconnected', () => {
        setRoom(null);
        setStatus('Đã ngắt kết nối');
        if (localMediaRef.current) {
          localMediaRef.current.innerHTML = '';
        }
        if (remoteMediaRef.current) {
          remoteMediaRef.current.innerHTML = '';
        }
      });

    } catch (error) {
      console.error('Lỗi khi kết nối phòng:', error);
      setStatus('Lỗi kết nối: ' + (error as Error).message);
    } finally {
      setIsJoining(false);
    }
  };

  const leaveRoom = () => {
    if (room) {
      room.disconnect();
    }
  };

  useEffect(() => {
    checkMediaPermissions();
    return () => {
      if (room) {
        room.disconnect();
      }
    };
  }, [room]);

  return (
    <div style={{ padding: '20px' }}>
      <h1>Meeting Room</h1>
      <p>{status}</p>
      
      {!room ? (
        <div>
          <input
            type="text"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            placeholder="Nhập tên của bạn"
            style={{ padding: '8px', marginRight: '10px' }}
          />
          <button 
            onClick={joinRoom} 
            disabled={!hasMediaPermission || isJoining}
          >
            {isJoining ? 'Đang kết nối...' : 'Tham gia phòng họp'}
          </button>
        </div>
      ) : (
        <button onClick={leaveRoom}>Rời phòng</button>
      )}

      <div style={{ marginTop: '20px' }}>
        <h3>Video của bạn</h3>
        <div ref={localMediaRef} style={{ border: '1px solid #ccc', padding: '10px' }} />
      </div>

      <div style={{ marginTop: '20px' }}>
        <h3>Video người khác</h3>
        <div ref={remoteMediaRef} style={{ border: '1px solid #ccc', padding: '10px' }} />
      </div>
    </div>
  );
}
