"use client";

import * as React from "react";
import { Provider } from "react-redux";
import { AppProgressBar } from "next-nprogress-bar";
import { Toaster } from "sonner";
import { NextIntlClientProvider } from "next-intl";
import { Messages } from "next-intl";
import { store } from "@/middleware/store";
export interface ProvidersProps {
  children: React.ReactNode;
  locale: string;
  messages: Messages;
}

export function Providers({ children, locale, messages }: ProvidersProps) {
  // Thêm effect để đồng bộ class dark vào thẻ html
  React.useEffect(() => {
    const updateDarkClass = () => {
      // Ưu tiên lấy từ localStorage, fallback theo hệ thống
      const theme = localStorage.getItem("theme");
      const isDark =
        theme === "dark" ||
        (!theme && window.matchMedia("(prefers-color-scheme: dark)").matches);
      document.documentElement.classList.toggle("dark", isDark);
    };
    updateDarkClass();
    window.addEventListener("storage", updateDarkClass);
    return () => window.removeEventListener("storage", updateDarkClass);
  }, []);

  return (
    <React.Suspense>
      <AppProgressBar
        shallowRouting
        color="#6947A8"
        height="4px"
        options={{ showSpinner: false }}
      />
      <Provider store={store}>
        <Toaster closeButton richColors position="top-right" />
        <NextIntlClientProvider locale={locale} messages={messages}>
          {children}
        </NextIntlClientProvider>
      </Provider>
    </React.Suspense>
  );
}
