import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";
import { MeetingRoom, ScheduledMeeting } from "./types";
import { generateRandomID, generateZegoToken } from "@/services/zego/config";

const SCHEDULED_MEETINGS_STORAGE_KEY = 'slom_scheduled_meetings';

const MEETING_ROOMS_STORAGE_KEY = 'slom_meeting_rooms';

export function getUrlParams(url?: string): URLSearchParams {
    if (typeof window === "undefined") return new URLSearchParams("");

    url = url || window.location.href;
    const urlParts = url.split("?");
    if (urlParts.length < 2) return new URLSearchParams("");
    return new URLSearchParams(urlParts[1]);
}

export function joinZegoRoom(
    element: HTMLDivElement,
    roomID: string,
    onJoinRoom?: () => void
): ReturnType<typeof ZegoUIKitPrebuilt.create> | undefined {
    try {
        const kitToken = generateZegoToken(roomID);

        const zp = ZegoUIKitPrebuilt.create(kitToken);

        zp.joinRoom({
            container: element,
            sharedLinks: [
                {
                    name: "Personal link",
                    url:
                        typeof window !== "undefined"
                            ? `${window.location.protocol}//${window.location.host}${window.location.pathname}?roomID=${roomID}`
                            : "",
                },
            ],
            scenario: {
                mode: ZegoUIKitPrebuilt.GroupCall,
            },
            onJoinRoom: onJoinRoom
        });

        return zp;
    } catch (error) {
        console.error("Failed to join meeting:", error);
        return undefined;
    }
}

export function createZegoMeetingRoom(params: {
    name: string;
    description?: string;
    duration: number;
}): MeetingRoom {
    const { name, description = '', duration } = params;

    const roomId = generateRandomID(6);

    const now = new Date();
    const expiresAt = new Date(now.getTime() + duration * 60 * 1000);

    const newRoom: MeetingRoom = {
        id: roomId,
        name,
        description,
        duration,
        createdAt: now.toISOString(),
        expiresAt: expiresAt.toISOString(),
        participants: []
    };

    const existingRooms = getZegoMeetingRooms();
    const updatedRooms = [...existingRooms, newRoom];
    saveRoomsToStorage(updatedRooms);

    return newRoom;
}

export function getZegoMeetingRooms(): MeetingRoom[] {
    if (typeof window === 'undefined') return [];
    try {
        const storedRooms = localStorage.getItem(MEETING_ROOMS_STORAGE_KEY);

        if (!storedRooms) return [];

        const rooms: MeetingRoom[] = JSON.parse(storedRooms);
        const now = new Date();

        const activeRooms = rooms.filter(room =>
            new Date(room.expiresAt) > now
        );

        if (activeRooms.length !== rooms.length) {
            saveRoomsToStorage(activeRooms);
        }

        return activeRooms;
    } catch (error) {
        console.error("Error getting meeting rooms:", error);
        return [];
    }
}

export function getZegoMeetingRoomById(roomId: string): MeetingRoom | undefined {
    const rooms = getZegoMeetingRooms();
    return rooms.find(room => room.id === roomId);
}

export function addParticipantToZegoRoom(roomId: string, participantId: string, participantName: string): boolean {
    const rooms = getZegoMeetingRooms();
    const roomIndex = rooms.findIndex(room => room.id === roomId);

    if (roomIndex === -1) return false;

    if (!rooms[roomIndex].participants) {
        rooms[roomIndex].participants = [];
    }

    const participantExists = rooms[roomIndex].participants!.some(p => p.id === participantId);

    if (!participantExists) {
        rooms[roomIndex].participants!.push({ id: participantId, name: participantName });
        saveRoomsToStorage(rooms);
    }

    return true;
}

export function getZegoRoomTimeLeft(roomId: string): number {
    const room = getZegoMeetingRoomById(roomId);
    if (!room) return 0;

    const now = new Date();
    const expiresAt = new Date(room.expiresAt);

    const timeLeftMs = expiresAt.getTime() - now.getTime();
    return Math.max(0, Math.floor(timeLeftMs / 1000));
}

function saveRoomsToStorage(rooms: MeetingRoom[]): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(MEETING_ROOMS_STORAGE_KEY, JSON.stringify(rooms));
}


function generateMeetingId(): string {
    return 'meeting_' + Math.random().toString(36).substr(2, 9);
}

export function createScheduledMeeting(params: {
    name: string;
    description: string;
    date: string;
    time: string;
    duration: number;
}): ScheduledMeeting {
    const { name, description, date, time, duration } = params;

    const meeting: ScheduledMeeting = {
        id: generateMeetingId(),
        name,
        description,
        date,
        time,
        duration,
        createdAt: new Date().toISOString()
    };

    const existingMeetings = getScheduledMeetings();
    const updatedMeetings = [...existingMeetings, meeting];
    saveScheduledMeetingsToStorage(updatedMeetings);

    return meeting;
}

export function getScheduledMeetings(): ScheduledMeeting[] {
    if (typeof window === 'undefined') return [];

    try {
        const storedMeetings = localStorage.getItem(SCHEDULED_MEETINGS_STORAGE_KEY);
        if (!storedMeetings) return [];

        return JSON.parse(storedMeetings);
    } catch (error) {
        console.error("Error getting scheduled meetings:", error);
        return [];
    }
}

export function getScheduledMeetingsForDate(date: string): ScheduledMeeting[] {
    const meetings = getScheduledMeetings();
    return meetings.filter(meeting => meeting.date === date);
}

export function getScheduledMeetingsForMonth(year: number, month: number): ScheduledMeeting[] {
    const meetings = getScheduledMeetings();

    const monthStr = month < 10 ? `0${month}` : `${month}`;

    return meetings.filter(meeting => {
        const meetingDate = meeting.date.split('-');
        return meetingDate[0] === year.toString() && meetingDate[1] === monthStr;
    });
}

function saveScheduledMeetingsToStorage(meetings: ScheduledMeeting[]): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(SCHEDULED_MEETINGS_STORAGE_KEY, JSON.stringify(meetings));
}
