import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Payment Result",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
