import Link from "next/link";
import { useTranslations } from "next-intl";
import { usePathname } from "next/navigation";
import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/middleware/store";
import { cn } from "@/utils/cn";

interface CourseTopNavProps {
  navItems: { name: string; href: string; icon: React.ReactNode }[];
}

export default function CourseTopNav({ navItems }: CourseTopNavProps) {
  const t = useTranslations("header");
  const tListCourse = useTranslations("listCoursePage");
  const pathname = usePathname();
  const userInfo = useSelector((state: RootState) => state.auth.userInfo);

  return (
    <div className="bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Course Title */}
          <div className="flex items-center">
            <Link
              href="/list-course"
              className="text-primary font-bold text-xl hover:text-primary/80 transition-colors"
            >
              {userInfo?.courseTitle == "chooseCourse" ? tListCourse("chooseCourse") : userInfo?.courseTitle}
            </Link>
          </div>

          {/* Navigation Items */}
          <nav className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => {
              const isActive = item.href === pathname;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200",
                    isActive
                      ? "bg-primary text-white shadow-md"
                      : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                  )}
                >
                  <span className={cn("text-lg", isActive ? "text-white" : "text-gray-600")}>
                    {item.icon}
                  </span>
                  <span>{t(item.name)}</span>
                </Link>
              );
            })}
          </nav>

          {/* Mobile Menu Button - you can expand this later */}
          <div className="md:hidden">
            <button className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
