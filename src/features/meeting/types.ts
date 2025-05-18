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
}

export interface MeetingRoom {
  id: string;
  name: string;
  description: string;
  duration: number;
  createdAt: string;
  expiresAt: string;
  participants?: {
    id: string;
    name: string;
  }[];
}

export interface ScheduledMeeting {
  id: string;
  name: string;
  description: string;
  date: string;
  time: string;
  duration: number;
  createdAt: string; 
}