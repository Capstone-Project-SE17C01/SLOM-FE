"use client";
import React, { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { useGetCourseDashboardDataMutation } from "../api";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { SummaryResponse } from "../types";
import { APIResponse } from "@/features/auth/types";
import { useRouter } from "next/navigation";
import ActivityCard from "@/components/ui/activityCard";
import { ButtonCourse } from "@/components/ui/buttonCourse";

export default function CourseDashboard() {
  const tCourseDashBoard = useTranslations("courseDashboard");
  const tLearnPage = useTranslations("learnPage");
  const [dashboardData, setDashboardData] = useState<SummaryResponse | null>(
    null
  );

  //get course id from userInfo
  const { userInfo } = useSelector((state: RootState) => state.auth);

  //call api get course by id
  const [getCourseDashboardData] = useGetCourseDashboardDataMutation();

  const router = useRouter();

  useEffect(() => {
    //fake data
    fetch("/fakedata/summary_data.json")
      .then((res) => res.json())
      .then((data) => setDashboardData(data.result));
    //end fake data
    if (userInfo?.courseId && userInfo.id) {
      getCourseDashboardData({
        courseId: userInfo.courseId,
        userId: userInfo.id,
      })
        .unwrap()
        .then((res: APIResponse<SummaryResponse>) => {
          // Map từ Course sang ViewModel
          const dashboardData = res.result;

          if (dashboardData) {
            setDashboardData(dashboardData);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [userInfo?.courseId, userInfo?.id, getCourseDashboardData]);

  return (
    <div className="flex min-h-screen">
      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <main className="flex-1 overflow-y-auto p-8">
          <div className="max-w-4xl mx-auto">
            {/* ProgressBar */}
            <div className="mb-6">
              <div className="text-lg  font-semibold">
                {/* current module title */}
                {dashboardData?.activeLesson?.title}
                <span className="inline-block bg-[#6947A8] text-white rounded-full px-2">
                  {/*current lesson title */}
                  {dashboardData?.activeLesson?.orderNumber ?? "-"}
                </span>
              </div>
              <div className="text-sm text-gray-500 mb-1">
                {tCourseDashBoard("progress", {
                  progress:
                    ((dashboardData?.totalLessonsCompleted ?? 0) /
                      (dashboardData?.totalLessons ?? 1)) *
                    100,
                })}
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2">
                <div
                  className="bg-[#6947A8] h-2.5 rounded-full"
                  style={{
                    width: `${
                      ((dashboardData?.totalLessonsCompleted ?? 0) /
                        (dashboardData?.totalLessons ?? 1)) *
                      100
                    }%`,
                  }}
                ></div>
              </div>
              {/* <div className="flex justify-between text-sm font-medium">
                <span>
                  {tCourseDashBoard("completedLessons", {
                    countString: `${dashboardData?.totalLessonsCompleted}/${dashboardData?.totalLessons}`,
                  })}
                </span>
              </div> */}
            </div>
            {/* Accomplishments */}
            <div className="bg-primary rounded-xl p-4 mb-6">
              <div className="flex justify-between items-center">
                <div className="font-bold text-lg text-white">
                  {tCourseDashBoard("myAccomplishments")}
                </div>
                <div className="font-bold text-lg text-white">-</div>
              </div>
              <div className="grid grid-cols-3 gap-4 mt-4">
                <div className="bg-white rounded-lg p-4">
                  <div className="font-semibold ">
                    {tCourseDashBoard("lessons")}
                  </div>
                  <div className="text-sm text-gray-600">
                    {/*mastered words is words in completed lesson*/}
                    {tCourseDashBoard("lessonsCompleted", {
                      count: dashboardData?.totalLessonsCompleted ?? 0,
                    })}
                  </div>
                  <div className="text-sm text-gray-600">
                    {tCourseDashBoard("totalLessons", {
                      count: dashboardData?.totalLessons ?? 0,
                    })}
                  </div>
                  <div className="font-bold text-right mt-2">
                    {tCourseDashBoard("percentage", {
                      percentage:
                        ((dashboardData?.totalLessonsCompleted ?? 0) /
                          (dashboardData?.totalLessons ?? 1)) *
                        100,
                    })}
                  </div>
                </div>
                <div className="bg-white rounded-lg p-4">
                  <div className="font-semibold">
                    {tCourseDashBoard("modules")}
                  </div>
                  <div className="text-sm text-gray-600">
                    {tCourseDashBoard("modulesCompleted", {
                      count: dashboardData?.totalModulesCompleted ?? 0,
                    })}
                  </div>
                  <div className="text-sm text-gray-600">
                    {tCourseDashBoard("totalModules", {
                      count: dashboardData?.totalModules ?? 0,
                    })}
                  </div>
                  <div className="font-bold text-right mt-2">
                    {tCourseDashBoard("percentage", {
                      percentage:
                        ((dashboardData?.totalModulesCompleted ?? 0) /
                          (dashboardData?.totalModules ?? 1)) *
                        100,
                    })}
                  </div>
                </div>
                <div className="bg-white rounded-lg p-4">
                  <div className="font-semibold">
                    {tCourseDashBoard("course")}
                  </div>
                  <div className="text-sm text-gray-600">
                    {tCourseDashBoard("courseCompleted", {
                      count: dashboardData?.totalCourseCompleted ?? 0,
                    })}
                  </div>
                  <div className="text-sm text-gray-600">
                    {tCourseDashBoard("totalCourse", {
                      count: dashboardData?.totalCourse ?? 0,
                    })}
                  </div>
                  <div className="font-bold text-right mt-2">
                    {tCourseDashBoard("percentage", {
                      percentage:
                        ((dashboardData?.totalCourseCompleted ?? 0) /
                          (dashboardData?.totalCourse ?? 1)) *
                        100,
                    })}
                  </div>
                </div>
              </div>
            </div>
            {/* ActivityCard */}
            <div className="mb-6 flex">
              <ActivityCard
                title={tCourseDashBoard("myActivity")}
                value={dashboardData?.activities?.recentLessonsCompleted ?? 0}
                subLabel={tCourseDashBoard("lessonsCompletedLast7Days")}
                diff={dashboardData?.activities?.recentLessonsCompleted ?? 0}
              />
            </div>
            {/* BannerStartLearning */}
            <div className="bg-primary/10  rounded-xl p-6 flex items-center justify-between mb-6">
              <div className="">
                <div className="font-bold text-lg mb-2">
                  {tCourseDashBoard("learnNewSign")}
                </div>
                <div className="text-sm">
                  {/* get lesson title from activeLesson*/}
                  {dashboardData?.activeLesson?.title && (
                    <span>
                      {tLearnPage(
                        "lessonsTitle." + dashboardData?.activeLesson?.title,
                        {
                          lessonTitle: dashboardData?.activeLesson?.title ?? "",
                        }
                      )}
                    </span>
                  )}
                </div>
              </div>
              <ButtonCourse
                variant="super"
                onClick={() => {
                  router.push(
                    `/apprender/learn?lessonId=${
                      dashboardData?.activeLesson?.id
                    }&moduleId=${
                      dashboardData?.activeLesson?.moduleId
                    }&back=${encodeURIComponent("/course-dashboard")}`
                  );
                }}
              >
                {tCourseDashBoard("startLearning")}
              </ButtonCourse>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
