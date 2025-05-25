"use client";
import React, { createContext, useContext, useState } from "react";

interface CourseContextType {
  courseTitle: string;
  setCourseTitle: (title: string) => void;
}

const CourseContext = createContext<CourseContextType | undefined>(undefined);

export const useCourse = () => {
  const ctx = useContext(CourseContext);
  if (!ctx) throw new Error("useCourse must be used within CourseProvider");
  return ctx;
};

export const CourseProvider = ({ children }: { children: React.ReactNode }) => {
  const [courseTitle, setCourseTitle] = useState("Choose your course");
  return (
    <CourseContext.Provider value={{ courseTitle, setCourseTitle }}>
      {children}
    </CourseContext.Provider>
  );
};
