// src/components/ui/QuizAction.tsx
import React from "react";

export default function QuizAction({
  onDontKnow,
  disabled,
  showExplanation,
  explanation,
  dontKnowLabel,
}: {
  onDontKnow: () => void;
  disabled: boolean;
  showExplanation: boolean;
  explanation: string;
  dontKnowLabel: string;
}) {
  return (
    <div className="flex items-center justify-center flex-col">
      <button
        className="bg-gray-200 text-[#0a2233] font-bold px-6 py-3 rounded-xl text-sm text-base shadow"
        onClick={onDontKnow}
        disabled={disabled}
      >
        {dontKnowLabel}
      </button>
      {showExplanation && (
        <div className="text-green-600 font-bold mt-4">{explanation}</div>
      )}
    </div>
  );
}
