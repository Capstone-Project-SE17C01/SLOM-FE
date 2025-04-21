// 🧱 components/MeetingLayout.tsx
"use client";

import { ReactNode } from "react";
import { cn } from "@/utils/cn";

interface MeetingLayoutProps {
  children: ReactNode;
  numberOfParticipants: number;
}

export default function MeetingLayout({
  children,
  numberOfParticipants,
}: MeetingLayoutProps) {
  const count = Array.isArray(children) ? children.length : 1;

  // Xác định số cột theo số participant:
  // 1 người: toàn màn hình
  // 2 người: 2 cột
  // 3 người: 3 cột
  // 4 người: 4 cột
  // >=5 người: 3 cột
  let colClass = "grid-cols-1";
  if (numberOfParticipants === 2) colClass = "grid-cols-2";
  else if (numberOfParticipants === 3) colClass = "grid-cols-3";
  else if (numberOfParticipants === 4) colClass = "grid-cols-4";
  else if (numberOfParticipants >= 5) colClass = "grid-cols-3";

  return (
    <div
      className={cn(
        "grid w-full gap-2",
        colClass,
        "auto-rows-fr", // 🔑 Hàng co dãn đều nhau
        "overflow-hidden" // Ẩn scroll thừa
      )}
    >
      {children}
    </div>
  );
}
