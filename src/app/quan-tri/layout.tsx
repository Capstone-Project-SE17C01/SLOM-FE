import DashboardLayout from "@/components/layouts/dashboard/dashboard-layout";

function Layout({ children }: { children: React.ReactNode }) {
  return <DashboardLayout>{children}</DashboardLayout>;
}

export default Layout;
