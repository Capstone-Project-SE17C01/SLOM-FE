import React from "react";
import { QuizOption } from "@/types/ICourse";

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
          className={`bg-white border border-gray-300 rounded-xl px-5 py-3 font-semibold text-[#0a2233] shadow hover:bg-gray-50 transition
            ${
              selectedOption === opt.id
                ? isCorrect
                  ? "border-green-500"
                  : "border-red-500"
                : ""
            }
          `}
          disabled={disabled}
          onClick={() => onSelect(opt.id, opt.isCorrect)}
        >
          {opt.text}
        </button>
      ))}
    </div>
  );
}
