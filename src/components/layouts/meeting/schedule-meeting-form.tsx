"use client";

import React, { useState } from 'react';
import { cn } from "@/utils/cn";
import { useTheme } from "@/contexts/ThemeContext";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScheduleMeetingModalProps } from '../../../types/IMeeting';
import { useCreateInvitationMutation, useSendMeetingInvitationMutation } from "../../../api/MeetingApi";


export const ScheduleMeetingModal: React.FC<ScheduleMeetingModalProps> = ({
  show,
  onClose,
  onScheduleMeeting,
  meetingId,
}) => {
  const { isDarkMode } = useTheme();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [duration, setDuration] = useState(30);
  const [recipientEmails, setRecipientEmails] = useState<string>('');
  const [senderName, setSenderName] = useState('');
  const [customMessage, setCustomMessage] = useState('');
  const [showInvitation, setShowInvitation] = useState(false);
  const [sendInvitation, { isLoading: isSending, isSuccess: isSent }] = useSendMeetingInvitationMutation();
  const [createInvitation] = useCreateInvitationMutation();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  if (!show) return null;

  const daysInMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    0
  ).getDate();
  
  const firstDayOfMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    1
  ).getDay();

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };
  
  const handleDateSelect = (day: number) => {
    const newDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    setSelectedDate(newDate);
    setDate(newDate.toISOString().split('T')[0]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!date || !time) return;

    onScheduleMeeting({
      name,
      description,
      date,
      time,
      duration,
    });

    setShowInvitation(true);
    setName('');
    setDescription('');
    setDate('');
    setTime('');
    setDuration(30);
    setSelectedDate(null);
  };

  const handleSendInvitation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!meetingId || !recipientEmails || !senderName) return;
    await createInvitation({
      request: {
        email: recipientEmails.split(',').map(email => email.trim()),
        meetingId
      }
    });
    await sendInvitation({
      id: meetingId,
      request: {
        recipientEmails: recipientEmails.split(',').map(email => email.trim()),
        senderName,
        customMessage,
      }
    });
  };

  const dayNames = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
  
  const calendarDays = [];
  for (let i = 0; i < firstDayOfMonth; i++) {
    calendarDays.push(null);
  }
  for (let i = 1; i <= daysInMonth; i++) {
    calendarDays.push(i);
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <Card className={cn(
        "w-full max-w-xl mx-auto",
        isDarkMode ? "bg-gray-800 text-white" : "bg-white"
      )}>
        <CardHeader className="relative">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Meeting Appointment</h3>
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
            <div className="space-y-4 mb-6">
              <div>
                <label htmlFor="name" className="text-sm font-medium block mb-1">
                  Meeting Name
                </label>
                <Input
                  id="name"
                  placeholder="Enter meeting name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div>
                <label htmlFor="description" className="text-sm font-medium block mb-1">
                  Description
                </label>
                <Input
                  id="description"
                  placeholder="Enter meeting description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
            </div>
            
            <div className="border rounded-lg p-4">
              <div className="flex justify-between items-center mb-4">
                <Button variant="ghost" onClick={handlePrevMonth} size="sm">
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <span className="font-medium">
                  {currentDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                </span>
                <Button variant="ghost" onClick={handleNextMonth} size="sm">
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="grid grid-cols-7 gap-1 mb-4">
                {dayNames.map((day) => (
                  <div key={day} className="text-center text-xs font-medium py-1">
                    {day}
                  </div>
                ))}
                
                {calendarDays.map((day, index) => (
                  <div 
                    key={index} 
                    className={cn(
                      "h-8 w-full flex items-center justify-center text-sm rounded-sm",
                      day === null ? "invisible" : "cursor-pointer",
                      day && selectedDate && 
                        day === selectedDate.getDate() && 
                        currentDate.getMonth() === selectedDate.getMonth() && 
                        currentDate.getFullYear() === selectedDate.getFullYear()
                        ? "bg-[#6947A8] text-white"
                        : day ? "hover:bg-gray-100 dark:hover:bg-gray-700" : ""
                    )}
                    onClick={() => day && handleDateSelect(day)}
                  >
                    {day}
                  </div>
                ))}
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="time" className="text-sm font-medium block mb-1">
                    Time
                  </label>
                  <Input
                    id="time"
                    type="time"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label htmlFor="duration" className="text-sm font-medium block mb-1">
                    Duration
                  </label>
                  <div className="flex items-center">
                    <Input
                      id="duration"
                      type="number"
                      min={5}
                      max={240}
                      value={duration}
                      onChange={(e) => setDuration(Number(e.target.value))}
                    />
                    <span className="ml-2">mins</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="pt-4">
              <Button 
                type="submit" 
                className="w-full bg-[#6947A8] hover:bg-[#5a3c96] text-white"
                disabled={!date || !time}
              >
                Schedule Meeting
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
      {showInvitation && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <Card className={cn(
            "w-full max-w-lg mx-auto",
            isDarkMode ? "bg-gray-800 text-white" : "bg-white"
          )}>
            <CardHeader className="relative">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Send Meeting Invitation Email</h3>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowInvitation(false)}
                  className="absolute right-2 top-2"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSendInvitation} className="space-y-4">
                <div>
                  <label className="text-sm font-medium block mb-1">Recipient Emails (comma separated)</label>
                  <Input
                    value={recipientEmails}
                    onChange={e => setRecipientEmails(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-medium block mb-1">Sender Name</label>
                  <Input
                    value={senderName}
                    onChange={e => setSenderName(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-medium block mb-1">Custom Message</label>
                  <Input
                    value={customMessage}
                    onChange={e => setCustomMessage(e.target.value)}
                  />
                </div>
                <div className="pt-4">
                  <Button
                    type="submit"
                    className="w-full bg-[#6947A8] hover:bg-[#5a3c96] text-white"
                    disabled={isSending}
                  >
                    {isSending ? "Sending..." : "Send Invitation"}
                  </Button>
                  {isSent && (
                    <div className="text-green-600 mt-2 text-center">Invitation sent!</div>
                  )}
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

