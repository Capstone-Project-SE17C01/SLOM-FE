"use client";
import React, { useState, useEffect } from "react";
import { FaSearch } from "react-icons/fa";
import Image from "next/image";
import SwitchTabButton from "@/components/ui/switchTabButton";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import LearningPathSection from "@/components/ui/learningPathSection";
import { Module, UserModuleProgress } from "@/features/course/types";
import { useGetUserModuleProgressMutation } from "@/features/course/api";
import Spinner from "@/components/ui/spinner";

export default function LearnPage() {
  const router = useRouter();
  const t_learn = useTranslations("learnPage");

  const [search, setSearch] = useState("");
  const [debounced, setDebounced] = useState("");
  const [userModuleProgress, setUserModuleProgress] =
    useState<UserModuleProgress>();
  const [modules, setModules] = useState<Module[]>([]);

  // Debounce input 1s
  useEffect(() => {
    const handler = setTimeout(() => setDebounced(search), 1000);
    return () => clearTimeout(handler);
  }, [search]);

  const [getUserModuleProgress, { isLoading: isLoadingUserModuleProgress }] =
    useGetUserModuleProgressMutation();

  useEffect(() => {
    fetch("/fakedata/module_data.json")
      .then((res) => res.json())
      .then((data) => setModules(data.result));
  }, []);

  useEffect(() => {
    fetch("/fakedata/user_module_progress.json")
      .then((res) => res.json())
      .then((data) => setUserModuleProgress(data.result));
  }, []);

  useEffect(() => {
    getUserModuleProgress({ userId: "1", moduleId: "1" })
      .unwrap()
      .then((res) => {
        if (res.result) {
          const result = res.result as UserModuleProgress;
          setUserModuleProgress({
            moduleId: result.moduleId,
            moduleProgress: result.moduleProgress,
            userId: result.userId,
            module: result.module,
          });
        }
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [getUserModuleProgress]);
  console.log(getUserModuleProgress);

  //json
  useEffect(() => {
    fetch("/fakedata/user_module_progress.json")
      .then((res) => res.json())
      .then((data) => setUserModuleProgress(data.result));
  }, []);

  const currentModule = userModuleProgress?.module;

  // Lọc module theo title đã dịch
  const filteredModules = modules.filter((mod) =>
    mod.title.toLowerCase().includes(debounced.trim().toLowerCase())
  );

  const learningModule = modules[0];

  // 1. Tính progressValue
  const progressValue =
    userModuleProgress && typeof userModuleProgress.moduleProgress === "number"
      ? userModuleProgress.moduleProgress < 1
        ? Math.round(userModuleProgress.moduleProgress * 100)
        : userModuleProgress.moduleProgress
      : 0;

  // 2. Loading overlay lên đầu
  if (isLoadingUserModuleProgress) {
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

      {/* Tiếp tục học */}
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
              {currentModule?.title
                ? t_learn("modulesDesc." + currentModule.title)
                : ""}
            </div>
            <div className="flex items-center gap-2">
              <div className="w-full h-1.5 bg-gray-200 rounded-full">
                <div
                  className="h-1.5 bg-gray-700 rounded-full"
                  style={{ width: "40%" }}
                ></div>
              </div>
              <div className="text-sm text-gray-500">{progressValue}%</div>
            </div>
          </div>
          <button
            className="ml-4 bg-primary text-white font-bold px-6 py-2 rounded-lg shadow"
            onClick={() =>
              learningModule && learningModule.lessons?.[0]
                ? router.push(
                    `/apprender/learn?lessonId=${
                      learningModule.lessons[0].id
                    }&back=${encodeURIComponent("/learn")}`
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

      {/* Tiếp theo */}

      {filteredModules.length > 0 ? (
        filteredModules.map((mod) => (
          <LearningPathSection
            key={mod.id}
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
