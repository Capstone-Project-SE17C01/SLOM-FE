"use client";

import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { Menu, Search, Bell, LogOut, UserCircle, Sun, Moon } from "lucide-react";
import { cn } from "@/utils/cn";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { RootState } from "@/middleware/store";
import { useTheme } from "@/contexts/ThemeContext";
import { toast } from "sonner";
import { logout } from "@/redux/auth/slice";

interface AdminHeaderProps {
  onToggleSidebar: () => void;
}

export default function AdminHeader({ onToggleSidebar }: AdminHeaderProps) {
  const { isDarkMode, toggleDarkMode } = useTheme();
  const { userInfo } = useSelector((state: RootState) => state.auth);
  const router = useRouter();
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
    router.push("/login");
    toast.success("Successfully logged out");
  };

  return (
    <header
      className={cn(
        "h-16 border-b flex items-center justify-between px-6",
        isDarkMode
          ? "bg-gray-800 border-gray-700"
          : "bg-white border-gray-200"
      )}
    >
      {/* Left side */}
      <div className="flex items-center">
        <button
          onClick={onToggleSidebar}
          className={cn(
            "p-2 rounded-lg mr-4 md:hidden",
            isDarkMode
              ? "hover:bg-gray-700 text-gray-300"
              : "hover:bg-gray-100 text-gray-600"
          )}
        >
          <Menu className="h-5 w-5" />
        </button>

        {/* Search */}
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search admin panel..."
            className={cn(
              "pl-10 pr-4 py-2 w-64 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-[#6947A8] focus:border-transparent",
              isDarkMode
                ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                : "bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500"
            )}
          />
        </div>
      </div>

      {/* Right side */}
      <div className="flex items-center space-x-4">
        {/* Theme Toggle */}
        <button
          onClick={toggleDarkMode}
          className={cn(
            "p-2 rounded-lg transition-colors",
            isDarkMode
              ? "hover:bg-gray-700 text-gray-300"
              : "hover:bg-gray-100 text-gray-600"
          )}
        >
          {isDarkMode ? (
            <Sun className="h-5 w-5" />
          ) : (
            <Moon className="h-5 w-5" />
          )}
        </button>

        {/* Notifications */}
        <button
          className={cn(
            "p-2 rounded-lg transition-colors relative",
            isDarkMode
              ? "hover:bg-gray-700 text-gray-300"
              : "hover:bg-gray-100 text-gray-600"
          )}
        >
          <Bell className="h-5 w-5" />
          <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
        </button>

        {/* User Menu */}
        {userInfo ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                className={cn(
                  "flex items-center space-x-2 p-2 rounded-lg transition-colors",
                  isDarkMode
                    ? "hover:bg-gray-700"
                    : "hover:bg-gray-100"
                )}
              >
                <Avatar className="h-8 w-8">
                  <AvatarImage
                    src={userInfo.avatarUrl}
                    alt={userInfo.username}
                  />
                  <AvatarFallback>{userInfo.username?.[0]?.toUpperCase()}</AvatarFallback>
                </Avatar>
                <div className="hidden md:block text-left">
                  <p className="text-sm font-medium">{userInfo.username}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Admin</p>
                </div>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuLabel>
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium">{userInfo.username}</p>
                  <p className="text-xs text-gray-500">{userInfo.email}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <UserCircle className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                asChild 
                className="text-destructive cursor-pointer"
              >
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Logout</span>
                </button>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push("/login")}
          >
            <UserCircle className="h-4 w-4 mr-2" />
            Sign In
          </Button>
        )}
      </div>
    </header>
  );
} 