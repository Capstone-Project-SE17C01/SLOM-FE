"use client";

import * as React from "react";
import { Provider } from "react-redux";
import { AppProgressBar } from "next-nprogress-bar";
import { Toaster } from "sonner";
import { ThemeProvider } from "next-themes";

import { store } from "@/redux/store";

export interface ProvidersProps {
  children: React.ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <React.Suspense>
      <ThemeProvider enableSystem attribute="class" defaultTheme="system">
        <AppProgressBar
          shallowRouting
          color="#75A815"
          height="4px"
          options={{ showSpinner: false }}
        />
        <Provider store={store}>
          <Toaster closeButton richColors position="top-right" />
          {children}
        </Provider>
      </ThemeProvider>
    </React.Suspense>
  );
}
