"use client";

import * as React from "react";
import { Provider } from "react-redux";
import { AppProgressBar } from "next-nprogress-bar";
import { Toaster } from "sonner";
import { store } from "@/redux/store";
import { NextIntlClientProvider } from "next-intl";
import { Messages } from "next-intl";
export interface ProvidersProps {
  children: React.ReactNode;
  locale: string;
  messages: Messages;
}

export function Providers({ children, locale, messages }: ProvidersProps) {
  return (
    <React.Suspense>
      <AppProgressBar
        shallowRouting
        color="#75A815"
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
