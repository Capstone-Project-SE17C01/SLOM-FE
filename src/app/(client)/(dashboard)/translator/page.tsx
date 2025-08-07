"use client";

import { useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import RealTimeTranslator from "@/components/layouts/translator/real-time-translator";
import UploadVideoTranslator from "@/components/layouts/translator/upload-video-translator";
import { Button } from "@/components/ui/button";
import { cn } from "@/utils/cn";
import { Camera, Upload } from "lucide-react";

export default function TranslatorPage() {
  const [activeTranslator, setActiveTranslator] = useState("realtime");
  const { userInfo } = useSelector((state: RootState) => state.auth);
  const isVipUser = userInfo?.roleName?.includes("VIP") ?? false;

  const handleToggle = (translator: string) => {
    setActiveTranslator(translator);
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Sign Language Translator
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Real-time translation and video analysis for sign language
        </p>
      </div>

      <div className="flex justify-center gap-4 mb-8">
        {isVipUser && (
          <Button
            onClick={() => handleToggle("realtime")}
            className={cn(
              "flex items-center gap-2 px-6 py-3 rounded-full transition-all",
              activeTranslator === "realtime"
                ? "bg-blue-500 text-white shadow-lg"
                : "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
            )}
          >
            <Camera className="w-5 h-5" />
            <span>Real-time</span>
          </Button>
        )}
        <Button
          onClick={() => handleToggle("upload")}
          className={cn(
            "flex items-center gap-2 px-6 py-3 rounded-full transition-all",
            activeTranslator === "upload"
              ? "bg-green-500 text-white shadow-lg"
              : "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
          )}
        >
          <Upload className="w-5 h-5" />
          <span>Upload Video</span>
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-8">
        <div className={cn(
          "transition-all duration-500",
          (activeTranslator === "realtime" && isVipUser) ? "block" : "hidden"
        )}>
          <RealTimeTranslator />
        </div>
        <div className={cn(
          "transition-all duration-500",
          activeTranslator === "upload" ? "block" : "hidden"
        )}>
          <UploadVideoTranslator />
        </div>
      </div>
    </div>
  );
}
