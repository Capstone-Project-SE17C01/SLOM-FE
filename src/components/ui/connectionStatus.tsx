import { cn } from "@/utils/cn";
import { RealTimeTranslationState } from "@/types/ITranslator";
import {
  Wifi,
  WifiOff,
  Loader2,
  AlertCircle,
  CheckCircle,
  Play,
  Camera,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { useTheme } from "@/contexts/ThemeContext";

interface ConnectionStatusProps {
  connectionStatus: RealTimeTranslationState["connectionStatus"];
  isActive?: boolean;
  className?: string;
}

export default function ConnectionStatus({
  connectionStatus,
  isActive = false,
  className,
}: ConnectionStatusProps) {
  const t_translatorPage = useTranslations("translatorPage");
  const { isDarkMode } = useTheme();
  
  const getStatusConfig = () => {
    switch (connectionStatus) {
      case t_translatorPage("connected"):
        return {
          icon: CheckCircle,
          color: isDarkMode ? "text-green-400" : "text-green-600",
          bgColor: isDarkMode ? "bg-green-900/20" : "bg-green-100",
          dotColor: "bg-green-500",
          message: t_translatorPage("connectedToTranslationServer"),
        };
      case t_translatorPage("connecting"):
        return {
          icon: Loader2,
          color: isDarkMode ? "text-blue-400" : "text-blue-600",
          bgColor: isDarkMode ? "bg-blue-900/20" : "bg-blue-100",
          dotColor: "bg-blue-500",
          message: t_translatorPage("connectingToServer"),
          animated: true,
        };
      case t_translatorPage("recognizing"):
        return {
          icon: Wifi,
          color: isDarkMode ? "text-purple-400" : "text-purple-600",
          bgColor: isDarkMode ? "bg-purple-900/20" : "bg-purple-100",
          dotColor: "bg-purple-500",
          message: t_translatorPage("translatingSignLanguage"),
          pulse: true,
        };
      case t_translatorPage("error"):
        return {
          icon: AlertCircle,
          color: isDarkMode ? "text-red-400" : "text-red-600",
          bgColor: isDarkMode ? "bg-red-900/20" : "bg-red-100",
          dotColor: "bg-red-500",
          message: t_translatorPage("connectionErrorOccurred"),
        };
      case t_translatorPage("demoModeServerUnavailable"):
        return {
          icon: Play,
          color: isDarkMode ? "text-orange-400" : "text-orange-600",
          bgColor: isDarkMode ? "bg-orange-900/20" : "bg-orange-100",
          dotColor: "bg-orange-500",
          message: t_translatorPage("runningInDemoModeServerTemporarilyUnavailable"),
          pulse: true,
        };
      case t_translatorPage("cameraOnlyModeWebSocketDisabled"):
        return {
          icon: Camera,
          color: isDarkMode ? "text-blue-400" : "text-blue-600",
          bgColor: isDarkMode ? "bg-blue-900/20" : "bg-blue-100",
          dotColor: "bg-blue-500",
          message: t_translatorPage("cameraPreviewOnlyWebSocketTemporarilyDisabled"),
        };
      default:
        return {
          icon: WifiOff,
          color: isDarkMode ? "text-gray-400" : "text-gray-600",
          bgColor: isDarkMode ? "bg-gray-800" : "bg-gray-100",
          dotColor: "bg-gray-400",
          message: t_translatorPage("notConnected"),
        };
    }
  };

  const config = getStatusConfig();
  const Icon = config.icon;

  return (
    <div
      className={cn(
        "flex items-center gap-3 p-4 rounded-lg border transition-all duration-300",
        config.bgColor,
        isDarkMode ? "border-gray-700" : "border-opacity-50",
        className
      )}
    >
      {/* Status indicator dot */}
      <div className="relative flex items-center">
        <div
          className={cn(
            "w-3 h-3 rounded-full",
            config.dotColor,
            config.pulse && "animate-pulse"
          )}
        />
        {isActive && connectionStatus === t_translatorPage("recognizing") && (
          <div
            className={cn(
              "absolute inset-0 w-3 h-3 rounded-full animate-ping",
              config.dotColor,
              "opacity-75"
            )}
          />
        )}
      </div>

      {/* Status icon */}
      <Icon
        className={cn(
          "w-5 h-5",
          config.color,
          config.animated && "animate-spin"
        )}
      />

      {/* Status message */}
      <div className="flex-1">
        <p className={cn("text-sm font-medium", config.color)}>
          {connectionStatus}
        </p>
        <p className={cn(
          "text-xs mt-0.5",
          isDarkMode ? "text-gray-300" : "text-gray-600"
        )}>
          {config.message}
        </p>
      </div>

      {/* Activity indicator for active translation */}
      {isActive && connectionStatus === t_translatorPage("recognizing") && (
        <div className="flex items-center gap-1">
          <div className="flex space-x-1">
            <div className="w-1 h-6 bg-purple-500 rounded-full animate-pulse" />
            <div className="w-1 h-6 bg-purple-500 rounded-full animate-pulse delay-75" />
            <div className="w-1 h-6 bg-purple-500 rounded-full animate-pulse delay-150" />
          </div>
        </div>
      )}

      {/* Demo mode indicator */}
      {isActive && connectionStatus === t_translatorPage("demoModeServerUnavailable") && (
        <div className="flex items-center gap-1">
          <div className="flex space-x-1">
            <div className="w-1 h-6 bg-orange-500 rounded-full animate-pulse" />
            <div className="w-1 h-6 bg-orange-500 rounded-full animate-pulse delay-75" />
            <div className="w-1 h-6 bg-orange-500 rounded-full animate-pulse delay-150" />
          </div>
        </div>
      )}
    </div>
  );
}
