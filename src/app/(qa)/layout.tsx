import { ThemeProvider } from "@/contexts/ThemeContext";
import QALayout from "@/components/layouts/qa/qa-layout";

function Layout({ children }: Readonly<{ children: React.ReactNode }>) {
    return (
        <ThemeProvider>
            <QALayout>{children}</QALayout>
        </ThemeProvider>
    );
}

export default Layout;