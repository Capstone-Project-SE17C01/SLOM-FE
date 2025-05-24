import { ButtonCourse } from "./buttonCourse";
import { useTranslations } from "next-intl";
export default function ActionButtons({
  onContinue,
  onAlreadyKnow,
  t_learn,
}: {
  onContinue: () => void;
  onAlreadyKnow: () => void;
  t_learn: ReturnType<typeof useTranslations>;
}) {
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
        onClick={onAlreadyKnow}
        variant="ghost"
        className="w-full border-2 border-gray-300 rounded-xl py-3 font-semibold text-lg text-[#0a2233] flex items-center justify-center gap-2"
      >
        {t_learn("alreadyKnow")}
      </ButtonCourse>
    </div>
  );
}
