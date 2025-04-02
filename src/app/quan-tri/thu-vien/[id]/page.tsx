import { Metadata } from "next";
import React from "react";

import DescriptionModule from "@/features/library/components/description-library";
export const metadata: Metadata = {
  title: "Mô tả bài viết thư viện",
};
const DescPage = () => {
  return (
    <div className="bg-white dark:bg-background p-4 rounded-xl border-[1px] border-stone-50 dark:border-stone-800">
      <DescriptionModule />
    </div>
  );
};

export default DescPage;
