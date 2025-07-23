import AdminLayout from "@/components/layouts/admin/admin-layout";
import { ThemeProvider } from "@/contexts/ThemeContext";

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <AdminLayout>{children}</AdminLayout>
    </ThemeProvider>
  );
}

export default Layout; 