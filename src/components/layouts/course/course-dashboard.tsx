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
    <div className="group relative overflow-hidden bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
      <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-primary/10 to-transparent rounded-full transform translate-x-10 -translate-y-10 group-hover:scale-150 transition-transform duration-500"></div>
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-lg text-gray-900 dark:text-white group-hover:text-primary transition-colors duration-300">
            {title}
          </h3>
          <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
            <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
        
        <div className="space-y-2 mb-4">
          <div className="text-sm text-gray-600 dark:text-gray-300">
            <span className="font-medium">{tCourseDashBoard("numberCompleted", { count: completed })}</span>
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            {tCourseDashBoard(totalLabel, { count: total })}
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2 mr-3">
            <div 
              className="bg-gradient-to-r from-primary to-primary/80 h-2 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${Math.min(percentage, 100)}%` }}
            ></div>
          </div>
          <div className="font-bold text-xl text-primary">
            {percentage.toFixed(0)}%
          </div>
        </div>
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
    <div className="bg-gradient-to-r from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 mb-8">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
            {dashboardData?.activeLesson?.module?.title
              ? dashboardData.activeLesson.module.title
              : tCourseDashBoard("moduleTitle")}
          </h3>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Current Progress: {percent.toFixed(1)}%
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-r from-primary to-primary/80 text-white rounded-full px-4 py-2 text-sm font-semibold shadow-md">
            Lesson {dashboardData?.activeLesson?.orderNumber ?? "0"}
          </div>
          <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
            <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
        </div>
      </div>
      
      <div className="relative">
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4 overflow-hidden">
          <div
            className="bg-gradient-to-r from-primary via-primary/90 to-primary/80 h-4 rounded-full transition-all duration-1000 ease-out shadow-sm relative overflow-hidden"
            style={{ width: `${percent}%` }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent animate-pulse"></div>
          </div>
        </div>
        <div className="absolute -top-8 right-0 text-sm font-bold text-primary">
          {percent.toFixed(1)}%
        </div>
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
      <div className="max-w-6xl mx-auto p-8">
        {/* ProgressBar */}
        <ProgressBar
          dashboardData={dashboardData}
          tCourseDashBoard={tCourseDashBoard}
        />

        {/* Accomplishments */}
        <div className="relative overflow-hidden bg-gradient-to-r from-primary via-primary/90 to-primary/80 dark:from-gray-800 dark:to-gray-700 rounded-2xl p-8 mb-8 shadow-xl">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full transform translate-x-32 -translate-y-32"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full transform -translate-x-24 translate-y-24"></div>
          
          <div className="relative z-10">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h2 className="font-bold text-2xl md:text-3xl text-white mb-2">
                  {tCourseDashBoard("myAccomplishments")}
                </h2>
                <p className="text-white/80">Track your learning progress and achievements</p>
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
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {accomplishmentConfigs.map((cfg, index) => (
                <div key={cfg.title} className="transform hover:scale-105 transition-transform duration-300" style={{ animationDelay: `${index * 100}ms` }}>
                  <AccomplishmentCard
                    {...cfg}
                    tCourseDashBoard={tCourseDashBoard}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ActivityCard */}
        <div className="mb-8 transform hover:scale-[1.02] transition-transform duration-300">
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

        {/* Enhanced Start Learning Banner */}
        <div className="group relative overflow-hidden bg-gradient-to-r from-white via-gray-50 to-white dark:from-gray-800 dark:to-gray-900 rounded-2xl p-8 shadow-xl border border-gray-200 dark:border-gray-700 hover:shadow-2xl transition-all duration-300">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-primary/10 to-transparent rounded-full transform translate-x-16 -translate-y-16"></div>
          
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex-1 text-center md:text-left">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-primary to-primary/80 rounded-xl flex items-center justify-center shadow-lg">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-bold text-2xl mb-1 text-gray-900 dark:text-white group-hover:text-primary transition-colors duration-300">
                    {tCourseDashBoard("learnNewSign")}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">Continue your learning journey</p>
                </div>
              </div>
              
              {dashboardData?.activeLesson?.title && (
                <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 mb-4">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Next Lesson:</p>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {dashboardData.activeLesson.title}
                  </p>
                </div>
              )}
            </div>
            
            <div className="flex-shrink-0">
              <ButtonCourse
                variant="super"
                className="group/btn relative overflow-hidden bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary text-white font-bold px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
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
                <span className="relative z-10 flex items-center gap-2">
                  {tCourseDashBoard("startLearning")}
                  <span className="text-lg group-hover/btn:translate-x-1 transition-transform duration-300">→</span>
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent transform -skew-x-12 translate-x-full group-hover/btn:-translate-x-full transition-transform duration-700"></div>
              </ButtonCourse>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
