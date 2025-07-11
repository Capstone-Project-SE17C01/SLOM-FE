"use client";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Upload, 
  Languages,
  FileVideo,
  Zap
} from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { RealTimeTranslationResult, VideoTranslationResult } from "@/types/ITranslator";
import { cn } from "@/utils/cn";
import RealTimeTranslator from "@/components/layouts/translator/real-time-translator";
import UploadVideoTranslator from "@/components/layouts/translator/upload-video-translator";

export default function TranslatorPage() {
  const { isDarkMode } = useTheme();
  const [activeMode, setActiveMode] = useState<"realtime" | "upload">("realtime");

  // Handle translation results
  const handleRealTimeResult = (result: RealTimeTranslationResult) => {
    console.log("Real-time translation:", result);
  };

  const handleVideoResult = (result: VideoTranslationResult) => {
    console.log("Video translation:", result);
  };

  return (
    <div className={cn(
      "min-h-screen p-6 transition-colors duration-300",
      isDarkMode ? "bg-gray-900" : "bg-gray-50"
    )}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className={cn(
              "p-3 rounded-xl",
              isDarkMode ? "bg-blue-600" : "bg-blue-500"
            )}>
              <Languages className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className={cn(
                "text-3xl font-bold",
                isDarkMode ? "text-white" : "text-gray-900"
              )}>
                Sign Language Translator
              </h1>
              <p className={cn(
                "text-lg",
                isDarkMode ? "text-gray-300" : "text-gray-600"
              )}>
                Translate sign language in real-time or upload videos for translation
              </p>
            </div>
          </div>
        </div>

        {/* Mode Selection */}
        <div className="mb-8">
          <Tabs value={activeMode} onValueChange={(value) => setActiveMode(value as "realtime" | "upload")}>
            <TabsList className={cn(
              "grid w-full grid-cols-2 p-1 h-14",
              isDarkMode ? "bg-gray-800" : "bg-white"
            )}>
              <TabsTrigger 
                value="realtime" 
                className={cn(
                  "flex items-center gap-2 h-12 text-base font-medium",
                  "data-[state=active]:bg-blue-500 data-[state=active]:text-white",
                  isDarkMode ? "text-gray-300 hover:text-white" : "text-gray-600 hover:text-gray-900"
                )}
              >
                <Zap className="w-5 h-5" />
                Real-time Translation
              </TabsTrigger>
              <TabsTrigger 
                value="upload" 
                className={cn(
                  "flex items-center gap-2 h-12 text-base font-medium",
                  "data-[state=active]:bg-blue-500 data-[state=active]:text-white",
                  isDarkMode ? "text-gray-300 hover:text-white" : "text-gray-600 hover:text-gray-900"
                )}
              >
                <Upload className="w-5 h-5" />
                Upload Video
              </TabsTrigger>
            </TabsList>

            <TabsContent value="realtime" className="mt-6">
              <RealTimeTranslator
                onResult={handleRealTimeResult}
                language="en"
                showConfidence={true}
                captureInterval={200}
              />
            </TabsContent>

            <TabsContent value="upload" className="mt-6">
              <UploadVideoTranslator
                onResult={handleVideoResult}
                language="en"
                maxFileSize={100}
                showPreview={true}
                acceptedFormats={['video/mp4', 'video/webm', 'video/avi', 'video/mov']}
              />
            </TabsContent>
          </Tabs>
        </div>

        {/* Feature Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <Card className={cn(
            "text-center",
            isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
          )}>
            <CardContent className="pt-6">
              <Zap className="w-12 h-12 mx-auto mb-4 text-blue-500" />
              <h3 className={cn(
                "font-semibold mb-2",
                isDarkMode ? "text-white" : "text-gray-900"
              )}>
                Real-time Processing
              </h3>
              <p className={cn(
                "text-sm",
                isDarkMode ? "text-gray-300" : "text-gray-600"
              )}>
                Instant sign language recognition and translation using advanced AI
              </p>
            </CardContent>
          </Card>

          <Card className={cn(
            "text-center",
            isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
          )}>
            <CardContent className="pt-6">
              <FileVideo className="w-12 h-12 mx-auto mb-4 text-green-500" />
              <h3 className={cn(
                "font-semibold mb-2",
                isDarkMode ? "text-white" : "text-gray-900"
              )}>
                Video Upload
              </h3>
              <p className={cn(
                "text-sm",
                isDarkMode ? "text-gray-300" : "text-gray-600"
              )}>
                Upload pre-recorded videos for batch translation and analysis
              </p>
            </CardContent>
          </Card>

          <Card className={cn(
            "text-center",
            isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
          )}>
            <CardContent className="pt-6">
              <Languages className="w-12 h-12 mx-auto mb-4 text-purple-500" />
              <h3 className={cn(
                "font-semibold mb-2",
                isDarkMode ? "text-white" : "text-gray-900"
              )}>
              High Accuracy
              </h3>
              <p className={cn(
                "text-sm",
                isDarkMode ? "text-gray-300" : "text-gray-600"
              )}>
                State-of-the-art AI models trained on extensive sign language datasets
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 