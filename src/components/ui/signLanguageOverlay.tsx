import React from 'react';
import { cn } from '@/lib/utils';
import { SignLanguageRecognitionResult } from '@/hooks/useSignLanguageRecognition';
import { Eye, EyeOff, Activity, Clock } from 'lucide-react';

interface SignLanguageOverlayProps {
  isActive: boolean;
  isConnected: boolean;
  connectionStatus: string;
  currentPrediction: string;
  confidence: number;
  lastUpdate: string;
  recentPredictions: SignLanguageRecognitionResult[];
  isVisible: boolean;
  onToggleVisibility: () => void;
}

export const SignLanguageOverlay: React.FC<SignLanguageOverlayProps> = ({
  isActive,
  isConnected,
  connectionStatus,
  currentPrediction,
  confidence,
  lastUpdate,
  recentPredictions,
  isVisible,
  onToggleVisibility,
}) => {
  if (!isVisible) return null;

  return (
    <div className="fixed bottom-20 right-5 z-[998] max-w-sm">
      {/* Main prediction display */}
      <div className="bg-black bg-opacity-60 backdrop-blur-sm rounded-lg p-4 mb-3 text-white">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Activity className={cn(
              "w-4 h-4",
              isActive ? "text-green-400 animate-pulse" : "text-gray-400"
            )} />
            <span className="text-sm font-medium">Sign Language</span>
          </div>
          
          <button
            onClick={onToggleVisibility}
            className="p-1 hover:bg-white hover:bg-opacity-20 rounded transition-colors"
          >
            <EyeOff className="w-3 h-3" />
          </button>
        </div>

        {/* Connection Status */}
        <div className="flex items-center gap-2 mb-3">
          <div className={cn(
            "w-2 h-2 rounded-full",
            isConnected ? "bg-green-400" : "bg-red-400"
          )} />
          <span className="text-xs text-gray-300">{connectionStatus}</span>
        </div>

        {/* Current Prediction */}
        <div className="mb-3">
          <div className="text-lg font-bold text-center mb-1">
            {currentPrediction}
          </div>
          {confidence > 0 && (
            <div className="text-xs text-center text-gray-300">
              Confidence: {confidence}%
            </div>
          )}
        </div>

        {/* Last Update */}
        {lastUpdate && (
          <div className="flex items-center gap-1 text-xs text-gray-400">
            <Clock className="w-3 h-3" />
            <span>Last: {lastUpdate}</span>
          </div>
        )}
      </div>

      {/* Recent predictions history */}
      {recentPredictions.length > 0 && (
        <div className="bg-black bg-opacity-40 backdrop-blur-sm rounded-lg p-3 text-white">
          <div className="text-xs font-medium mb-2 text-gray-300">Recent Signs:</div>
          <div className="space-y-1 max-h-32 overflow-y-auto">
            {recentPredictions.slice(0, 5).map((prediction, index) => (
              <div
                key={`${prediction.timestamp}-${index}`}
                className={cn(
                  "text-xs flex justify-between items-center p-1 rounded",
                  index === 0 ? "bg-white bg-opacity-10" : "bg-transparent"
                )}
              >
                <span className="truncate flex-1">{prediction.prediction}</span>
                <span className="text-gray-400 ml-2">
                  {prediction.confidence}%
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// Toggle button for when overlay is hidden
export const SignLanguageToggleButton: React.FC<{
  isVisible: boolean;
  onToggle: () => void;
  isActive: boolean;
}> = ({ isVisible, onToggle, isActive }) => {
  if (isVisible) return null;

  return (
    <button
      onClick={onToggle}
      className={cn(
        "fixed bottom-20 right-5 z-[998] p-2 rounded-full transition-all",
        "bg-black bg-opacity-60 backdrop-blur-sm text-white hover:bg-opacity-80",
        isActive && "ring-2 ring-green-400 ring-opacity-50"
      )}
      title="Show Sign Language Recognition"
    >
      <div className="relative">
        <Eye className="w-4 h-4" />
        {isActive && (
          <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-400 rounded-full animate-pulse" />
        )}
      </div>
    </button>
  );
}; 