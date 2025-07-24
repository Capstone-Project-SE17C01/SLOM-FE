import QALayout from "@/components/layouts/qa/qa-layout";
import { ThemeProvider } from "@/contexts/ThemeContext";

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <QALayout>{children}</QALayout>
    </ThemeProvider>
  );
}

export default Layout;
