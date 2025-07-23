"use client";

import { useState } from "react";
import { Calendar, Clock, Users, Video, Plus, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function MeetingsPage() {
  const [view, setView] = useState<"upcoming" | "completed" | "all">("upcoming");

  // Mock data - replace with real API call
  const meetings = [
    {
      id: 1,
      title: "Advanced Sign Language Workshop",
      instructor: "Sarah Johnson",
      participants: 15,
      maxParticipants: 20,
      date: "2024-01-20",
      time: "10:00 AM",
      duration: "2 hours",
      status: "Upcoming",
      type: "Workshop",
      description: "Interactive workshop focusing on advanced sign language techniques",
    },
    {
      id: 2,
      title: "Beginner's Q&A Session",
      instructor: "John Smith",
      participants: 8,
      maxParticipants: 12,
      date: "2024-01-18",
      time: "2:00 PM",
      duration: "1 hour",
      status: "Upcoming",
      type: "Q&A",
      description: "Open Q&A session for beginner students",
    },
    {
      id: 3,
      title: "Business Sign Language Seminar",
      instructor: "Lisa Brown",
      participants: 22,
      maxParticipants: 25,
      date: "2024-01-15",
      time: "9:00 AM",
      duration: "3 hours",
      status: "Completed",
      type: "Seminar",
      description: "Professional sign language for workplace communication",
    },
    {
      id: 4,
      title: "Kids Learning Session",
      instructor: "Mike Davis",
      participants: 10,
      maxParticipants: 15,
      date: "2024-01-22",
      time: "4:00 PM",
      duration: "45 minutes",
      status: "Upcoming",
      type: "Kids Session",
      description: "Fun and interactive sign language session for children",
    },
  ];

  const filteredMeetings = meetings.filter((meeting) => {
    if (view === "upcoming") return meeting.status === "Upcoming";
    if (view === "completed") return meeting.status === "Completed";
    return true;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Upcoming":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "Completed":
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
      case "Cancelled":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
      default:
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "Workshop":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300";
      case "Q&A":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
      case "Seminar":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300";
      case "Kids Session":
        return "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Meeting Management</h1>
          <p className="text-gray-600 dark:text-gray-400">Schedule and manage virtual meetings</p>
        </div>
        <Button className="bg-[#6947A8] hover:bg-[#5a3d8c]">
          <Plus className="h-4 w-4 mr-2" />
          Schedule Meeting
        </Button>
      </div>

      {/* View Filters */}
      <div className="flex space-x-2">
        <Button
          variant={view === "upcoming" ? "default" : "outline"}
          onClick={() => setView("upcoming")}
          className={view === "upcoming" ? "bg-[#6947A8] hover:bg-[#5a3d8c]" : ""}
        >
          Upcoming
        </Button>
        <Button
          variant={view === "completed" ? "default" : "outline"}
          onClick={() => setView("completed")}
          className={view === "completed" ? "bg-[#6947A8] hover:bg-[#5a3d8c]" : ""}
        >
          Completed
        </Button>
        <Button
          variant={view === "all" ? "default" : "outline"}
          onClick={() => setView("all")}
          className={view === "all" ? "bg-[#6947A8] hover:bg-[#5a3d8c]" : ""}
        >
          All Meetings
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <Calendar className="h-8 w-8 text-blue-500" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Meetings</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{meetings.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <Clock className="h-8 w-8 text-green-500" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Upcoming</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {meetings.filter((m) => m.status === "Upcoming").length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <Users className="h-8 w-8 text-purple-500" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Participants</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {meetings.reduce((sum, m) => sum + m.participants, 0)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <Video className="h-8 w-8 text-orange-500" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Completed</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {meetings.filter((m) => m.status === "Completed").length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Meetings List */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Meeting Details
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Instructor
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Schedule
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Participants
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
              {filteredMeetings.map((meeting) => (
                <tr key={meeting.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {meeting.title}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {meeting.description}
                      </div>
                      <div className="mt-1">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTypeColor(meeting.type)}`}>
                          {meeting.type}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {meeting.instructor}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 dark:text-white">{meeting.date}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {meeting.time} ({meeting.duration})
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 dark:text-white">
                      {meeting.participants}/{meeting.maxParticipants}
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-1">
                      <div
                        className="bg-[#6947A8] h-2 rounded-full"
                        style={{ width: `${(meeting.participants / meeting.maxParticipants) * 100}%` }}
                      ></div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(meeting.status)}`}>
                      {meeting.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex space-x-2 justify-end">
                      <Button size="sm" variant="ghost">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="ghost" className="text-red-600">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
} 