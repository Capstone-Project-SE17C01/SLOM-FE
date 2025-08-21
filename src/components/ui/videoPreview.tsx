import { cn } from "@/utils/cn";
import { VideoPreviewProps } from "@/types/ITranslator";
import { Button } from "@/components/ui/button";
import { Play, Pause, Volume2, VolumeX, X, Loader2, FileVideo } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useTranslations } from "next-intl";
import { useTheme } from "@/contexts/ThemeContext";

export default function VideoPreview({
  file,
  videoUrl,
  isProcessing = false,
  onRemove,
  className
}: VideoPreviewProps) {
  const t_translatorPage = useTranslations("translatorPage");
  const { isDarkMode } = useTheme();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);


  // Update video element when videoUrl changes
  useEffect(() => {
    if (videoRef.current && videoUrl) {
      videoRef.current.load();
    }
  }, [videoUrl]);

  const togglePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    if (videoRef.current) {
      videoRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const formatFileSize = (bytes: number) => {
    const mb = bytes / (1024 * 1024);
    return `${mb.toFixed(2)} MB`;
  };

  if (!file && !videoUrl) {
    return (
      <div className={cn(
        "aspect-video rounded-xl border-2 border-dashed flex items-center justify-center",
        isDarkMode 
          ? "border-gray-600 bg-gray-800" 
          : "border-gray-300 bg-gray-50",
        className
      )}>
        <div className="text-center">
          <FileVideo className={cn(
            "w-16 h-16 mx-auto mb-4",
            isDarkMode ? "text-gray-500" : "text-gray-400"
          )} />
          <p className={cn(
            "text-lg font-medium",
            isDarkMode ? "text-gray-300" : "text-gray-600"
          )}>
            {t_translatorPage("noVideoSelected")}
          </p>
          <p className={cn(
            "text-sm",
            isDarkMode ? "text-gray-400" : "text-gray-500"
          )}>
            {t_translatorPage("uploadAVideoToSeePreview")}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("space-y-4", className)}>
      {/* Video Player */}
      <div className="relative group">
        <div className="aspect-video rounded-xl overflow-hidden bg-black">
          {videoUrl ? (
            <video
              ref={videoRef}
              className="w-full h-full object-contain"
              onTimeUpdate={handleTimeUpdate}
              onLoadedMetadata={handleLoadedMetadata}
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
              onEnded={() => setIsPlaying(false)}
              playsInline
            >
              <source src={videoUrl} type={file?.type || "video/mp4"} />
              {t_translatorPage("yourBrowserDoesNotSupportTheVideoTag")}
            </video>
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Loader2 className="w-12 h-12 text-white animate-spin" />
            </div>
          )}

          {/* Processing overlay */}
          {isProcessing && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <div className="text-center text-white">
                <Loader2 className="w-12 h-12 mx-auto mb-4 animate-spin" />
                <p className="text-lg font-medium">{t_translatorPage("processingVideo")}...</p>
                <p className="text-sm opacity-75">{t_translatorPage("translatingSignLanguageContent")}</p>
              </div>
            </div>
          )}

          {/* Remove button */}
          {onRemove && (
            <Button
              size="sm"
              variant="outline"
              className={cn(
                "absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity",
                isDarkMode 
                  ? "bg-gray-800/90 hover:bg-gray-700 border-gray-600" 
                  : "bg-white/90 hover:bg-white"
              )}
              onClick={onRemove}
            >
              <X className="w-4 h-4" />
            </Button>
          )}
        </div>

        {/* Video controls */}
        {videoUrl && !isProcessing && (
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
            {/* Progress bar */}
            <div className="mb-3">
              <input
                type="range"
                min="0"
                max={duration || 0}
                value={currentTime}
                onChange={handleSeek}
                className="w-full h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-xs text-white mt-1">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>

            {/* Control buttons */}
            <div className="flex items-center gap-3">
              <Button
                size="sm"
                variant="ghost"
                className="text-white hover:bg-white/20 p-2"
                onClick={togglePlayPause}
              >
                {isPlaying ? (
                  <Pause className="w-5 h-5" />
                ) : (
                  <Play className="w-5 h-5" />
                )}
              </Button>

              <Button
                size="sm"
                variant="ghost"
                className="text-white hover:bg-white/20 p-2"
                onClick={toggleMute}
              >
                {isMuted ? (
                  <VolumeX className="w-5 h-5" />
                ) : (
                  <Volume2 className="w-5 h-5" />
                )}
              </Button>

              <div className="flex-1" />

              {/* File info */}
              <div className="text-xs text-white/75">
                {file && `${formatFileSize(file.size)} • ${file.type.split('/')[1].toUpperCase()}`}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* File information */}
      {file && (
        <div className={cn(
          "p-3 rounded-lg",
          isDarkMode ? "bg-gray-800" : "bg-gray-50"
        )}>
          <div className="flex items-center justify-between">
            <div>
              <p className={cn(
                "font-medium truncate",
                isDarkMode ? "text-gray-100" : "text-gray-900"
              )}>
                {file.name}
              </p>
              <p className={cn(
                "text-sm",
                isDarkMode ? "text-gray-400" : "text-gray-600"
              )}>
                {formatFileSize(file.size)} • {file.type}
              </p>
            </div>
            {isProcessing && (
              <div className="flex items-center gap-2 text-blue-600">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="text-sm font-medium">{t_translatorPage("processing")}...</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
} 