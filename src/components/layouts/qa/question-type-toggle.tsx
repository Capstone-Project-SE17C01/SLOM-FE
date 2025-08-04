import React, { useState, useEffect } from 'react';
import { cn } from '@/utils/cn';
import { Users, User } from 'lucide-react';
import { QuestionTypeToggleProps } from '@/types/IQa';

export default function QuestionTypeToggle({
  isCurrentUser,
  onToggle,
  className,
  isAdmin
}: QuestionTypeToggleProps) {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    console.log(isAdmin)
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsScrolled(scrollTop > 50); // Change to scrolled state after 50px
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
      return (
      <div className={cn(
        "flex items-center justify-center p-1 fixed left-1/2 transform -translate-x-1/2 z-10 transition-all duration-300 ease-in-out h-12",
        isScrolled ? "top-4" : "top-20",
        className
      )}>
      <div className="relative inline-flex items-center rounded-lg bg-gray-100 p-1 shadow-sm h-[3rem]">
        <button
          onClick={() => onToggle(false)}
          className={cn(
            "relative flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-all duration-200 ease-in-out justify-center",
            "hover:bg-white hover:shadow-sm",
            !isCurrentUser 
              ? "bg-white shadow-sm" 
              : "hover:text-gray-900",
              isAdmin ? "w-56" : ""
          )}
        >
          <Users className="h-4 w-4 z-10" />
          <span className='z-10'>All Questions</span>
        </button>

        <button
          onClick={() => onToggle(true)}
          className={cn(
            "relative flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-all duration-200 ease-in-out justify-center",
            isCurrentUser 
              ? "bg-white shadow-sm" 
              : "hover:bg-white hover:shadow-sm",
              isAdmin ? "w-56" : ""
          )}
        >
          <User className="h-4 w-4 z-10" />
          <span className='z-10'>{isAdmin ? "Unanswered Questions" : "My Questions"}</span>
        </button>

        <div
          className={cn(
            "absolute inset-y-1 w-[calc(50%-0.25rem)] rounded-md bg-white shadow-sm transition-all duration-200 ease-in-out",
            isCurrentUser ? "translate-x-[calc(100%+0.25rem)]" : "translate-x-0"
          )}
        />
      </div>
    </div>
  );
}