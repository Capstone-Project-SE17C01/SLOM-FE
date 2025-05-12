"use client";
import React from "react";
import CourseCard from "@/components/ui/courseCard";

// Dummy data
const learningCourses = [
  {
    img: "/images/logo/logo.png",
    title: "American Sign Language",
    subtitle: "ASL Course",
    btn: "Tiếp tục học",
  },
];

const languageCourses = [
  {
    img: "/images/logo/logo.png",
    title: "Chinese Sign Language",
    subtitle: "CLS Course",
    btn: "Bắt đầu học",
  },
  {
    img: "/images/logo/logo.png",
    title: "Korean Sign Language",
    subtitle: "KSL Course",
    btn: "Bắt đầu học",
  },
  {
    img: "/images/logo/logo.png",
    title: "Vietnamese Sign Language",
    subtitle: "VSL Course",
    btn: "Bắt đầu học",
  },
];

export default function ListCoursePage() {
  return (
    <div className="flex min-h-screen bg-white">
      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center">
        <main className="w-full max-w-6xl mx-auto pt-12 px-4">
          <h1 className="text-4xl font-extrabold text-center mb-10">
            Hiện đang học
          </h1>
          <div className="grid grid-cols-1 gap-8 mb-12">
            {learningCourses.map((c, i) => (
              <CourseCard key={i} {...c} />
            ))}
          </div>

          <h2 className="text-3xl font-extrabold mb-4 mt-8">Ngôn ngữ</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            {languageCourses.map((c, i) => (
              <CourseCard key={i} {...c} />
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
