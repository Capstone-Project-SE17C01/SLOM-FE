"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { CardLesson } from "./cardCourse";

export interface Lesson {
  title: string;
  image: string;
  id: string;
}

export interface LearningPathSectionProps {
  sectionTitle?: string;
  sectionDescription?: string;
  lessons: Lesson[];
  isReview: boolean;
}

export default function LearningPathSection({
  sectionTitle,
  sectionDescription,
  lessons,
  isReview,
}: LearningPathSectionProps) {
  const router = useRouter();

  const handleNextClick = (lesson: Lesson) => {
    if (isReview) {
      router.push(
        `/apprender/learn?lessonId=${encodeURIComponent(
          lesson.id
        )}&lessonTitle=${encodeURIComponent(
          lesson.title
        )}&review=${encodeURIComponent(isReview)}&back=${encodeURIComponent(
          "/practice"
        )}`
      );
    } else {
      router.push(
        `/apprender/learn?lessonId=${encodeURIComponent(
          lesson.id
        )}&lessonTitle=${encodeURIComponent(
          lesson.title
        )}&review=${encodeURIComponent(isReview)}&back=${encodeURIComponent(
          "/learn"
        )}`
      );
    }
  };

  return (
    <div className="group/section mb-12">
      {sectionTitle && (
        <div className="flex items-center gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-r from-primary to-primary/80 rounded-lg flex items-center justify-center shadow-md">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <h3 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white group-hover/section:text-primary transition-colors duration-300">
              {sectionTitle}
            </h3>
          </div>
          <div className="flex-1 h-px bg-gradient-to-r from-gray-300 to-transparent dark:from-gray-600"></div>
          <div className="text-sm text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full">
            {lessons.length} lessons
          </div>
        </div>
      )}
      
      {sectionDescription && sectionDescription !== sectionTitle && (
        <div className="text-base text-gray-600 dark:text-gray-400 mb-6 ml-11">
          {sectionDescription}
        </div>
      )}
      
      <div className="relative">
        <div className="overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent">
          <div className="flex gap-6 px-1">
            {lessons.map((lesson, i) => (
              <div 
                key={i} 
                className="flex-shrink-0 transform hover:scale-105 transition-transform duration-300"
                style={{ animationDelay: `${i * 50}ms` }}
              >
                <CardLesson
                  title={lesson.title}
                  image={lesson.image}
                  onClick={() => handleNextClick(lesson)}
                />
              </div>
            ))}
          </div>
        </div>
        
        {/* Gradient fade on scroll */}
        <div className="absolute top-0 right-0 w-12 h-full bg-gradient-to-l from-gray-50 to-transparent dark:from-gray-900 pointer-events-none"></div>
        <div className="absolute top-0 left-0 w-12 h-full bg-gradient-to-r from-gray-50 to-transparent dark:from-gray-900 pointer-events-none"></div>
      </div>
    </div>
  );
}
