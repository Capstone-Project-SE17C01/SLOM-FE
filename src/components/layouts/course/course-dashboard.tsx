"use client";
import React, { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import {
  useGetCourseSummaryMutation,
  useGetReminderMutation,
} from "../../../api/CourseApi";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { SummaryResponse } from "../../../types/ICourse";
import { APIResponse } from "@/types/IAuth";
import { useRouter } from "next/navigation";
import ActivityCard from "@/components/ui/activityCard";
import { ButtonCourse } from "@/components/ui/buttonCourse";
import Spinner from "@/components/ui/spinner";
import { ReminderDialog } from "./reminder-dialog";

function AccomplishmentCard({
  title,
  completed,
  total,
  percentage,
  totalLabel,
  tCourseDashBoard,
}: {
  title: string;
  completed: number;
  total: number;
  percentage: number;
  totalLabel: string;
  tCourseDashBoard: (
    key: string,
    params?: Record<string, string | number | Date>
  ) => string;
}) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
      <div className="font-semibold ">{title}</div>
      <div className="text-sm text-gray-600 dark:text-gray-300">
        {tCourseDashBoard("numberCompleted", { count: completed })}
      </div>
      <div className="text-sm text-gray-600 dark:text-gray-300">
        {tCourseDashBoard(totalLabel, { count: total })}
      </div>
      <div className="font-bold text-right mt-2">
        {tCourseDashBoard("percentage", { percentage: percentage.toFixed(2) })}
      </div>
    </div>
  );
}

function ProgressBar({
  dashboardData,
  tCourseDashBoard,
}: {
  dashboardData: SummaryResponse | null;
  tCourseDashBoard: (
    key: string,
    params?: Record<string, string | number | Date>
  ) => string;
}) {
  const percent =
    ((dashboardData?.totalLessonsCompleted ?? 0) /
      (dashboardData?.totalLessons ?? 1)) *
    100;
  return (
    <div className="mb-6">
      <div className="text-lg mb-2 font-semibold">
        {/* current module title */}
        {dashboardData?.activeLesson?.module?.title
          ? dashboardData.activeLesson.module.title
          : tCourseDashBoard("moduleTitle")}
        <span className="inline-block bg-[#6947A8] dark:bg-[#4b2e6a] ml-2 text-white rounded-full px-2">
          {/*current lesson title */}
          {dashboardData?.activeLesson?.orderNumber ?? "0"}
        </span>
      </div>
      <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">
        {tCourseDashBoard("progress", {
          progress: percent.toFixed(2),
        })}
      </div>
      <div className="w-full bg-primary/30 rounded-full h-2.5 mb-2">
        <div
          className="bg-primary h-2.5 rounded-full"
          style={{ width: `${percent}%` }}
        ></div>
      </div>
    </div>
  );
}

