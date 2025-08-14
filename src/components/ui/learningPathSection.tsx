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
    <div className="mb-8">
      {sectionTitle && (
        <div className="text-2xl font-extrabold mb-1">{sectionTitle}</div>
      )}
      {sectionDescription && (
        <div className="text-base font-semibold text-gray-700 mb-3">
          {sectionDescription}
        </div>
      )}
      <div className="overflow-x-auto pb-2">
        <div className="flex gap-4">
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
