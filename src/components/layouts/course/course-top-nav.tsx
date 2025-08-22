import Link from "next/link";
import { useTranslations } from "next-intl";
import { usePathname } from "next/navigation";
import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { cn } from "@/utils/cn";
import { Book } from "lucide-react";

interface CourseTopNavProps {
  navItems: { name: string; href: string; icon: React.ReactNode }[];
}

export default function CourseTopNav({ navItems }: CourseTopNavProps) {
  const t = useTranslations("header");
  const tListCourse = useTranslations("listCoursePage");
  const pathname = usePathname();
  const userInfo = useSelector((state: RootState) => state.auth.userInfo);

  return (
    <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Course Title */}
          <div className="flex items-center">
            <Link
              href="/list-course"
              className="flex items-center gap-2 text-primary font-bold text-xl hover:text-primary/80 transition-all duration-300 group"
            >
              <Book className="h-5 w-5 group-hover:scale-110 transition-transform duration-300" />
              <span className="bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
                {userInfo?.courseTitle == "chooseCourse"
                  ? tListCourse("chooseCourse")
                  : userInfo?.courseTitle}
              </span>
            </Link>
          </div>

          {/* Navigation Items */}
          <nav className="hidden md:flex items-center space-x-3">
            {navItems.map((item) => {
              const isActive = item.href === pathname;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-2 px-5 py-2 rounded-lg font-medium text-sm transition-all duration-300",
                    isActive
                      ? "bg-primary text-white shadow-md dark:bg-primary dark:text-white scale-105"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white hover:scale-105"
                  )}
                >
                  <span
                    className={cn(
                      "text-lg transition-transform duration-300",
                      isActive
                        ? "text-white"
                        : "text-gray-600 dark:text-gray-300"
                    )}
                  >
                    {item.icon}
                  </span>
                  <span className="font-semibold">{t(item.name)}</span>
                </Link>
              );
            })}
          </nav>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button className="p-2 rounded-md text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-300">
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
