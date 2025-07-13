import DashboardLayout from "@/components/layouts/dashboard/dashboard-layout";
import { ThemeProvider } from "@/contexts/ThemeContext";

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <DashboardLayout>{children}</DashboardLayout>
    </ThemeProvider>
  );
}

export default Layout;
