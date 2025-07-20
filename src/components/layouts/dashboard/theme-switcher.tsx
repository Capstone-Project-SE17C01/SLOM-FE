"use client";

import { Moon, Sun } from "lucide-react";
import { cn } from "@/utils/cn";
import { useEffect } from "react";

interface ThemeSwitcherProps {
  isDarkMode: boolean;
  toggleDarkMode?: () => void;
}

export default function ThemeSwitcher({
  isDarkMode,
  toggleDarkMode,
}: ThemeSwitcherProps) {
  useEffect(() => {}, []);
  return (
    <button
      onClick={toggleDarkMode}
      className={cn(
        "p-2 rounded-full",
      )}
    >
      <span className="flex items-center justify-center h-9 w-9 rounded-full bg-white/90 dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 shadow-inner transition-all duration-300">
        {isDarkMode ? (
          <Sun className="h-5 w-5 text-yellow-500 transition-all duration-300" />
        ) : (
          <Moon className="h-5 w-5 text-blue-500 transition-all duration-300" />
        )}
      </span>
    </button>
  );
}
