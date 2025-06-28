"use client";

import { useState } from "react";
import { cn } from "@/utils/cn";
import { useTheme } from "@/contexts/ThemeContext";

import Header from "./header-breadcrumb";
import MobileMenu from "./mobile-menu";
import Footer from "./footer";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const { isDarkMode, toggleDarkMode } = useTheme();
  const toggleMenu = () => setMenuOpen(!menuOpen);
  let navItems = [
    { name: "home", href: "/home" },
    { name: "features", href: "/features" },
    { name: "about", href: "/about" },
    { name: "contact", href: "/contact" },
  ];

  const userInfo = useSelector((state: RootState) => state.auth.userInfo);
  if (userInfo) {
    navItems = [
      { name: "message", href: "/chat" },
      { name: "course", href: "/list-course" },
      { name: "meeting", href: "/meeting-room" },
    ];
  }

  return (
    <div
      className={cn(
        "min-h-screen antialiased",
        isDarkMode ? "bg-black text-white" : "bg-white text-black"
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

      <main className="">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div
            className={cn(
              "rounded-xl p-8 shadow-sm border",
              isDarkMode
                ? "bg-gray-800 border-gray-700 text-white"
                : "bg-white border-gray-100 text-black"
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
