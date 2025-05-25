export default function ProgressBar({
  progress,
  className,
}: {
  progress: number;
  className?: string;
}) {
  return (
    <div className={`w-full max-w-4xl mx-auto mt-6 mb-8 ${className}`}>
      <div className="h-4 bg-gray-200 rounded-sm w-full">
        <div
          className={`h-4 bg-primary rounded-sm`}
          style={{ width: `${progress}%` }}
        ></div>
      </div>
    </div>
  );
}
