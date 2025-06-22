import { List } from "lodash";

export interface FolderSelectionModalProps {
  show: boolean;
  folderName: string;
  customFolderName: string;
  setCustomFolderName: (name: string) => void;
  onSelect: (folder: string) => void;
  onCustomSubmit: () => void;
  onClose: () => void;
}

export interface JoinMeetingModalProps {
  show: boolean;
  onClose: () => void;
  onJoinRoom: (roomCode: string) => void;
}

export interface ScheduleMeetingModalProps {
  show: boolean;
  onClose: () => void;
  onScheduleMeeting: (details: {
    name: string;
    description: string;
    date: string;
    time: string;
    duration: number;
  }) => void;
  meetingId?: string;
}

export interface RoomCreationModalProps {
  show: boolean;
  onClose: () => void;
  onCreateRoom: (roomName: string, description: string, duration: number) => void;
}

export interface MeetingEditModalProps {
  show: boolean;
  meeting?: MeetingDetail;
  onClose: () => void;
  onUpdateMeeting: (details: UpdateMeetingRequest) => void;
}

export interface Meeting {
  id: string;
  title: string;
  description: string;
  hostId: string;
  hostName: string;
  participantCount: number;
  startTime: string;
  endTime?: string;
  status: string;
  isPrivate: boolean;
  isHost?: boolean;
  guestCode?: string;
}

export interface ScheduledMeeting {
  id: string;
  title: string;
  description: string;
  hostName: string;
  startTime: string;
  endTime?: string;
  status: string;
  guestCode?: string;
}

export interface MeetingDetail {
  id: string;
  title: string;
  description: string;
  hostId: string;
  hostName: string;
  participants: {
    userId: string;
    name: string;
    joinTime: string;
    leaveTime?: string;
  }[];
  startTime: string;
  endTime?: string;
  status: string;
  isPrivate: boolean;
  guestCode?: string;
}

export interface CreateMeetingRequest {
  title: string;
  description: string;
  isImmediate: boolean;
  startTime?: string;
  duration?: number;
  isPrivate: boolean;
  userId: string;
}

export interface CreateMeetingResponse {
  id: string;
  title: string;
  description: string;
  startTime: string;
  endTime?: string;
  status: string;
  isPrivate: boolean;
  guestCode?: string;
}

export interface UpdateMeetingRequest {
  title?: string;
  description?: string;
  startTime?: string;
  endTime?: string;
  status?: string;
  maxParticipants?: number;
  userId: string;
}


export interface LeaveMeetingRequest {
  userId: string;
}

export interface AddRecordingRequest {
  storagePath: string;
  duration?: number;
  userId: string;
}

export interface Recording {
  id: string;
  meetingId: string;
  meetingTitle?: string;
  storagePath: string;
  duration?: number;
  processed: boolean;
  transcription?: string;
  createdAt: string;
}

export interface SendMeetingEmailDto {
  recipientEmails: string[];
  senderName: string;
  customMessage?: string;
}

export interface MeetingInvitation {
  meetingId: string;
  email: List<string>;
}