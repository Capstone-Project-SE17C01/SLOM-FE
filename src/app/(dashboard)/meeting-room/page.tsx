"use client";

import { useState, useEffect } from "react";
import { useTheme } from "@/contexts/ThemeContext";
import { cn } from "@/utils/cn";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  MeetingRoomActions, 
  MeetingRoomGrid
} from "@/components/layouts/meeting/meeting-room";
import { RoomCreationModal } from "@/features/meeting/components/room-creation-form";
import { useRouter } from "next/navigation";

import { JoinMeetingModal } from "@/features/meeting/components/join-meeting-form";
import { ScheduleMeetingModal } from "@/features/meeting/components/schedule-meeting-form";
import { ScheduledMeeting } from "@/features/meeting/types";
import { createScheduledMeeting, createZegoMeetingRoom, getScheduledMeetingsForDate, getScheduledMeetingsForMonth, getZegoMeetingRooms } from "@/features/meeting/api";

export default function MeetingRoomPage() {
  const { isDarkMode } = useTheme();
  const router = useRouter();
  
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  
  type Room = {
    id: string;
    name: string;
    description: string;
    participantCount: number;
    duration: number;
  };
  const [rooms, setRooms] = useState<Room[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [scheduledMeetings, setScheduledMeetings] = useState<ScheduledMeeting[]>([]);
  const [selectedDateMeetings, setSelectedDateMeetings] = useState<ScheduledMeeting[]>([]);
  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setIsLoading(true);
        
        const activeRooms = await getZegoMeetingRooms();
        
        const formattedRooms = activeRooms.map(room => ({
          id: room.id,
          name: room.name,
          participantCount: 0,
          description: room.description,
          duration: room.duration
        }));
        
        if (formattedRooms.length > 0) {
          setRooms(formattedRooms);
        }
        
        const monthMeetings = await getScheduledMeetingsForMonth(
          currentMonth.getFullYear(), 
          currentMonth.getMonth() + 1
        );
        setScheduledMeetings(monthMeetings);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchAllData();
  }, [currentMonth]);
  
  const handleStartMeeting = () => {
    setShowCreateModal(true);
  };
  
  const handleJoinMeeting = () => {
    setShowJoinModal(true);
  };
  
  const handleScheduleMeeting = () => {
    setShowScheduleModal(true);
  };

  const handleCreateRoom = async (roomName: string, description: string, duration: number) => {
    try {
      const room = await createZegoMeetingRoom({
        name: roomName,
        description,
        duration
      });
      
      setShowCreateModal(false);
      
      setRooms(prev => [...prev, {
        id: room.id,
        name: room.name,
        description: room.description,
        participantCount: 0,
        duration: room.duration
      }]);
      
      router.push(`/meeting?roomID=${room.id}`);
      
    } catch (error) {
      console.error("Failed to create room:", error);
      throw error;
    }
  };
  
  const handleJoinRoom = (roomCode: string) => {
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
      const scheduledMeeting = await createScheduledMeeting({
        name: details.name,
        description: details.description,
        date: details.date,
        time: details.time,
        duration: details.duration
      });
      
      console.log("Meeting scheduled successfully:", scheduledMeeting);
      setShowScheduleModal(false);
      
      fetchScheduledMeetings(currentMonth.getFullYear(), currentMonth.getMonth() + 1);
      
    } catch (error) {
      console.error("Failed to schedule meeting:", error);
    }
  };
  
  const handleRoomClick = (roomId: string) => {
    console.log("Clicked room:", roomId);
    router.push(`/meeting?roomID=${roomId}`);
  };

  const fetchScheduledMeetings = async (year: number, month: number) => {
    try {
      const meetings = await getScheduledMeetingsForMonth(year, month);
      setScheduledMeetings(meetings);
    } catch (error) {
      console.error("Failed to fetch scheduled meetings:", error);
    }
  };

  const handleDateSelection = async (date: Date) => {
    setSelectedDate(date);
    const dateString = date.toISOString().split('T')[0];
    
    try {
      const meetings = await getScheduledMeetingsForDate(dateString);
      setSelectedDateMeetings(meetings);
    } catch (error) {
      console.error("Failed to fetch meetings for date:", error);
    }
  };

  return (
    <>
      <div className="flex flex-col md:flex-row gap-8">
        <div className="md:w-80 flex-shrink-0">
          <h2 className="text-2xl font-bold mb-4">Meeting Room</h2>
          <div className="space-y-6">
            <MeetingRoomActions 
              onStartMeeting={handleStartMeeting}
              onJoinMeeting={handleJoinMeeting}
              onScheduleMeeting={handleScheduleMeeting}
            />
            <div className={cn(
              "p-4 rounded-lg border",
              isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
            )}>
              <h3 className="font-medium mb-3">Meeting Appointment</h3>
              <div className="mb-3 flex space-x-2">
                <button 
                  onClick={() => {
                    const newDate = new Date(currentMonth);
                    newDate.setMonth(newDate.getMonth() - 1);
                    setCurrentMonth(newDate);
                    fetchScheduledMeetings(newDate.getFullYear(), newDate.getMonth() + 1);
                  }}
                  className={cn(
                    "px-2 py-1 rounded text-sm",
                    isDarkMode ? "bg-gray-700 hover:bg-gray-600" : "bg-gray-100 hover:bg-gray-200"
                  )}
                >
                  &lt;
                </button>
                
                <div className="flex-1 p-2 text-center text-sm font-medium">
                  {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                </div>
                
                <button 
                  onClick={() => {
                    const newDate = new Date(currentMonth);
                    newDate.setMonth(newDate.getMonth() + 1);
                    setCurrentMonth(newDate);
                    fetchScheduledMeetings(newDate.getFullYear(), newDate.getMonth() + 1);
                  }}
                  className={cn(
                    "px-2 py-1 rounded text-sm",
                    isDarkMode ? "bg-gray-700 hover:bg-gray-600" : "bg-gray-100 hover:bg-gray-200"
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
              
              {(() => {
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
                
                for (let i = 0; i < firstDay; i++) {
                  calendarDays.push(null);
                }
                
                for (let i = 1; i <= daysInMonth; i++) {
                  calendarDays.push(i);
                }
                
                return (
                  <div className="grid grid-cols-7 gap-1 mb-3">
                    {calendarDays.map((day, i) => {
                      if (day === null) {
                        return <div key={`empty-${i}`} className="h-7 w-full" />;
                      }
                      
                      const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
                      const dateStr = date.toISOString().split('T')[0];
                      
                      const hasMeetings = scheduledMeetings.some(meeting => meeting.date === dateStr);
                      
                      const isSelected = selectedDate && 
                        day === selectedDate.getDate() && 
                        currentMonth.getMonth() === selectedDate.getMonth() && 
                        currentMonth.getFullYear() === selectedDate.getFullYear();
                      
                      return (
                        <div 
                          key={`day-${i}`}
                          onClick={() => handleDateSelection(date)}
                          className={cn(
                            "h-7 w-full flex items-center justify-center text-xs rounded-sm relative cursor-pointer",
                            isSelected ? "bg-[#6947A8] text-white" : 
                              hasMeetings ? "bg-[#6947A8]/20 hover:bg-[#6947A8]/30" : 
                              "hover:bg-gray-100 dark:hover:bg-gray-700"
                          )}
                        >
                          {day}
                          {hasMeetings && !isSelected && (
                            <span className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-[#6947A8] rounded-full" />
                          )}
                        </div>
                      );
                    })}
                  </div>
                );
              })()}
                {selectedDate && selectedDateMeetings.length > 0 ? (
                <div className="text-xs p-2 border-t max-h-36 overflow-y-auto">
                  {selectedDateMeetings.map((meeting) => (
                    <div key={meeting.id} className="mb-1 last:mb-0 p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">{meeting.time.substring(0, 5)} • {meeting.duration}min</span>
                        <span className="text-gray-500 truncate max-w-[120px]">{meeting.name}</span>
                      </div>
                      {meeting.description && (
                        <div className="text-gray-500 truncate mt-0.5">{meeting.description}</div>
                      )}
                    </div>
                  ))}
                </div>
              ) : selectedDate ? (
                <div className="text-xs p-2 border-t text-center text-gray-500">
                  No meetings scheduled for this date
                </div>
              ) : (
                <div className="text-xs p-2 border-t text-center text-gray-500">
                  Select a date to view scheduled meetings
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Right area for room listings */}
        <div className="flex-grow">
          <Tabs defaultValue="available" className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="available">Available Rooms</TabsTrigger>
              <TabsTrigger value="upcoming">Upcoming Meetings</TabsTrigger>
              <TabsTrigger value="recorded">Recorded Sessions</TabsTrigger>
            </TabsList>
              <TabsContent value="available">
              {isLoading ? (
                <div className="p-6 text-center rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/50">
                  <p className={cn(
                    "text-lg",
                    isDarkMode ? "text-gray-400" : "text-gray-500"
                  )}>
                    Loading meeting rooms...
                  </p>
                </div>
              ) : (
                <MeetingRoomGrid 
                  rooms={rooms}
                  onRoomClick={handleRoomClick}
                />
              )}
            </TabsContent>
              <TabsContent value="upcoming">
              {scheduledMeetings.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {scheduledMeetings.map((meeting) => (
                    <div 
                      key={meeting.id}
                      className={cn(
                        "p-4 rounded-lg border cursor-pointer transition-all",
                        isDarkMode 
                          ? "bg-gray-800 border-gray-700 hover:border-[#6947A8]" 
                          : "bg-white border-gray-200 hover:border-[#6947A8]"
                      )}
                    >
                      <div className="mb-2 flex justify-between items-center">
                        <h3 className="font-medium truncate">{meeting.name}</h3>
                        <span className={cn(
                          "text-xs px-2 py-1 rounded-full",
                          isDarkMode ? "bg-[#6947A8]/20 text-purple-300" : "bg-[#6947A8]/10 text-[#6947A8]"
                        )}>
                          {meeting.duration} min
                        </span>
                      </div>
                      
                      {meeting.description && (
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-3 line-clamp-2">
                          {meeting.description}
                        </p>
                      )}
                      
                      <div className="flex items-center justify-between mt-2 text-sm">
                        <div className="flex items-center">
                          <span className={cn(
                            "mr-1",
                            isDarkMode ? "text-gray-400" : "text-gray-500"
                          )}>
                            Date:
                          </span>
                          <span className="font-medium">
                            {new Date(meeting.date).toLocaleDateString()}
                          </span>
                        </div>
                        <div>
                          <span className={cn(
                            "mr-1",
                            isDarkMode ? "text-gray-400" : "text-gray-500"
                          )}>
                            Time:
                          </span>
                          <span className="font-medium">
                            {meeting.time.substring(0, 5)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-6 text-center rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/50">
                  <p className={cn(
                    "text-lg",
                    isDarkMode ? "text-gray-400" : "text-gray-500"
                  )}>
                    No upcoming meetings scheduled
                  </p>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="recorded">
              <div className="p-6 text-center rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/50">
                <p className={cn(
                  "text-lg",
                  isDarkMode ? "text-gray-400" : "text-gray-500"
                )}>
                  No recorded sessions available
                </p>
              </div>
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
      />
    </>
  );
}
