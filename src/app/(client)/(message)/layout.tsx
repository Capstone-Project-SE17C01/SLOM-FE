import MessageLayout from "@/components/layouts/message/message-layout";
import { MessageProvider } from "@/contexts/MessageContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Chat",
};

export default function Layout({ children }: { readonly children: React.ReactNode }) {
  return <ThemeProvider>
  <MessageProvider>
    <MessageLayout>
      {children}
    </MessageLayout>
  </MessageProvider>
</ThemeProvider>;
}
