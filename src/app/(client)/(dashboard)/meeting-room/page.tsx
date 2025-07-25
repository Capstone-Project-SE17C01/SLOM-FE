"use client";
import { useState, useEffect } from "react";
import { cn } from "@/utils/cn";
import { useClipboard } from "@/hooks/useClipboard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MeetingRoomActions, MeetingRoomGrid } from "@/components/layouts/meeting/meeting-room";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { toast } from "sonner";
import { MoreVertical, Share2, Edit, Trash2, ClipboardCopy, Check, AlertTriangle, Play } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useTheme } from "@/contexts/ThemeContext";
import { RoomCreationModal } from "@/components/layouts/meeting/room-creation-form";
import { RootState, store } from "@/redux/store";
import { JoinMeetingModal } from "@/components/layouts/meeting/join-meeting-form";
import { ScheduleMeetingModal } from "@/components/layouts/meeting/schedule-meeting-form";
import { MeetingEditModal } from "@/components/layouts/meeting/edit-meeting-form";
import { CreateMeetingRequest, MeetingDetail, UpdateMeetingRequest } from "@/types/IMeeting";
import { meetingApi, useCreateMeetingMutation, useDeleteMeetingMutation, useGetActiveMeetingsQuery, useGetScheduledMeetingsByDateQuery, useGetScheduledMeetingsByMonthQuery, useGetUserRecordingsQuery, useUpdateMeetingMutation } from "@/api/MeetingApi";

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
  const [meetingToDelete, setMeetingToDelete] = useState<{ id: string; title: string } | null>(null);
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedDateString, setSelectedDateString] = useState<string | null>(null);
  const [selectedMeeting, setSelectedMeeting] = useState<MeetingDetail | undefined>(undefined);
  const [meetingId, setMeetingId] = useState<string | null>(null);

  const { data: activeMeetings = [], isLoading: isLoadingMeetings } = useGetActiveMeetingsQuery(userInfo?.id);
  const { data: monthMeetings = [] } = useGetScheduledMeetingsByMonthQuery({ year, month, userId: userInfo?.id });
  const { data: dateMeetings = [] } = useGetScheduledMeetingsByDateQuery({ date: selectedDateString || "", userId: userInfo?.id }, { skip: !selectedDateString });
  const { data: recordedSessions = [], isLoading: isLoadingRecordings } = useGetUserRecordingsQuery(userInfo?.id || "", { skip: !userInfo?.id });
  const [createMeeting] = useCreateMeetingMutation();
  const [deleteMeeting, { isLoading: isDeleting }] = useDeleteMeetingMutation();
  const [updateMeeting, { isLoading: isUpdating }] = useUpdateMeetingMutation();

  const todayStr = new Date().toISOString().split("T")[0];
  const meetingsToday = monthMeetings.filter(
    (meeting) => new Date(meeting.startTime).toISOString().split("T")[0] === todayStr
  );
  const meetingCountToday = meetingsToday.length;
  const isVip = !!userInfo?.vipUser;
  const isFreeUserLimitReached = !isVip && meetingCountToday >= 3;
  const freeUserLimitReason = "Free accounts can create up to 3 rooms per day, each room up to 30 minutes. Upgrade for unlimited usage.";

  const formattedActiveMeetings = activeMeetings.map((meeting) => ({
    id: meeting.id,
    name: meeting.title,
    participantCount: meeting.participantCount,
    description: meeting.description,
    duration: meeting.endTime ? Math.round((new Date(meeting.endTime).getTime() - new Date(meeting.startTime).getTime()) / 60000) : 60,
  }));

  const handleCreateRoom = async (roomName: string, description: string, duration: number) => {
    try {
      if (!userInfo?.id) throw new Error("User not authenticated");
      const meetingRequest: CreateMeetingRequest = { title: roomName, description, isImmediate: true, duration, isPrivate: false, userId: userInfo.id };
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

  const handleScheduleMeetingSubmit = async (details: { name: string; description: string; date: string; time: string; duration: number }) => {
    try {
      if (!userInfo?.id) throw new Error("User not authenticated");
      const localDateTime = new Date(`${details.date}T${details.time}`);
      const utcDateTime = new Date(Date.UTC(localDateTime.getFullYear(), localDateTime.getMonth(), localDateTime.getDate(), localDateTime.getHours(), localDateTime.getMinutes(), localDateTime.getSeconds()));
      const meetingRequest: CreateMeetingRequest = { title: details.name, description: details.description, isImmediate: false, startTime: utcDateTime.toISOString(), duration: details.duration, isPrivate: false, userId: userInfo.id };
      await createMeeting(meetingRequest).then((response) => {
        if (response.data && response.data.id) {
          setMeetingId(response.data.id);
        }
      });
    } catch (error) {
      console.error("Failed to schedule meeting:", error);
    }
  };

  const handleRoomClick = (roomId: string) => router.push(`/meeting?roomID=${roomId}`);

  const handleDateSelection = (date: Date) => {
    setSelectedDate(date);
    setSelectedDateString(date.toISOString().split("T")[0]);
  };

  const handleEditMeeting = async (meetingId: string) => {
    try {
      const loadingToast = toast.loading("Loading meeting details...");
      const result = await store.dispatch(meetingApi.endpoints.getMeeting.initiate(meetingId));
      toast.dismiss(loadingToast);
      if (result.data) {
        setSelectedMeeting(result.data);
        setShowEditModal(true);
      } else if (result.error) {
        throw result.error;
      }
    } catch (error) {
      console.error("Failed to get meeting details:", error);
      toast.error("Failed to get meeting details", { icon: <AlertTriangle className="h-4 w-4 text-red-500" />, description: "Please try again later." });
    }
  };

  const handleUpdateMeeting = async (updatedDetails: UpdateMeetingRequest) => {
    if (!selectedMeeting) return;
    try {
      const loadingToast = toast.loading("Updating meeting information...");
      await updateMeeting({ id: selectedMeeting.id, request: updatedDetails }).unwrap();
      toast.dismiss(loadingToast);
      toast.success("Meeting updated successfully", { icon: <Check className="h-4 w-4 text-green-500" />, description: "All meeting details have been saved and updated." });
      setShowEditModal(false);
      setSelectedMeeting(undefined);
      await Promise.all([
        store.dispatch(meetingApi.util.invalidateTags([{ type: "Meeting", id: "DATE" }])),
        store.dispatch(meetingApi.util.invalidateTags([{ type: "Meeting", id: "MONTH" }])),
        store.dispatch(meetingApi.util.invalidateTags([{ type: "Meeting", id: "ACTIVE" }])),
      ]);
    } catch (error) {
      console.error("Failed to update meeting:", error);
      const errorMessage = error && typeof error === "object" && "data" in error ? (error.data as { message?: string })?.message || "Failed to update meeting" : "Failed to update meeting";
      toast.error(errorMessage, { icon: <AlertTriangle className="h-4 w-4 text-red-500" />, description: "Please check your inputs and try again." });
    }
  };

  const handleDeleteMeeting = async (meetingId: string, userId: string) => {
    try {
      const loadingToast = toast.loading("Deleting meeting...");
      await deleteMeeting({ id: meetingId, userId: userId }).unwrap();
      toast.dismiss(loadingToast);
      toast.success("Meeting deleted successfully", { icon: <Check className="h-4 w-4 text-green-500" /> });
      if (selectedDateString) {
        await Promise.all([
          store.dispatch(meetingApi.util.invalidateTags([{ type: "Meeting", id: "DATE" }])),
          store.dispatch(meetingApi.util.invalidateTags([{ type: "Meeting", id: "MONTH" }])),
          store.dispatch(meetingApi.util.invalidateTags([{ type: "Meeting", id: "ACTIVE" }])),
        ]);
      }
    } catch (error) {
      console.error("Failed to delete meeting:", error);
      const errorMessage = error && typeof error === "object" && "data" in error ? (error.data as { message?: string })?.message || "Failed to delete meeting" : "Failed to delete meeting";
      toast.error(errorMessage, { icon: <AlertTriangle className="h-4 w-4 text-red-500" />, description: "Please try again or contact support if the problem persists." });
    }
  };

  const renderDropdownActions = (meeting: { id: string; title: string }, showJoin = false) => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full focus:outline-none">
          <MoreVertical size={14} />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40">
        {showJoin && (
          <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleRoomClick(meeting.id); }} className="flex items-center gap-1" disabled={isDeleting || isUpdating}>
            <Share2 size={14} /> Join
          </DropdownMenuItem>
        )}
        <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleEditMeeting(meeting.id); }} className="flex items-center gap-1" disabled={isDeleting || isUpdating}>
          <Edit size={14} /> Edit
        </DropdownMenuItem>
        <DropdownMenuItem onClick={(e) => { e.stopPropagation(); setMeetingToDelete(meeting); setShowDeleteDialog(true); }} className="flex items-center gap-1 text-red-500 focus:bg-red-50 dark:focus:bg-red-900/20" disabled={isDeleting || isUpdating}>
          <Trash2 size={14} /> {isDeleting ? "Deleting..." : "Delete"}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={(e) => { e.stopPropagation(); const meetingLink = `${window.location.origin}/meeting?roomID=${meeting.id}`; copyToClipboard(meetingLink, "Meeting link copied to clipboard"); }} className="flex items-center gap-1" disabled={isCopying || isDeleting || isUpdating}>
          <ClipboardCopy size={14} className={isCopying ? "animate-pulse" : ""} />
          {isCopying ? "Copying..." : "Copy Link"}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );

  const renderCalendar = () => {
    const daysInMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate();
    const firstDayOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay();
    const firstDay = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;
    const calendarDays = [];

    for (let i = 0; i < firstDay; i++) calendarDays.push(null);
    for (let day = 1; day <= daysInMonth; day++) {
      calendarDays.push(new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day));
    }

    return (
      <div className="grid grid-cols-7 gap-1">
        {calendarDays.map((day, index) => {
          if (day === null) return <div key={`empty-${index}`} className="h-8"></div>;
          const formattedDate = day.toISOString().split("T")[0];
          const hasMeetings = monthMeetings.some((meeting) => new Date(meeting.startTime).toISOString().split("T")[0] === formattedDate);
          const isSelected = selectedDate?.toDateString() === day.toDateString();
          const isToday = new Date().toDateString() === day.toDateString();

          return (
            <div key={day.getTime()} onClick={() => handleDateSelection(day)} className={cn("h-8 flex items-center justify-center rounded-full text-xs cursor-pointer relative", isSelected ? "bg-[#6947A8] text-white" : isToday ? "border border-[#6947A8] text-[#6947A8]" : isDarkMode ? "hover:bg-gray-700" : "hover:bg-gray-100")}>
              {day.getDate()}
              {hasMeetings && <span className="absolute bottom-1 w-1 h-1 bg-[#6947A8] rounded-full"></span>}
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

  return (
    <>
      <div className="flex flex-col md:flex-row gap-8">
        <div className="md:w-80 flex-shrink-0">
          <h2 className="text-2xl font-bold mb-4">Meeting Room</h2>
          {!isVip && (
            <div className={cn(
              "mb-4 p-3 rounded bg-yellow-50 border border-yellow-300 text-yellow-800 text-sm",
              isDarkMode ? "bg-yellow-900/20 border-yellow-700 text-yellow-200" : ""
            )}>
              {isFreeUserLimitReached ? (
                <>
                  <span className="font-bold">You have reached your daily usage limit.</span><br />
                  {freeUserLimitReason}
                </>
              ) : (
                <>Free account: Up to 3 room creations per day, each room up to 30 minutes. Upgrade for unlimited usage.</>
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
            <div className={cn("p-4 rounded-lg border", isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200")}>
              <h3 className="font-medium mb-3">Meeting Appointment</h3>
              <div className="mb-3 flex space-x-2">
                <button onClick={() => { const newDate = new Date(currentMonth); newDate.setMonth(newDate.getMonth() - 1); setCurrentMonth(newDate); }} className={cn("px-2 py-1 rounded text-sm", isDarkMode ? "bg-gray-700 hover:bg-gray-600" : "bg-gray-100 hover:bg-gray-200")}>&lt;</button>
                <div className="flex-1 p-2 text-center text-sm font-medium">{currentMonth.toLocaleDateString("en-US", { month: "long", year: "numeric" })}</div>
                <button onClick={() => { const newDate = new Date(currentMonth); newDate.setMonth(newDate.getMonth() + 1); setCurrentMonth(newDate); }} className={cn("px-2 py-1 rounded text-sm", isDarkMode ? "bg-gray-700 hover:bg-gray-600" : "bg-gray-100 hover:bg-gray-200")}>&gt;</button>
              </div>
              <div className="grid grid-cols-7 gap-1 text-center text-xs mb-2">
                <div>MON</div><div>TUE</div><div>WED</div><div>THU</div><div>FRI</div><div>SAT</div><div>SUN</div>
              </div>
              {renderCalendar()}
              {selectedDate && dateMeetings.length > 0 ? (
                <div className="mt-3 text-xs p-2 border-t">
                  {dateMeetings.map((meeting) => (
                    <div key={meeting.id} className="mb-1 last:mb-0 p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">{new Date(meeting.startTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} • {meeting.endTime ? Math.round((new Date(meeting.endTime).getTime() - new Date(meeting.startTime).getTime()) / 60000) : 60}min</span>
                        <div className="flex items-center">
                          <span className="text-gray-500 truncate max-w-[100px] mr-1">{meeting.title}</span>
                          {renderDropdownActions({ id: meeting.id, title: meeting.title })}
                        </div>
                      </div>
                      {meeting.description && <div className="text-gray-500 truncate mt-0.5">{meeting.description}</div>}
                    </div>
                  ))}
                </div>
              ) : selectedDate ? (
                <div className="text-xs p-2 border-t text-center text-gray-500">No meetings scheduled for this date</div>
              ) : (
                <div className="text-xs p-2 border-t text-center text-gray-500">Select a date to view scheduled meetings</div>
              )}
            </div>
          </div>
        </div>

        <div className="flex-grow">
          <Tabs defaultValue="available" className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="available">Available Rooms</TabsTrigger>
              <TabsTrigger value="upcoming">Upcoming Meetings</TabsTrigger>
              {isVip && (
                <TabsTrigger value="recorded">Recorded Sessions</TabsTrigger>
              )}
            </TabsList>
            <TabsContent value="available">
              {isLoadingMeetings ? (
                <div className="p-6 text-center rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/50">
                  <p className={cn("text-lg", isDarkMode ? "text-gray-400" : "text-gray-500")}>Loading meeting rooms...</p>
                </div>
              ) : formattedActiveMeetings.length === 0 ? (
                <div className="p-6 text-center rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/50">
                  <p className={cn("text-lg", isDarkMode ? "text-gray-400" : "text-gray-500")}>No available rooms found</p>
                  <p className={cn("text-sm mt-2", isDarkMode ? "text-gray-400" : "text-gray-500")}>Create a new meeting to get started</p>
                </div>
              ) : (
                <MeetingRoomGrid rooms={formattedActiveMeetings} onRoomClick={handleRoomClick} />
              )}
            </TabsContent>
            <TabsContent value="upcoming">
              {monthMeetings.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {monthMeetings.map((meeting) => (
                    <div key={meeting.id} className={cn("p-4 rounded-lg border transition-all", isDarkMode ? "bg-gray-800 border-gray-700 hover:border-[#6947A8]" : "bg-white border-gray-200 hover:border-[#6947A8]")}>
                      <div className="mb-2 flex justify-between items-center">
                        <h3 className="font-medium truncate">{meeting.title}</h3>
                        <div className="flex items-center gap-2">
                          <span className={cn("text-xs px-2 py-0.5 rounded-full", meeting.status === "Active" ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300" : "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300")}>{meeting.status}</span>
                          {renderDropdownActions({ id: meeting.id, title: meeting.title }, true)}
                        </div>
                      </div>
                      <div className="space-y-1 mb-2">
                        <div className="text-sm text-gray-500 dark:text-gray-400"><span className="inline-block min-w-[100px]">Host:</span><span className="font-medium">{meeting.hostName}</span></div>
                        <div className="text-sm text-gray-500 dark:text-gray-400"><span className="inline-block min-w-[100px]">Date:</span><span className="font-medium">{new Date(meeting.startTime).toLocaleDateString()}</span></div>
                        <div className="text-sm text-gray-500 dark:text-gray-400"><span className="inline-block min-w-[100px]">Time:</span><span className="font-medium">{new Date(meeting.startTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span></div>
                      </div>
                      {meeting.description && <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">{meeting.description}</p>}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-6 text-center rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/50">
                  <p className={cn("text-lg", isDarkMode ? "text-gray-400" : "text-gray-500")}>No upcoming meetings found</p>
                  <p className={cn("text-sm mt-2", isDarkMode ? "text-gray-400" : "text-gray-500")}>Schedule a meeting to get started</p>
                </div>
              )}
            </TabsContent>
            <TabsContent value="recorded">
              {isLoadingRecordings ? (
                <div className="p-6 text-center rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/50">
                  <p className={cn("text-lg", isDarkMode ? "text-gray-400" : "text-gray-500")}>Loading recorded sessions...</p>
                </div>
              ) : recordedSessions.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {recordedSessions.map((recording) => (
                    <div key={recording.id} onClick={() => { if (recording.storagePath) { const params = new URLSearchParams({ url: recording.storagePath, title: recording.meetingTitle || "Untitled Recording" }); router.push(`/video-viewer?${params.toString()}`); } }} className={cn("p-4 rounded-lg border transition-all cursor-pointer hover:shadow-lg transform hover:scale-[1.02]", isDarkMode ? "bg-gray-800 border-gray-700 hover:border-[#6947A8]" : "bg-white border-gray-200 hover:border-[#6947A8]")}>
                      <div className="mb-2 flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-[#6947A8] text-white"><Play className="h-4 w-4 ml-0.5" /></div>
                          <h3 className="font-medium truncate">{recording.meetingTitle || "Untitled Recording"}</h3>
                        </div>
                        <span className={cn("text-xs px-2 py-0.5 rounded-full", recording.processed ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300" : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300")}>{recording.processed ? "Processed" : "Processing"}</span>
                      </div>
                      <div className="space-y-1 mb-2">
                        <div className="text-sm text-gray-500 dark:text-gray-400"><span className="inline-block min-w-[100px]">Date:</span><span className="font-medium">{new Date(recording.createdAt).toLocaleDateString()}</span></div>
                        <div className="text-sm text-gray-500 dark:text-gray-400"><span className="inline-block min-w-[100px]">Duration:</span><span className="font-medium">{recording.duration ? `${recording.duration} minutes` : "Unknown"}</span></div>
                      </div>
                      {recording.transcription && (
                        <div className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                          <span className="font-medium">Transcription:</span>
                          <p className="line-clamp-2 mt-1">{recording.transcription}</p>
                        </div>
                      )}
                      <div className="mt-3 pt-2 border-t border-gray-200 dark:border-gray-600">
                        <p className="text-xs text-[#6947A8] dark:text-[#8B6CC7] flex items-center gap-1"><Play className="h-3 w-3" />Click to watch recording</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-6 text-center rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/50">
                  <p className={cn("text-lg", isDarkMode ? "text-gray-400" : "text-gray-500")}>No recorded sessions available</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
      <RoomCreationModal show={showCreateModal} onClose={() => setShowCreateModal(false)} onCreateRoom={handleCreateRoom} />
      <JoinMeetingModal show={showJoinModal} onClose={() => setShowJoinModal(false)} onJoinRoom={handleJoinRoom} />
      <ScheduleMeetingModal show={showScheduleModal} onClose={() => setShowScheduleModal(false)} onScheduleMeeting={handleScheduleMeetingSubmit} meetingId={meetingId ?? undefined} />
      <MeetingEditModal show={showEditModal} onClose={() => setShowEditModal(false)} meeting={selectedMeeting} onUpdateMeeting={handleUpdateMeeting} />
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-red-500">Delete Meeting</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete the meeting <span className="font-medium">{meetingToDelete?.title}</span>? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)} disabled={isDeleting}>Cancel</Button>
            <Button className="bg-red-500 hover:bg-red-600 text-white relative" onClick={() => { if (meetingToDelete) { handleDeleteMeeting(meetingToDelete.id, userInfo?.id || ""); setShowDeleteDialog(false); setMeetingToDelete(null); } }} disabled={isDeleting}>
              <span className={cn("flex items-center gap-2", isDeleting && "opacity-0")}><Trash2 size={16} /> Delete</span>
              {isDeleting && <div className="absolute inset-0 flex items-center justify-center"><div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" /></div>}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
