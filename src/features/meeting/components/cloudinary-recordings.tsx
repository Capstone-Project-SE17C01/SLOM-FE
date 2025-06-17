"use client";

import { useState } from "react";
import React from "react";
import { cn } from "@/utils/cn";
import { toast } from "sonner";
import { AlertTriangle, Play, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useGetAllRecordingStoragePathsQuery } from "@/features/meeting/api";

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
  const [page, setPage] = useState(1);
  const [allRecordings, setAllRecordings] = useState<CloudinaryRecording[]>([]);
  const limit = 20;

  // Use the new API hook
  const { data, isLoading, isFetching, error } = useGetAllRecordingStoragePathsQuery({ 
    page, 
    limit 
  });

  // Transform backend data to component format
  const transformRecordings = (storagePaths: Array<{
    storagePath: string;
    meetingId: string;
    recordingId: string;
    createdAt: string;
  }>): CloudinaryRecording[] => {
    return storagePaths.map((recording) => {
      // Extract meeting title from storage path
      const urlParts = recording.storagePath.split('/');
      const filename = urlParts[urlParts.length - 1];
      const meetingTitle = filename
        .replace(/^meeting-/, '')
        .replace(/-\d+_[a-z0-9]+\.webm$/, '')
        .replace(recording.meetingId + '-', '');

      // Extract folder from URL path
      const folder = urlParts[urlParts.length - 2] || 'general';

      return {
        id: recording.recordingId,
        meetingTitle: meetingTitle || recording.meetingId,
        createdAt: recording.createdAt,
        duration: null, // Backend doesn't provide duration yet
        processed: true, // Assume all recordings from backend are processed
        url: recording.storagePath,
        folder: folder,
        transcription: null, // Backend doesn't provide transcription yet
      };
    });
  };

  // Update recordings when data changes
  React.useEffect(() => {
    if (data?.storagePaths) {
      const transformed = transformRecordings(data.storagePaths);
      if (page === 1) {
        setAllRecordings(transformed);
      } else {
        setAllRecordings(prev => [...prev, ...transformed]);
      }
    }
  }, [data, page]);

  const handleLoadMore = () => {
    setPage(prev => prev + 1);
  };

  const hasMore = data ? allRecordings.length < data.totalCount : false;

  if (isLoading && page === 1) {
    return (
      <div className="p-6 text-center rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/50">
        <div className="flex items-center justify-center gap-2">
          <Loader2 className="h-5 w-5 animate-spin" />
          <p className={cn("text-lg", isDarkMode ? "text-gray-400" : "text-gray-500")}>
            Loading recorded sessions...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    toast.error("Failed to load recorded sessions", {
      icon: <AlertTriangle className="h-4 w-4 text-red-500" />,
      description: "Please check your connection and try again.",
    });
    return (
      <div className="p-6 text-center rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/50">
        <p className={cn("text-lg text-red-500", isDarkMode ? "text-red-400" : "text-red-600")}>
          Failed to load recorded sessions
        </p>
      </div>
    );
  }

  if (allRecordings.length === 0 && !isLoading) {
    return (
      <div className="p-6 text-center rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/50">
        <p className={cn("text-lg", isDarkMode ? "text-gray-400" : "text-gray-500")}>
          No recorded sessions available
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {allRecordings.map((recording) => (
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
      {hasMore && (
        <div className="mt-6 text-center">
          <Button
            onClick={handleLoadMore}
            disabled={isFetching}
            variant="outline"
            className="min-w-[150px]"
          >
            {isFetching ? (
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