"use client";
import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { cn } from "@/utils/cn";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Play, Pause, Volume2, VolumeX, Maximize2, Minimize2, FileText, Loader2 } from "lucide-react";
import { OpenRouterService } from "@/services/openrouter/config";
import { useTheme } from "@/contexts/ThemeContext";
import { VideoTranscriptionService } from "@/services/video/config";

export default function VideoViewerPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { isDarkMode } = useTheme();
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [summary, setSummary] = useState<string>("");
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);
  const [hasSummary, setHasSummary] = useState(false);
  
  const videoUrl = searchParams.get('url');
  const title = searchParams.get('title') || 'Recorded Session';

  const getVideo = () => document.getElementById('main-video') as HTMLVideoElement;

  const handlePlayPause = () => {
    const video = getVideo();
    if (video) {
      if (isPlaying) video.pause(); else video.play();
      setIsPlaying(!isPlaying);
    }
  };

  const handleMute = () => {
    const video = getVideo();
    if (video) {
      video.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const video = getVideo();
    const newVolume = parseFloat(e.target.value);
    if (video) {
      video.volume = newVolume;
      setVolume(newVolume);
      setIsMuted(newVolume === 0);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const video = getVideo();
    const newTime = parseFloat(e.target.value);
    if (video) {
      video.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const toggleFullscreen = () => {
    const videoContainer = document.getElementById('video-container');
    if (videoContainer) {
      if (!isFullscreen) {
        if (videoContainer.requestFullscreen) videoContainer.requestFullscreen();
      } else {
        if (document.exitFullscreen) document.exitFullscreen();
      }
      setIsFullscreen(!isFullscreen);
    }
  };

  const formatTime = (time: number) => {
    if (!time || !isFinite(time) || isNaN(time)) return null;
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const generateSummary = async () => {
    setIsGeneratingSummary(true);
    try {
      const openRouterApiKey = process.env.NEXT_PUBLIC_OPENROUTER_API_KEY;
      if (!openRouterApiKey) throw new Error('OpenRouter API key not configured');

      const videoElement = getVideo();
      if (!videoElement) throw new Error('Video element not found');

      const transcriptionService = new VideoTranscriptionService();
      let transcriptText = transcriptionService.extractSubtitlesFromVideo(videoElement);
      
      if (!transcriptText || transcriptText.length < 10) {
        const transcriptionResult = await transcriptionService.transcribeVideo(videoElement);
        transcriptText = (transcriptionResult as {text?: string})?.text || '';
      }

      if (!transcriptText || transcriptText.length < 10) {
        throw new Error('Unable to extract content from video');
      }

      const openRouterService = new OpenRouterService(openRouterApiKey);
      const summaryText = await openRouterService.summarizeText({ content: transcriptText, maxWords: 100 });

      const formattedSummary = `## Video Summary\n\n${summaryText}\n\n${formatTime(duration) ? `**Duration:** ${formatTime(duration)}\n` : ''}**Date:** ${new Date().toLocaleDateString()}`;

      setSummary(formattedSummary);
      setHasSummary(true);
    } catch (error) {
      console.error('Failed to generate summary:', error);
      setSummary(`## Error\n\nFailed to generate summary: ${error instanceof Error ? error.message : 'Unknown error'}\n\nPlease try again or check if the video has subtitles/captions.`);
      setHasSummary(true);
    } finally {
      setIsGeneratingSummary(false);
    }
  };

  useEffect(() => {
    if (!videoUrl) router.push('/meeting-room');
  }, [videoUrl, router]);

  if (!videoUrl) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-lg text-gray-500">Invalid video URL</p>
          <Button onClick={() => router.push('/meeting-room')} className="mt-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Meeting Room
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("min-h-screen", isDarkMode ? "bg-gradient-to-br from-gray-900 via-gray-900 to-gray-800" : "bg-gradient-to-br from-gray-50 via-white to-gray-100")}>
      <div className="max-w-7xl mx-auto p-6">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button variant="outline" onClick={() => router.push('/meeting-room')} className={cn("flex items-center gap-2 transition-all duration-200 hover:scale-105", isDarkMode ? "border-gray-600 hover:border-[#6947A8] hover:bg-[#6947A8]/10" : "border-gray-300 hover:border-[#6947A8] hover:bg-[#6947A8]/5")}>
              <ArrowLeft className="h-4 w-4" />
              Back to Meeting Room
            </Button>
          </div>
          <div className="text-right">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-[#6947A8] to-[#8B6CC7] bg-clip-text text-transparent">{title}</h1>
            <p className={cn("text-sm mt-1", isDarkMode ? "text-gray-400" : "text-gray-600")}>Video Recording{formatTime(duration) ? ` • ${formatTime(duration)}` : ''}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="lg:col-span-1">
            <div id="video-container" className={cn("relative rounded-2xl overflow-hidden shadow-2xl ring-1", isDarkMode ? "bg-gray-800 ring-gray-700/50" : "bg-black ring-gray-200/50")}>
              <video id="main-video" className="w-full aspect-video" src={videoUrl} onTimeUpdate={() => setCurrentTime(getVideo()?.currentTime || 0)} onLoadedMetadata={() => setDuration(getVideo()?.duration || 0)} onPlay={() => setIsPlaying(true)} onPause={() => setIsPlaying(false)} onEnded={() => setIsPlaying(false)} controls={false} />
              
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                <div className="mb-4">
                  <input type="range" min="0" max={duration || 0} value={currentTime} onChange={handleSeek} className="w-full h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer slider" />
                  <div className="flex justify-between text-xs text-white mt-1">
                    <span>{formatTime(currentTime) || '00:00'}</span>
                    <span>{formatTime(duration) || '00:00'}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <button onClick={handlePlayPause} className="text-white hover:text-gray-300 transition-colors">
                      {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
                    </button>
                    <button onClick={handleMute} className="text-white hover:text-gray-300 transition-colors">
                      {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
                    </button>
                    <input type="range" min="0" max="1" step="0.1" value={volume} onChange={handleVolumeChange} className="w-20 h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer" />
                  </div>
                  <button onClick={toggleFullscreen} className="text-white hover:text-gray-300 transition-colors">
                    {isFullscreen ? <Minimize2 className="h-5 w-5" /> : <Maximize2 className="h-5 w-5" />}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className={cn("rounded-2xl border backdrop-blur-sm h-full flex flex-col transition-all duration-300", isDarkMode ? "bg-gray-800/80 border-gray-700/50 shadow-2xl" : "bg-white/80 border-gray-200/50 shadow-xl")}>
              <div className={cn("p-6 border-b", isDarkMode ? "border-gray-700/50" : "border-gray-200/50")}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={cn("p-2 rounded-lg", isDarkMode ? "bg-[#6947A8]/20" : "bg-[#6947A8]/10")}>
                      <FileText className="h-5 w-5 text-[#6947A8]" />
                    </div>
                    <div>
                      <h2 className="text-lg font-bold">AI Summary</h2>
                      <p className={cn("text-xs", isDarkMode ? "text-gray-400" : "text-gray-500")}>Powered by AI</p>
                    </div>
                  </div>
                  {!hasSummary && (
                    <Button onClick={generateSummary} disabled={isGeneratingSummary} size="sm" className={cn("bg-gradient-to-r from-[#6947A8] to-[#8B6CC7] hover:from-[#5A3A96] hover:to-[#7A5BBD]", "shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105", "text-white border-0")}>
                      {isGeneratingSummary ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Analyzing...
                        </>
                      ) : (
                        <>
                          <FileText className="h-4 w-4 mr-2" />
                          Generate
                        </>
                      )}
                    </Button>
                  )}
                </div>
              </div>

              <div className="p-6">
                {hasSummary ? (
                  <div className="space-y-4">
                    <div className={cn("prose prose-sm max-w-none", isDarkMode ? "prose-invert" : "", "prose-headings:text-[#6947A8] prose-headings:font-bold", "prose-strong:text-[#6947A8] prose-strong:font-semibold", "prose-ul:space-y-1 prose-li:text-sm")}>
                      <div className="whitespace-pre-wrap text-sm leading-relaxed">{summary}</div>
                    </div>
                    <div className="pt-4 border-t border-gray-200/50 dark:border-gray-700/50">
                      <Button onClick={() => { setHasSummary(false); setSummary(""); }} variant="outline" size="sm" className="w-full">Generate New Summary</Button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className={cn("p-4 rounded-full mx-auto mb-4 w-fit", isDarkMode ? "bg-gray-700/50" : "bg-gray-100/50")}>
                      <FileText className={cn("h-8 w-8", isGeneratingSummary ? "text-[#6947A8] animate-pulse" : isDarkMode ? "text-gray-500" : "text-gray-400")} />
                    </div>
                    <h3 className={cn("font-semibold mb-2", isDarkMode ? "text-gray-300" : "text-gray-700")}>{isGeneratingSummary ? "Analyzing Video..." : "No Summary Yet"}</h3>
                    <p className={cn("text-sm leading-relaxed", isDarkMode ? "text-gray-400" : "text-gray-500")}>{isGeneratingSummary ? "Our AI is processing the video content to extract key insights, action items, and important discussion points." : "Generate an AI-powered summary to quickly understand the key points, decisions, and action items from this recording."}</p>
                    {isGeneratingSummary && (
                      <div className="mt-4">
                        <div className={cn("h-1 bg-gray-200 rounded-full overflow-hidden", isDarkMode ? "bg-gray-700" : "bg-gray-200")}>
                          <div className="h-full bg-gradient-to-r from-[#6947A8] to-[#8B6CC7] rounded-full animate-pulse"></div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
