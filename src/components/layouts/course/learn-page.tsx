"use client";
import React, { useState, useEffect } from "react";
import { Search, BookOpen, ArrowRight } from "lucide-react";
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
import { motion } from "framer-motion";

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
      getOngoingLesson({ userId: userInfo.id, courseId: userInfo.courseId }).unwrap(),
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
      <div className="bg-black/50 dark:bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 w-screen h-screen fixed inset-0">
        <Spinner />
      </div>
    );
  }

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <div className="p-6 md:p-8 bg-white dark:bg-gray-900 min-h-screen">
      <div className="max-w-6xl mx-auto">
        {/* Tabs + Search */}
        <div className="flex lg:flex-row items-center justify-between mb-10 max-md:flex-col max-md:gap-6 max-md:items-start">
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
                className="pl-12 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent min-w-[280px] shadow-sm text-black dark:text-gray-100 transition-all duration-300"
              />
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
            </div>
            <button
              className="font-semibold text-sm text-primary flex items-center gap-2 hover:text-primary/80 transition-colors group"
              onClick={() => {
                router.push("/practice");
              }}
            >
              <span>{t_learn("studiedSituations")}</span>
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
            </button>
          </div>
        </div>

        {/* Continue learning */}
        {ongoingLesson && (
          <motion.div 
            className="mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100 flex items-center gap-2">
              <BookOpen className="h-6 w-6 text-primary" />
              {t_learn("continueLearning")}
            </h2>
            <div className="bg-gradient-to-r from-primary/10 to-primary/5 dark:from-gray-800 dark:to-gray-700 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-primary/20 dark:border-gray-700 p-6 max-w-3xl">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="font-bold text-sm mb-2 text-primary">
                    {currentModule?.title
                      ? currentModule.title
                      : t_learn("moduleTitle")}
                  </div>
                  <div className="text-gray-800 dark:text-gray-200 text-xl mb-3 font-medium">
                    {ongoingLesson?.title
                      ? ongoingLesson.title
                      : t_learn("lessonTitle")}
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <button
                    className="bg-primary text-white font-bold px-8 py-3 rounded-lg shadow-md hover:shadow-lg hover:bg-primary/90 transition-all hover:scale-105 flex items-center gap-2"
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
                    <span>{t_learn("continue")}</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>
                  <div className="max-md:hidden">
                    <div className="h-14 w-14 rounded-full overflow-hidden shadow-md border-2 border-white dark:border-gray-700">
                      <Image
                        src="/images/logo.png"
                        alt="avatar"
                        width={56}
                        height={56}
                        className="object-cover w-full h-full"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* List modules and lessons */}
        <motion.div 
          className="space-y-12"
          variants={container}
          initial="hidden"
          animate="show"
        >
          {filteredModules.length > 0 ? (
            filteredModules.map((mod) => (
              <motion.div key={mod.id} variants={item}>
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
              </motion.div>
            ))
          ) : (
            <div className="text-center py-20 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
              <div className="text-xl font-medium text-gray-500 dark:text-gray-400">{t_learn("emptyModule")}</div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
