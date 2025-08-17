import QALayout from "@/components/layouts/qa/qa-layout";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { MessageProvider } from "@/contexts/MessageContext";

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <MessageProvider>
        <QALayout>{children}</QALayout>
      </MessageProvider>
    </ThemeProvider>
  );
}

export default Layout;