export default function CourseDashboard() {
  const { userInfo } = useSelector((state: RootState) => state.auth);
  const tCourseDashBoard = useTranslations("courseDashboard");
  const [dashboardData, setDashboardData] = useState<SummaryResponse | null>(
    null
  );
  const [getReminder] = useGetReminderMutation();
  const [isActive, setIsActive] = useState(false);

  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  useEffect(() => {
    if (!userInfo) {
      router.push("/login");
    }
  }, [userInfo, router]);

  const [getCourseSummary, { isLoading: isLoadingCourseSummary }] =
    useGetCourseSummaryMutation();

  useEffect(() => {
    if (userInfo?.courseId && userInfo.id) {
      getCourseSummary({
        courseId: userInfo.courseId,
        userId: userInfo.id,
      })
        .unwrap()
        .then((res: APIResponse<SummaryResponse>) => {
          const dashboardData = res.result;
          if (dashboardData) {
            setDashboardData(dashboardData);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }

    //get reminder
    if (userInfo?.email) {
      (async () => {
        await getReminder(userInfo.email)
          .unwrap()
          .then((res) => {
            if (res.result) {
              setIsActive(res.result.isActive);
            } else {
              setIsActive(false);
            }
          })
          .catch((err) => {
            console.log(err);
          });
      })();
    }
  }, [userInfo, getCourseSummary, getReminder]);

  if (isLoadingCourseSummary) {
    return (
      <div className="bg-black/50 dark:bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 w-screen h-screen fixed inset-0">
        <Spinner text="Loading..." />
      </div>
    );
  }

  const accomplishmentConfigs = [
    {
      title: tCourseDashBoard("lessons"),
      completed: dashboardData?.totalLessonsCompleted ?? 0,
      total: dashboardData?.totalLessons ?? 0,
      percentage:
        ((dashboardData?.totalLessonsCompleted ?? 0) /
          (dashboardData?.totalLessons ?? 1)) *
        100,
      totalLabel: "totalLessons",
    },
    {
      title: tCourseDashBoard("modules"),
      completed: dashboardData?.totalModulesCompleted ?? 0,
      total: dashboardData?.totalModules ?? 0,
      percentage:
        ((dashboardData?.totalModulesCompleted ?? 0) /
          (dashboardData?.totalModules ?? 1)) *
        100,
      totalLabel: "totalModules",
    },
    {
      title: tCourseDashBoard("course"),
      completed: dashboardData?.totalCourseCompleted ?? 0,
      total: dashboardData?.totalCourse ?? 0,
      percentage:
        ((dashboardData?.totalCourseCompleted ?? 0) /
          (dashboardData?.totalCourse ?? 1)) *
        100,
      totalLabel: "totalCourse",
    },
  ];

  return (
    <div className="p-8 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="max-w-4xl mx-auto">
        {/* ProgressBar */}
        <ProgressBar
          dashboardData={dashboardData}
          tCourseDashBoard={tCourseDashBoard}
        />

        {/* Accomplishments */}
        <div className="bg-gradient-to-r from-primary to-primary/80 dark:from-gray-800 dark:to-gray-700 rounded-xl p-6 mb-6 shadow-lg">
          <div className="flex justify-between items-center">
            <div className="font-bold text-xl text-white dark:text-gray-200">
              {tCourseDashBoard("myAccomplishments")}
            </div>

            {/* Reminder Dialog */}
            <ReminderDialog
              isOpen={isOpen}
              onOpenChange={setIsOpen}
              userEmail={userInfo?.email}
              userId={userInfo?.id}
              isActive={isActive}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            {accomplishmentConfigs.map((cfg) => (
              <AccomplishmentCard
                key={cfg.title}
                {...cfg}
                tCourseDashBoard={tCourseDashBoard}
              />
            ))}
          </div>
        </div>

        {/* ActivityCard */}
        <div className="mb-6">
          <ActivityCard
            title={tCourseDashBoard("myActivity")}
            activities={
              dashboardData?.activities ?? {
                recentLessonsCompleted: 0,
                recentModulesCompleted: 0,
                recentCoursesCompleted: 0,
              }
            }
            subLabel={tCourseDashBoard("lessonsCompletedLast7Days")}
          />
        </div>

        {/* BannerStartLearning */}
        <div className="bg-gradient-to-r from-primary/10 to-primary/5 dark:from-gray-800 dark:to-gray-700 rounded-xl p-6 flex items-center justify-between mb-6 border border-primary/20 dark:border-gray-700">
          <div>
            <div className="font-bold text-xl mb-2 text-gray-900 dark:text-gray-200">
              {tCourseDashBoard("learnNewSign")}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-300">
              {dashboardData?.activeLesson?.title && (
                <span>{dashboardData?.activeLesson?.title}</span>
              )}
            </div>
          </div>
          <ButtonCourse
            variant="super"
            className="shadow-lg hover:shadow-xl transition-shadow"
            onClick={() => {
              if (dashboardData?.activeLesson) {
                router.push(
                  `/apprender/learn?lessonId=${
                    dashboardData.activeLesson.id
                  }&moduleId=${
                    dashboardData.activeLesson.moduleId
                  }&back=${encodeURIComponent("/course-dashboard")}`
                );
              } else {
                router.push("/learn");
              }
            }}
          >
            {tCourseDashBoard("startLearning")}
          </ButtonCourse>
        </div>
      </div>
    </div>
  );
}
