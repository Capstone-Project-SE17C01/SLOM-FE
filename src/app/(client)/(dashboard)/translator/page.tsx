"use client";

import { useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import RealTimeTranslator from "@/components/layouts/translator/real-time-translator";
import UploadVideoTranslator from "@/components/layouts/translator/upload-video-translator";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { cn } from "@/utils/cn";
import { Camera, Upload } from "lucide-react";

export default function TranslatorPage() {
  const { userInfo } = useSelector((state: RootState) => state.auth);
  const isVipUser = true;

  const [isRealtimeMode, setIsRealtimeMode] = useState(isVipUser);

  const handleModeChange = (isChecked: boolean) => {
    if (isVipUser) {
      setIsRealtimeMode(isChecked);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Sign Language Translator
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          {isVipUser
            ? "Switch between real-time translation and video analysis"
            : "Upload a video for sign language analysis"}
        </p>
      </div>

      {isVipUser && (
        <div className="flex items-center justify-center space-x-4">
          <Label
            htmlFor="translator-mode-switch"
            className={cn(
              "font-medium cursor-pointer",
              !isRealtimeMode
                ? "text-green-600 dark:text-green-400"
                : "text-gray-500"
            )}
          >
            <div className="flex items-center gap-2">
              <Upload className="w-5 h-5" />
              <span>Upload Video</span>
            </div>
          </Label>
          <Switch
            id="translator-mode-switch"
            checked={isRealtimeMode}
            onCheckedChange={handleModeChange}
          />
          <Label
            htmlFor="translator-mode-switch"
            className={cn(
              "font-medium cursor-pointer",
              isRealtimeMode
                ? "text-blue-600 dark:text-blue-400"
                : "text-gray-500"
            )}
          >
            <div className="flex items-center gap-2">
              <Camera className="w-5 h-5" />
              <span>Real-time</span>
            </div>
          </Label>
        </div>
      )}

      <div className="grid grid-cols-1 gap-8">
        <div
          className={cn(
            "transition-opacity duration-300",
            isVipUser && isRealtimeMode ? "block opacity-100" : "hidden opacity-0"
          )}
        >
          <RealTimeTranslator />
        </div>

        <div
          className={cn(
            "transition-opacity duration-300",
            !isRealtimeMode ? "block opacity-100" : "hidden opacity-0"
          )}
        >
          <UploadVideoTranslator />
        </div>
      </div>
    </div>
  );
}
