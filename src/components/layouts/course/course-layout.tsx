"use client";

import { useState } from "react";
import { cn } from "@/utils/cn";
import { useTheme } from "@/contexts/ThemeContext";
import { FaClipboardList, FaRocket, FaRegPlayCircle } from "react-icons/fa";

import Header from "../dashboard/header-breadcrumb";
import MobileMenu from "../dashboard/mobile-menu";
import Footer from "../dashboard/footer";
import CourseTopNav from "./course-top-nav";
import { CourseProvider } from "@/contexts/CourseContext";

export default function CourseLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const { toggleDarkMode } = useTheme();

  const toggleMenu = () => setMenuOpen(!menuOpen);

  const navItems = [
    { name: "home", href: "/home" },
    { name: "message", href: "/chat" },
    { name: "course", href: "/list-course" },
    { name: "meeting", href: "/meeting-room" },
    { name: "translator", href: "/translator" },
    { name: "qa", href: "/qa" },
    { name: "contact", href: "/contact" },
  ];

  const courseNavItems = [
    {
      name: "progress",
      href: "/course-dashboard",
      icon: <FaClipboardList size={20} />,
    },
    { name: "scenario", href: "/learn", icon: <FaRocket size={20} /> },
    { name: "video", href: "/immerse", icon: <FaRegPlayCircle size={20} /> },
  ];

  return (
    <CourseProvider>
      <div
        className={cn("min-h-screen flex flex-col text-black dark:text-white")}
      >
        <Header
          toggleMenu={toggleMenu}
          toggleDarkMode={toggleDarkMode}
          menuOpen={menuOpen}
          navItems={navItems}
        />

        <MobileMenu
          menuOpen={menuOpen}
          navItems={navItems}
          setMenuOpen={setMenuOpen}
        />

        <main className="flex-1 bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 min-h-screen">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div
              className={cn(
                "rounded-xl shadow-lg border min-h-[calc(100vh-200px)] bg-white border-gray-200 text-black dark:bg-gray-800 dark:border-gray-700 dark:text-white overflow-hidden"
              )}
            >
              <CourseTopNav navItems={courseNavItems} />
              <div className="h-full">
                {children}
              </div>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </CourseProvider>
  );
}
