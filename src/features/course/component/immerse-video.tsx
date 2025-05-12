"use client";
import React, { useState } from "react";
import { FaPlay, FaSearch } from "react-icons/fa";
import Image from "next/image";
import { useTranslations } from "next-intl";

export default function ImmerseVideo() {
  const t = useTranslations("immersePage");
  const [activeTab, setActiveTab] = useState(0);
  const [search, setSearch] = useState("");

  // Tabs filter lấy từ i18n
  const videoTabs = [
    { label: t("tabAll") },
    { label: t("tabReady") },
    { label: t("tabWatched") },
    { label: t("tabPractice") },
  ];

  // Dummy data for cards lấy từ i18n
  const videoCards = [
    {
      id: 1,
      label: t("popular"),
      highlight: true,
      tag: t("tag"),
      tagColor: "bg-pink-200 text-[#b94a4a]",
      border: "border-4 border-[#2c3e50]",
      img: "/images/video1.jpg",
      title: t("card1"),
    },
    {
      id: 2,
      tag: t("tag"),
      tagColor: "bg-pink-200 text-[#b94a4a]",
      border: "border border-white",
      img: "/images/video2.jpg",
      title: t("card2"),
    },
    {
      id: 3,
      tag: t("tag"),
      tagColor: "bg-pink-200 text-[#b94a4a]",
      border: "border border-white",
      img: "/images/video3.jpg",
      title: t("card3"),
    },
    {
      id: 4,
      tag: t("tag"),
      tagColor: "bg-pink-200 text-[#b94a4a]",
      border: "border border-white",
      img: "/images/video4.jpg",
      title: t("card4"),
    },
  ];

  function VideoHeader() {
    return (
      <div className="bg-[#fff8e1] rounded-xl flex items-center gap-4 px-6 py-5 mb-6">
        <div className="bg-[#ffe082] rounded-lg p-3 flex items-center justify-center">
          <FaPlay className="text-yellow-500 text-3xl" />
        </div>
        <div>
          <div className="font-bold text-2xl text-[#0a2233] leading-snug">
            {t("headerTitle")}
          </div>
          <div className="text-[#0a2233] text-base mt-1">{t("headerDesc")}</div>
        </div>
      </div>
    );
  }

  function VideoTabs({
    active,
    setActive,
  }: {
    active: number;
    setActive: (i: number) => void;
  }) {
    return (
      <div className="flex gap-2 mb-6">
        {videoTabs.map((tab, i) => (
          <button
            key={tab.label}
            onClick={() => setActive(i)}
            className={`px-5 py-1.5 rounded-full font-semibold text-base border transition-all
              ${
                active === i
                  ? "border-yellow-400 text-[#0a2233] bg-white shadow"
                  : "border-gray-200 text-[#0a2233] bg-gray-50 hover:border-yellow-300"
              }
            `}
          >
            {tab.label}
          </button>
        ))}
      </div>
    );
  }

  function VideoCard({ card }: { card: (typeof videoCards)[0] }) {
    return (
      <div
        className={`relative rounded-2xl overflow-hidden flex flex-col justify-between min-w-[260px] max-w-[320px] h-[370px] bg-white ${card.border} shadow-sm hover:scale-105 transition-transform duration-200`}
      >
        {card.highlight && (
          <div className="absolute top-0 left-0 bg-[#2c3e50] text-white text-sm font-bold px-4 py-2 rounded-tl-2xl rounded-br-2xl z-10">
            {card.label}
          </div>
        )}
        <div className="relative w-full h-[220px]">
          <Image
            src={card.img}
            alt={card.title}
            fill
            className="object-cover"
          />
        </div>
        <div className="flex flex-col flex-1 p-4 pt-3">
          <div
            className={`inline-block px-3 py-1 rounded-md text-xs font-semibold mb-2 ${card.tagColor} bg-opacity-80`}
          >
            {card.tag}
          </div>
          <div className="font-semibold text-[#0a2233] text-base mb-4 line-clamp-2">
            {card.title}
          </div>
          <button className="mt-auto w-fit px-5 py-2 rounded-xl border-2 border-[#0a2233] font-bold text-[#0a2233] bg-white hover:bg-gray-50 transition text-base">
            {t("btn")}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 pt-4">
      <VideoHeader />
      <div className="flex items-center justify-between mb-2">
        <VideoTabs active={activeTab} setActive={setActiveTab} />
        <div className="relative w-[260px]">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t("searchPlaceholder")}
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-300 bg-white text-base focus:outline-none focus:ring-2 focus:ring-yellow-400"
          />
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-2">
        {videoCards.map((card) => (
          <VideoCard key={card.id} card={card} />
        ))}
      </div>
    </div>
  );
}
