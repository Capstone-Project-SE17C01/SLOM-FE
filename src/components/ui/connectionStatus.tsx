import { cn } from "@/lib/utils";
import { RealTimeTranslationState } from "@/features/translator/types";
import { Wifi, WifiOff, Loader2, AlertCircle, CheckCircle, Play, Camera } from "lucide-react";

interface ConnectionStatusProps {
  connectionStatus: RealTimeTranslationState['connectionStatus'];
  isActive?: boolean;
  className?: string;
}

export default function ConnectionStatus({
  connectionStatus,
  isActive = false,
  className
}: ConnectionStatusProps) {
  
  const getStatusConfig = () => {
    switch (connectionStatus) {
      case 'Connected':
        return {
          icon: CheckCircle,
          color: 'text-green-600',
          bgColor: 'bg-green-100',
          dotColor: 'bg-green-500',
          message: 'Connected to translation server'
        };
      case 'Connecting...':
        return {
          icon: Loader2,
          color: 'text-blue-600',
          bgColor: 'bg-blue-100',
          dotColor: 'bg-blue-500',
          message: 'Connecting to server...',
          animated: true
        };
      case 'Recognizing...':
        return {
          icon: Wifi,
          color: 'text-purple-600',
          bgColor: 'bg-purple-100',
          dotColor: 'bg-purple-500',
          message: 'Translating sign language...',
          pulse: true
        };
      case 'Error':
        return {
          icon: AlertCircle,
          color: 'text-red-600',
          bgColor: 'bg-red-100',
          dotColor: 'bg-red-500',
          message: 'Connection error occurred'
        };
      case 'Demo Mode (Server Unavailable)':
        return {
          icon: Play,
          color: 'text-orange-600',
          bgColor: 'bg-orange-100',
          dotColor: 'bg-orange-500',
          message: 'Running in demo mode - Server temporarily unavailable',
          pulse: true
        };
      case 'Camera Only Mode (WebSocket Disabled)':
        return {
          icon: Camera,
          color: 'text-blue-600',
          bgColor: 'bg-blue-100',
          dotColor: 'bg-blue-500',
          message: 'Camera preview only - WebSocket temporarily disabled'
        };
      default: // Disconnected
        return {
          icon: WifiOff,
          color: 'text-gray-600',
          bgColor: 'bg-gray-100',
          dotColor: 'bg-gray-400',
          message: 'Not connected'
        };
    }
  };

  const config = getStatusConfig();
  const Icon = config.icon;

  return (
    <div className={cn(
      "flex items-center gap-3 p-4 rounded-lg border transition-all duration-300",
      config.bgColor,
      "border-opacity-50",
      className
    )}>
      {/* Status indicator dot */}
      <div className="relative flex items-center">
        <div className={cn(
          "w-3 h-3 rounded-full",
          config.dotColor,
          config.pulse && "animate-pulse"
        )} />
        {isActive && connectionStatus === 'Recognizing...' && (
          <div className={cn(
            "absolute inset-0 w-3 h-3 rounded-full animate-ping",
            config.dotColor,
            "opacity-75"
          )} />
        )}
      </div>

      {/* Status icon */}
      <Icon className={cn(
        "w-5 h-5",
        config.color,
        config.animated && "animate-spin"
      )} />

      {/* Status message */}
      <div className="flex-1">
        <p className={cn(
          "text-sm font-medium",
          config.color
        )}>
          {connectionStatus}
        </p>
        <p className="text-xs text-gray-600 mt-0.5">
          {config.message}
        </p>
      </div>

      {/* Activity indicator for active translation */}
      {isActive && connectionStatus === 'Recognizing...' && (
        <div className="flex items-center gap-1">
          <div className="flex space-x-1">
            <div className="w-1 h-6 bg-purple-500 rounded-full animate-pulse" />
            <div className="w-1 h-6 bg-purple-500 rounded-full animate-pulse delay-75" />
            <div className="w-1 h-6 bg-purple-500 rounded-full animate-pulse delay-150" />
          </div>
        </div>
      )}

      {/* Demo mode indicator */}
      {isActive && connectionStatus === 'Demo Mode (Server Unavailable)' && (
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