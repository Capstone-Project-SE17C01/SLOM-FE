"use client";
import React, { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { useGetCourseDashboardDataMutation } from "../api";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { CourseDashboardViewModel } from "../types";
import { APIResponse } from "@/features/auth/types";
import { useRouter } from "next/navigation";
import ActivityCard from "@/components/ui/activityCard";

export default function CourseDashboard() {
  const tCourseDashBoard = useTranslations("courseDashboard");
  const [dashboardData, setDashboardData] =
    useState<CourseDashboardViewModel | null>(null);

  //get course id from userInfo
  const { userInfo } = useSelector((state: RootState) => state.auth);

  //call api get course by id
  const [getCourseDashboardData] = useGetCourseDashboardDataMutation();

  const router = useRouter();

  useEffect(() => {
    //fake data
    const fakeDashboardData: CourseDashboardViewModel = {
      numberLearnedLessons: 10, //số bài học đã học
      totalLessons: 20,
      numberMasteredWords: 10, //số từ đã mastered
      numberLearnedWords: 10, //số từ đã học
      numberWatchedWords: 10, //số từ đã xem
      numberReWatchWords: 10, //số từ đã xem lại
      numberConversationWords: 10, //số từ đã làm conversation
      numberReplayedWords: 10, //số từ đã làm replay
      currentModule: {
        id: "2",
        courseId: "1",
        title: "Module 2",
        description: "Module 2 description",
        orderNumber: 2,
        createdAt: "2021-01-01",
      },
      numberCompletedModules: 1, //số bài học đã hoàn thành
      totalModules: 5, //tổng số bài học
      nextLesson: {
        id: "3",
        moduleId: "2",
        title: "Lesson 3",
        orderNumber: 3,
        createdAt: "2021-01-01",
      },
      activities: {
        recentLearnedWords: 10,
        recentWatchedWords: 10,
        recentReplayedWords: 10,
        recentConversationWords: 10,
      },
    };
    setDashboardData(fakeDashboardData);
    //end fake data
    if (userInfo?.courseId && userInfo.id) {
      getCourseDashboardData({
        courseId: userInfo.courseId,
        userId: userInfo.id,
      })
        .unwrap()
        .then((res: APIResponse<CourseDashboardViewModel>) => {
          // Map từ Course sang ViewModel
          const dashboardData = res.result;

          if (dashboardData) {
            setDashboardData({
              numberLearnedLessons: dashboardData.numberLearnedLessons,
              totalLessons: dashboardData.totalLessons,
              numberMasteredWords: dashboardData.numberMasteredWords,
              numberLearnedWords: dashboardData.numberLearnedWords,
              numberWatchedWords: dashboardData.numberWatchedWords,
              numberReWatchWords: dashboardData.numberReWatchWords,
              numberConversationWords: dashboardData.numberConversationWords,
              numberReplayedWords: dashboardData.numberReplayedWords,
              currentModule: dashboardData.currentModule,
              numberCompletedModules: dashboardData.numberCompletedModules,
              totalModules: dashboardData.totalModules,
              nextLesson: dashboardData.nextLesson,
              activities: dashboardData.activities,
            });
          }
        })
        .catch((err) => {
          console.log(err);
          //set default value
          setDashboardData(fakeDashboardData);
        });
    }
  }, [userInfo?.courseId, userInfo?.id, getCourseDashboardData]);

  return (
    <div className="flex min-h-screen bg-[#FFFCF3]">
      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <main className="flex-1 overflow-y-auto p-8">
          <div className="max-w-4xl mx-auto">
            {/* ProgressBar */}
            <div className="mb-6">
              <div className="text-lg font-semibold">
                {/* current module title */}
                {dashboardData?.currentModule?.title}
                <span className="inline-block bg-yellow-400 text-white rounded-full px-2">
                  {/*current lesson title */}
                  {dashboardData?.currentModule?.orderNumber ?? "-"}
                </span>
              </div>
              <div className="text-sm text-gray-500 mb-1">
                {tCourseDashBoard("progress", {
                  progress:
                    ((dashboardData?.numberLearnedLessons ?? 0) /
                      (dashboardData?.totalLessons ?? 1)) *
                    100,
                })}
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2">
                <div
                  className="bg-yellow-400 h-2.5 rounded-full"
                  style={{
                    width: `${
                      ((dashboardData?.numberLearnedLessons ?? 0) /
                        (dashboardData?.totalLessons ?? 1)) *
                      100
                    }%`,
                  }}
                ></div>
              </div>
              <div className="flex justify-between text-sm font-medium">
                <span>
                  {tCourseDashBoard("completedLessons", {
                    countString: `${dashboardData?.numberLearnedLessons}/${dashboardData?.totalLessons}`,
                  })}
                </span>
              </div>
            </div>
            {/* Accomplishments */}
            <div className="bg-yellow-300 rounded-xl p-4 mb-6">
              <div className="flex justify-between items-center">
                <div className="font-bold text-lg">
                  {tCourseDashBoard("accomplishments")}
                </div>
                <div className="font-bold text-lg">
                  {/*completed module / total modules*/}
                  {tCourseDashBoard("completedModules", {
                    countString: `${dashboardData?.numberCompletedModules}/${dashboardData?.totalModules}`,
                  })}
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4 mt-4">
                <div className="bg-green-50 rounded-lg p-4">
                  <div className="font-semibold">
                    {tCourseDashBoard("learnedWords")}
                  </div>
                  <div className="text-sm text-gray-600">
                    {/*mastered words is words in completed lesson*/}
                    {tCourseDashBoard("fullyLearnedWords", {
                      count: dashboardData?.numberMasteredWords ?? 0,
                    })}
                  </div>
                  <div className="text-sm text-gray-600">
                    {tCourseDashBoard("startedWords", {
                      count: dashboardData?.numberLearnedWords ?? 0,
                    })}
                  </div>
                  <div className="font-bold text-right mt-2">
                    {tCourseDashBoard("percentageFullyLearnedWords", {
                      percentage:
                        ((dashboardData?.numberMasteredWords ?? 0) /
                          (dashboardData?.numberLearnedWords ?? 1)) *
                        100,
                    })}
                  </div>
                </div>
                <div className="bg-white rounded-lg p-4">
                  <div className="font-semibold">
                    {tCourseDashBoard("watchedWords")}
                  </div>
                  <div className="text-sm text-gray-600">
                    {tCourseDashBoard("newVideosWatched", {
                      count: dashboardData?.numberWatchedWords ?? 0,
                    })}
                  </div>
                  <div className="text-sm text-gray-600">
                    {tCourseDashBoard("numberReplayed", {
                      count: dashboardData?.numberReWatchWords ?? 0,
                    })}
                  </div>
                  <div className="font-bold text-right mt-2">-</div>
                </div>
                <div className="bg-white rounded-lg p-4">
                  <div className="font-semibold">
                    {tCourseDashBoard("usedWords")}
                  </div>
                  <div className="text-sm text-gray-600">
                    {tCourseDashBoard("completedConversations", {
                      count: dashboardData?.numberConversationWords ?? 0,
                    })}
                  </div>
                  <div className="text-sm text-gray-600">
                    {tCourseDashBoard("numberReplayed", {
                      count: dashboardData?.numberReplayedWords ?? 0,
                    })}
                  </div>
                  <div className="font-bold text-right mt-2">-</div>
                </div>
              </div>
            </div>
            {/* ActivityCard */}
            <div className="mb-6 flex">
              <ActivityCard
                title={tCourseDashBoard("myActivity")}
                value={dashboardData?.activities.recentWatchedWords ?? 0}
                subLabel={tCourseDashBoard("wordsLearnedLast7Days")}
                diff={3} // hoặc lấy từ API nếu có
              />
            </div>
            {/* BannerStartLearning */}
            <div className="bg-[#1B2A3A] rounded-xl p-6 flex items-center justify-between mb-6">
              <div className="text-white">
                <div className="font-bold text-lg mb-2">
                  {tCourseDashBoard("learnNewSign")}
                </div>
                <div className="text-sm">{tCourseDashBoard("continue")}</div>
              </div>
              <button
                className="bg-yellow-400 text-black font-bold px-6 py-2 rounded-lg"
                onClick={() => {
                  router.push(
                    `/apprender/learn?lessonId=${
                      dashboardData?.nextLesson.id
                    }&moduleId=${
                      dashboardData?.nextLesson.moduleId
                    }&back=${encodeURIComponent("/course-dashboard")}`
                  );
                }}
              >
                {tCourseDashBoard("startLearning")}
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
