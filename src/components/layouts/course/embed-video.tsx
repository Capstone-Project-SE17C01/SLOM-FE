'use client'
import Image from "next/image";
import { useSearchParams } from 'next/navigation'
import { useGetVideoSuggestMutation } from "../../../api/CourseApi";
import { useSelector } from "react-redux";
import { ListVideoSuggestResult, VideoSuggest } from "../../../types/ICourse";
import { RootState } from "@/redux/store";
import React, { useState, useEffect, useCallback, useRef } from "react";
import { motion } from "framer-motion";
import { Play, Calendar } from "lucide-react";
import { cn } from "@/utils/cn";

function SideBarVideo(card: Readonly<ListVideoSuggestResult>) {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
            className="mb-4"
        >
            <div
                className={cn(
                    "relative rounded-xl overflow-hidden flex bg-white dark:bg-gray-800 shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer border border-gray-200 dark:border-gray-700",
                )}
                onClick={() => { window.location.replace(`/video?videoId=${card.videoId}`) }}
            >
                <div className="relative w-[120px] h-[80px] overflow-hidden">
                    <Image
                        src={card.videoThumbnail}
                        alt={card.title}
                        fill
                        className="object-cover"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300">
                        <Play className="h-8 w-8 text-white" />
                    </div>
                </div>
                <div className="flex flex-col flex-1 p-3">
                    <h4 className="font-medium text-gray-900 dark:text-gray-100 text-sm mb-1 line-clamp-2">
                        {card.title}
                    </h4>
                    {card.publishDate && (
                        <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 mt-auto">
                            <Calendar className="h-3 w-3 mr-1" />
                            {new Date(card.publishDate).toLocaleDateString()}
                        </div>
                    )}
                </div>
            </div>
        </motion.div>
    );
}

export default function EmbedVideo() {
    const searchParams = useSearchParams()
    const videoId = searchParams.get('videoId')
    const [getVideoSuggestion] = useGetVideoSuggestMutation();
    const { userInfo } = useSelector((state: RootState) => state.auth);
    const [videoList, setVideoList] = useState<VideoSuggest | null>()
    const chatContainerRef = useRef<HTMLDivElement | null>(null);
    const [isLoadFull, setIsLoadFull] = useState(false);
    const [currentPage, setCurrentPage] = useState(2);
    const scrollPositionRef = useRef<number | null>(null);
    const handleScroll = useCallback(async (videoList: VideoSuggest | null | undefined, theCurrentPage: number, isLoadFull: boolean) => {
        if (chatContainerRef.current && !isLoadFull) {
            if (chatContainerRef.current.scrollHeight - chatContainerRef.current.scrollTop <= chatContainerRef.current.clientHeight + 20) {
                const prevScrollHeight = chatContainerRef.current.scrollHeight;

                if (!userInfo?.id) return;

                Promise.all([
                    getVideoSuggestion({ userId: userInfo.id, pageNumber: theCurrentPage, searchQuery: "" }).unwrap(),
                ])
                    .then(([videoListResponse]) => {
                        if (videoListResponse.result != null) {
                            const getListVideo: VideoSuggest | null = videoListResponse.result

                            if (getListVideo.isLoadFullPage) {
                                setIsLoadFull(true);
                            }

                            if (videoList != null) {
                                const currentVideoList = [...videoList.videoSuggest ?? []];
                                const gotVideoList = [...getListVideo.videoSuggest ?? []];
                                if (gotVideoList != null && currentVideoList != null) {
                                    currentVideoList.push(...gotVideoList)
                                    const result: VideoSuggest = {
                                        videoSuggest: currentVideoList,
                                        isLoadFullPage: getListVideo.isLoadFullPage
                                    };
                                    setVideoList(result);
                                    setCurrentPage(theCurrentPage + 1)
                                }
                            }

                            scrollPositionRef.current = prevScrollHeight;
                        }
                    })
                    .catch((err) => {
                        console.error("fetch error", err);
                    });
            }
        }
    }, [getVideoSuggestion, userInfo?.id]);

    useEffect(() => {
        const div = chatContainerRef.current;
        if (div) {
            const onScroll = async () => {
                await handleScroll(videoList, currentPage, isLoadFull);
            };

            div.addEventListener('scroll', onScroll);

            return () => {
                div.removeEventListener('scroll', onScroll);
            };
        }
    }, [videoList, currentPage, isLoadFull, handleScroll]);

    useEffect(() => {
        if (!userInfo?.id) return;
        Promise.all([
            getVideoSuggestion({ userId: userInfo.id, pageNumber: 1, searchQuery: "" }).unwrap(),
        ])
            .then(([videoListResponse]) => {
                if (videoListResponse != null) setVideoList(videoListResponse.result);
            })
            .catch((err) => {
                console.error("fetch error", err);
            });
    }, [
        getVideoSuggestion,
        userInfo?.id,
        userInfo?.courseId,
    ]);

    return (
        <div className="flex flex-col md:flex-row w-full h-[calc(100vh-200px)] justify-between gap-6">
            <motion.div 
                className="w-full md:w-[70%] h-full md:h-[calc(100vh-200px)] rounded-xl overflow-hidden shadow-lg border border-gray-200 dark:border-gray-700"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <iframe 
                    src={`https://www.youtube.com/embed/${videoId}`}
                    allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                    title="Video Player" 
                    allowFullScreen
                    className="w-full h-full"
                ></iframe>
            </motion.div>
            
            <motion.div 
                className="w-full md:w-[30%] h-[300px] md:h-[calc(100vh-200px)] overflow-y-auto p-4 rounded-xl border border-gray-200 dark:border-gray-700 shadow-md bg-gray-50 dark:bg-gray-800"
                ref={chatContainerRef}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
            >
                <h3 className="text-lg font-bold mb-4 text-gray-900 dark:text-gray-100">Suggested Videos</h3>
                
                {videoList?.videoSuggest != null && videoList.videoSuggest.length > 0 ? (
                    videoList.videoSuggest.map((card) => (
                        <SideBarVideo key={card.id}
                            videoThumbnail={card.videoThumbnail}
                            id={card.id}
                            title={card.title}
                            description={card.description}
                            videoUrl={card.videoUrl}
                            publishDate={card.publishDate}
                            videoId={card.videoId}
                        />
                    ))
                ) : (
                    <div className="text-center py-8">
                        <p className="text-gray-500 dark:text-gray-400">No suggested videos available</p>
                    </div>
                )}
            </motion.div>
        </div>
    )
}