import React from "react";
import { Metadata } from "next";

import TitlePage from "@/components/ui/title-page";
import LibraryTable from "@/features/library/components/library-table";

export const metadata: Metadata = {
  title: "Quản Lí Thư Viện",
};
const Library = () => {
  return (
    <div className="bg-white dark:bg-background p-4 rounded-xl border-[1px] border-stone-50 dark:border-stone-800">
      <TitlePage
        contentHref="Thêm danh sách"
        href="thu-vien/them-bai-viet"
        title="Quản lí thư viện"
      />
      <LibraryTable />
    </div>
  );
};

export default Library;
