"use client";
import React, { useEffect, useState } from "react";
import CourseCard from "@/components/ui/courseCard";
import { useGetCoursesMutation } from "../api";
import { Course } from "../types";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { useTranslations } from "next-intl";

export default function ListCoursePage() {
  const tDashboard = useTranslations("listCoursePage");
  const [learningCourses, setLearningCourses] = useState<Course[]>([]);
  const [remainingCourses, setRemainingCourses] = useState<Course[]>([]);
  const [getCourses] = useGetCoursesMutation();
  const userInfo = useSelector((state: RootState) => state.auth.userInfo);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        if (userInfo?.id) {
          const res = await getCourses(userInfo?.id).unwrap();
          if (res.result) {
            setLearningCourses(res.result.learningCourses);
            setRemainingCourses(res.result.remainingCourses);
          }
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchCourses();
  }, [getCourses, userInfo?.id]);

  return (
    <div className="flex min-h-screen bg-white">
      {/* Main Content */}
      <div className="flex-1 flex mx-28 flex-col items-center">
        <main className="w-full max-w-6xl mx-20 pt-12 px-4">
          <h2 className="text-3xl font-extrabold mb-4 mt-8">
            {tDashboard("currentlyLearning")}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            {learningCourses.map((c, i) => (
              <CourseCard key={i} course={c} />
            ))}
          </div>

          <h2 className="text-3xl font-extrabold mb-4 mt-8">
            {tDashboard("languages")}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            {remainingCourses.map((c, i) => (
              <CourseCard key={i} course={c} />
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
