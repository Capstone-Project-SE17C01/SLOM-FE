import { cn } from "@/utils/cn";
import { TranslationDisplayProps } from "@/types/ITranslator";
import { Clock, Zap } from "lucide-react";
import { useTranslations } from "next-intl";

export default function TranslationDisplay({
  prediction,
  confidence,
  timestamp,
  showConfidence = true,
  className
}: TranslationDisplayProps) {
  const t_translatorPage = useTranslations("translatorPage");
  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 80) return "text-green-600";
    if (confidence >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getConfidenceBgColor = (confidence: number) => {
    if (confidence >= 80) return "bg-green-100";
    if (confidence >= 60) return "bg-yellow-100";
    return "bg-red-100";
  };

  return (
    <div className={cn(
      "p-4 rounded-lg border-2 transition-all duration-300",
      confidence >= 80 ? "border-green-200 bg-green-50" : 
      confidence >= 60 ? "border-yellow-200 bg-yellow-50" : 
      "border-gray-200 bg-gray-50",
      className
    )}>
      {/* Header with timestamp */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Zap className="w-4 h-4 text-blue-500" />
          <span className="text-sm font-medium text-gray-600">{t_translatorPage("liveTranslation")}</span>
        </div>
        {timestamp && (
          <div className="flex items-center gap-1 text-xs text-gray-500">
            <Clock className="w-3 h-3" />
            <span>{timestamp}</span>
          </div>
        )}
      </div>

      {/* Main prediction text */}
      <div className="mb-3">
        <p className="text-xl font-semibold text-gray-900 leading-relaxed">
          {prediction || "No sign detected"}
        </p>
      </div>

      {/* Confidence indicator */}
      {showConfidence && (
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">{t_translatorPage("confidence")}:</span>
            <span className={cn(
              "text-sm font-bold",
              getConfidenceColor(confidence)
            )}>
              {confidence}%
            </span>
          </div>
          
          {/* Confidence progress bar */}
          <div className="flex-1 mx-3">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className={cn(
                  "h-2 rounded-full transition-all duration-500",
                  confidence >= 80 ? "bg-green-500" : 
                  confidence >= 60 ? "bg-yellow-500" : 
                  "bg-red-500"
                )}
                style={{ width: `${Math.max(confidence, 5)}%` }}
              />
            </div>
          </div>

          {/* Confidence badge */}
          <div className={cn(
            "px-2 py-1 rounded-full text-xs font-medium",
            getConfidenceBgColor(confidence),
            getConfidenceColor(confidence)
          )}>
            {confidence >= 80 ? t_translatorPage("high") : confidence >= 60 ? t_translatorPage("medium") : t_translatorPage("low")}
          </div>
        </div>
      )}
    </div>
  );
} 