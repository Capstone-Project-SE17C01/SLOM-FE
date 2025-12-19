"use client";

import * as React from "react";
import { Provider } from "react-redux";
import { AppProgressBar } from "next-nprogress-bar";
import { Toaster } from "sonner";
import { NextIntlClientProvider } from "next-intl";
import { Messages } from "next-intl";
import { store } from "@/redux/store";
import {
  setHardcodedCredentials
} from "@/utils/hardcodeAuth";

export interface ProvidersProps {
  children: React.ReactNode;
  locale: string;
  messages: Messages;
}

export function Providers({ children, locale, messages }: ProvidersProps) {
  React.useEffect(() => {
    const updateDarkClass = () => {
      const theme = localStorage.getItem("theme");
      const isDark = theme === "dark";
      document.documentElement.classList.toggle("dark", isDark);
    };
    updateDarkClass();
    window.addEventListener("storage", updateDarkClass);
    return () => window.removeEventListener("storage", updateDarkClass);
  }, []);

  // Auto-set hardcoded credentials for testing
  // Always set to ensure VIP status is correct
  React.useEffect(() => {
    // Small delay to ensure Redux store is ready
    const timer = setTimeout(() => {
      // Always check and update credentials
      const currentUserInfo = store.getState().auth.userInfo;
      const needsUpdate = !currentUserInfo || 
                          currentUserInfo.email !== "quanpva.dev@gmail.com" ||
                          currentUserInfo.vipUser !== true;
      
      if (needsUpdate) {
        console.log("🔧 Setting/updating hardcoded credentials for testing...");
        setHardcodedCredentials();
        
        // Double-check after a short delay
        setTimeout(() => {
          const updatedUserInfo = store.getState().auth.userInfo;
          if (!updatedUserInfo || updatedUserInfo.vipUser !== true) {
            console.log("🔄 Force updating credentials again...");
            setHardcodedCredentials();
          } else {
            console.log("✅ VIP credentials confirmed:", updatedUserInfo.vipUser);
          }
        }, 200);
      } else {
        console.log("✅ VIP credentials already set correctly");
      }
    }, 0);
    
    return () => clearTimeout(timer);
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
