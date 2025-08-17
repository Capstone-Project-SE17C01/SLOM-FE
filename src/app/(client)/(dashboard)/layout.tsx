import DashboardLayout from "@/components/layouts/dashboard/dashboard-layout";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { MessageProvider } from "@/contexts/MessageContext";

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <MessageProvider>
        <DashboardLayout>{children}</DashboardLayout>
      </MessageProvider>
    </ThemeProvider>
  );
}

export default Layout;
