import React from "react";
import { cn } from "@/utils/cn";
import { useTheme } from "@/contexts/ThemeContext";

interface StatCardProps {
  value: number | string;
  label: string;
  className?: string;
}

export default function StatCard({ value, label, className }: StatCardProps) {
  const { isDarkMode } = useTheme();
  
  return (
    <div
      className={cn(
        "rounded-xl shadow flex flex-col items-center justify-center w-24 h-24",
        isDarkMode 
          ? "bg-gray-800 text-white" 
          : "bg-white text-[#0a2233]",
        className
      )}
    >
      <span className={cn(
        "text-3xl font-extrabold",
        isDarkMode ? "text-gray-100" : "text-[#0a2233]"
      )}>
        {value}
      </span>
      <span className={cn(
        "text-xs mt-1 text-center",
        isDarkMode ? "text-gray-300" : "text-[#0a2233]"
      )}>
        {label}
      </span>
    </div>
  );
}
