"use client";
import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

export interface Lesson {
  title: string;
  image: string;
  id: string;
}

export interface LearningPathSectionProps {
  sectionTitle?: string;
  sectionDescription?: string;
  lessons: Lesson[];
  review?: boolean;
}

export default function LearningPathSection({
  sectionTitle,
  sectionDescription,
  lessons,
  review,
}: LearningPathSectionProps) {
  const router = useRouter();

  const handleNextClick = (lesson: Lesson) => {
    if (review) {
      router.push(
        `/apprender/learn?lessonId=${
          lesson.id
        }&review=${review}&back=${encodeURIComponent("/practice")}`
      );
    } else {
      router.push(
        `/apprender/learn?lessonId=${
          lesson.id
        }&review=${review}&back=${encodeURIComponent("/learn")}`
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
        <div className="flex gap-4 min-w-[900px]">
          {lessons.map((lesson, i) => (
            <div
              key={i}
              className="relative bg-gray-100 rounded-xl min-w-[210px] h-[120px] flex flex-col justify-end shadow-sm border-b-4 border-yellow-400 overflow-hidden cursor-pointer hover:shadow-lg transition"
              onClick={() => handleNextClick(lesson)}
            >
              {/* Ảnh hình tròn, chỉ lộ nửa trái, nằm cạnh phải */}
              <div
                className="absolute top-1/2"
                style={{
                  right: "-50px",
                  transform: "translateY(-50%)",
                  width: "100px",
                  height: "100px",
                  borderRadius: "9999px",
                  overflow: "hidden",
                  background: "#fff",
                }}
              >
                <Image
                  src={lesson.image}
                  alt={lesson.title}
                  width={100}
                  height={100}
                  className="object-cover w-full h-full"
                  style={{ objectPosition: "center" }}
                />
              </div>
              <div className="relative z-10 p-3 pr-24">
                <span className="font-semibold text-sm block whitespace-normal">
                  {lesson.title}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
