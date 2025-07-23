"use client";

import { useState } from "react";
import { cn } from "@/utils/cn";
import { useTheme } from "@/contexts/ThemeContext";
import AdminSidebar from "./admin-sidebar";
import AdminHeader from "./admin-header";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const { isDarkMode } = useTheme();

  const toggleSidebar = () => setSidebarCollapsed(!sidebarCollapsed);

  return (
    <div
      className={cn(
        "min-h-screen flex",
        isDarkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-black"
      )}
    >
      {/* Sidebar */}
      <AdminSidebar collapsed={sidebarCollapsed} onToggle={toggleSidebar} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <AdminHeader onToggleSidebar={toggleSidebar} />

        {/* Content */}
        <main className="flex-1 p-6 overflow-auto">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
} 