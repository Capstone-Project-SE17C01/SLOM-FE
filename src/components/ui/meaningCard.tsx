// src/components/ui/MeaningCard.tsx
import { useTranslations } from "next-intl";

export default function MeaningCard({ meaning }: { meaning: string }) {
  const t = useTranslations("meaningCard");
  return (
    <div className="flex flex-col items-center justify-center text-center">
      <div className="text-xl font-bold mb-2">{t("meaning")}</div>
      <div className="text-xs text-gray-500 font-semibold mb-1">
        {t("label")}
      </div>
      <div className="text-5xl font-extrabold mb-4">{meaning}</div>
    </div>
  );
}
