"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface Tab {
  label: string;
  href: string;
}

interface SwitchTabButtonProps {
  tabs: Tab[];
  className?: string;
}

export default function SwitchTabButton({
  tabs,
  className,
}: SwitchTabButtonProps) {
  const pathname = usePathname();
  return (
    <div
      className={`inline-flex rounded-xl bg-gray-100 p-1 ${className || ""}`}
    >
      {tabs.map((tab) => {
        const isActive = pathname === tab.href;
        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={`px-8 py-2 text-lg transition-all
              ${
                isActive
                  ? "bg-white rounded-lg shadow font-bold border border-gray-200"
                  : "bg-transparent text-gray-700 font-normal"
              }
            `}
            style={{ minWidth: 100, textAlign: "center" }}
          >
            {tab.label}
          </Link>
        );
      })}
    </div>
  );
}
