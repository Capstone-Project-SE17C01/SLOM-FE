"use client";

import { ReactNode, useEffect, useState } from "react";
import { cn } from "@/utils/cn";

interface MeetingLayoutProps {
  children: ReactNode;
  numberOfParticipants: number;
}

export default function MeetingLayout({
  children,
  numberOfParticipants,
}: MeetingLayoutProps) {
  const [colClass, setColClass] = useState("grid-cols-1");
  
  useEffect(() => {
    let newColClass = "grid-cols-1";
    
    if (numberOfParticipants === 2) newColClass = "grid-cols-2";
    else if (numberOfParticipants === 3) newColClass = "grid-cols-3";
    else if (numberOfParticipants === 4) newColClass = "grid-cols-2";
    else if (numberOfParticipants >= 5 && numberOfParticipants <= 6) newColClass = "grid-cols-3";
    else if (numberOfParticipants > 6) newColClass = "grid-cols-4";
    
    console.log(`Updating layout to ${newColClass} for ${numberOfParticipants} participants`);
    setColClass(newColClass);
  }, [numberOfParticipants]);

  return (
    <div
      className={cn(
        "grid w-full gap-3",
        colClass,
        "auto-rows-fr",
        "h-full",
        "overflow-hidden"
      )}
      key={`layout-${numberOfParticipants}`}
    >
      {children}
    </div>
  );
}
