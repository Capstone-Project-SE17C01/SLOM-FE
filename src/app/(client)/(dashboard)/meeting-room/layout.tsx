import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Meet",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
} 