import React from "react";

interface SectionBoxProps {
  title: string;
  children: React.ReactNode;
  className?: string;
  infoIcon?: React.ReactNode;
}

export default function SectionBox({
  title,
  children,
  className = "",
  infoIcon,
}: SectionBoxProps) {
  return (
    <div
      className={`rounded-2xl p-6 flex flex-col relative shadow-sm ${className}`}
    >
      <div className="flex items-center justify-between mb-4 relative">
        <span className="text-xl font-bold">{title}</span>
        {infoIcon}
      </div>
      {children}
    </div>
  );
}
