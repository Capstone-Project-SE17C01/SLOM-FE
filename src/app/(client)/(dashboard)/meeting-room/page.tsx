"use client";
import { useState, useEffect } from "react";
import { cn } from "@/utils/cn";
import { useClipboard } from "@/hooks/useClipboard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  MeetingRoomActions,
  MeetingRoomGrid,
} from "@/components/layouts/meeting/meeting-room";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { toast } from "sonner";
import {
  MoreVertical,
  Share2,
  Edit,
  Trash2,
  ClipboardCopy,
  Check,
  AlertTriangle,
  Folder,
  FolderOpen,
  Calendar,
  Clock,
  FileVideo,
  Library,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTheme } from "@/contexts/ThemeContext";
import { RoomCreationModal } from "@/components/layouts/meeting/room-creation-form";
import { RootState, store } from "@/redux/store";
import { JoinMeetingModal } from "@/components/layouts/meeting/join-meeting-form";
import { ScheduleMeetingModal } from "@/components/layouts/meeting/schedule-meeting-form";
import { MeetingEditModal } from "@/components/layouts/meeting/edit-meeting-form";
import {
  CreateMeetingRequest,
  MeetingDetail,
  MeetingRecording,
  UpdateMeetingRequest,
} from "@/types/IMeeting";
import {
  meetingApi,
  useCreateMeetingMutation,
  useDeleteMeetingMutation,
  useDeleteRecordingMutation,
  useGetActiveMeetingsQuery,
  useGetScheduledMeetingsByDateQuery,
  useGetScheduledMeetingsByMonthQuery,
  useGetUserRecordingsQuery,
  useUpdateMeetingMutation,
} from "@/api/MeetingApi";
import { useTranslations } from "next-intl";

