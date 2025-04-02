import React from "react";

import TitlePage from "@/components/ui/title-page";
import NewsTableModule from "@/features/news/components/news-table";

const NewsPage = () => {
  return (
    <div className="bg-white dark:bg-background p-4 rounded-xl border-[1px] border-stone-50 dark:border-stone-800">
      <TitlePage
        contentHref="Thêm bài báo"
        href="tin-tuc/them-tin-tuc"
        title="Quản lí tin tức"
      />
      <NewsTableModule />
    </div>
  );
};

export default NewsPage;
