import CourseLayout from "@/components/layouts/course/course-layout";
import { ThemeProvider } from "@/contexts/ThemeContext";

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <CourseLayout>{children}</CourseLayout>
    </ThemeProvider>
  );
}

export default Layout;
