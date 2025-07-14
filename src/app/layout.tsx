import type { Metadata } from "next";
import { getLocale, getMessages } from "next-intl/server";
import { Lexend } from "next/font/google";

import "./globals.css";

import { geistMono, geistSans } from "@/config/fonts";
import { Providers } from "./providers";
const lexend = Lexend({
  subsets: ["latin"],
  variable: "--font-lexend",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    template: "%s | SLOM",
    default: "SLOM",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();
  const messages = await getMessages();
  return (
    <html lang={locale}>
      <head>
        <link rel="icon" href="/images/logo.png" />
      </head>
      <body
        className={`${lexend.variable} ${geistSans.variable} ${geistMono.variable} antialiased shadow-md`}
      >
        <Providers locale={locale} messages={messages}>
          {children}
        </Providers>
      </body>
    </html>
  );
}
