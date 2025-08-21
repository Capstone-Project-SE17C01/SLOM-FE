"use client";
import React from "react";
import { useCourse } from "@/contexts/CourseContext";
import { useRouter } from "next/navigation";
import { Course } from "@/types/ICourse";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/redux/store";
import { authSlice } from "@/redux/auth/slice";
import { useTheme } from "@/contexts/ThemeContext";
import { cn } from "@/utils/cn";

export interface CourseCardProps {
  course: Course;
}

export default function CourseCard({ course }: CourseCardProps) {
  const { setCourseTitle } = useCourse();
  const router = useRouter();
  const tCourseDashBoard = useTranslations("courseDashboard");
  const userInfo = useSelector((state: RootState) => state.auth.userInfo);
  const accessToken = useSelector(
    (state: RootState) => state.auth.access_token
  );
  const dispatch = useDispatch();
  const { isDarkMode } = useTheme();
  const handleStartLearning = () => {
    setCourseTitle(course.title);
    if (userInfo) {
      dispatch(
        authSlice.actions.setCredentials({
          userInfo: {
            ...userInfo,
            courseId: course.id,
            languageCode: userInfo.languageCode,
            courseTitle: course.title,
          },
          accessToken: accessToken,
        })
      );
    }
    router.push("/course-dashboard");
  };

  return (
    <div
      className={cn(
        "max-md:flex-col min-w-[300px] max-md:items-start border-b-4 max-w-[400px] border-primary hover:bg-primary/10 flex items-center bg-white border border-gray-200 rounded-3xl shadow-sm px-6 py-4 min-h-[120px] transition hover:shadow-md",
        isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
      )}
    >
      <div className="relative h-28 mr-6 flex-shrink-0 max-md:hidden">
        <Image
          src={course.thumbnailUrl || ""}
          alt={course.title}
          width={100}
          height={100}
          className="object-cover rounded-2xl w-[100px] h-[100px]"
        />
        {course.courseCategory?.name && (
          <span className="absolute top-2 left-2 bg-white/80 text-gray-900 text-xs font-semibold px-2 py-0.5 rounded">
            {course.courseCategory?.name}
          </span>
        )}
      </div>
      <div className="flex-1 flex flex-col justify-between h-full w-full">
        <div
          className={cn(
            "font-bold text-3xl mb-1",
            isDarkMode ? "text-white" : "text-[#1a2a32]"
          )}
        >
          {course.title}
        </div>
        {course.courseCategory?.name && (
          <div
            className={cn(
              "text-sm mb-2",
              isDarkMode ? "text-gray-400" : "text-gray-500"
            )}
          >
            {course.courseCategory?.name}
          </div>
        )}
        {course.description && (
          <div
            className={cn(
              "text-sm mb-3",
              isDarkMode ? "text-gray-300" : "text-gray-600"
            )}
          >
            {course.description}
          </div>
        )}
        <div className="flex items-center">
          <button
            onClick={handleStartLearning}
            className={cn(
              "ml-auto font-bold hover:text-primary transition text-base",
              isDarkMode ? "text-white" : "text-[#1a2a32]"
            )}
          >
            {tCourseDashBoard("startLearning")} <span className="ml-1">›</span>
          </button>
        </div>
      </div>
    </div>
  );
}
