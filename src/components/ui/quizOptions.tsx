import React from "react";
import { QuizOption } from "@/types/ICourse";
import { cn } from "@/utils/cn";

interface QuizOptionsProps {
  options: QuizOption[];
  selectedOption: string | null;
  isCorrect: boolean | null;
  onSelect: (optionId: string, isCorrect: boolean) => void;
  disabled: boolean;
}

export default function QuizOptions({
  options,
  selectedOption,
  isCorrect,
  onSelect,
  disabled,
}: QuizOptionsProps) {
  return (
    <div className="grid grid-cols-1 gap-4 w-full h-full">
      {Object.entries(options).map(([key, opt]) => (
        <button
          key={key}
          className={cn(
            "border rounded-xl px-5 py-3 font-semibold shadow transition-all duration-300",
            "bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-100",
            "hover:bg-gray-50 dark:hover:bg-gray-700",
            selectedOption === opt.id && isCorrect && "border-green-500 dark:border-green-400",
            selectedOption === opt.id && !isCorrect && "border-red-500 dark:border-red-400"
          )}
          disabled={disabled}
          onClick={() => onSelect(opt.id, opt.isCorrect)}
        >
          {opt.text}
        </button>
      ))}
    </div>
  );
}
