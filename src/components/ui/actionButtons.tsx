import { ButtonCourse } from "./buttonCourse";
import { useTranslations } from "next-intl";
import { cn } from "@/utils/cn";
import { useTheme } from "@/contexts/ThemeContext";

export default function ActionButtons({
  onContinue,
  onBack,
  canGoBack,
  t_learn,
}: {
  onContinue: () => void;
  onBack: () => void;
  canGoBack: boolean;
  t_learn: ReturnType<typeof useTranslations>;
}) {
  const { isDarkMode } = useTheme();
  
  return (
    <div className="flex flex-col items-center justify-center gap-4 w-full">
      <ButtonCourse
        onClick={onContinue}
        variant="primary"
        className="w-full bg-primary hover:bg-primary/80 transition-all duration-300 text-center text-white font-bold py-3 rounded-xl text-lg shadow"
      >
        {t_learn("continue")}
      </ButtonCourse>
      <ButtonCourse
        onClick={onBack}
        variant="ghost"
        className={cn(
          "w-full border-2 rounded-xl py-3 font-semibold text-lg flex items-center justify-center gap-2",
          isDarkMode 
            ? "border-gray-600 text-gray-200 hover:bg-gray-700" 
            : "border-gray-300 text-[#0a2233] hover:bg-gray-100"
        )}
        disabled={!canGoBack}
      >
        {t_learn("back")}
      </ButtonCourse>
    </div>
  );
}
