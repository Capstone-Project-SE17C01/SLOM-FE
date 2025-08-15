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
  const getStatusConfig = () => {
    switch (connectionStatus) {
      case "Connected":
        return {
          icon: CheckCircle,
          color: "text-green-600",
          bgColor: "bg-green-100",
          dotColor: "bg-green-500",
          message: t_translatorPage("connectedToTranslationServer"),
        };
      case "Connecting...":
        return {
          icon: Loader2,
          color: "text-blue-600",
          bgColor: "bg-blue-100",
          dotColor: "bg-blue-500",
          message: t_translatorPage("connectingToServer"),
          animated: true,
        };
      case "Recognizing...":
        return {
          icon: Wifi,
          color: "text-purple-600",
          bgColor: "bg-purple-100",
          dotColor: "bg-purple-500",
          message: t_translatorPage("translatingSignLanguage"),
          pulse: true,
        };
      case "Error":
        return {
          icon: AlertCircle,
          color: "text-red-600",
          bgColor: "bg-red-100",
          dotColor: "bg-red-500",
          message: t_translatorPage("connectionErrorOccurred"),
        };
      case "Demo Mode (Server Unavailable)":
        return {
          icon: Play,
          color: "text-orange-600",
          bgColor: "bg-orange-100",
          dotColor: "bg-orange-500",
          message: t_translatorPage("runningInDemoModeServerTemporarilyUnavailable"),
          pulse: true,
        };
      case "Camera Only Mode (WebSocket Disabled)":
        return {
          icon: Camera,
          color: "text-blue-600",
          bgColor: "bg-blue-100",
          dotColor: "bg-blue-500",
          message: t_translatorPage("cameraPreviewOnlyWebSocketTemporarilyDisabled"),
        };
      default: // Disconnected
        return {
          icon: WifiOff,
          color: "text-gray-600",
          bgColor: "bg-gray-100",
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
        "border-opacity-50",
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
        {isActive && connectionStatus === "Recognizing..." && (
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
        <p className="text-xs text-gray-600 mt-0.5">{config.message}</p>
      </div>

      {/* Activity indicator for active translation */}
      {isActive && connectionStatus === "Recognizing..." && (
        <div className="flex items-center gap-1">
          <div className="flex space-x-1">
            <div className="w-1 h-6 bg-purple-500 rounded-full animate-pulse" />
            <div className="w-1 h-6 bg-purple-500 rounded-full animate-pulse delay-75" />
            <div className="w-1 h-6 bg-purple-500 rounded-full animate-pulse delay-150" />
          </div>
        </div>
      )}

      {/* Demo mode indicator */}
      {isActive && connectionStatus === "Demo Mode (Server Unavailable)" && (
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
