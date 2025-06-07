"use client";

import { generateRandomID } from "@/services/zego/config";
import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";
import { useSearchParams, useRouter } from "next/navigation";
import React, { useEffect, useState, useCallback } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { useLeaveMeetingMutation } from "@/features/meeting/api";

const MeetingPage = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const roomIDFromUrl = searchParams.get("roomID");
    
    const [roomID, setRoomID] = useState<string>("");
    const [token, setToken] = useState<string | null>(null);
    const [error, setError] = useState<string>("");

    const userInfo = useSelector((state: RootState) => state.auth.userInfo);
    const [leaveMeeting] = useLeaveMeetingMutation();

    useEffect(() => {
        const id = roomIDFromUrl || generateRandomID(5);
        setRoomID(id);
        if (!roomIDFromUrl) {
            router.replace(`/meeting?roomID=${id}`);
        }
    }, [roomIDFromUrl, router]);

    useEffect(() => {
        if (!roomID || !userInfo) return;

        const fetchToken = async () => {
            try {
                const response = await fetch('/api/zego-token', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ roomID }),
                });

                if (!response.ok) {
                    const { message } = await response.json();
                    throw new Error(message || 'Failed to fetch token');
                }

                const { token: newToken } = await response.json();
                setToken(newToken);
                setError("");
            } catch (err) {
                console.error(err);
                if (err instanceof Error) {
                    setError(err.message);
                } else {
                    setError("An unknown error occurred while fetching the token.");
                }
            }
        };

        fetchToken();
    }, [roomID, userInfo]);

    const handleLeaveRoom = useCallback(() => {
        if (userInfo?.id && roomID) {
            leaveMeeting({
                id: roomID,
                request: { userId: userInfo.id }
            });
        }
        router.push('/');
    }, [leaveMeeting, roomID, userInfo, router]);

    const meetingContainerRef = useCallback((element: HTMLDivElement | null) => {
        if (element && token && userInfo?.id && roomID) {
            const zp = ZegoUIKitPrebuilt.create(token);
            zp.joinRoom({
                container: element,
                sharedLinks: [{
                    name: "Copy link",
                    url: `${window.location.protocol}//${window.location.host}${window.location.pathname}?roomID=${roomID}`,
                }],
                scenario: {
                    mode: ZegoUIKitPrebuilt.GroupCall,
                },
                onLeaveRoom: handleLeaveRoom,
                showScreenSharingButton: true,
            });
        }
    }, [token, userInfo, roomID, handleLeaveRoom]);

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center h-screen text-red-500">
                <h2 className="text-xl mb-4">Error</h2>
                <p>{error}</p>
                <button
                    onClick={() => router.push('/')}
                    className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                    Return Home
                </button>
            </div>
        );
    }

    if (!token) {
        return <div className="flex items-center justify-center h-screen">Loading Meeting...</div>;
    }
    
    return (
        <div ref={meetingContainerRef} style={{ width: "100vw", height: "100vh" }} />
    );
};

export default MeetingPage;