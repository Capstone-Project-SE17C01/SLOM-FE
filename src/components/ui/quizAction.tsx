// src/components/ui/QuizAction.tsx
import React from "react";
import { ButtonCourse } from "@/components/ui/buttonCourse";

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
      <ButtonCourse
        variant="default"
        className="p-3 text-base shadow"
        onClick={onDontKnow}
        disabled={disabled}
      >
        {dontKnowLabel}
      </ButtonCourse>
      {showExplanation && (
        <div className="bg-gray-200 rounded-xl p-3 text-dark text-center font-bold mt-4">
          {explanation}
        </div>
      )}
    </div>
  );
}
