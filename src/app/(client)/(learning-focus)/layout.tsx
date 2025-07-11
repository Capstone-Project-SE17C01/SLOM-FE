import { ThemeProvider } from "@/contexts/ThemeContext";

function Layout({ children }: { children: React.ReactNode }) {
  return <ThemeProvider>{children}</ThemeProvider>;
}

export default Layout;
