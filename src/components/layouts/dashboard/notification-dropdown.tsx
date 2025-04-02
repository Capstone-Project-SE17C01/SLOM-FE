"use client";

import { useState } from "react";
import { Bell } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

function NotificationDropdown() {
  const notifications = [
    { id: 1, message: "New message received" },
    { id: 2, message: "Your order has been shipped" },
    { id: 3, message: "Payment successful" },
  ];

  const [unreadCount, setUnreadCount] = useState(notifications.length);

  const markAllAsRead = () => {
    setUnreadCount(0);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button className="relative" size="icon" variant="ghost">
          <Bell />
          {unreadCount > 0 && (
            <span className="absolute top-0 right-0 -mt-1 -mr-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
              {unreadCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-lg font-semibold">Notifications</h2>
          <Button size="sm" variant="ghost" onClick={markAllAsRead}>
            Mark all as read
          </Button>
        </div>
        <div className="space-y-2">
          {notifications.map((notification) => (
            <div key={notification.id} className="p-2 bg-muted rounded-md">
              {notification.message}
            </div>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}

export default NotificationDropdown;
