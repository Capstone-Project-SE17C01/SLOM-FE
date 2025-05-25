import { ThemeProvider } from "@/contexts/ThemeContext";
import CourseLayout from "@/components/layouts/course/course-layout";

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <CourseLayout>{children}</CourseLayout>
    </ThemeProvider>
  );
}

export default Layout;
