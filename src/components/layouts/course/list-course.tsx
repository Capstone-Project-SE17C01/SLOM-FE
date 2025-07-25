"use client";
import React, { useEffect, useState } from "react";
import CourseCard from "@/components/ui/courseCard";
import { useGetCoursesMutation } from "../../../api/CourseApi";
import { Course } from "../../../types/ICourse";
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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            {tDashboard("chooseYourPath")}
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            {tDashboard("pathDescription")}
          </p>
        </div>

        {learningCourses.length > 0 && (
          <div className="mb-16">
            <h2 className="text-3xl font-extrabold mb-8 text-gray-900 dark:text-gray-100">
              {tDashboard("currentlyLearning")}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {learningCourses.map((c, i) => (
                <CourseCard key={i} course={c} />
              ))}
            </div>
          </div>
        )}

        <div>
          <h2 className="text-3xl font-extrabold mb-8 text-gray-900 dark:text-gray-100">
            {tDashboard("languages")}
          </h2>
          {!remainingCourses || remainingCourses.length === 0 ? (
            <div className="text-center text-gray-500 dark:text-gray-400">
              {tDashboard("noCourseRemain")}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {remainingCourses.map((c, i) => (
                <CourseCard key={i} course={c} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
