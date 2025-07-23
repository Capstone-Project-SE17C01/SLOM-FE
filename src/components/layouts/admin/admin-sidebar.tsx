"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/utils/cn";
import { useTheme } from "@/contexts/ThemeContext";
import {
  LayoutDashboard,
  Users,
  BookOpen,
  MessageSquare,
  Settings,
  FileText,
  BarChart3,
  Calendar,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import Image from "next/image";

interface AdminSidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

export default function AdminSidebar({
  collapsed,
  onToggle,
}: AdminSidebarProps) {
  const { isDarkMode } = useTheme();
  const pathname = usePathname();

  const menuItems = [
    {
      name: "Dashboard",
      href: "/admin",
      icon: LayoutDashboard,
      description: "Overview & Analytics",
    },
    {
      name: "Users",
      href: "/admin/users",
      icon: Users,
      description: "Manage Users",
    },
    {
      name: "Courses",
      href: "/admin/courses",
      icon: BookOpen,
      description: "Course Management",
    },
    {
      name: "Messages",
      href: "/admin/messages",
      icon: MessageSquare,
      description: "Communication",
    },
    {
      name: "Analytics",
      href: "/admin/analytics",
      icon: BarChart3,
      description: "Reports & Stats",
    },
    {
      name: "Meetings",
      href: "/admin/meetings",
      icon: Calendar,
      description: "Schedule & Rooms",
    },
    {
      name: "Feedback",
      href: "/admin/feedback",
      icon: MessageSquare,
      description: "Feedback Management",
    },
    {
      name: "Content",
      href: "/admin/content",
      icon: FileText,
      description: "Content Management",
    },
    {
      name: "Settings",
      href: "/admin/settings",
      icon: Settings,
      description: "System Settings",
    },
  ];

  return (
    <div
      className={cn(
        "flex flex-col border-r transition-all duration-300 ease-in-out",
        collapsed ? "w-16" : "w-64",
        isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        {!collapsed && (
          <div className="flex items-center">
            <div className="w-8 h-8 rounded-full flex items-center justify-center mr-3">
              <Image
                src="/images/logo.png"
                alt="SLOM Logo"
                width={24}
                height={24}
              />
            </div>
            <span className="font-bold text-lg text-[#6947A8]">SLOM Admin</span>
          </div>
        )}
        <button
          onClick={onToggle}
          className={cn(
            "p-1.5 rounded-lg transition-colors",
            isDarkMode
              ? "hover:bg-gray-700 text-gray-300"
              : "hover:bg-gray-100 text-gray-600"
          )}
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            // Custom active logic for Courses
            let isActive = pathname === item.href;
            if (
              item.name === "Courses" &&
              ["/admin/courses", "/admin/modules", "/admin/lessons"].some((p) =>
                pathname.startsWith(p)
              )
            ) {
              isActive = true;
            }
            return (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center px-3 py-3 rounded-lg transition-all duration-200 group",
                    isActive
                      ? "bg-[#6947A8] text-white shadow-md"
                      : isDarkMode
                      ? "text-gray-300 hover:bg-gray-700 hover:text-white"
                      : "text-gray-700 hover:bg-gray-100 hover:text-gray-900",
                    collapsed && "justify-center"
                  )}
                  title={collapsed ? item.name : ""}
                >
                  <item.icon
                    className={cn(
                      "h-5 w-5",
                      collapsed ? "mx-auto" : "mr-3",
                      isActive ? "text-white" : ""
                    )}
                  />
                  {!collapsed && (
                    <div className="flex-1">
                      <div className="font-medium">{item.name}</div>
                      <div
                        className={cn(
                          "text-xs opacity-70",
                          isActive
                            ? "text-white"
                            : "text-gray-500 dark:text-gray-400"
                        )}
                      >
                        {item.description}
                      </div>
                    </div>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer */}
      {!collapsed && (
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
            SLOM Admin Panel v1.0
          </div>
        </div>
      )}
    </div>
  );
}
