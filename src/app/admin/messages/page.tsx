"use client";

import { useState } from "react";
import { Search, MessageSquare, Reply, Archive, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function MessagesPage() {
  const [searchTerm, setSearchTerm] = useState("");

  // Mock data - replace with real API call
  const messages = [
    {
      id: 1,
      from: "John Doe",
      email: "john.doe@example.com",
      avatar: "/images/avatar-1.jpg",
      subject: "Course Access Issue",
      message: "I'm having trouble accessing the Advanced Sign Language course. Can you please help?",
      timestamp: "2024-01-15 10:30 AM",
      status: "Unread",
      priority: "High",
    },
    {
      id: 2,
      from: "Jane Smith",
      email: "jane.smith@example.com",
      avatar: "/images/avatar-2.jpg",
      subject: "Feature Request",
      message: "It would be great to have mobile app support for practicing sign language on the go.",
      timestamp: "2024-01-15 09:15 AM",
      status: "Read",
      priority: "Medium",
    },
    {
      id: 3,
      from: "Mike Johnson",
      email: "mike.johnson@example.com",
      avatar: "",
      subject: "Payment Issue",
      message: "My payment was charged twice for the same course. Please investigate and refund.",
      timestamp: "2024-01-14 03:45 PM",
      status: "Replied",
      priority: "High",
    },
    {
      id: 4,
      from: "Sarah Wilson",
      email: "sarah.wilson@example.com",
      avatar: "",
      subject: "Great Platform!",
      message: "Thank you for creating such an amazing platform for learning sign language. My kids love it!",
      timestamp: "2024-01-14 11:20 AM",
      status: "Read",
      priority: "Low",
    },
  ];

  const filteredMessages = messages.filter(
    (message) =>
      message.from.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.subject.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Unread":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
      case "Read":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
      case "Replied":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High":
        return "bg-red-500";
      case "Medium":
        return "bg-yellow-500";
      case "Low":
        return "bg-green-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Message Center</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage customer communications</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline">
            <Archive className="h-4 w-4 mr-2" />
            Archive All Read
          </Button>
        </div>
      </div>

      {/* Search */}
      <div className="flex items-center space-x-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search messages..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-[#6947A8] focus:border-transparent"
          />
        </div>
      </div>

      {/* Messages List */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="divide-y divide-gray-200 dark:divide-gray-600">
          {filteredMessages.map((message) => (
            <div
              key={message.id}
              className={`p-6 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors ${
                message.status === "Unread" ? "bg-blue-50 dark:bg-blue-900/20" : ""
              }`}
              onClick={() => console.log(`Selected message: ${message.id}`)}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4 flex-1">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={message.avatar} alt={message.from} />
                    <AvatarFallback>{message.from[0]}</AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                        {message.from}
                      </h3>
                      <div
                        className={`w-2 h-2 rounded-full ${getPriorityColor(message.priority)}`}
                        title={`${message.priority} Priority`}
                      ></div>
                    </div>
                    
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                      {message.email}
                    </p>
                    
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                      {message.subject}
                    </h4>
                    
                    <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                      {message.message}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col items-end space-y-2 ml-4">
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {message.timestamp}
                  </span>
                  
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                      message.status
                    )}`}
                  >
                    {message.status}
                  </span>

                  <div className="flex space-x-1">
                    <Button size="sm" variant="ghost" title="Reply">
                      <Reply className="h-3 w-3" />
                    </Button>
                    <Button size="sm" variant="ghost" title="Archive">
                      <Archive className="h-3 w-3" />
                    </Button>
                    <Button size="sm" variant="ghost" title="Delete" className="text-red-600">
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <MessageSquare className="h-8 w-8 text-blue-500" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Messages</p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">{messages.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <div className="h-8 w-8 bg-red-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">
                {messages.filter((m) => m.status === "Unread").length}
              </span>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Unread</p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">
                {messages.filter((m) => m.status === "Unread").length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <div className="h-8 w-8 bg-yellow-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">
                {messages.filter((m) => m.priority === "High").length}
              </span>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">High Priority</p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">
                {messages.filter((m) => m.priority === "High").length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <div className="h-8 w-8 bg-green-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">
                {messages.filter((m) => m.status === "Replied").length}
              </span>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Replied</p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">
                {messages.filter((m) => m.status === "Replied").length}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 