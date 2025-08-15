"use client";

import React, { useState } from "react";
import { cn } from "@/utils/cn";
import { useTheme } from "@/contexts/ThemeContext";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { RoomCreationModalProps } from "../../../types/IMeeting";
import { useSelector } from "react-redux";
import { useGetScheduledMeetingsByDateQuery } from "@/api/MeetingApi";
import dayjs from "dayjs";
import { RootState } from "@/redux/store";
import { useTranslations } from "next-intl";

export const RoomCreationModal: React.FC<RoomCreationModalProps> = ({
  show,
  onClose,
  onCreateRoom,
}) => {
  const { isDarkMode } = useTheme();
  const [roomName, setRoomName] = useState("");
  const [description, setDescription] = useState("");
  const [duration, setDuration] = useState(30);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const userInfo = useSelector((state: RootState) => state.auth.userInfo);
  const isVip = userInfo?.vipUser === true;
  const t_meetingPage = useTranslations("meetingPage");
  const today = dayjs().format("YYYY-MM-DD");
  const { data: meetingsToday } = useGetScheduledMeetingsByDateQuery(
    { date: today, userId: userInfo?.id },
    { skip: !userInfo?.id }
  );
  const meetingCount = meetingsToday?.length || 0;

  const isFreeUserLimitReached = !isVip && meetingCount >= 3;

  if (!show) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!isVip) {
      if (duration > 30) {
        setError(t_meetingPage("freeAccountsCanOnlyCreateRoomsUpTo30Minutes"));
        return;
      }
      if (meetingCount >= 3) {
        setError(
          t_meetingPage(
            "youHaveReachedTheDailyLimitOf3RoomCreationsForFreeAccounts"
          )
        );
        return;
      }
    }

    setIsLoading(true);
    try {
      await onCreateRoom(roomName, description, duration);
      setRoomName("");
      setDescription("");
      setDuration(30);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create room");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <Card
        className={cn(
          "w-full max-w-md mx-auto",
          isDarkMode ? "bg-gray-800 text-white" : "bg-white"
        )}
      >
        <CardHeader className="relative pb-2">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">
              {t_meetingPage("createRoom")}
            </h3>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="absolute right-2 top-2"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="room-name"
                className="text-sm font-medium block mb-1"
              >
                {t_meetingPage("roomName")}
              </label>
              <Input
                id="room-name"
                placeholder={t_meetingPage("enterRoomName")}
                value={roomName}
                onChange={(e) => setRoomName(e.target.value)}
                required
                className="w-full"
              />
            </div>

            <div>
              <label
                htmlFor="description"
                className="text-sm font-medium block mb-1"
              >
                {t_meetingPage("description")}
              </label>
              <Input
                id="description"
                placeholder={t_meetingPage("enterDescription")}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full"
              />
            </div>
            <div>
              <label
                htmlFor="duration"
                className="text-sm font-medium block mb-1"
              >
                {t_meetingPage("duration")}
              </label>
              <div className="flex items-center">
                <select
                  id="duration"
                  value={duration}
                  onChange={(e) => setDuration(Number(e.target.value))}
                  className={cn(
                    "w-full p-2 border rounded",
                    isDarkMode
                      ? "bg-gray-700 border-gray-600 text-white"
                      : "bg-white border-gray-300"
                  )}
                  disabled={isFreeUserLimitReached}
                >
                  <option value="15">{t_meetingPage("15minutes")}</option>
                  <option value="30">{t_meetingPage("30minutes")}</option>
                  <option value="45" disabled={!isVip}>
                    {t_meetingPage("45minutes")}
                  </option>
                  <option value="60" disabled={!isVip}>
                    {t_meetingPage("1hour")}
                  </option>
                  <option value="90" disabled={!isVip}>
                    {t_meetingPage("1,5hours")}
                  </option>
                  <option value="120" disabled={!isVip}>
                    {t_meetingPage("2hours")}
                  </option>
                  <option value="180" disabled={!isVip}>
                    {t_meetingPage("3hours")}
                  </option>
                  <option value="240" disabled={!isVip}>
                    {t_meetingPage("4hours")}
                  </option>
                  <option value="480" disabled={!isVip}>
                    {t_meetingPage("8hours")}
                  </option>
                </select>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {isVip
                  ? t_meetingPage(
                      "theMeetingWillAutomaticallyEndAfterTheSelectedDuration"
                    )
                  : t_meetingPage(
                      "freeAccountsCanOnlyCreateRoomsUpTo30MinutesTimeUpTo3TimesDay"
                    )}
              </p>
            </div>
            <div className="pt-4">
              {error && (
                <div className="text-red-500 text-sm mb-2">{error}</div>
              )}
              <Button
                type="submit"
                className="w-full bg-[#6947A8] hover:bg-[#5a3c96] text-white"
                disabled={isLoading || isFreeUserLimitReached}
              >
                {isLoading
                  ? t_meetingPage("creating")
                  : isFreeUserLimitReached
                  ? t_meetingPage("reachedLimitDay")
                  : t_meetingPage("createRoom")}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
