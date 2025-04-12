import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Payment Cancel",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
