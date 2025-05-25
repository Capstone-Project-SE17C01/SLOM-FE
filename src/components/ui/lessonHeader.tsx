// src/components/ui/LessonHeader.tsx
import React from "react";
import { FaTimes } from "react-icons/fa";
export default function LessonHeader({
  title,
  onClose,
}: {
  title: string;
  onClose: () => void;
}) {
  return (
    <div className="bg-primary/10 grid grid-cols-6 items-center px-8 py-4 border-b">
      <div className="col-start-2 col-end-3 font-bold text-lg">{title}</div>
      <button
        onClick={onClose}
        className="col-start-6 col-end-7 p-2 rounded-full hover:bg-gray-100 justify-self-end"
      >
        <FaTimes className="text-2xl text-gray-500" />
      </button>
    </div>
  );
}
