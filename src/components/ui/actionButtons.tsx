// src/components/ui/ActionButtons.tsx
export default function ActionButtons({
  onContinue,
  onAlreadyKnow,
}: {
  onContinue: () => void;
  onAlreadyKnow: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <button
        onClick={onContinue}
        className="w-full bg-primary hover:bg-primary/80 transition text-white font-bold py-3 rounded-xl text-lg shadow"
      >
        Tiếp tục
      </button>
      <button
        onClick={onAlreadyKnow}
        className="w-full border-2 border-gray-300 rounded-xl py-3 font-semibold text-lg text-[#0a2233] flex items-center justify-center gap-2"
      >
        Tôi đã biết cái này
      </button>
    </div>
  );
}
