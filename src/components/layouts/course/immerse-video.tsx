"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { Search, Video, Play, Calendar } from "lucide-react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { RootState } from "@/redux/store";
import { useGetVideoSuggestMutation } from "../../../api/CourseApi";
import { useSelector } from "react-redux";
import { ListVideoSuggestResult, VideoSuggest } from "../../../types/ICourse";
import { motion } from "framer-motion";
import { cn } from "@/utils/cn";

function VideoCard(card: Readonly<ListVideoSuggestResult>) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ scale: 1.03, transition: { duration: 0.2 } }}
    >
      <div
        className={cn(
          "relative rounded-xl overflow-hidden flex flex-col justify-between min-w-[260px] max-w-[320px] bg-white dark:bg-gray-800 shadow-md hover:shadow-lg transition-all duration-300 border border-gray-200 dark:border-gray-700 cursor-pointer h-full"
        )}
        onClick={() => { window.location.replace(`/video?videoId=${card.videoId}`) }}
      >
        <div className="relative w-full h-[180px] overflow-hidden group">
          <Image
            src={card.videoThumbnail}
            alt={card.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <Play className="h-12 w-12 text-white" />
          </div>
        </div>
        <div className="flex flex-col flex-1 p-5">
          <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-lg mb-3 line-clamp-2">
            {card.title}
          </h3>
          {card.publishDate && (
            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mt-auto">
              <Calendar className="h-4 w-4 mr-2" />
              {new Date(card.publishDate).toLocaleDateString()}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export default function ImmerseVideo() {
  const t = useTranslations("immersePage");
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
    getVideoSuggestion,
    userInfo?.id,
    userInfo?.courseId,
    search
  ]);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <div className="p-6 md:p-8 bg-white dark:bg-gray-900 max-h-[90vh] overflow-auto" ref={chatContainerRef}>
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg text-primary">
              <Video className="h-6 w-6" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              {t("videoLibrary")}
            </h1>
          </div>
          <div className="relative">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t("searchPlaceholder")}
              className="pl-12 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent min-w-[280px] shadow-sm text-black dark:text-gray-100 transition-all duration-300"
            />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
          </div>
        </div>
        
        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
          variants={container}
          initial="hidden"
          animate="show"
        >
          {videoList?.videoSuggest != null && videoList.videoSuggest.length > 0 ? (
            videoList.videoSuggest.map((card) => (
              <VideoCard key={card.id}
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
            <div className="col-span-full text-center py-20">
              <p className="text-xl text-gray-500 dark:text-gray-400">{t("noVideosFound")}</p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
