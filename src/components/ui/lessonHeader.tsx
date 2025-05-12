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
    <div className="flex items-center justify-between px-8 py-4 border-b">
      <div className="font-bold text-lg">{title}</div>
      <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100">
        <FaTimes className="text-2xl text-gray-500" />
      </button>
    </div>
  );
}
