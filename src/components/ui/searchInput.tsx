import React from "react";
import { FaSearch } from "react-icons/fa";
import { cn } from "@/utils/cn";
import { useTheme } from "@/contexts/ThemeContext";
import { useTranslations } from "next-intl";

interface SearchInputProps {
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
  size?: "sm" | "md" | "lg";
  minWidth?: string;
  withButton?: boolean;
  buttonText?: string;
  onButtonClick?: () => void;
}

export default function SearchInput({
  placeholder,
  value,
  onChange,
  className = "",
  size = "md",
  minWidth = "220px",
  withButton = false,
  buttonText,
  onButtonClick,
}: SearchInputProps) {
  const { isDarkMode } = useTheme();
  const t = useTranslations("common");
  
  // Determine padding and text size based on size prop
  const sizeClasses = {
    sm: "py-1.5 text-sm",
    md: "py-2 text-base",
    lg: "py-3 text-base",
  };
  
  return (
    <div className={cn("flex items-center gap-4", className)}>
      <div className="relative">
        <input
          type="text"
          placeholder={placeholder || t("searchPlaceholder")}
          value={value}
          onChange={onChange}
          className={cn(
            "pl-10 pr-4 rounded-lg border focus:outline-none focus:ring-2",
            sizeClasses[size],
            isDarkMode 
              ? "border-gray-600 bg-gray-800 text-gray-100 focus:ring-primary placeholder:text-gray-400" 
              : "border-gray-300 bg-white text-gray-900 focus:ring-yellow-400 placeholder:text-gray-500"
          )}
          style={{ minWidth }}
        />
        <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
      </div>
      
      {withButton && (
        <button
          className="font-semibold text-sm text-primary flex items-center gap-1 hover:text-primary/80 transition-colors"
          onClick={onButtonClick}
        >
          {buttonText} <span className="ml-1">→</span>
        </button>
      )}
    </div>
  );
}
