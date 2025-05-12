import Link from "next/link";
import { useTranslations } from "next-intl";
import { usePathname } from "next/navigation";
import { useCourse } from "@/contexts/CourseContext";
import React from "react";

interface CourseSidebarProps {
  navItems: { name: string; href: string; icon: React.ReactNode }[];
}

export default function CourseSidebar({ navItems }: CourseSidebarProps) {
  const t = useTranslations("header");
  const pathname = usePathname();
  const { courseTitle } = useCourse();
  return (
    <aside className="bg-white w-64 border-r border-gray-200 flex flex-col pt-8 min-h-screen">
      {/* Logo */}
      <div className="flex flex-col items-center mb-8 select-none">
        <Link
          href="/list-course"
          className="px-4 text-yellow-400 font-extrabold text-3xl leading-none tracking-tight transition-transform duration-200 hover:scale-105 cursor-pointer select-none"
          style={{ lineHeight: 1 }}
        >
          {courseTitle}
        </Link>
      </div>
      <nav className="flex flex-col gap-2 px-4">
        {navItems.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className={`flex items-center gap-3 px-4 py-3 rounded-r-2xl font-bold text-lg transition-all duration-150
              ${
                item.href === pathname
                  ? "bg-gray-100 text-gray-900 border-r-8 border-yellow-400 shadow-sm"
                  : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
              }
            `}
            aria-current={item.href === pathname ? "page" : undefined}
          >
            <span className="text-gray-800">{item.icon}</span>
            <span>{t(item.name)}</span>
          </Link>
        ))}
      </nav>
    </aside>
  );
}
