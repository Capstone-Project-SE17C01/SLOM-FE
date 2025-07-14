"use client";
import React, { useState, useEffect } from "react";
import { FaSearch } from "react-icons/fa";
import Image from "next/image";
import SwitchTabButton from "@/components/ui/switchTabButton";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import LearningPathSection from "@/components/ui/learningPathSection";
import { Lesson, Module } from "@/types/ICourse";
import {
  useGetAllModuleByCourseIdMutation,
  useGetOngoingLessonByUserIdMutation,
} from "@/api/CourseApi";
import Spinner from "@/components/ui/spinner";
import { RootState } from "@/middleware/store";
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
        console.error("fetch error", err);
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
    <div className="p-8 bg-white dark:bg-gray-900 min-h-screen">
      {/* Tabs + Search */}
      <div className="flex lg:flex-row items-center justify-between mb-8 max-md:flex-col max-md:gap-4 max-md:items-start">
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
              className="pl-10 pr-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent min-w-[260px] shadow-sm text-black dark:text-gray-100"
            />
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          </div>
          <button
            className="font-semibold text-sm text-primary flex items-center gap-1 hover:text-primary/80 transition-colors"
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
          <div className="text-2xl font-extrabold mb-4 text-gray-900 dark:text-gray-100">
            {t_learn("continueLearning")}
          </div>
          <div className="bg-gradient-to-r from-primary/5 to-primary/10 dark:from-gray-800 dark:to-gray-900 rounded-xl shadow-sm border border-primary/20 dark:border-gray-700 p-6 max-w-2xl">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="font-bold text-sm mb-1 text-primary">
                  {currentModule?.title
                    ? currentModule.title
                    : t_learn("moduleTitle")}
                </div>
                <div className="text-gray-700 dark:text-gray-300 text-lg mb-3 font-medium">
                  {ongoingLesson?.title
                    ? ongoingLesson.title
                    : t_learn("lessonTitle")}
                </div>
              </div>
              <div className="flex items-center gap-4">
                <button
                  className="bg-primary text-white font-bold px-8 py-3 rounded-lg shadow-md hover:shadow-lg hover:bg-primary/90 transition-all"
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
                <div className="max-md:hidden">
                  <Image
                    src="/images/logo.png"
                    alt="avatar"
                    width={56}
                    height={56}
                    className="rounded-full object-cover shadow-md"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* List modules and lessons */}
      <div className="space-y-8">
        {filteredModules.length > 0 ? (
          filteredModules.map((mod) => (
            <LearningPathSection
              key={mod.id}
              isReview={false}
              sectionTitle={mod.title}
              sectionDescription={mod.title}
              lessons={
                mod.lessons?.map((lesson) => ({
                  id: lesson.id,
                  title: lesson?.title ? lesson.title : t_learn("lessonTitle"),
                  image: "/images/logo.png",
                })) ?? []
              }
            />
          ))
        ) : (
          <div className="text-center text-gray-500 mt-12 py-12">
            <div className="text-lg font-medium">{t_learn("emptyModule")}</div>
          </div>
        )}
      </div>
    </div>
  );
}
