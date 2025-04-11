import { ThemeProvider } from "@/contexts/ThemeContext";
import DashboardLayout from "@/components/layouts/dashboard/dashboard-layout";

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <DashboardLayout>{children}</DashboardLayout>
    </ThemeProvider>
  );
}

export default Layout;
