// src/components/ui/QuizAction.tsx
import React from "react";
import { ButtonCourse } from "@/components/ui/buttonCourse";
import { useTranslations } from "next-intl";
import { cn } from "@/utils/cn";

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
            className="w-full bg-primary hover:bg-primary/80 transition-all duration-300 text-center text-white font-bold py-3 rounded-xl text-lg shadow-md"
            onClick={onContinue}
          >
            {t_learn("continue")}
          </ButtonCourse>
        )}
        <ButtonCourse
          variant="default"
          className={cn(
            "w-full border-2 rounded-xl py-3 font-semibold text-lg flex items-center justify-center gap-2",
            "border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100",
            "hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-300"
          )}
          onClick={onDontKnow}
          disabled={disabled}
        >
          {t_learn("dontKnow")}
        </ButtonCourse>
        {showExplanation && (
          <div className="bg-gray-200 dark:bg-gray-700 rounded-xl p-3 text-gray-900 dark:text-gray-100 text-center font-bold mt-1 w-full">
            {explanation}
          </div>
        )}
      </div>
    </>
  );
}
