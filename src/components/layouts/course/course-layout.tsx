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
    { name: "contact", href: "/contact" },
    { name: "Q&A", href: "/qa" }
  ];

  const courseNavItems = [
    {
      name: "home",
      href: "/course-dashboard",
      icon: <FaClipboardList size={18} />,
    },
    { name: "scenario", href: "/learn", icon: <FaRocket size={18} /> },
    { name: "video", href: "/immerse", icon: <FaRegPlayCircle size={18} /> },
  ];

  return (
    <CourseProvider>
      <div
        className={cn(
          "min-h-screen flex flex-col text-black dark:text-white"
        )}
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

        <main className="flex-1 bg-gray-50 dark:bg-gray-900 min-h-screen">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div
              className={cn(
                "rounded-xl shadow-sm border min-h-[calc(100vh-200px)] bg-white border-gray-200 text-black dark:bg-gray-800 dark:border-gray-700 dark:text-white"
              )}
            >
              <CourseTopNav navItems={courseNavItems} />
              {children}
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </CourseProvider>
  );
}
