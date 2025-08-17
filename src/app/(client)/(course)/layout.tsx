import CourseLayout from "@/components/layouts/course/course-layout";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { MessageProvider } from "@/contexts/MessageContext";

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <MessageProvider>
        <CourseLayout>{children}</CourseLayout>
      </MessageProvider>
    </ThemeProvider>
  );
}

export default Layout;
