// src/components/ui/QuizAction.tsx
import React from "react";
import { ButtonCourse } from "@/components/ui/buttonCourse";
import { useTranslations } from "next-intl";
export default function QuizAction({
  onDontKnow,
  onContinue,
  canContinue,
  disabled,
  showExplanation,
  explanation,
  t_learn,
}: {
  onDontKnow: () => void;
  onContinue: () => void;
  canContinue: boolean;
  disabled: boolean;
  showExplanation: boolean;
  explanation: string;
  t_learn: ReturnType<typeof useTranslations>;
}) {
  return (
    <>
      <div className="flex flex-col items-center justify-center mt-4 gap-4 w-full">
        {canContinue && (
          <ButtonCourse
            variant="primary"
            className="w-full bg-primary hover:bg-primary/80 transition-all duration-300 text-center text-white font-bold py-3 rounded-xl text-lg shadow"
            onClick={onContinue}
          >
            {t_learn("continue")}
          </ButtonCourse>
        )}
        <ButtonCourse
          variant="default"
          className="w-full border-2 border-gray-300 rounded-xl py-3 font-semibold text-lg text-[#0a2233] flex items-center justify-center gap-2"
          onClick={onDontKnow}
          disabled={disabled}
        >
          {t_learn("dontKnow")}
        </ButtonCourse>
        {showExplanation && (
          <div className="bg-gray-200 rounded-xl p-3 text-dark text-center font-bold mt-1 w-full">
            {explanation}
          </div>
        )}
      </div>
    </>
  );
}
