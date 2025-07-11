'use client'
import Image from "next/image";
import { useSearchParams } from 'next/navigation'
import { useGetVideoSuggestMutation } from "../../../api/CourseApi";
import { useSelector } from "react-redux";
import { ListVideoSuggestResult, VideoSuggest } from "../../../types/ICourse";
import { RootState } from "@/middleware/store";
import React, { useState, useEffect, useCallback, useRef } from "react";

function SideBarVideo(card: Readonly<ListVideoSuggestResult>) {
    return (
        <button
            className={`relative rounded-2xl overflow-hidden flex flex-col justify-between min-w-[260px] w-full h-[30%] bg-white shadow-sm cursor-pointer transition-transform duration-200 mb-2 border`}
            onClick={() => { window.location.replace(`/video?videoId=${card.videoId}`) }}
        >
            <div className="flex h-full">
                <div className="relative w-[60%] h-full">
                    <Image
                        src={card.videoThumbnail}
                        alt={card.title}
                        fill
                        className="object-cover h-full"
                    />
                </div>
                <div className="flex flex-col flex-1 p-4 pt-3">
                    {/* <div
                            className={`inline-block px-3 py-1 rounded-md text-sm font-semibold mb-2 ${card.tagColor} bg-opacity-80`}
                        >
                            {card.tag}
                        </div> */}
                    <div className="font-semibold text-[#0a2233] text-sm mb-4 line-clamp-2">
                        {card.title}
                    </div>
                    {/* <button className="mt-auto w-fit px-5 py-2 rounded-xl border-2 border-[#0a2233] font-bold text-[#0a2233] bg-white hover:bg-gray-50 transition text-base">
                            {t("btn")}
                        </button> */}
                </div>
            </div>

        </button>
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
        <div className="flex w-full h-[calc(100vh-200px)] justify-between">
            <div className="w-[70%] h-[calc(100vh-200px)]">
                <iframe src={`https://www.youtube.com/embed/${videoId}`}
                    allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                    title="Video: Rickroll" allowFullScreen
                    className="rounded-xl w-[100%] h-full"></iframe>
            </div>
            <div className="w-[28%] overflow-scroll px-3" ref={chatContainerRef}>
                {videoList?.videoSuggest != null ? videoList.videoSuggest.map((card) => (
                    <SideBarVideo key={card.id}
                        videoThumbnail={card.videoThumbnail}
                        id={card.id}
                        title={card.title}
                        description={card.description}
                        videoUrl={card.videoUrl}
                        publishDate={card.publishDate}
                        videoId={card.videoId}
                    />
                )) : ""}
            </div>
        </div>
    )
}