"use client";

import { useState } from "react";
import { cn } from "@/utils/cn";
import { useTheme } from "@/contexts/ThemeContext";
import { FaClipboardList, FaRocket, FaRegPlayCircle } from "react-icons/fa";

import Header from "../dashboard/header-breadcrumb";
import MobileMenu from "../dashboard/mobile-menu";
import Footer from "../dashboard/footer";
import CourseSidebar from "./course-sidebar";
import { CourseProvider } from "@/contexts/CourseContext";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

export default function CourseLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const { isDarkMode, toggleDarkMode } = useTheme();

  const toggleMenu = () => setMenuOpen(!menuOpen);

  const navItems = [
    { name: "home", href: "/home" },
    { name: "features", href: "/features" },
    { name: "about", href: "/about" },
    { name: "contact", href: "/contact" },
  ];

  const userInfo = useSelector((state: RootState) => state.auth.userInfo);
  if (userInfo) {
    navItems.push({ name: "message", href: "/chat" });
    navItems.push({ name: "course", href: "/list-course" });
  }

  const sidebarItems = [
    {
      name: "home",
      href: "course-dashboard",
      icon: <FaClipboardList size={22} />,
    },
    { name: "scenario", href: "/learn", icon: <FaRocket size={22} /> },
    { name: "video", href: "/immerse", icon: <FaRegPlayCircle size={22} /> },
  ];

  return (
    <CourseProvider>
      <div
        className={cn(
          "min-h-screen flex flex-col ",
          isDarkMode ? "text-white" : "text-black"
        )}
      >
        <div className="flex flex-1">
          <CourseSidebar navItems={sidebarItems} />
          <div className="flex flex-col flex-1 min-w-0">
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
            <main className="flex-1 overflow-auto p-6">{children}</main>
          </div>
        </div>
        <Footer />
      </div>
    </CourseProvider>
  );
}
