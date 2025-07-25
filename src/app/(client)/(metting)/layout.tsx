"use client";

import { ThemeProvider } from "@/contexts/ThemeContext";

export default function MeetingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ThemeProvider>{children}</ThemeProvider>;
}
