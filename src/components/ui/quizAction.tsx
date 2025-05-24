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
      {canContinue && (
        <div className="flex items-center justify-center w-full mb-4 flex-col">
          <ButtonCourse
            variant="primary"
            className="p-3 text-base shadow w-full"
            onClick={onContinue}
          >
            {t_learn("continue")}
          </ButtonCourse>
        </div>
      )}
      <div className="flex items-center justify-center flex-col mb-4">
        <ButtonCourse
          variant="default"
          className="p-3 text-base shadow"
          onClick={onDontKnow}
          disabled={disabled}
        >
          {t_learn("dontKnow")}
        </ButtonCourse>
        {showExplanation && (
          <div className="bg-gray-200 rounded-xl p-3 text-dark text-center font-bold mt-4">
            {explanation}
          </div>
        )}
      </div>
      {canContinue}
    </>
  );
}
