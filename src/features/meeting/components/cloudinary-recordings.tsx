"use client";

import { useState, useEffect } from "react";
import { cn } from "@/utils/cn";
import { getAllVideosFromCloudinary } from "@/services/cloudinary/config";
import { toast } from "sonner";
import { AlertTriangle, Play, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CloudinaryRecording {
  id: string;
  meetingTitle: string;
  createdAt: string;
  duration: number | null;
  processed: boolean;
  url: string;
  folder: string;
  transcription: string | null;
}

interface CloudinaryRecordingsProps {
  isDarkMode: boolean;
}

export function CloudinaryRecordings({ isDarkMode }: CloudinaryRecordingsProps) {
  const [recordings, setRecordings] = useState<CloudinaryRecording[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [nextCursor, setNextCursor] = useState<string | undefined>(undefined);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const fetchVideos = async (cursor?: string) => {
    try {
      const response = await getAllVideosFromCloudinary(undefined, 20, cursor);
      
      // Transform Cloudinary response to match expected format
      const transformedSessions = response.resources.map((video) => ({
        id: video.public_id,
        meetingTitle: video.public_id.replace(/^meeting-/, '').replace(/-\d+\.webm$/, ''),
        createdAt: video.created_at,
        duration: video.duration ? Math.round(video.duration / 60) : null,
        processed: true,
        url: video.secure_url,
        folder: video.folder || 'general',
        transcription: null,
      }));
      
      if (cursor) {
        // Append to existing recordings when loading more
        setRecordings(prev => [...prev, ...transformedSessions]);
      } else {
        // Replace recordings on initial load
        setRecordings(transformedSessions);
      }
      
      setNextCursor(response.next_cursor);
    } catch (error) {
      console.error("Failed to fetch videos from Cloudinary:", error);
      toast.error("Failed to load recorded sessions", {
        icon: <AlertTriangle className="h-4 w-4 text-red-500" />,
        description: "Please check your Cloudinary configuration.",
      });
      if (!cursor) {
        setRecordings([]);
      }
    }
  };

  const handleLoadMore = async () => {
    if (!nextCursor) return;
    
    setIsLoadingMore(true);
    await fetchVideos(nextCursor);
    setIsLoadingMore(false);
  };

  useEffect(() => {
    const loadInitialVideos = async () => {
      setIsLoading(true);
      await fetchVideos();
      setIsLoading(false);
    };
    
    loadInitialVideos();
  }, []);

  if (isLoading) {
    return (
      <div className="p-6 text-center rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/50">
        <div className="flex items-center justify-center gap-2">
          <Loader2 className="h-5 w-5 animate-spin" />
          <p className={cn("text-lg", isDarkMode ? "text-gray-400" : "text-gray-500")}>
            Loading recorded sessions from Cloudinary...
          </p>
        </div>
      </div>
    );
  }

  if (recordings.length === 0) {
    return (
      <div className="p-6 text-center rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/50">
        <p className={cn("text-lg", isDarkMode ? "text-gray-400" : "text-gray-500")}>
          No recorded sessions available in Cloudinary
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {recordings.map((recording) => (
          <div
            key={recording.id}
            className={cn(
              "p-4 rounded-lg border transition-all",
              isDarkMode
                ? "bg-gray-800 border-gray-700 hover:border-[#6947A8]"
                : "bg-white border-gray-200 hover:border-[#6947A8]",
            )}
          >
            <div className="mb-2 flex justify-between items-center">
              <h3 className="font-medium truncate">
                {recording.meetingTitle || "Untitled Recording"}
              </h3>
              <span
                className={cn(
                  "text-xs px-2 py-0.5 rounded-full",
                  recording.processed
                    ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                    : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
                )}
              >
                {recording.processed ? "Processed" : "Processing"}
              </span>
            </div>

            <div className="space-y-1 mb-2">
              <div className="text-sm text-gray-500 dark:text-gray-400">
                <span className="inline-block min-w-[100px]">Date:</span>
                <span className="font-medium">
                  {new Date(recording.createdAt).toLocaleDateString()}
                </span>
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                <span className="inline-block min-w-[100px]">Duration:</span>
                <span className="font-medium">
                  {recording.duration ? `${recording.duration} minutes` : "Unknown"}
                </span>
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                <span className="inline-block min-w-[100px]">Folder:</span>
                <span className="font-medium">{recording.folder}</span>
              </div>
            </div>

            {/* Video preview and play button */}
            <div className="mt-3">
              <div className="relative aspect-video bg-gray-100 dark:bg-gray-700 rounded overflow-hidden group">
                <video
                  src={recording.url}
                  className="w-full h-full object-cover"
                  poster={recording.url.replace('.webm', '.jpg')}
                  preload="metadata"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40 group-hover:bg-opacity-50 transition-all">
                  <button
                    onClick={() => window.open(recording.url, '_blank')}
                    className="bg-white/90 hover:bg-white text-gray-800 rounded-full p-3 transition-all hover:scale-110 shadow-lg"
                    title="Play video"
                  >
                    <Play className="h-6 w-6" fill="currentColor" />
                  </button>
                </div>
              </div>
            </div>

            {recording.transcription && (
              <div className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                <span className="font-medium">Transcription:</span>
                <p className="line-clamp-2 mt-1">{recording.transcription}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Load More Button */}
      {nextCursor && (
        <div className="mt-6 text-center">
          <Button
            onClick={handleLoadMore}
            disabled={isLoadingMore}
            variant="outline"
            className="min-w-[150px]"
          >
            {isLoadingMore ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Loading more...
              </>
            ) : (
              "Load more videos"
            )}
          </Button>
        </div>
      )}
    </>
  );
} 