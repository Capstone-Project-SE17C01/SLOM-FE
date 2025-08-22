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
import { ArrowRight } from "lucide-react";

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
        "flex flex-col h-full rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1",
        isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border border-gray-100"
      )}
    >
      {/* Course Image */}
      <div className="relative h-48 w-full overflow-hidden">
        <Image
          src={course.thumbnailUrl || "/images/banner.png"}
          alt={course.title}
          fill
          className="object-cover"
        />
        {course.courseCategory?.name && (
          <span className="absolute top-4 left-4 bg-white/90 dark:bg-gray-800/90 text-primary dark:text-primary font-medium px-3 py-1 rounded-full text-sm shadow-sm">
            {course.courseCategory?.name}
          </span>
        )}
      </div>
      
      {/* Course Content */}
      <div className="flex flex-col flex-grow p-6">
        <h3 className={cn(
          "font-bold text-2xl mb-3",
          isDarkMode ? "text-white" : "text-gray-900"
        )}>
          {course.title}
        </h3>
        
        {course.description && (
          <p className={cn(
            "text-sm mb-6 flex-grow",
            isDarkMode ? "text-gray-300" : "text-gray-600"
          )}>
            {course.description}
          </p>
        )}
        
        <button
          onClick={handleStartLearning}
          className={cn(
            "mt-auto self-end flex items-center gap-2 font-bold text-primary hover:text-primary/80 transition-colors group",
          )}
        >
          <span>{tCourseDashBoard("startLearning")}</span>
          <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
        </button>
      </div>
    </div>
  );
}
