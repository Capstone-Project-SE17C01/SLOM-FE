import React from "react";
import { FaSearch } from "react-icons/fa";
import { cn } from "@/utils/cn";
import { useTheme } from "@/contexts/ThemeContext";

interface SearchInputProps {
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
}

export default function SearchInput({
  placeholder = "Search",
  value,
  onChange,
  className = "",
}: SearchInputProps) {
  const { isDarkMode } = useTheme();
  
  return (
    <div className={`relative ${className}`}>
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={cn(
          "pl-10 pr-4 py-2 rounded-lg border focus:outline-none focus:ring-2 min-w-[220px]",
          isDarkMode 
            ? "border-gray-600 bg-gray-800 text-gray-100 focus:ring-primary placeholder:text-gray-400" 
            : "border-gray-300 bg-white text-gray-900 focus:ring-yellow-400 placeholder:text-gray-500"
        )}
      />
      <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
    </div>
  );
}
