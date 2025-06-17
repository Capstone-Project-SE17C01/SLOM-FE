"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { FaPlay, FaSearch } from "react-icons/fa";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { RootState } from "@/redux/store";
import { useGetVideoSuggestMutation } from "../api";
import { useSelector } from "react-redux";
import { ListVideoSuggestResult, VideoHeaderInput, VideoSuggest, VideoTabsInput } from "../types";

function VideoHeader(input: Readonly<VideoHeaderInput>) {
  return (
    <div className="bg-primary/10 rounded-xl flex items-center gap-4 px-6 py-5 mb-6">
      <div className="bg-primary/10 rounded-lg p-3 flex items-center justify-center">
        <FaPlay className="text-primary text-3xl" />
      </div>
      <div>
        <div className="font-bold text-2xl text-primary leading-snug">
          {input.headerTitle}
        </div>
        <div className="text-primary text-base mt-1">{input.headerDesc}</div>
      </div>
    </div>
  );
}

function VideoTabs(input: Readonly<VideoTabsInput>) {
  const t = useTranslations("immersePage");
  const videoTabs = [
    { label: t("tabAll") },
    { label: t("tabReady") },
    { label: t("tabWatched") },
    { label: t("tabPractice") },
  ];
  return (
    <div className="flex gap-2 mb-6">
      {videoTabs.map((tab, i) => (
        <button
          key={tab.label}
          onClick={() => input.setActive(i)}
          className={`px-5 py-1.5 rounded-full font-semibold text-base border transition-all
              ${input.active === i
              ? "border-primary text-[#0a2233] bg-white shadow"
              : "border-gray-200 text-[#0a2233] bg-gray-50 hover:border-primary"
            }
            `}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}

function VideoCard(card: Readonly<ListVideoSuggestResult>) {
  return (
    <button
      className={`relative rounded-2xl overflow-hidden flex flex-col justify-between min-w-[260px] max-w-[320px] bg-white shadow-sm hover:scale-105 transition-transform duration-200 border cursor-pointer`}
      onClick={() => { window.location.replace(`/video?videoId=${card.videoId}`) }}
    >
      <div className="relative w-full h-[220px]">
        <Image
          src={card.videoThumbnail}
          alt={card.title}
          fill
          className="object-cover"
        />
      </div>
      <div className="flex flex-col flex-1 p-4 pt-3">
        <div className="font-semibold text-[#0a2233] text-base mb-4 line-clamp-2">
          {card.title}
        </div>
      </div>
    </button>
  );
}

export default function ImmerseVideo() {
  const t = useTranslations("immersePage");
  const [activeTab, setActiveTab] = useState(0);
  const [search, setSearch] = useState("");
  const [getVideoSuggestion] = useGetVideoSuggestMutation();
  const { userInfo } = useSelector((state: RootState) => state.auth);
  const [videoList, setVideoList] = useState<VideoSuggest | null>()
  const chatContainerRef = useRef<HTMLDivElement | null>(null);
  const [currentPage, setCurrentPage] = useState(2);
  const [isLoadFull, setIsLoadFull] = useState(false);
  const scrollPositionRef = useRef<number | null>(null);
  const handleScroll = useCallback(async (videoList: VideoSuggest | null | undefined, theCurrentPage: number, isLoadFull: boolean, searchQuery: string) => {
    if (chatContainerRef.current && !isLoadFull) {
      if (chatContainerRef.current.scrollHeight - chatContainerRef.current.scrollTop <= chatContainerRef.current.clientHeight + 20) {
        const prevScrollHeight = chatContainerRef.current.scrollHeight;

        if (!userInfo?.id) return;

        Promise.all([
          getVideoSuggestion({ userId: userInfo.id, pageNumber: theCurrentPage, searchQuery: searchQuery }).unwrap(),
        ])
          .then(([videoListResponse]) => {
            if (videoListResponse.result != null) {
              let getListVideo: VideoSuggest | null = videoListResponse.result

              if (getListVideo.isLoadFullPage) {
                setIsLoadFull(true);
              }

              if (videoList != null) {
                let currentVideoList = [...videoList.videoSuggest ?? []];
                let gotVideoList = [...getListVideo.videoSuggest ?? []];
                if (gotVideoList != null && currentVideoList != null) {
                  currentVideoList.push(...gotVideoList)
                  let result: VideoSuggest = {
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
  }, []);

  useEffect(() => {
    const div = chatContainerRef.current;
    if (div) {
      const onScroll = async () => {
        await handleScroll(videoList, currentPage, isLoadFull, search);
      };

      div.addEventListener('scroll', onScroll);

      return () => {
        div.removeEventListener('scroll', onScroll);
      };
    }
  }, [videoList, currentPage, isLoadFull, handleScroll, search]);

  useEffect(() => {
    if (!userInfo?.id) return;
    Promise.all([
      getVideoSuggestion({ userId: userInfo.id, pageNumber: 1, searchQuery: search }).unwrap(),
    ])
      .then(([videoListResponse]) => {
        if (videoListResponse != null) {
          setVideoList(videoListResponse.result);
          setCurrentPage(2);
        }
      })
      .catch((err) => {
        console.error("fetch error", err);
      });
  }, [
    userInfo?.id,
    userInfo?.courseId,
    search
  ]);

  return (
    <div className="p-8 pt-4 max-h-[90vh] overflow-scroll" ref={chatContainerRef}>
      <VideoHeader headerTitle={t("headerTitle")} headerDesc={t("headerDesc")} />
      <div className="flex items-center justify-between mb-2">
        <VideoTabs active={activeTab} setActive={setActiveTab} />
        <div className="relative w-[260px]">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t("searchPlaceholder")}
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-300 bg-white text-base focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-2">
        {videoList?.videoSuggest != null ? videoList.videoSuggest.map((card) => (
          <VideoCard key={card.id}
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
  );
}
