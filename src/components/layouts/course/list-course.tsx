"use client";
import React, { useEffect, useState } from "react";
import CourseCard from "@/components/ui/courseCard";
import { useGetCoursesMutation } from "../../../api/CourseApi";
import { Course } from "../../../types/ICourse";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { useTranslations } from "next-intl";
import { GraduationCap, Languages } from "lucide-react";
import { motion } from "framer-motion";

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

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 dark:text-gray-100 mb-6 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            {tDashboard("chooseYourPath")}
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed">
            {tDashboard("pathDescription")}
          </p>
        </div>

        {learningCourses.length > 0 && (
          <div className="mb-20">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-2 bg-primary/10 rounded-lg text-primary">
                <GraduationCap size={24} />
              </div>
              <h2 className="text-3xl font-extrabold text-gray-900 dark:text-gray-100">
                {tDashboard("currentlyLearning")}
              </h2>
            </div>
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              variants={container}
              initial="hidden"
              animate="show"
            >
              {learningCourses.map((c, i) => (
                <motion.div key={i} variants={item}>
                  <CourseCard course={c} />
                </motion.div>
              ))}
            </motion.div>
          </div>
        )}

        <div>
          <div className="flex items-center gap-3 mb-8">
            <div className="p-2 bg-primary/10 rounded-lg text-primary">
              <Languages size={24} />
            </div>
            <h2 className="text-3xl font-extrabold text-gray-900 dark:text-gray-100">
              {tDashboard("languages")}
            </h2>
          </div>
          {!remainingCourses || remainingCourses.length === 0 ? (
            <div className="text-center py-16 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
              <p className="text-xl text-gray-500 dark:text-gray-400">
                {tDashboard("noCourseRemain")}
              </p>
            </div>
          ) : (
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              variants={container}
              initial="hidden"
              animate="show"
            >
              {remainingCourses.map((c, i) => (
                <motion.div key={i} variants={item}>
                  <CourseCard course={c} />
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
