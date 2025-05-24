"use client";
import React, { useState, useEffect } from "react";
import { FaSearch } from "react-icons/fa";
import Image from "next/image";
import SwitchTabButton from "@/components/ui/switchTabButton";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import LearningPathSection from "@/components/ui/learningPathSection";
import { Lesson, Module } from "@/features/course/types";
import {
  useGetAllModuleByCourseIdMutation,
  useGetOngoingLessonByUserIdMutation,
} from "@/features/course/api";
import Spinner from "@/components/ui/spinner";
import { RootState } from "@/redux/store";
import { useSelector } from "react-redux";
import { useDebounce } from "@/hooks/useDebounce";

export default function LearnPage() {
  const router = useRouter();
  const t_learn = useTranslations("learnPage");

  const [search, setSearch] = useState("");
  const debounced = useDebounce(search, 1000);

  const [modules, setModules] = useState<Module[]>([]);
  const [ongoingLesson, setOngoingLesson] = useState<Lesson>();
  const { userInfo } = useSelector((state: RootState) => state.auth);

  const [getOngoingLesson, { isLoading: isLoadingOngoingLesson }] =
    useGetOngoingLessonByUserIdMutation();
  const [getAllModuleByCourseId, { isLoading: isLoadingAllModuleByCourseId }] =
    useGetAllModuleByCourseIdMutation();

  useEffect(() => {
    if (!userInfo?.id || !userInfo?.courseId) return;
    Promise.all([
      getAllModuleByCourseId(userInfo.courseId).unwrap(),
      getOngoingLesson(userInfo.id).unwrap(),
    ])
      .then(([modulesRes, lessonRes]) => {
        if (modulesRes.result) setModules(modulesRes.result);
        if (lessonRes.result) setOngoingLesson(lessonRes.result);
      })
      .catch((err) => {
        console.log("fetch error", err);
      });
  }, [
    getAllModuleByCourseId,
    getOngoingLesson,
    userInfo?.id,
    userInfo?.courseId,
  ]);

  const currentModule = ongoingLesson?.module;
  const filteredModules = modules.filter((mod) =>
    mod.title.toLowerCase().includes(debounced.trim().toLowerCase())
  );

  if (isLoadingOngoingLesson || isLoadingAllModuleByCourseId) {
    return (
      <div className="bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 w-screen h-screen fixed inset-0">
        <Spinner text="Loading..." />
      </div>
    );
  }

  return (
    <div className="p-8">
      {/* Tabs + Search */}
      <div className="flex lg:flex-row items-center justify-between mb-6 max-md:flex-col max-md:gap-4 max-md:items-start">
        <SwitchTabButton
          tabs={[
            { label: t_learn("tabLearn"), href: "/learn" },
            { label: t_learn("tabPractice"), href: "/practice" },
          ]}
        />
        <div className="flex max-md:flex-col items-center gap-6">
          <div className="relative">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t_learn("searchPlaceholder")}
              className="pl-10 pr-4 py-2 rounded-lg border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-primary min-w-[220px]"
            />
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          </div>
          <button
            className="font-semibold text-sm text-gray-800 flex items-center gap-1 hover:underline"
            onClick={() => {
              router.push("/practice");
            }}
          >
            {t_learn("studiedSituations")} <span className="ml-1">→</span>
          </button>
        </div>
      </div>

      {/* Continue learning */}
      {ongoingLesson && (
        <div className="mb-8">
          <div className="text-2xl font-extrabold mb-3">
            {t_learn("continueLearning")}
          </div>
          <div className="min-w-[300px] w-full max-w-md bg-gray-50 rounded-xl shadow flex items-center p-4 mb-2 lg:flex-row sm:items-start sm:gap-4">
            <div className="flex-1">
              <div className="font-bold text-sm mb-1">
                {currentModule?.title
                  ? t_learn("modulesTitle." + currentModule.title)
                  : ""}
              </div>
              <div className="text-gray-700 text-base mb-2">
                {ongoingLesson?.title
                  ? t_learn("lessonsTitle." + ongoingLesson?.title)
                  : ""}
              </div>
            </div>
            <button
              className="ml-4 bg-primary text-white font-bold px-6 py-2 rounded-lg shadow"
              onClick={() =>
                ongoingLesson
                  ? router.push(
                      `/apprender/learn?lessonId=${encodeURIComponent(
                        ongoingLesson.id
                      )}&lessonTitle=${encodeURIComponent(
                        ongoingLesson.title
                      )}&back=${encodeURIComponent("/learn")}`
                    )
                  : null
              }
            >
              {t_learn("continue")}
            </button>
            <div className="ml-4 max-md:hidden">
              <Image
                src="/images/logo.png"
                alt="avatar"
                width={48}
                height={48}
                className="rounded-full object-cover"
              />
            </div>
          </div>
        </div>
      )}

      {/* List modules and lessons */}

      {filteredModules.length > 0 ? (
        filteredModules.map((mod) => (
          <LearningPathSection
            key={mod.id}
            isReview={false}
            sectionTitle={t_learn("modulesTitle." + mod.title)}
            sectionDescription={t_learn("modulesDesc." + mod.title)}
            lessons={
              mod.lessons?.map((lesson) => ({
                id: lesson.id,
                title: lesson?.title
                  ? t_learn("lessonsTitle." + lesson.title)
                  : "",
                image: "/images/logo.png",
              })) ?? []
            }
          />
        ))
      ) : (
        <div className="text-center text-gray-500 mt-8">
          {t_learn("emptyModule")}
        </div>
      )}
    </div>
  );
}
