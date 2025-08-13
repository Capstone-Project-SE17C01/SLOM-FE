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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
      <div className="p-8">
        {/* Enhanced Header with Tabs + Search */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 mb-8">
          <div className="flex lg:flex-row items-center justify-between max-md:flex-col max-md:gap-6 max-md:items-start">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-r from-primary to-primary/80 rounded-xl flex items-center justify-center shadow-lg">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <SwitchTabButton
                tabs={[
                  { label: t_learn("tabLearn"), href: "/learn" },
                  { label: t_learn("tabPractice"), href: "/practice" },
                ]}
              />
            </div>
            
            <div className="flex max-md:flex-col items-center gap-6">
              <div className="relative group">
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder={t_learn("searchPlaceholder")}
                  className="pl-12 pr-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary min-w-[280px] shadow-sm text-gray-900 dark:text-gray-100 transition-all duration-300 group-hover:shadow-md"
                />
                <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-hover:text-primary transition-colors duration-300" />
                {search && (
                  <button
                    onClick={() => setSearch("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    ✕
                  </button>
                )}
              </div>
              
              <button
                className="group/link bg-gradient-to-r from-primary/10 to-primary/5 hover:from-primary/20 hover:to-primary/10 border border-primary/20 hover:border-primary/30 font-semibold text-sm text-primary px-4 py-3 rounded-xl flex items-center gap-2 transition-all duration-300 hover:shadow-md"
                onClick={() => router.push("/practice")}
              >
                {t_learn("studiedSituations")}
                <span className="group-hover/link:translate-x-1 transition-transform duration-300">→</span>
              </button>
            </div>
          </div>
        </div>

        {/* Enhanced Continue Learning Section */}
        {ongoingLesson && (
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                {t_learn("continueLearning")}
              </h2>
            </div>
            
            <div className="group relative overflow-hidden bg-gradient-to-r from-white via-gray-50 to-white dark:from-gray-800 dark:to-gray-900 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-8 max-w-4xl hover:shadow-2xl transition-all duration-300">
              <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-primary/10 to-transparent rounded-full transform translate-x-32 -translate-y-32 group-hover:scale-110 transition-transform duration-500"></div>
              
              <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex-1 text-center md:text-left">
                  <div className="inline-flex items-center gap-2 bg-primary/10 px-3 py-1 rounded-full mb-3">
                    <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                    <span className="text-xs font-semibold text-primary">
                      {currentModule?.title || t_learn("moduleTitle")}
                    </span>
                  </div>
                  
                  <h3 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-primary transition-colors duration-300">
                    {ongoingLesson?.title || t_learn("lessonTitle")}
                  </h3>
                  
                  <p className="text-gray-600 dark:text-gray-400">
                    Continue where you left off and master new signs
                  </p>
                </div>
                
                <div className="flex items-center gap-6">
                  <button
                    className="group/btn relative overflow-hidden bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary text-white font-bold px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
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
                    <span className="relative z-10 flex items-center gap-2">
                      {t_learn("continue")}
                      <span className="text-lg group-hover/btn:translate-x-1 transition-transform duration-300">→</span>
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent transform -skew-x-12 translate-x-full group-hover/btn:-translate-x-full transition-transform duration-700"></div>
                  </button>
                  
                  <div className="hidden md:block">
                    <div className="w-16 h-16 rounded-2xl overflow-hidden shadow-lg group-hover:shadow-xl transition-shadow duration-300">
                      <Image
                        src="/images/logo.png"
                        alt="avatar"
                        width={64}
                        height={64}
                        className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Enhanced Modules List */}
        <div>
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-gradient-to-r from-primary to-primary/80 rounded-xl flex items-center justify-center shadow-lg">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
              Learning Modules
            </h2>
          </div>
          
          <div className="space-y-12">
            {filteredModules.length > 0 ? (
              filteredModules.map((mod, index) => (
                <div 
                  key={mod.id} 
                  className="transform hover:scale-[1.01] transition-transform duration-300"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <LearningPathSection
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
                </div>
              ))
            ) : (
              <div className="text-center py-20">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-2xl mb-6">
                  <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  No Modules Found
                </h3>
                <p className="text-gray-500 dark:text-gray-400">
                  {t_learn("emptyModule")}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
