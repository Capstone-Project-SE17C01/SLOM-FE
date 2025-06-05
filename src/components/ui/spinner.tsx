import { Loader2 } from "lucide-react";

export default function Spinner({ text = "Loading..." }: { text?: string }) {
  return (
    <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg shadow">
      <Loader2 className="h-5 w-5 animate-spin text-primary" />
      <span>{text}</span>
    </div>
  );
}
