"use client";

import { useCallback, useState, useRef } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTheme } from "@/contexts/ThemeContext";
import { cn } from "@/utils/cn";
import {
  Upload,
  FileVideo,
  Languages,
  Download,
  Clock,
  CheckCircle,
  AlertCircle,
  RotateCcw,
} from "lucide-react";

import { useVideoUploadTranslator } from "@/hooks/useVideoUploadTranslator";
import VideoPreview from "@/components/ui/videoPreview";
import {
  VideoUploadTranslatorProps,
  TranslationSegment,
} from "../../../types/ITranslator";
import { useTranslations } from "next-intl";

export default function UploadVideoTranslator({
  onResult,
  language = "en",
  maxFileSize = 100,
  acceptedFormats = ["video/mp4", "video/webm", "video/avi", "video/mov"],
  showPreview = true,
}: VideoUploadTranslatorProps) {
  const t_translatorPage = useTranslations("translatorPage");
  const { isDarkMode } = useTheme();
  const { userInfo } = useSelector((state: RootState) => state.auth);
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Initialize video upload translator
  const translator = useVideoUploadTranslator({
    onResult: (result) => {
      console.log("Video translation result:", result);
      if (onResult) {
        onResult(result);
      }
    },
    language,
    maxFileSize,
    userId: userInfo?.id,
  });

  // Handle file selection
  const handleFileSelect = useCallback(
    (files: FileList | null) => {
      if (files && files.length > 0) {
        const file = files[0];
        translator.uploadVideo(file);
      }
    },
    [translator]
  );

  // Handle drag events
  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  // Handle drop
  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(false);

      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        handleFileSelect(e.dataTransfer.files);
      }
    },
    [handleFileSelect]
  );

  // Format time for translation segments
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  // Export translation results
  const exportResults = () => {
    if (!translator.state.translationResult) return;

    const data = {
      filename: translator.state.translationResult.filename,
      timestamp: new Date().toISOString(),
      language,
      duration: translator.state.translationResult.duration,
      summary: translator.state.translationResult.summary,
      translations: translator.state.translationResult.translations,
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `video-translation-${
      translator.state.file?.name?.split(".")[0] || "result"
    }.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Upload Section */}
      <Card
        className={cn(
          "border-2 shadow-lg",
          isDarkMode
            ? "bg-gray-800 border-gray-700"
            : "bg-white border-gray-200"
        )}
      >
        <CardHeader className="pb-4">
          <CardTitle
            className={cn(
              "flex items-center gap-3 text-xl",
              isDarkMode ? "text-white" : "text-gray-900"
            )}
          >
            <FileVideo className="w-6 h-6 text-green-500" />
            {t_translatorPage("uploadVideoForTranslation")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Upload Area */}
            <div className="space-y-4">
              {!translator.state.file ? (
                <div
                  className={cn(
                    "border-2 border-dashed rounded-xl p-8 text-center transition-all cursor-pointer",
                    dragActive
                      ? "border-blue-400 bg-blue-50"
                      : "border-gray-300",
                    isDarkMode
                      ? dragActive
                        ? "border-blue-400 bg-blue-900/20"
                        : "border-gray-600 bg-gray-700"
                      : dragActive
                      ? "bg-blue-50"
                      : "bg-gray-50",
                    "hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                  )}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                  onClick={() => {
                    inputRef.current?.click();
                  }}
                >
                  <input
                    ref={inputRef}
                    type="file"
                    accept={acceptedFormats.join(",")}
                    style={{ display: "none" }}
                    onChange={(e) => handleFileSelect(e.target.files)}
                  />
                  <Upload
                    className={cn(
                      "w-16 h-16 mx-auto mb-4",
                      dragActive
                        ? "text-blue-500"
                        : isDarkMode
                        ? "text-gray-400"
                        : "text-gray-500"
                    )}
                  />
                  <h3
                    className={cn(
                      "text-lg font-semibold mb-2",
                      dragActive
                        ? "text-blue-600"
                        : isDarkMode
                        ? "text-white"
                        : "text-gray-900"
                    )}
                  >
                    {dragActive
                      ? t_translatorPage("dropYourVideoHere")
                      : t_translatorPage("dropYourVideoHere")}
                  </h3>
                  <p
                    className={cn(
                      "text-sm mb-4",
                      isDarkMode ? "text-gray-300" : "text-gray-600"
                    )}
                  >
                    {t_translatorPage("orClickToBrowseFiles")}
                  </p>
                  <Button
                    variant="outline"
                    className={cn(
                      "border-blue-500 text-blue-500",
                      isDarkMode 
                        ? "hover:bg-blue-900/20 dark:border-blue-400 dark:text-blue-400" 
                        : "hover:bg-blue-50"
                    )}
                    onClick={(e) => {
                      e.stopPropagation();
                      inputRef.current?.click();
                    }}
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    {t_translatorPage("chooseFile")}
                  </Button>

                  <div
                    className={cn(
                      "text-xs mt-4",
                      isDarkMode ? "text-gray-400" : "text-gray-500"
                    )}
                  >
                    {t_translatorPage("supports")}:{" "}
                    {acceptedFormats
                      .map((f) => f.split("/")[1].toUpperCase())
                      .join(", ")}{" "}
                    (Max: {maxFileSize}MB)
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Upload Progress */}
                  {translator.state.isUploading && (
                    <div
                      className={cn(
                        "p-4 rounded-lg border",
                        isDarkMode
                          ? "bg-gray-700 border-gray-600"
                          : "bg-blue-50 border-blue-200"
                      )}
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <Upload className="w-5 h-5 text-blue-500 animate-pulse" />
                        <span className="font-medium text-blue-600">
                          {t_translatorPage("uploading")}...
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                          style={{
                            width: `${translator.state.uploadProgress}%`,
                          }}
                        />
                      </div>
                      <div className={cn(
                        "text-xs mt-1",
                        isDarkMode ? "text-gray-300" : "text-gray-600"
                      )}>
                        {translator.state.uploadProgress}%{" "}
                        {t_translatorPage("complete")}
                      </div>
                    </div>
                  )}

                  {/* Processing Status */}
                  {translator.state.isProcessing && (
                    <div
                      className={cn(
                        "p-4 rounded-lg border",
                        isDarkMode
                          ? "bg-gray-700 border-gray-600"
                          : "bg-purple-50 border-purple-200"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <Languages className="w-5 h-5 text-purple-500 animate-pulse" />
                        <div>
                          <p className={cn(
                            "font-medium",
                            isDarkMode ? "text-purple-400" : "text-purple-600"
                          )}>
                            {t_translatorPage("processingVideo")}...
                          </p>
                          <p className={cn(
                            "text-xs",
                            isDarkMode ? "text-gray-300" : "text-gray-600"
                          )}>
                            {t_translatorPage("analyzingSignLanguageContent")}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Translation Complete */}
                  {translator.state.translationResult && (
                    <div
                      className={cn(
                        "p-4 rounded-lg border",
                        isDarkMode
                          ? "bg-gray-700 border-gray-600"
                          : "bg-green-50 border-green-200"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <CheckCircle className="w-5 h-5 text-green-500" />
                        <div>
                          <p className={cn(
                            "font-medium",
                            isDarkMode ? "text-green-400" : "text-green-600"
                          )}>
                            {t_translatorPage("translationComplete")}!
                          </p>
                          <p className={cn(
                            "text-xs",
                            isDarkMode ? "text-gray-300" : "text-gray-600"
                          )}>
                            {t_translatorPage("found")}{" "}
                            {
                              translator.state.translationResult.translations
                                .length
                            }{" "}
                            {t_translatorPage("signLanguageSegments")}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Error Display */}
                  {translator.state.error && (
                    <div
                      className={cn(
                        "p-4 rounded-lg border",
                        isDarkMode
                          ? "bg-gray-700 border-gray-600"
                          : "bg-red-50 border-red-200"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <AlertCircle className="w-5 h-5 text-red-500" />
                        <div>
                          <p className={cn(
                            "font-medium",
                            isDarkMode ? "text-red-400" : "text-red-600"
                          )}>
                            {t_translatorPage("error")}
                          </p>
                          <p className={cn(
                            "text-xs",
                            isDarkMode ? "text-gray-300" : "text-gray-600"
                          )}>
                            {translator.state.error}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex gap-3">
                    <Button
                      variant="outline"
                      onClick={translator.removeFile}
                      className="flex-1"
                    >
                      <RotateCcw className="w-4 h-4 mr-2" />
                      {t_translatorPage("uploadNew")}
                    </Button>

                    {translator.state.translationResult && (
                      <Button
                        onClick={exportResults}
                        className="flex-1 bg-green-500 hover:bg-green-600 text-white"
                      >
                        <Download className="w-4 h-4 mr-2" />
                        {t_translatorPage("exportResults")}
                      </Button>
                    )}
                  </div>

                  {/* Selected File Info */}
                  {translator.state.file &&
                    !translator.state.isUploading &&
                    !translator.state.isProcessing && (
                      <div
                        className={cn(
                          "p-3 rounded-lg border text-left",
                          isDarkMode
                            ? "bg-gray-700 border-gray-600"
                            : "bg-gray-100 border-gray-200"
                        )}
                      >
                        <div className="flex items-center gap-3">
                          <FileVideo className="w-5 h-5 text-gray-500" />
                          <div className="truncate">
                            <p
                              className={cn(
                                "text-sm font-medium truncate",
                                isDarkMode ? "text-gray-200" : "text-gray-900"
                              )}
                              title={translator.state.file.name}
                            >
                              {translator.state.file.name}
                            </p>
                            <p className={cn(
                              "text-xs",
                              isDarkMode ? "text-gray-400" : "text-gray-500"
                            )}>
                              {(
                                translator.state.file.size /
                                (1024 * 1024)
                              ).toFixed(2)}{" "}
                              MB
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                </div>
              )}
            </div>

            {/* Video Preview */}
            <div className="relative w-full h-full min-h-[250px] space-y-4">
              {showPreview && (
                <VideoPreview
                  file={translator.state.file}
                  videoUrl={translator.state.videoUrl}
                  isProcessing={translator.state.isProcessing}
                  onRemove={translator.removeFile}
                />
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Translation Results */}
      {translator.state.translationResult && (
        <Card
          className={cn(
            "border-2 shadow-lg",
            isDarkMode
              ? "bg-gray-800 border-gray-700"
              : "bg-white border-gray-200"
          )}
        >
          <CardHeader className="pb-4">
            <CardTitle
              className={cn(
                "flex items-center gap-3 text-xl",
                isDarkMode ? "text-white" : "text-gray-900"
              )}
            >
              <Languages className="w-6 h-6 text-purple-500" />
              {t_translatorPage("translationResults")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Summary */}
              {translator.state.translationResult.summary && (
                <div
                  className={cn(
                    "p-4 rounded-lg border",
                    isDarkMode
                      ? "bg-gray-700 border-gray-600"
                      : "bg-blue-50 border-blue-200"
                  )}
                >
                  <h4 className={cn(
                    "font-semibold mb-2",
                    isDarkMode ? "text-blue-400" : "text-blue-600"
                  )}>
                    {t_translatorPage("summary")}
                  </h4>
                  <p
                    className={cn(
                      "text-sm",
                      isDarkMode ? "text-gray-300" : "text-gray-700"
                    )}
                  >
                    {translator.state.translationResult.summary}
                  </p>
                </div>
              )}

              {/* Translation Timeline */}
              <div>
                <h4
                  className={cn(
                    "font-semibold mb-4",
                    isDarkMode ? "text-white" : "text-gray-900"
                  )}
                >
                  {t_translatorPage("translationTimeline")}
                </h4>

                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {translator.state.translationResult.translations.map(
                    (segment: TranslationSegment, index: number) => (
                      <div
                        key={index}
                        className={cn(
                          "p-4 rounded-lg border transition-all duration-200 hover:shadow-md",
                          isDarkMode
                            ? "bg-gray-700 border-gray-600"
                            : "bg-gray-50 border-gray-200"
                        )}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-gray-500" />
                            <span className={cn(
                              "text-sm font-medium",
                              isDarkMode ? "text-gray-400" : "text-gray-500"
                            )}>
                              {formatTime(segment.startTime)} -{" "}
                              {formatTime(segment.endTime)}
                            </span>
                          </div>
                          <span
                            className={cn(
                              "text-xs px-2 py-1 rounded-full",
                              segment.confidence >= 0.8
                                ? isDarkMode 
                                  ? "bg-green-900/30 text-green-400" 
                                  : "bg-green-100 text-green-600"
                                : segment.confidence >= 0.6
                                ? isDarkMode 
                                  ? "bg-yellow-900/30 text-yellow-400" 
                                  : "bg-yellow-100 text-yellow-600"
                                : isDarkMode 
                                  ? "bg-red-900/30 text-red-400" 
                                  : "bg-red-100 text-red-600"
                            )}
                          >
                            {Math.round(segment.confidence * 100)}%
                          </span>
                        </div>
                        <p
                          className={cn(
                            "text-lg font-medium",
                            isDarkMode ? "text-white" : "text-gray-900"
                          )}
                        >
                          {segment.prediction}
                        </p>
                      </div>
                    )
                  )}
                </div>
              </div>

              {/* Video Info */}
              <div
                className={cn(
                  "p-4 rounded-lg border",
                  isDarkMode
                    ? "bg-gray-700 border-gray-600"
                    : "bg-gray-50 border-gray-200"
                )}
              >
                <h4 className={cn(
                  "font-semibold mb-2",
                  isDarkMode ? "text-gray-200" : "text-gray-900"
                )}>
                  {t_translatorPage("videoInformation")}
                </h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className={cn(
                      isDarkMode ? "text-gray-400" : "text-gray-500"
                    )}>
                      {t_translatorPage("duration")}:
                    </span>
                    <span className={cn(
                      "ml-2 font-medium",
                      isDarkMode ? "text-gray-200" : "text-gray-900"
                    )}>
                      {formatTime(translator.state.translationResult.duration)}
                    </span>
                  </div>
                  <div>
                    <span className={cn(
                      isDarkMode ? "text-gray-400" : "text-gray-500"
                    )}>
                      {t_translatorPage("segments")}:
                    </span>
                    <span className={cn(
                      "ml-2 font-medium",
                      isDarkMode ? "text-gray-200" : "text-gray-900"
                    )}>
                      {translator.state.translationResult.translations.length}
                    </span>
                  </div>
                  <div>
                    <span className={cn(
                      isDarkMode ? "text-gray-400" : "text-gray-500"
                    )}>
                      {t_translatorPage("language")}:
                    </span>
                    <span className={cn(
                      "ml-2 font-medium",
                      isDarkMode ? "text-gray-200" : "text-gray-900"
                    )}>
                      {language.toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <span className={cn(
                      isDarkMode ? "text-gray-400" : "text-gray-500"
                    )}>
                      {t_translatorPage("processed")}:
                    </span>
                    <span className={cn(
                      "ml-2 font-medium",
                      isDarkMode ? "text-gray-200" : "text-gray-900"
                    )}>
                      {new Date(
                        translator.state.translationResult.createdAt
                      ).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
