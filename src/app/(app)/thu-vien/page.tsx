import React from "react";

import { Library } from "@/features/library/library.type";
import { DataTopic } from "@/features/topic/topic.type";
import { ResourceCard } from "@/features/library/components/resource-card";

export const metadata = {
  title: "Thư viện giáo dục",
  description:
    "Khám phá các tài liệu giáo dục đa dạng và phong phú trong thư viện của SafeEdu.",
  openGraph: {
    title: "Thư viện giáo dục",
    description:
      "Khám phá các tài liệu giáo dục đa dạng và phong phú trong thư viện của SafeEdu.",
    url: "https://www.safe-edu.site/thu-vien",
    images: [
      {
        url: "/images/logo/logo.png",
        width: 800,
        height: 600,
        alt: "SafeEdu Library",
      },
    ],
  },
};

const fetchLatestLibrary = async () => {
  const res = await fetch("https://api-dev.fuses.fun/categories");

  const data = await res.json();

  const libraries =
    data?.items?.filter((item: Library) => item?.isActive) ?? [];

  return libraries;
};

const fetchTopics = async () => {
  const res = await fetch("https://api-dev.fuses.fun/topics");

  const data = await res.json();

  const topics = data?.data?.filter((item: Library) => item?.isActive) ?? [];

  return topics;
};

async function LibraryPage() {
  const libraries: Library[] = await fetchLatestLibrary();

  const topics: DataTopic[] = await fetchTopics();

  return (
    <div className="min-h-screen ">
      <section className="container mx-auto px-4 py-12 md:py-16 bg-white rounded-lg ">
        <h2 className="text-3xl font-bold text-center mb-10 text-primary">
          Thư viện giáo dục
        </h2>

        {topics?.map((topic) => (
          <div key={topic._id}>
            <h3 className="text-xl font-bold my-4">{topic.topic_name}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {libraries
                ?.filter(
                  (item) => item.topic_id?.toString() === topic._id?.toString()
                )
                ?.map((item, index) => (
                  <ResourceCard
                    key={item._id}
                    description={item.description}
                    icon={item.image}
                    id={item._id}
                    title={item.category_name}
                  />
                ))}
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}

export default LibraryPage;