export default function MeetingRoomPage() {
  const { isDarkMode } = useTheme();
  const router = useRouter();
  const { userInfo } = useSelector((state: RootState) => state.auth);
  const { copyToClipboard, isCopying } = useClipboard();

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [meetingToDelete, setMeetingToDelete] = useState<{
    id: string;
    title: string;
  } | null>(null);
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedDateString, setSelectedDateString] = useState<string | null>(
    null
  );
  const [selectedMeeting, setSelectedMeeting] = useState<
    MeetingDetail | undefined
  >(undefined);
  const [meetingId, setMeetingId] = useState<string | null>(null);

  // Thêm state cho dialog xóa recording
  const [showDeleteRecordingDialog, setShowDeleteRecordingDialog] =
    useState(false);
  const [recordingToDelete, setRecordingToDelete] =
    useState<MeetingRecording | null>(null);

  // Thêm state để lưu trữ recordings đã được nhóm theo folder
  const [groupedRecordings, setGroupedRecordings] = useState<{
    [key: string]: {
      folderName: string;
      subFolders?: { [key: string]: MeetingRecording[] };
      recordings: MeetingRecording[];
    };
  }>({});

  const { data: activeMeetings = [], isLoading: isLoadingMeetings } =
    useGetActiveMeetingsQuery(userInfo?.id);
  const { data: monthMeetings = [] } = useGetScheduledMeetingsByMonthQuery({
    year,
    month,
    userId: userInfo?.id,
  });
  const { data: dateMeetings = [] } = useGetScheduledMeetingsByDateQuery(
    { date: selectedDateString || "", userId: userInfo?.id },
    { skip: !selectedDateString }
  );
  const { data: recordedSessions = [], isLoading: isLoadingRecordings } =
    useGetUserRecordingsQuery(userInfo?.id || "", { skip: !userInfo?.id });
  const [createMeeting] = useCreateMeetingMutation();
  const [deleteMeeting, { isLoading: isDeleting }] = useDeleteMeetingMutation();
  const [updateMeeting, { isLoading: isUpdating }] = useUpdateMeetingMutation();
  const [deleteRecording, { isLoading: isDeletingRecording }] =
    useDeleteRecordingMutation();

  const todayStr = new Date().toISOString().split("T")[0];
  const upcomingMeetings = monthMeetings.filter(
    (meeting) =>
      meeting.isDeleted == false &&
      new Date(meeting.startTime).getTime() > new Date().getTime()
  );
  const meetingsToday = monthMeetings.filter(
    (meeting) =>
      new Date(meeting.startTime).toISOString().split("T")[0] === todayStr
  );
  const meetingCountToday = meetingsToday.length;
  const isVip = !!userInfo?.vipUser;
  const isFreeUserLimitReached = !isVip && meetingCountToday >= 3;
  const freeUserLimitReason =
    "Free accounts can create up to 3 rooms per day, each room up to 30 minutes. Upgrade for unlimited usage.";

  const formattedActiveMeetings = activeMeetings
    .filter((meeting) => meeting.isDeleted == false)
    .map((meeting) => ({
      id: meeting.id,
      name: meeting.title,
      participantCount: meeting.participantCount,
      description: meeting.description,
      duration: meeting.endTime
        ? Math.round(
            (new Date(meeting.endTime).getTime() -
              new Date(meeting.startTime).getTime()) /
              60000
          )
        : 60,
    }));

  const t_meetingPage = useTranslations("meetingPage");

  const extractFolderInfo = (
    storagePath: string
  ): { folderType: string; subFolder?: string } => {
    try {
      const url = new URL(storagePath);
      const pathParts = url.pathname.split("/");
      const uploadIndex = pathParts.findIndex((part) => part === "upload");
      if (uploadIndex !== -1 && pathParts.length > uploadIndex + 2) {
        const folderType = pathParts[uploadIndex + 2];

        if (folderType === "custom" && pathParts.length > uploadIndex + 3) {
          return { folderType, subFolder: pathParts[uploadIndex + 3] };
        }

        return { folderType };
      }
      return { folderType: "unknown" };
    } catch (error) {
      console.error("Failed to parse URL:", error);
      return { folderType: "unknown" };
    }
  };

  const handleCreateRoom = async (
    roomName: string,
    description: string,
    duration: number
  ) => {
    try {
      if (!userInfo?.id) throw new Error("User not authenticated");
      const meetingRequest: CreateMeetingRequest = {
        title: roomName,
        description,
        isImmediate: true,
        duration,
        isPrivate: false,
        userId: userInfo.id,
      };
      const response = await createMeeting(meetingRequest).unwrap();
      setShowCreateModal(false);
      router.push(`/meeting?roomID=${response.id}`);
    } catch (error) {
      console.error("Failed to create room:", error);
      throw error;
    }
  };

  const handleJoinRoom = async (roomCode: string) => {
    setShowJoinModal(false);
    router.push(`/meeting?roomID=${roomCode}`);
  };

  const handleScheduleMeetingSubmit = async (details: {
    name: string;
    description: string;
    date: string;
    time: string;
    duration: number;
  }) => {
    try {
      if (!userInfo?.id) throw new Error("User not authenticated");
      const localDateTime = new Date(`${details.date}T${details.time}`);
      const utcDateTime = new Date(
        Date.UTC(
          localDateTime.getFullYear(),
          localDateTime.getMonth(),
          localDateTime.getDate(),
          localDateTime.getHours(),
          localDateTime.getMinutes(),
          localDateTime.getSeconds()
        )
      );
      const meetingRequest: CreateMeetingRequest = {
        title: details.name,
        description: details.description,
        isImmediate: false,
        startTime: utcDateTime.toISOString(),
        duration: details.duration,
        isPrivate: false,
        userId: userInfo.id,
      };
      await createMeeting(meetingRequest).then((response) => {
        if (response.data && response.data.id) {
          setMeetingId(response.data.id);
        }
      });
    } catch (error) {
      console.error("Failed to schedule meeting:", error);
    }
  };

  const handleRoomClick = (roomId: string) =>
    router.push(`/meeting?roomID=${roomId}`);

  const handleDateSelection = (date: Date) => {
    setSelectedDate(date);
    
    // Format date theo local timezone để tránh bị tăng thêm 1 ngày
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const dayStr = String(date.getDate()).padStart(2, '0');
    setSelectedDateString(`${year}-${month}-${dayStr}`);
  };

  const handleEditMeeting = async (meetingId: string) => {
    try {
      const loadingToast = toast.loading(t_meetingPage("loadingMeetingDetails"));
      const result = await store.dispatch(
        meetingApi.endpoints.getMeeting.initiate(meetingId)
      );
      toast.dismiss(loadingToast);
      if (result.data) {
        setSelectedMeeting(result.data);
        setShowEditModal(true);
      } else if (result.error) {
        throw result.error;
      }
    } catch (error) {
      console.error("Failed to get meeting details:", error);
      toast.error("Failed to get meeting details", {
        icon: <AlertTriangle className="h-4 w-4 text-red-500" />,
        description: "Please try again later.",
      });
    }
  };

  const handleUpdateMeeting = async (updatedDetails: UpdateMeetingRequest) => {
    if (!selectedMeeting) return;
    try {
      const loadingToast = toast.loading(t_meetingPage("updatingMeetingInformation"));
      await updateMeeting({
        id: selectedMeeting.id,
        request: updatedDetails,
      }).unwrap();
      toast.dismiss(loadingToast);
      toast.success(t_meetingPage("meetingUpdatedSuccessfully"), {
        icon: <Check className="h-4 w-4 text-green-500" />,
        description: t_meetingPage("allMeetingDetailsHaveBeenSavedAndUpdated"),
      });
      setShowEditModal(false);
      setSelectedMeeting(undefined);
      await Promise.all([
        store.dispatch(
          meetingApi.util.invalidateTags([{ type: "Meeting", id: "DATE" }])
        ),
        store.dispatch(
          meetingApi.util.invalidateTags([{ type: "Meeting", id: "MONTH" }])
        ),
        store.dispatch(
          meetingApi.util.invalidateTags([{ type: "Meeting", id: "ACTIVE" }])
        ),
      ]);
    } catch (error) {
      console.error("Failed to update meeting:", error);
      const errorMessage =
        error && typeof error === "object" && "data" in error
          ? (error.data as { message?: string })?.message ||
            "Failed to update meeting"
          : "Failed to update meeting";
      toast.error(errorMessage, {
        icon: <AlertTriangle className="h-4 w-4 text-red-500" />,
        description: "Please check your inputs and try again.",
      });
    }
  };

  const handleDeleteMeeting = async (meetingId: string, userId: string) => {
    try {
      const loadingToast = toast.loading(t_meetingPage("deletingMeeting"));
      await deleteMeeting({ id: meetingId, userId: userId }).unwrap();
      toast.dismiss(loadingToast);
      toast.success(t_meetingPage("meetingDeletedSuccessfully"), {
        icon: <Check className="h-4 w-4 text-green-500" />,
      });
      if (selectedDateString) {
        await Promise.all([
          store.dispatch(
            meetingApi.util.invalidateTags([{ type: "Meeting", id: "DATE" }])
          ),
          store.dispatch(
            meetingApi.util.invalidateTags([{ type: "Meeting", id: "MONTH" }])
          ),
          store.dispatch(
            meetingApi.util.invalidateTags([{ type: "Meeting", id: "ACTIVE" }])
          ),
        ]);
      }
    } catch (error) {
      console.error("Failed to delete meeting:", error);
      const errorMessage =
        error && typeof error === "object" && "data" in error
          ? (error.data as { message?: string })?.message ||
            "Failed to delete meeting"
          : "Failed to delete meeting";
      toast.error(errorMessage, {
        icon: <AlertTriangle className="h-4 w-4 text-red-500" />,
        description:
          "Please try again or contact support if the problem persists.",
      });
    }
  };

  const handleDeleteRecording = async (
    recordingId: string,
    meetingId: string
  ) => {
    try {
      const recording = recordedSessions.find((r) => r.id === recordingId);
      if (!recording || !recording.storagePath) {
        throw new Error("Recording not found or missing storage path");
      }

      const folderInfo = extractFolderInfo(recording.storagePath);
      console.log(
        `Deleting recording from ${folderInfo.folderType} folder${
          folderInfo.subFolder ? ` (subfolder: ${folderInfo.subFolder})` : ""
        }`
      );

      const loadingToast = toast.loading(t_meetingPage("deletingRecording"));
      await deleteRecording({ recordingId, meetingId }).unwrap();
      toast.dismiss(loadingToast);
      toast.success(t_meetingPage("recordingDeletedSuccessfully"), {
        icon: <Check className="h-4 w-4 text-green-500" />,
      });

      const newGroupedRecordings = { ...groupedRecordings };

      Object.keys(newGroupedRecordings).forEach((folderKey) => {
        const folder = newGroupedRecordings[folderKey];

        folder.recordings = folder.recordings.filter(
          (r) => r.id !== recordingId
        );

        if (folder.subFolders) {
          Object.keys(folder.subFolders).forEach((subFolderKey) => {
            folder.subFolders![subFolderKey] = folder.subFolders![
              subFolderKey
            ].filter((r) => r.id !== recordingId);
          });
        }
      });

      setGroupedRecordings(newGroupedRecordings);

      store.dispatch(
        meetingApi.util.invalidateTags([{ type: "Meeting", id: "RECORDINGS" }])
      );
    } catch (error) {
      console.error("Failed to delete recording:", error);
      const errorMessage =
        error && typeof error === "object" && "data" in error
          ? (error.data as { message?: string })?.message ||
            "Failed to delete recording"
          : "Failed to delete recording";
      toast.error(errorMessage, {
        icon: <AlertTriangle className="h-4 w-4 text-red-500" />,
        description:
          "Please try again or contact support if the problem persists.",
      });
    }
  };

  const renderDropdownActions = (meeting: {
    id: string;
    title: string;
    endTime?: string;
  }) => {
    const meetingEndTime = meeting.endTime
      ? new Date(meeting.endTime)
      : null;

    const isPastMeeting = meetingEndTime
      ? meetingEndTime < new Date()
      : false;
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full focus:outline-none">
            <MoreVertical size={14} />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-40">
          {!isPastMeeting && (
            <>
              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation();
                  handleRoomClick(meeting.id);
                }}
                className="flex items-center gap-1"
                disabled={isDeleting || isUpdating}
              >
                <Share2 size={14} /> {t_meetingPage("joinSchedule")}
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation();
                  handleEditMeeting(meeting.id);
                }}
                className="flex items-center gap-1"
                disabled={isDeleting || isUpdating}
              >
                <Edit size={14} /> {t_meetingPage("edit")}
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation();
                  const meetingLink = `${window.location.origin}/meeting?roomID=${meeting.id}`;
                  copyToClipboard(
                    meetingLink                    
                  );
                }}
                className="flex items-center gap-1"
                disabled={isCopying || isDeleting || isUpdating}
              >
                <ClipboardCopy
                  size={14}
                  className={isCopying ? "animate-pulse" : ""}
                />
                {isCopying ? t_meetingPage("copying") : t_meetingPage("copyLink")}
              </DropdownMenuItem>
            </>
          )}
          <DropdownMenuItem
            onClick={(e) => {
              e.stopPropagation();
              setMeetingToDelete(meeting);
              setShowDeleteDialog(true);
            }}
            className="flex items-center gap-1 text-red-500 focus:bg-red-50 dark:focus:bg-red-900/20"
            disabled={isDeleting || isUpdating}
          >
            <Trash2 size={14} /> {isDeleting ? t_meetingPage("deleting") : t_meetingPage("delete")}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  };

  // Thêm renderRecordingDropdownActions
  const renderRecordingDropdownActions = (recording: MeetingRecording) => {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
          <button className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full focus:outline-none">
            <MoreVertical size={14} />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-40">
          <DropdownMenuItem
            onClick={(e) => {
              e.stopPropagation();
              setRecordingToDelete(recording);
              setShowDeleteRecordingDialog(true);
            }}
            className="flex items-center gap-1 text-red-500 focus:bg-red-50 dark:focus:bg-red-900/20"
            disabled={isDeletingRecording}
          >
            <Trash2 size={14} />{" "}
            {isDeletingRecording ? t_meetingPage("deleting") : t_meetingPage("delete")}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  };

  const renderCalendar = () => {
    const daysInMonth = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth() + 1,
      0
    ).getDate();
    const firstDayOfMonth = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth(),
      1
    ).getDay();
    const firstDay = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;
    const calendarDays = [];

    for (let i = 0; i < firstDay; i++) calendarDays.push(null);
    for (let day = 1; day <= daysInMonth; day++) {
      calendarDays.push(
        new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day, 12, 0, 0, 0)
      );
    }

    return (
      <div className="grid grid-cols-7 gap-1">
        {calendarDays.map((day, index) => {
          if (day === null)
            return <div key={`empty-${index}`} className="h-8"></div>;
          
          // Format date theo local timezone
          const year = day.getFullYear();
          const month = String(day.getMonth() + 1).padStart(2, '0');
          const dayStr = String(day.getDate()).padStart(2, '0');
          const formattedDate = `${year}-${month}-${dayStr}`;
          
          const hasMeetings = monthMeetings.some(
            (meeting) => {
              if (meeting.isDeleted) return false;
              
              // Format meeting date theo local timezone
              const meetingDate = new Date(meeting.startTime);
              const mYear = meetingDate.getFullYear();
              const mMonth = String(meetingDate.getMonth() + 1).padStart(2, '0');
              const mDay = String(meetingDate.getDate()).padStart(2, '0');
              const meetingFormattedDate = `${mYear}-${mMonth}-${mDay}`;
              
              return meetingFormattedDate === formattedDate;
            }
          );
          const isSelected =
            selectedDate?.toDateString() === day.toDateString();
          const isToday = new Date().toDateString() === day.toDateString();

          return (
            <div
              key={day.getTime()}
              onClick={() => handleDateSelection(day)}
              className={cn(
                "h-8 flex items-center justify-center rounded-full text-xs cursor-pointer relative",
                isSelected
                  ? "bg-[#6947A8] text-white"
                  : isToday
                  ? "border border-[#6947A8] text-[#6947A8]"
                  : isDarkMode
                  ? "hover:bg-gray-700"
                  : "hover:bg-gray-100"
              )}
            >
              {day.getDate()}
              {hasMeetings && (
                <span className="absolute bottom-1 w-1 h-1 bg-[#6947A8] rounded-full"></span>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  useEffect(() => {
    if (currentMonth) {
      setYear(currentMonth.getFullYear());
      setMonth(currentMonth.getMonth() + 1);
    }
  }, [currentMonth]);

  useEffect(() => {
    if (recordedSessions.length > 0) {
      const grouped: {
        [key: string]: {
          folderName: string;
          subFolders?: { [key: string]: MeetingRecording[] };
          recordings: MeetingRecording[];
        };
      } = {};

      recordedSessions.forEach((recording) => {
        if (recording.storagePath) {
          const folderInfo = extractFolderInfo(recording.storagePath);
          const folderType = folderInfo.folderType;

          if (!grouped[folderType]) {
            grouped[folderType] = {
              folderName: folderType,
              recordings: [],
            };

            if (folderType === "custom") {
              grouped[folderType].subFolders = {};
            }
          }

          if (folderType === "custom" && folderInfo.subFolder) {
            if (!grouped[folderType].subFolders![folderInfo.subFolder]) {
              grouped[folderType].subFolders![folderInfo.subFolder] = [];
            }
            grouped[folderType].subFolders![folderInfo.subFolder].push(
              recording
            );
          } else {
            grouped[folderType].recordings.push(recording);
          }
        }
      });

      setGroupedRecordings(grouped);
    }
  }, [recordedSessions]);

  return (
    <>
      <div className="flex flex-col md:flex-row gap-8">
        <div className="md:w-80 flex-shrink-0">
          <h2 className="text-2xl font-bold mb-4">
            {t_meetingPage("meetingRoom")}
          </h2>
          {!isVip && (
            <div
              className={cn(
                "mb-4 p-3 rounded bg-yellow-50 border border-yellow-300 text-yellow-800 text-sm",
                isDarkMode
                  ? "bg-yellow-900/20 border-yellow-700 text-yellow-200"
                  : ""
              )}
            >
              {isFreeUserLimitReached ? (
                <>
                  <span className="font-bold">
                    {t_meetingPage("youHaveReachedYourDailyUsageLimit")}
                  </span>
                  <br />
                  {freeUserLimitReason}
                </>
              ) : (
                <>{t_meetingPage("freeAccount")}</>
              )}
            </div>
          )}
          <div className="space-y-6">
            <MeetingRoomActions
              onStartMeeting={() => setShowCreateModal(true)}
              onJoinMeeting={() => setShowJoinModal(true)}
              onScheduleMeeting={() => setShowScheduleModal(true)}
              disableStart={isFreeUserLimitReached}
              disableJoin={isFreeUserLimitReached}
              disableSchedule={isFreeUserLimitReached}
              disableReason={isFreeUserLimitReached ? freeUserLimitReason : ""}
            />
            <div
              className={cn(
                "p-4 rounded-lg border",
                isDarkMode
                  ? "bg-gray-800 border-gray-700"
                  : "bg-white border-gray-200"
              )}
            >
              <h3 className="font-medium mb-3">
                {t_meetingPage("meetingAppointment")}
              </h3>
              <div className="mb-3 flex space-x-2">
                <button
                  onClick={() => {
                    const newDate = new Date(currentMonth);
                    newDate.setMonth(newDate.getMonth() - 1);
                    setCurrentMonth(newDate);
                  }}
                  className={cn(
                    "px-2 py-1 rounded text-sm",
                    isDarkMode
                      ? "bg-gray-700 hover:bg-gray-600"
                      : "bg-gray-100 hover:bg-gray-200"
                  )}
                >
                  &lt;
                </button>
                <div className="flex-1 p-2 text-center text-sm font-medium">
                  {currentMonth.toLocaleDateString("en-US", {
                    month: "long",
                    year: "numeric",
                  })}
                </div>
                <button
                  onClick={() => {
                    const newDate = new Date(currentMonth);
                    newDate.setMonth(newDate.getMonth() + 1);
                    setCurrentMonth(newDate);
                  }}
                  className={cn(
                    "px-2 py-1 rounded text-sm",
                    isDarkMode
                      ? "bg-gray-700 hover:bg-gray-600"
                      : "bg-gray-100 hover:bg-gray-200"
                  )}
                >
                  &gt;
                </button>
              </div>
              <div className="grid grid-cols-7 gap-1 text-center text-xs mb-2">
                <div>MON</div>
                <div>TUE</div>
                <div>WED</div>
                <div>THU</div>
                <div>FRI</div>
                <div>SAT</div>
                <div>SUN</div>
              </div>
              {renderCalendar()}
              {selectedDate && dateMeetings.length > 0 ? (
                <div className="mt-3 text-xs p-2 border-t">
                  {dateMeetings
                    .filter((meeting) => meeting.isDeleted == false)
                    .map((meeting) => {
                      return (
                        <div
                          key={meeting.id}
                          className="mb-1 last:mb-0 p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                        >
                          <div className="flex justify-between items-center">
                            <span className="font-medium">
                              {new Date(meeting.startTime).toLocaleTimeString(
                                [],
                                { hour: "2-digit", minute: "2-digit" }
                              )}{" "}
                              •{" "}
                              {meeting.endTime
                                ? Math.round(
                                    (new Date(meeting.endTime).getTime() -
                                      new Date(meeting.startTime).getTime()) /
                                      60000
                                  )
                                : 60}
                              min
                            </span>
                            <div className="flex items-center">
                              <span className="text-gray-500 truncate max-w-[100px] mr-1">
                                {meeting.title}
                              </span>
                              {renderDropdownActions({
                                id: meeting.id,
                                title: meeting.title,
                                endTime: meeting.endTime,
                              })}
                            </div>
                          </div>
                          {meeting.description && (
                            <div className="text-gray-500 truncate mt-0.5">
                              {meeting.description}
                            </div>
                          )}
                        </div>
                      );
                    })}
                </div>
              ) : selectedDate ? (
                <div className="text-xs p-2 border-t text-center text-gray-500">
                  {t_meetingPage("noMeetingsScheduledForThisDate")}
                </div>
              ) : (
                <div className="text-xs p-2 border-t text-center text-gray-500">
                  {t_meetingPage("selectDate")}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex-grow">
          <Tabs defaultValue="available" className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="available">
                {t_meetingPage("availableRooms")}
              </TabsTrigger>
              <TabsTrigger value="upcoming">
                {t_meetingPage("upcomingMeetings")}
              </TabsTrigger>
              {isVip && (
                <TabsTrigger value="recorded">
                  {t_meetingPage("recordSession")}
                </TabsTrigger>
              )}
            </TabsList>
            <TabsContent value="available">
              {isLoadingMeetings ? (
                <div className="p-6 text-center rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/50">
                  <p
                    className={cn(
                      "text-lg",
                      isDarkMode ? "text-gray-400" : "text-gray-500"
                    )}
                  >
                    {t_meetingPage("loadingMeetingRooms")}
                  </p>
                </div>
              ) : formattedActiveMeetings.length === 0 ? (
                <div className="p-6 text-center rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/50">
                  <p
                    className={cn(
                      "text-lg",
                      isDarkMode ? "text-gray-400" : "text-gray-500"
                    )}
                  >
                    {t_meetingPage("noAvailableRooms")}
                  </p>
                  <p
                    className={cn(
                      "text-sm mt-2",
                      isDarkMode ? "text-gray-400" : "text-gray-500"
                    )}
                  >
                    {t_meetingPage("createMeetingToGetStarted")}
                  </p>
                </div>
              ) : (
                <MeetingRoomGrid
                  rooms={formattedActiveMeetings}
                  onRoomClick={handleRoomClick}
                />
              )}
            </TabsContent>
            <TabsContent value="upcoming">
              {upcomingMeetings.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {upcomingMeetings.map((meeting) => (
                    <div
                      key={meeting.id}
                      className={cn(
                        "p-4 rounded-lg border transition-all",
                        isDarkMode
                          ? "bg-gray-800 border-gray-700 hover:border-[#6947A8]"
                          : "bg-white border-gray-200 hover:border-[#6947A8]"
                      )}
                    >
                      <div className="mb-2 flex justify-between items-center">
                        <h3 className="font-medium truncate">
                          {meeting.title}
                        </h3>
                        <div className="flex items-center gap-2">
                          <span
                            className={cn(
                              "text-xs px-2 py-0.5 rounded-full",
                              meeting.status === "Active"
                                ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                                : "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
                            )}
                          >
                            {meeting.status}
                          </span>
                          {renderDropdownActions({
                            id: meeting.id,
                            title: meeting.title,
                          })}
                        </div>
                      </div>
                      <div className="space-y-1 mb-2">
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          <span className="inline-block min-w-[100px]">
                            {t_meetingPage("host")}
                          </span>
                          <span className="font-medium">
                            {meeting.hostName}
                          </span>
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          <span className="inline-block min-w-[100px]">
                            {t_meetingPage("date")}
                          </span>
                          <span className="font-medium">
                            {new Date(meeting.startTime).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          <span className="inline-block min-w-[100px]">
                            {t_meetingPage("time")}
                          </span>
                          <span className="font-medium">
                            {new Date(meeting.startTime).toLocaleTimeString(
                              [],
                              { hour: "2-digit", minute: "2-digit" }
                            )}
                          </span>
                        </div>
                      </div>
                      {meeting.description && (
                        <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
                          {meeting.description}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-6 text-center rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/50">
                  <p
                    className={cn(
                      "text-lg",
                      isDarkMode ? "text-gray-400" : "text-gray-500"
                    )}
                  >
                    {t_meetingPage("noUpcomingMeetings")}
                  </p>
                  <p
                    className={cn(
                      "text-sm mt-2",
                      isDarkMode ? "text-gray-400" : "text-gray-500"
                    )}
                  >
                    {t_meetingPage("createMeetingToGetStarted")}
                  </p>
                </div>
              )}
            </TabsContent>
            <TabsContent value="recorded">
              {isLoadingRecordings ? (
                <div className="p-6 text-center rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/50">
                  <p
                    className={cn(
                      "text-lg",
                      isDarkMode ? "text-gray-400" : "text-gray-500"
                    )}
                  >
                    {t_meetingPage("loadingRecordedSessions")}
                  </p>
                </div>
              ) : Object.keys(groupedRecordings).length === 0 ? (
                <div className="p-6 text-center rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/50">
                  <p
                    className={cn(
                      "text-lg",
                      isDarkMode ? "text-gray-400" : "text-gray-500"
                    )}
                  >
                    {t_meetingPage("noRecordSessions")}
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-6">
                  {Object.entries(groupedRecordings).map(
                    ([folderKey, folderData]) => (
                      <div
                        key={folderKey}
                        className={cn(
                          "overflow-hidden rounded-xl border shadow-sm",
                          isDarkMode
                            ? "bg-gray-800 border-gray-700"
                            : "bg-white border-gray-200"
                        )}
                      >
                        <div className="p-5 border-b border-gray-200 dark:border-gray-700">
                          <div className="flex items-center gap-3">
                            {folderKey === "general" ? (
                              <div className="h-10 w-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                                <Library className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                              </div>
                            ) : folderKey === "custom" ? (
                              <div className="h-10 w-10 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                                <FolderOpen className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                              </div>
                            ) : (
                              <div className="h-10 w-10 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                                <Folder className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                              </div>
                            )}
                            <div>
                              <h3 className="text-lg font-semibold capitalize">
                                {folderData.folderName === "general"
                                  ? t_meetingPage("generalRecordings")
                                  : folderData.folderName === "custom"
                                  ? t_meetingPage("customFolders")
                                  : `${folderData.folderName} Recordings`}
                              </h3>
                              <p className="text-sm text-gray-500 dark:text-gray-400">
                                {folderData.recordings.length}{" "}
                                {t_meetingPage("recordings")}
                                {folderData.subFolders &&
                                  Object.keys(folderData.subFolders).length >
                                    0 &&
                                  ` in ${
                                    Object.keys(folderData.subFolders).length
                                  } ${t_meetingPage("folders")}`}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Hiển thị recordings trực tiếp trong folder (không thuộc subfolder) */}
                        {folderData.recordings.length > 0 && (
                          <div className="p-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {folderData.recordings.map((recording) => (
                                <div
                                  key={recording.id}
                                  className={cn(
                                    "relative overflow-hidden rounded-lg border transition-all",
                                    isDarkMode
                                      ? "bg-gray-700 border-gray-600 hover:border-purple-500"
                                      : "bg-gray-50 border-gray-200 hover:border-purple-500"
                                  )}
                                >
                                  <div
                                    className="p-4 cursor-pointer"
                                    onClick={() => {
                                      if (recording.storagePath) {
                                        const params = new URLSearchParams({
                                          url: recording.storagePath,
                                          title:
                                            recording.meetingTitle ||
                                            t_meetingPage("untitledRecording"),
                                        });
                                        router.push(
                                          `/video-viewer?${params.toString()}`
                                        );
                                      }
                                    }}
                                  >
                                    <div className="flex items-center gap-4">
                                      <div className="flex-shrink-0 h-12 w-12 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                                        <FileVideo className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                                      </div>
                                      <div className="flex-grow min-w-0">
                                        <h4 className="font-medium text-base truncate">
                                          {recording.meetingTitle ||
                                            t_meetingPage("untitledRecording")}
                                        </h4>
                                        <div className="flex items-center gap-3 mt-1 text-xs text-gray-500 dark:text-gray-400">
                                          <div className="flex items-center gap-1">
                                            <Calendar className="h-3 w-3" />
                                            <span>
                                              {new Date(
                                                recording.createdAt
                                              ).toLocaleDateString()}
                                            </span>
                                          </div>
                                          {recording.duration && (
                                            <div className="flex items-center gap-1">
                                              <Clock className="h-3 w-3" />
                                              <span>
                                                {recording.duration} min
                                              </span>
                                            </div>
                                          )}
                                        </div>
                                      </div>
                                      <div className="flex items-center gap-2">
                                        <span
                                          className={cn(
                                            "text-xs px-2 py-0.5 rounded-full",
                                            recording.processed
                                              ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                                              : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300"
                                          )}
                                        >
                                          {recording.processed
                                            ? t_meetingPage("processed")
                                            : t_meetingPage("processing")}
                                        </span>
                                        {renderRecordingDropdownActions(
                                          recording
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 to-blue-500"></div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Hiển thị subfolders nếu có */}
                        {folderData.subFolders &&
                          Object.entries(folderData.subFolders).length > 0 && (
                            <div className="p-4 pt-0">
                              {Object.entries(folderData.subFolders).map(
                                ([subFolderName, subFolderRecordings]) => (
                                  <div
                                    key={subFolderName}
                                    className="mt-6 first:mt-0"
                                  >
                                    <div className="flex items-center gap-2 mb-3">
                                      <Folder className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                                      <h4 className="font-medium text-md capitalize">
                                        {subFolderName}
                                      </h4>
                                      <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">
                                        {subFolderRecordings.length}{" "}
                                        {subFolderRecordings.length === 1
                                          ? t_meetingPage("recording")
                                          : t_meetingPage("recordings")}
                                      </span>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                      {subFolderRecordings.map((recording) => (
                                        <div
                                          key={recording.id}
                                          className={cn(
                                            "relative overflow-hidden rounded-lg border transition-all",
                                            isDarkMode
                                              ? "bg-gray-700 border-gray-600 hover:border-purple-500"
                                              : "bg-gray-50 border-gray-200 hover:border-purple-500"
                                          )}
                                        >
                                          <div
                                            className="p-4 cursor-pointer"
                                            onClick={() => {
                                              if (recording.storagePath) {
                                                const params =
                                                  new URLSearchParams({
                                                    url: recording.storagePath,
                                                    title:
                                                      recording.meetingTitle ||
                                                      t_meetingPage(
                                                        "untitledRecording"
                                                      ),
                                                  });
                                                router.push(
                                                  `/video-viewer?${params.toString()}`
                                                );
                                              }
                                            }}
                                          >
                                            <div className="flex items-center gap-4">
                                              <div className="flex-shrink-0 h-12 w-12 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                                                <FileVideo className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                                              </div>
                                              <div className="flex-grow min-w-0">
                                                <h4 className="font-medium text-base truncate">
                                                  {recording.meetingTitle ||
                                                    t_meetingPage(
                                                      "untitledRecording"
                                                    )}
                                                </h4>
                                                <div className="flex items-center gap-3 mt-1 text-xs text-gray-500 dark:text-gray-400">
                                                  <div className="flex items-center gap-1">
                                                    <Calendar className="h-3 w-3" />
                                                    <span>
                                                      {new Date(
                                                        recording.createdAt
                                                      ).toLocaleDateString()}
                                                    </span>
                                                  </div>
                                                  {recording.duration && (
                                                    <div className="flex items-center gap-1">
                                                      <Clock className="h-3 w-3" />
                                                      <span>
                                                        {recording.duration} min
                                                      </span>
                                                    </div>
                                                  )}
                                                </div>
                                              </div>
                                              <div className="flex items-center gap-2">
                                                <span
                                                  className={cn(
                                                    "text-xs px-2 py-0.5 rounded-full",
                                                    recording.processed
                                                      ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                                                      : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300"
                                                  )}
                                                >
                                                  {recording.processed
                                                    ? t_meetingPage("processed")
                                                    : t_meetingPage(
                                                        "processing"
                                                      )}
                                                </span>
                                                {renderRecordingDropdownActions(
                                                  recording
                                                )}
                                              </div>
                                            </div>
                                          </div>
                                          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 to-blue-500"></div>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )
                              )}
                            </div>
                          )}
                      </div>
                    )
                  )}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
      <RoomCreationModal
        show={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onCreateRoom={handleCreateRoom}
      />
      <JoinMeetingModal
        show={showJoinModal}
        onClose={() => setShowJoinModal(false)}
        onJoinRoom={handleJoinRoom}
      />
      <ScheduleMeetingModal
        show={showScheduleModal}
        onClose={() => setShowScheduleModal(false)}
        onScheduleMeeting={handleScheduleMeetingSubmit}
        meetingId={meetingId ?? undefined}
      />
      <MeetingEditModal
        show={showEditModal}
        onClose={() => setShowEditModal(false)}
        meeting={selectedMeeting}
        onUpdateMeeting={handleUpdateMeeting}
      />
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-red-500">
              {t_meetingPage("deleteMeeting")}
            </DialogTitle>
            <DialogDescription>
              {t_meetingPage("areYouSureYouWantToDeleteTheMeeting")}
              <span className="font-medium">{meetingToDelete?.title}</span>?
              {t_meetingPage("thisActionCannotBeUndone")}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4">
            <Button
              variant="outline"
              onClick={() => setShowDeleteDialog(false)}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              className="bg-red-500 hover:bg-red-600 text-white relative"
              onClick={() => {
                if (meetingToDelete) {
                  handleDeleteMeeting(meetingToDelete.id, userInfo?.id || "");
                  setShowDeleteDialog(false);
                  setMeetingToDelete(null);
                }
              }}
              disabled={isDeleting}
            >
              <span
                className={cn(
                  "flex items-center gap-2",
                  isDeleting && "opacity-0"
                )}
              >
                <Trash2 size={16} /> {t_meetingPage("delete")}
              </span>
              {isDeleting && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                </div>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Dialog
        open={showDeleteRecordingDialog}
        onOpenChange={setShowDeleteRecordingDialog}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-red-500">{t_meetingPage("deleteRecording")}</DialogTitle>
            <DialogDescription>
              {t_meetingPage("areYouSureYouWantToDeleteTheRecording")}
              <span className="font-medium">
                {recordingToDelete?.meetingTitle}
              </span>
              ? {t_meetingPage("thisActionCannotBeUndone")}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4">
            <Button
              variant="outline"
              onClick={() => setShowDeleteRecordingDialog(false)}
              disabled={isDeletingRecording}
            >
              Cancel
            </Button>
            <Button
              className="bg-red-500 hover:bg-red-600 text-white relative"
              onClick={() => {
                if (recordingToDelete) {
                  handleDeleteRecording(
                    recordingToDelete.id,
                    recordingToDelete.meetingId || ""
                  );
                  setShowDeleteRecordingDialog(false);
                  setRecordingToDelete(null);
                }
              }}
              disabled={isDeletingRecording}
            >
              <span
                className={cn(
                  "flex items-center gap-2",
                  isDeletingRecording && "opacity-0"
                )}
              >
                <Trash2 size={16} /> {t_meetingPage("delete")}
              </span>
              {isDeletingRecording && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                </div>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
