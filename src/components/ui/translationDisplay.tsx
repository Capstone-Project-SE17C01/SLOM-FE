import { cn } from "@/utils/cn";
import { TranslationDisplayProps } from "@/types/ITranslator";
import { Clock, Zap } from "lucide-react";
import { useTranslations } from "next-intl";
import { useTheme } from "@/contexts/ThemeContext";

export default function TranslationDisplay({
  prediction,
  confidence,
  timestamp,
  showConfidence = true,
  className
}: TranslationDisplayProps) {
  const t_translatorPage = useTranslations("translatorPage");
  const { isDarkMode } = useTheme();
  
  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 80) return isDarkMode ? "text-green-400" : "text-green-600";
    if (confidence >= 60) return isDarkMode ? "text-yellow-400" : "text-yellow-600";
    return isDarkMode ? "text-red-400" : "text-red-600";
  };

  const getConfidenceBgColor = (confidence: number) => {
    if (confidence >= 80) return isDarkMode ? "bg-green-900/30" : "bg-green-100";
    if (confidence >= 60) return isDarkMode ? "bg-yellow-900/30" : "bg-yellow-100";
    return isDarkMode ? "bg-red-900/30" : "bg-red-100";
  };

  const getBorderColor = (confidence: number) => {
    if (confidence >= 80) return isDarkMode ? "border-green-600" : "border-green-200";
    if (confidence >= 60) return isDarkMode ? "border-yellow-600" : "border-yellow-200";
    return isDarkMode ? "border-gray-600" : "border-gray-200";
  };

  const getBackgroundColor = (confidence: number) => {
    if (confidence >= 80) return isDarkMode ? "bg-green-900/10" : "bg-green-50";
    if (confidence >= 60) return isDarkMode ? "bg-yellow-900/10" : "bg-yellow-50";
    return isDarkMode ? "bg-gray-800" : "bg-gray-50";
  };

  return (
    <div className={cn(
      "p-4 rounded-lg border-2 transition-all duration-300",
      getBorderColor(confidence),
      getBackgroundColor(confidence),
      className
    )}>
      {/* Header with timestamp */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Zap className="w-4 h-4 text-purple-500" />
          <span className={cn(
            "text-sm font-medium",
            isDarkMode ? "text-gray-300" : "text-gray-600"
          )}>
            {t_translatorPage("liveTranslation")}
          </span>
        </div>
        {timestamp && (
          <div className={cn(
            "flex items-center gap-1 text-xs",
            isDarkMode ? "text-gray-400" : "text-gray-500"
          )}>
            <Clock className="w-3 h-3" />
            <span>{timestamp}</span>
          </div>
        )}
      </div>

      {/* Main prediction text */}
      <div className="mb-3">
        <p className={cn(
          "text-xl font-semibold leading-relaxed",
          isDarkMode ? "text-gray-100" : "text-gray-900"
        )}>
          {prediction || t_translatorPage("noSignDetected")}
        </p>
      </div>

      {/* Confidence indicator */}
      {showConfidence && (
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className={cn(
              "text-sm",
              isDarkMode ? "text-gray-300" : "text-gray-600"
            )}>
              {t_translatorPage("confidence")}:
            </span>
            <span className={cn(
              "text-sm font-bold",
              getConfidenceColor(confidence)
            )}>
              {confidence}%
            </span>
          </div>
          
          {/* Confidence progress bar */}
          <div className="flex-1 mx-3">
            <div className={cn(
              "w-full rounded-full h-2",
              isDarkMode ? "bg-gray-700" : "bg-gray-200"
            )}>
              <div 
                className={cn(
                  "h-2 rounded-full transition-all duration-500",
                  confidence >= 80 ? "bg-green-500" : 
                  confidence >= 60 ? "bg-yellow-500" : 
                  confidence >= 40 ? "bg-orange-500" :
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