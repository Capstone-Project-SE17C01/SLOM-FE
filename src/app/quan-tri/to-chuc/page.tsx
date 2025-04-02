import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Quản lý tổ chức",
};

import CardList from "@/features/organizations/components/card-list";

export default function Page() {
  return (
    <div className="bg-white dark:bg-background p-4 rounded-xl border-[1px] border-stone-50 dark:border-stone-800">
      <h3 className="text-2xl font-bold mb-4">Quản lý tổ chức</h3>
      <CardList />
    </div>
  );
}
