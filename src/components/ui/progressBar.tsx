// src/components/ui/ProgressBar.tsx
export default function ProgressBar({ progress }: { progress: number }) {
  return (
    <div className="w-full max-w-4xl mx-auto mt-6 mb-8">
      <div className="h-2 bg-gray-200 rounded-full w-full">
        <div
          className="h-2 bg-yellow-400 rounded-full"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
    </div>
  );
}
