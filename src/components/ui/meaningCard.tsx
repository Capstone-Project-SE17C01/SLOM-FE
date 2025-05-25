// src/components/ui/MeaningCard.tsx
export default function MeaningCard({
  meaning,
  label = "ENGLISH",
}: {
  meaning: string;
  label?: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center">
      <div className="text-xl font-bold mb-2">Meaning</div>
      <div className="text-xs text-gray-500 font-semibold mb-1">{label}</div>
      <div className="text-5xl font-extrabold mb-4">{meaning}</div>
    </div>
  );
}
