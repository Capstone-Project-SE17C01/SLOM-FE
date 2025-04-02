import React from "react";
import { format } from "date-fns";

import { TypeNews } from "@/features/news/news.type";
import { ArticleCard } from "@/features/news/components/artical-card";

export const metadata = {
  title: "Tin tức mới nhất",
  description:
    "Cập nhật những tin tức mới nhất và nổi bật trong lĩnh vực giáo dục từ SafeEdu.",
  openGraph: {
    title: "Tin tức mới nhất",
    description:
      "Cập nhật những tin tức mới nhất và nổi bật trong lĩnh vực giáo dục từ SafeEdu.",
    url: "https://www.safe-edu.site/tin-tuc",
    images: [
      {
        url: "/images/logo/logo.png",
        width: 800,
        height: 600,
        alt: "SafeEdu News",
      },
    ],
  },
};

const fetchLatestNews = async () => {
  const res = await fetch("https://api-dev.fuses.fun/news");

  const data = await res.json();

  const latestNews =
    data?.items?.filter((item: TypeNews) => item?.isActive) ?? [];

  return latestNews?.sort(
    (a: TypeNews, b: TypeNews) =>
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );
};

async function NewsPage() {
  const latestNews: TypeNews[] = await fetchLatestNews();

  return (
    <div className="min-h-screen ">
      <section className="container mx-auto px-4 py-12 md:py-16 bg-white rounded-lg ">
        <h2 className="text-3xl font-bold text-center mb-10 text-primary">
          Tin tức mới nhất
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {latestNews?.map((item) => (
            <ArticleCard
              key={item._id}
              category={item.topic_id.topic_name}
              date={format(item.created_at, "dd/MM/yyyy HH:mm:ss")}
              id={item._id}
              image={item.image}
              title={item.title}
            />
          ))}
        </div>
      </section>
    </div>
  );
}

export default NewsPage;
