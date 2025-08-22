"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { CardLesson } from "./cardCourse";
import { BookOpen } from "lucide-react";

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
  icon?: React.ReactNode;
}

export default function LearningPathSection({
  sectionTitle,
  sectionDescription,
  lessons,
  isReview,
  icon = <BookOpen className="h-5 w-5" />,
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
    <div className="mb-10 w-full">
      {sectionTitle && (
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-primary/10 rounded-lg text-primary">
            {icon}
          </div>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{sectionTitle}</h3>
          {sectionDescription && (
            <span className="bg-primary text-white rounded-full px-3 py-1 text-sm font-medium ml-2">
              {sectionDescription}
            </span>
          )}
        </div>
      )}
      <div className="overflow-x-auto pb-4 ml-11 w-full">
        <div className="flex gap-6 flex-wrap">
          {lessons.map((lesson, i) => (
            <CardLesson
              key={i}
              title={lesson.title}
              image={lesson.image}
              onClick={() => handleNextClick(lesson)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
