"use client";

import { useState } from "react";
import { cn } from "@/utils/cn";
import { useTheme } from "@/contexts/ThemeContext";

import Header from "../dashboard/header-breadcrumb";
import MobileMenu from "../dashboard/mobile-menu";
import Footer from "../dashboard/footer";
import { useSelector } from "react-redux";
import { RootState } from "@/middleware/store";

export default function QALayout({
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
    navItems.push({ name: "meeting", href: "/meeting-room" });
    navItems.push({ name: "qa", href: "/qa" });
  }

  return (
    <div
      className={cn(
        "min-h-screen flex flex-col",
        isDarkMode ? "text-white" : "text-black"
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

      <main className="flex-1 bg-gray-50 min-h-screen">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div
            className={cn(
              "rounded-xl shadow-sm border min-h-[calc(100vh-200px)]",
              isDarkMode
                ? "bg-gray-800 border-gray-700 text-white"
                : "bg-white border-gray-200 text-black"
            )}
          >
            {children}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
