"use client";
import React from "react";
import { useCourse } from "@/contexts/CourseContext";
import { useRouter } from "next/navigation";
import { Course } from "@/features/course/types";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/redux/store";
import { authSlice } from "@/features/auth/slice";

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
    <div className="max-md:flex-col min-w-[300px] max-md:items-start border-b-4 max-w-[400px] border-primary hover:bg-primary/10 flex items-center bg-white border border-gray-200 rounded-3xl shadow-sm px-6 py-4 min-h-[120px] transition hover:shadow-md">
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
        <div className="font-bold text-xl text-[#1a2a32] mb-1">
          {course.title}
        </div>
        {course.courseCategory?.name && (
          <div className="text-gray-500 text-sm mb-2">
            {course.courseCategory?.name}
          </div>
        )}
        <div className="flex items-center">
          <button
            onClick={handleStartLearning}
            className="ml-auto font-bold text-[#1a2a32] hover:text-primary transition text-base"
          >
            {tCourseDashBoard("startLearning")} <span className="ml-1">›</span>
          </button>
        </div>
      </div>
    </div>
  );
}
