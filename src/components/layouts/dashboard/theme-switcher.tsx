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
        isDarkMode ? "hover:bg-white/10" : "hover:bg-black/5"
      )}
    >
      {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
    </button>
  );
}
