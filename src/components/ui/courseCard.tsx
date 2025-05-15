"use client";
import React from "react";
import { useCourse } from "@/contexts/CourseContext";
import { useRouter } from "next/navigation";
import CourseImage from "./courseImage";

export interface CourseCardProps {
  img: string;
  title: string;
  subtitle?: string;
  btn: string;
  badge?: string;
}

export default function CourseCard({
  img,
  title,
  subtitle,
  btn,
  badge,
}: CourseCardProps) {
  const { setCourseTitle } = useCourse();
  const router = useRouter();

  return (
    <div className="border-b-4 border-primary hover:bg-primary/10 flex items-center bg-white border border-gray-200 rounded-3xl shadow-sm px-6 py-4 min-h-[120px] transition hover:shadow-md">
      <div className="relative w-28 h-28 mr-6 flex-shrink-0">
        <CourseImage
          img={img}
          title={title}
          badge={badge}
          className="object-cover rounded-2xl"
        />
        {badge && (
          <span className="absolute top-2 left-2 bg-white/80 text-gray-900 text-xs font-semibold px-2 py-0.5 rounded">
            {badge}
          </span>
        )}
      </div>
      <div className="flex-1 flex flex-col justify-between h-full">
        <div>
          <div className="font-bold text-xl text-[#1a2a32] mb-1">{title}</div>
          {subtitle && (
            <div className="text-gray-500 text-sm mb-2">{subtitle}</div>
          )}
        </div>
        <div className="flex items-center justify-between mt-auto">
          <span className="text-gray-400 text-2xl">&#8230;</span>
          <button
            onClick={() => {
              setCourseTitle(title);
              router.push("/learn");
            }}
            className="font-bold text-[#1a2a32] hover:text-primary transition text-base"
          >
            {btn} <span className="ml-1">›</span>
          </button>
        </div>
      </div>
    </div>
  );
}
