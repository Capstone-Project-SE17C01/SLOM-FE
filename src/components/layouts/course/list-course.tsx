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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-primary/10 via-primary/5 to-transparent">
        <div className="absolute inset-0 opacity-30">
          <div className="w-full h-full bg-gradient-to-r from-primary/5 to-transparent"></div>
        </div>
        <div className="relative max-w-6xl mx-auto px-4 py-16">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-2xl mb-6">
              <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-gray-900 via-primary to-gray-700 dark:from-white dark:via-primary-200 dark:to-gray-300 bg-clip-text text-transparent mb-6">
              {tDashboard("chooseYourPath")}
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
              {tDashboard("pathDescription")}
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        {learningCourses.length > 0 && (
          <div className="mb-20">
            <div className="flex items-center gap-4 mb-8">
              <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl shadow-lg">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
                  {tDashboard("currentlyLearning")}
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mt-1">Continue your learning journey</p>
              </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {learningCourses.map((c, i) => (
                <div key={i} className="transform hover:scale-[1.02] transition-transform duration-300">
                  <CourseCard course={c} />
                </div>
              ))}
            </div>
          </div>
        )}

        <div>
          <div className="flex items-center gap-4 mb-8">
            <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-primary to-primary/80 rounded-xl shadow-lg">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9" />
              </svg>
            </div>
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
                {tDashboard("languages")}
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mt-1">Explore new courses and expand your skills</p>
            </div>
          </div>
          
          {!remainingCourses || remainingCourses.length === 0 ? (
            <div className="text-center py-20">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-2xl mb-6">
                <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
                No Additional Courses Available
              </h3>
              <p className="text-gray-500 dark:text-gray-400">
                {tDashboard("noCourseRemain")}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
              {remainingCourses.map((c, i) => (
                <div key={i} className="transform hover:scale-[1.02] transition-transform duration-300">
                  <CourseCard course={c} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
