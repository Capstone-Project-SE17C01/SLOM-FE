import type { Metadata } from "next";

import "./globals.css";

import { geistMono, geistSans } from "@/config/fonts";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: {
    template: "%s | SLOM",
    default: "SLOM",
  },
};
// test comment
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased shadow-md`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
