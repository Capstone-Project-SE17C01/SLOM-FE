import { Activities } from "@/features/course/types";
import { useTranslations } from "next-intl";
import React, { useState } from "react";
import { FaChartBar, FaChevronRight, FaCaretUp } from "react-icons/fa";

function ActivityCard({
  title,
  activities,
  subLabel,
}: {
  title: string;
  activities: Activities;
  subLabel: string;
}) {
  const tCourseDashBoard = useTranslations("courseDashboard");
  const [open, setOpen] = useState(false);

  return (
    <>
      <div
        className="bg-primary rounded-2xl p-4 shadow flex flex-col gap-2 w-[270px] cursor-pointer"
        onClick={() => setOpen(true)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-white font-bold">
            <FaChartBar className="text-lg" />
            <span>{title}</span>
          </div>
          <FaChevronRight className="text-white" />
        </div>
        <div className="bg-white rounded-xl px-4 py-3 flex flex-col gap-1 relative">
          <span className="text-sm">{subLabel}</span>
          <span className="text-3xl font-bold">
            {activities.recentLessonsCompleted}
          </span>
          <span className="absolute right-4 bottom-3 flex items-center gap-1 text-green-600 font-bold text-sm">
            <FaCaretUp />
            {activities.recentLessonsCompleted}
          </span>
        </div>
      </div>
      {open && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div
            className="bg-white rounded-xl p-6 min-w-[320px] relative
              transition-all duration-300 ease-out
              transform scale-95 opacity-0
              animate-fade-in-zoom"
          >
            <button
              className="absolute top-2 right-2 text-2xl text-gray-500 hover:text-primary"
              onClick={() => setOpen(false)}
              aria-label="Close"
            >
              &times;
            </button>
            <div className="font-bold text-lg mb-4">{title}</div>
            <div className="flex flex-col gap-4">
              {Object.entries(activities).map(([key, value]) => {
                const label = tCourseDashBoard(key);
                return (
                  <div
                    key={key}
                    className="bg-primary/10 rounded-2xl px-4 py-3 flex items-center justify-between min-w-[250px]"
                  >
                    <div>
                      <div className="text-base font-semibold">{label}</div>
                      <div className="text-3xl font-bold">{value}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default ActivityCard;
