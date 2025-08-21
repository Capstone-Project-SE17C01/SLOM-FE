import DashboardLayout from "@/components/layouts/dashboard/dashboard-layout";
import { MessageProvider } from "@/contexts/MessageContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Chat",
};

export default function Layout({ children }: { readonly children: React.ReactNode }) {
  return <ThemeProvider>
  <MessageProvider>
    <DashboardLayout>{children}</DashboardLayout>
  </MessageProvider>
</ThemeProvider>
}
