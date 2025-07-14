import React from "react";
import { ThemeProvider } from "@/contexts/ThemeContext";

function layout({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <div>{children}</div>
    </ThemeProvider>
  );
}

export default layout;
