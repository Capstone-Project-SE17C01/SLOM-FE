import { Loader2 } from "lucide-react";
import { cn } from "@/utils/cn";
import { useTheme } from "@/contexts/ThemeContext";

export default function Spinner({ text = "Loading..." }: { text?: string }) {
  const { isDarkMode } = useTheme();
  
  return (
    <div className={cn(
      "flex items-center gap-2 px-4 py-2 rounded-lg shadow",
      isDarkMode ? "bg-gray-800 text-white" : "bg-white text-gray-800"
    )}>
      <Loader2 className="h-5 w-5 animate-spin text-primary" />
      <span>{text}</span>
    </div>
  );
}
