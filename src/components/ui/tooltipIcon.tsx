import React from "react";

interface TooltipIconProps {
  icon: React.ReactNode;
  tooltip: React.ReactNode;
  open: boolean;
  onClick: () => void;
  placement?: "left" | "right";
  className?: string;
}

export default function TooltipIcon({
  icon,
  tooltip,
  open,
  onClick,
  placement = "left",
  className = "",
}: TooltipIconProps) {
  return (
    <div className={`relative inline-block ${className}`}>
      <span onClick={onClick} className="cursor-pointer">
        {icon}
      </span>
      {open && (
        <div
          className={`absolute ${
            placement === "left" ? "right-full mr-3" : "left-full ml-3"
          } top-1/2 -translate-y-1/2 w-[300px] bg-white text-[#0a2233] text-base rounded-xl shadow-lg p-4 z-50 border border-gray-100`}
        >
          {tooltip}
        </div>
      )}
    </div>
  );
}
