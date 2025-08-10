import React, { useState, useEffect } from 'react';
import { cn } from '@/utils/cn';
import { Users, User } from 'lucide-react';
import { QuestionTypeToggleProps } from '@/types/IQa';
import { useTheme } from '@/contexts/ThemeContext';

export default function QuestionTypeToggle({
  isCurrentUser,
  onToggle,
  className,
  isAdmin
}: QuestionTypeToggleProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const { isDarkMode } = useTheme();

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsScrolled(scrollTop > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className={cn(
      "flex items-center justify-center transition-all duration-300 ease-in-out z-10",
      isScrolled ? "sticky top-4" : "",
      className
    )}>
      <div className={cn(
        "relative inline-flex items-center rounded-xl p-1.5 shadow-md border",
        isDarkMode 
          ? "bg-gray-800 border-gray-700" 
          : "bg-white border-gray-100"
      )}>
        <button
          onClick={() => onToggle(false)}
          className={cn(
            "relative flex items-center gap-2.5 rounded-lg px-5 py-2.5 text-sm font-medium transition-all duration-200 ease-in-out",
            !isCurrentUser 
              ? "bg-blue-50 text-blue-600 shadow-sm" 
              : isDarkMode
                ? "text-gray-300 hover:text-gray-100 hover:bg-gray-700"
                : "text-gray-700 hover:text-gray-900 hover:bg-gray-50",
            isAdmin ? "w-52" : "w-40"
          )}
        >
          <Users className="h-4.5 w-4.5" />
          <span className="font-medium">All Questions</span>
        </button>

        <button
          onClick={() => onToggle(true)}
          className={cn(
            "relative flex items-center gap-2.5 rounded-lg px-5 py-2.5 text-sm font-medium transition-all duration-200 ease-in-out",
            isCurrentUser 
              ? "bg-blue-50 text-blue-600 shadow-sm" 
              : isDarkMode
                ? "text-gray-300 hover:text-gray-100 hover:bg-gray-700"
                : "text-gray-700 hover:text-gray-900 hover:bg-gray-50",
            isAdmin ? "w-52" : "w-40"
          )}
        >
          <User className="h-4.5 w-4.5" />
          <span className="font-medium">{isAdmin ? "Unanswered Questions" : "My Questions"}</span>
        </button>
      </div>
    </div>
  );
}