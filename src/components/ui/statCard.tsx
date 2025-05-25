import React from "react";
import clsx from "clsx";

interface StatCardProps {
  value: number | string;
  label: string;
  className?: string;
}

export default function StatCard({ value, label, className }: StatCardProps) {
  return (
    <div
      className={clsx(
        "bg-white rounded-xl shadow flex flex-col items-center justify-center w-24 h-24",
        className
      )}
    >
      <span className="text-3xl font-extrabold text-[#0a2233]">{value}</span>
      <span className="text-xs text-[#0a2233] mt-1 text-center">{label}</span>
    </div>
  );
}
