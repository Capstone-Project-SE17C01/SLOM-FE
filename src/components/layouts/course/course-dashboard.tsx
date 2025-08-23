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
import { ArrowRight, Award, BookOpen, CheckCircle } from "lucide-react";

// Helper function to check if course is available
const isCourseAvailable = (dashboardData: SummaryResponse | null): boolean => {
  return (
    (dashboardData?.totalModules ?? 0) > 0 &&
    (dashboardData?.totalLessons ?? 0) > 0
  );
};

function AccomplishmentCard({
  title,
  completed,
  total,
  percentage,
  totalLabel,
  tCourseDashBoard,
  icon,
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
  icon: React.ReactNode;
}) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-100 dark:border-gray-700">
      <div className="flex items-center gap-3 mb-3">
        <div className="p-2 bg-primary/10 rounded-lg text-primary">
          {icon}
        </div>
        <div className="font-semibold text-lg">{title}</div>
      </div>
      <div className="text-sm text-gray-600 dark:text-gray-300 mb-1">
        {tCourseDashBoard("numberCompleted", { count: completed })}
      </div>
      <div className="text-sm text-gray-600 dark:text-gray-300 mb-3">
        {tCourseDashBoard(totalLabel, { count: total })}
      </div>
      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-2">
        <div
          className="bg-primary h-2 rounded-full transition-all duration-700 ease-in-out"
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
      <div className="font-bold text-right mt-2 text-primary">
        {tCourseDashBoard("percentage", { percentage: percentage.toFixed(0) })}%
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
  //If totalmodule is 0 or totallesson is 0, set percent to 0
  const percent = isCourseAvailable(dashboardData)
    ? ((dashboardData?.totalQuizzesCompleted ?? 0) /
        (dashboardData?.totalLessons ?? 1)) *
      100
    : 0;

  return (
    <div className="mb-8 bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md border border-gray-100 dark:border-gray-700">
      <div className="text-xl mb-3 font-bold flex items-center gap-2">
        {/* current module title */}
        {isCourseAvailable(dashboardData) &&
        dashboardData?.activeLesson?.module?.title
          ? dashboardData.activeLesson.module.title
          : tCourseDashBoard("moduleTitle")}
        <span className="inline-block bg-primary dark:bg-primary/80 ml-2 text-white rounded-full px-3 py-1 text-sm">
          {/*current lesson title */}
          {isCourseAvailable(dashboardData) &&
          dashboardData?.activeLesson?.orderNumber
            ? dashboardData.activeLesson.orderNumber
            : "0"}
        </span>
      </div>
      <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
        {tCourseDashBoard("progress", {
          progress: percent.toFixed(0)
        })}%
      </div>
      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 mb-2">
        <div
          className="bg-primary h-3 rounded-full transition-all duration-1000 ease-in-out"
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
        <Spinner />
      </div>
    );
  }

  const accomplishmentConfigs = [
    {
      title: tCourseDashBoard("lessons"),
      completed: dashboardData?.totalLessonsLearned ?? 0,
      total: dashboardData?.totalLessons ?? 0,
      percentage:
        ((dashboardData?.totalLessonsLearned ?? 0) /
          (dashboardData?.totalLessons ?? 1)) *
        100,
      totalLabel: "totalLessons",
      icon: <BookOpen size={24} />,
    },
    {
      title: tCourseDashBoard("quizzes"),
      completed: dashboardData?.totalQuizzesCompleted ?? 0,
      total: dashboardData?.totalQuizzes ?? 0,
      percentage:
        ((dashboardData?.totalQuizzesCompleted ?? 0) /
          (dashboardData?.totalQuizzes ?? 1)) *
        100,
      totalLabel: "totalQuizzes",
      icon: <CheckCircle size={24} />,
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
      icon: <Award size={24} />,
    },
  ];

  return (
    <div className="p-8 bg-gray-50 dark:bg-gray-900 min-h-screen rounded-b-xl">
      <div className="max-w-4xl mx-auto">
        {/* ProgressBar */}
        <ProgressBar
          dashboardData={dashboardData}
          tCourseDashBoard={tCourseDashBoard}
        />

        {/* Accomplishments, not show if total module or total lesson is 0 */}
        <div className="bg-gradient-to-r from-primary/90 to-primary dark:from-gray-800 dark:to-gray-700 rounded-xl p-8 mb-8 shadow-lg">
          <div className="flex justify-between items-center">
            {/* not show label if total module or total lesson is 0 */}
            {isCourseAvailable(dashboardData) && (
              <div className="font-bold text-2xl text-white dark:text-gray-100 flex items-center gap-2">
                <Award className="h-6 w-6" />
                {tCourseDashBoard("myAccomplishments")}
              </div>
            )}

            {/* Reminder Dialog, not show if total module or total lesson is 0 */}
            {isCourseAvailable(dashboardData) && (
              <ReminderDialog
                isOpen={isOpen}
                onOpenChange={setIsOpen}
                userEmail={userInfo?.email}
                userId={userInfo?.id}
                isActive={isActive}
              />
            )}
          </div>
          {/* if total module or total lesson is 0, show a message to user "This Course not available, Please choose other course" */}
          {!isCourseAvailable(dashboardData) ? (
            <div className="text-white dark:text-white text-center text-2xl font-bold mt-4">
              {tCourseDashBoard("thisCourseNotAvailable")}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
              {accomplishmentConfigs.map((cfg) => (
                <AccomplishmentCard
                  key={cfg.title}
                  {...cfg}
                  tCourseDashBoard={tCourseDashBoard}
                />
              ))}
            </div>
          )}
        </div>

        {/* ActivityCard, not show if total module or total lesson is 0 */}
        {isCourseAvailable(dashboardData) && (
          <div className="mb-8">
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
        )}

        {/* BannerStartLearning, not show if total module or total lesson is 0 */}
        {isCourseAvailable(dashboardData) && (
          <div className="bg-gradient-to-r from-primary/10 to-primary/5 dark:from-gray-800 dark:to-gray-700 rounded-xl p-8 flex items-center justify-between mb-6 border border-primary/20 dark:border-gray-700 shadow-md hover:shadow-lg transition-shadow duration-300">
            <div>
              <div className="font-bold text-2xl mb-3 text-gray-900 dark:text-gray-100">
                {tCourseDashBoard("learnNewSign")}
              </div>
              <div className="text-base text-gray-700 dark:text-gray-300">
                {dashboardData?.activeLesson?.title && (
                  <span className="font-medium">{dashboardData?.activeLesson?.title}</span>
                )}
              </div>
            </div>
            <ButtonCourse
              variant="super"
              className="shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 flex items-center gap-2"
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
              <ArrowRight className="h-4 w-4" />
            </ButtonCourse>
          </div>
        )}
      </div>
    </div>
  );
}
