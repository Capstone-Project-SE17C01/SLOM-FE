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
    <div className={cn(
      "group relative overflow-hidden rounded-2xl border border-gray-200 bg-gradient-to-br from-white via-white to-gray-50/50 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 min-h-[160px] flex flex-col md:flex-row items-center p-6 gap-4",
      "before:absolute before:inset-0 before:bg-gradient-to-r before:from-primary/5 before:to-transparent before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-300",
      isDarkMode ? "bg-gradient-to-br from-gray-800 via-gray-800 to-gray-900/50 border-gray-700" : ""
    )}>
      {/* Background Decoration */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-primary/10 to-transparent rounded-full transform translate-x-16 -translate-y-16 group-hover:scale-150 transition-transform duration-500"></div>
      
      {/* Course Image */}
      <div className="relative z-10 flex-shrink-0">
        <div className="relative w-24 h-24 md:w-28 md:h-28 rounded-2xl overflow-hidden shadow-lg group-hover:shadow-xl transition-shadow duration-300">
          <Image
            src={course.thumbnailUrl || "/images/logo.png"}
            alt={course.title}
            width={112}
            height={112}
            className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-300"
          />
          {course.courseCategory?.name && (
            <div className="absolute top-2 left-2 bg-white/90 backdrop-blur-sm text-gray-900 text-xs font-semibold px-2 py-1 rounded-md shadow-sm">
              {course.courseCategory?.name}
            </div>
          )}
        </div>
      </div>

      {/* Course Content */}
      <div className="relative z-10 flex-1 flex flex-col justify-between h-full w-full text-center md:text-left">
        <div>
          <h3 className={cn(
            "font-bold text-xl md:text-2xl mb-2 group-hover:text-primary transition-colors duration-300",
            isDarkMode ? "text-white" : "text-gray-900"
          )}>
            {course.title}
          </h3>
          {course.description && (
            <p className={cn(
              "text-sm mb-3 line-clamp-2",
              isDarkMode ? "text-gray-400" : "text-gray-600"
            )}>
              {course.description}
            </p>
          )}
        </div>
        
        <div className="flex items-center justify-center md:justify-between">
          <div className="hidden md:flex items-center gap-2">
            {course.courseCategory?.name && (
              <span className={cn(
                "text-xs px-2 py-1 rounded-full",
                isDarkMode ? "bg-gray-700 text-gray-300" : "bg-gray-100 text-gray-600"
              )}>
                {course.courseCategory?.name}
              </span>
            )}
          </div>
          
          <button
            onClick={handleStartLearning}
            className="group/btn relative overflow-hidden bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary text-white font-semibold px-6 py-3 rounded-xl shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-300"
          >
            <span className="relative z-10 flex items-center gap-2">
              {tCourseDashBoard("startLearning")}
              <span className="text-lg group-hover/btn:translate-x-1 transition-transform duration-300">→</span>
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent transform -skew-x-12 translate-x-full group-hover/btn:-translate-x-full transition-transform duration-700"></div>
          </button>
        </div>
      </div>
    </div>
  );
}
