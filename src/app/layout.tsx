import type { Metadata } from "next";

import "./globals.css";

import { Providers } from "./providers";

import { geistMono, geistSans } from "@/config/fonts";

export const metadata: Metadata = {
  title: {
    template: "%s | SafeEdu",
    default: "SafeEdu",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html suppressHydrationWarning lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased shadow-md overflow-y-scroll`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
