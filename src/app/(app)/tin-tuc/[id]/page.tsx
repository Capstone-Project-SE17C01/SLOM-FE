import Image from "next/image";
import Link from "next/link";
import { format } from "date-fns";
import { vi } from "date-fns/locale";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TypeNews } from "@/features/news/news.type";
import { ArticleCard } from "@/features/news/components/artical-card";

type Params = Promise<{ id: string }>;

export async function generateMetadata({ params }: { params: Params }) {
  const { id } = await params;
  const newsDetail = await fetchNewsById(id);

  return {
    title: newsDetail.title,
    description: newsDetail.description,
  };
}

const fetchNewsById = async (id: string) => {
  const res = await fetch(`https://api-dev.fuses.fun/news/${id}`);

  const data = await res.json();

  return data;
};

const fetchRelatedNews = async (topicId: string, newDetailId: string) => {
  const res = await fetch("https://api-dev.fuses.fun/news");

  const data = await res.json();

  const latestNews =
    data?.items?.filter(
      (item: TypeNews) => item?.isActive && item._id !== newDetailId
    ) ?? [];

  return latestNews
    ?.sort(
      (a: TypeNews, b: TypeNews) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    )
    ?.filter((item: TypeNews) => item.topic_id._id === topicId)
    ?.slice(0, 3);
};

const fetchLatestNews = async (newDetailId: string) => {
  const res = await fetch("https://api-dev.fuses.fun/news");

  const data = await res.json();

  const latestNews =
    data?.items?.filter(
      (item: TypeNews) => item?.isActive && item._id !== newDetailId
    ) ?? [];

  return latestNews
    ?.sort(
      (a: TypeNews, b: TypeNews) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    )
    .slice(0, 10);
};

export default async function NewsDetailPage(props: { params: Params }) {
  const { id } = await props.params;
  const newsDetail: TypeNews = await fetchNewsById(id);
  const relatedNews: TypeNews[] = await fetchRelatedNews(
    newsDetail.topic_id._id,
    newsDetail._id
  );

  const latestNews: TypeNews[] = await fetchLatestNews(newsDetail._id);

  // Format the date
  const formattedDate = format(
    new Date(newsDetail.created_at),
    "dd MMMM yyyy",
    {
      locale: vi,
    }
  );

  const summary =
    newsDetail.content.match(/<p><em>(.*?)<\/em><\/p>/)?.[1] || "";

  return (
    <div className="min-h-screen bg-[#f8f9fa]">
      {/* Breadcrumb */}
      {/* <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center text-sm text-gray-500">
            <Link className="hover:text-[#8BC34A]" href="/">
              Trang chủ
            </Link>
            <span className="mx-2">/</span>
            <Link className="hover:text-[#8BC34A]" href="/topics/drugs">
              Ma Túy
            </Link>
            <span className="mx-2">/</span>
            <span className="text-gray-700 truncate max-w-[200px] sm:max-w-md">
              {newsDetail.title}
            </span>
          </div>p
        </div>
      </div> */}

      {/* Article Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-8">
            <article className="bg-white rounded-lg shadow-sm p-6 md:p-8">
              {/* Category Badge */}
              <div className="mb-4">
                <Link href="/topics/drugs">
                  <Badge className="bg-[#8BC34A] hover:bg-[#7CB342]">
                    {newsDetail.topic_id.topic_name}
                  </Badge>
                </Link>
              </div>

              {/* Title */}
              <h1 className="text-3xl md:text-4xl font-bold mb-4">
                {newsDetail.title}
              </h1>

              {/* Metadata */}
              <div className="flex flex-wrap items-center text-sm text-gray-500 mb-6">
                <span>{formattedDate}</span>
                <span className="mx-2">•</span>
                <span>Tác giả: {newsDetail.author}</span>
              </div>

              {/* Featured Image */}
              <div className="mb-6">
                <Image
                  alt={newsDetail.title}
                  className="w-full h-auto rounded-lg"
                  height={450}
                  src={newsDetail.image || "/placeholder.svg"}
                  width={800}
                />
              </div>

              {/* Summary */}
              <div className="mb-6 border-l-4 border-[#8BC34A] pl-4 italic text-gray-700">
                {summary}
              </div>

              {/* Content */}
              <div
                dangerouslySetInnerHTML={{ __html: newsDetail.content }}
                className="prose max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 prose-strong:text-gray-900 prose-img:rounded-lg"
              />
            </article>

            {/* Related Articles */}
            <div className="mt-8">
              <h3 className="text-2xl font-bold mb-6">Bài viết liên quan</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {relatedNews
                  ?.filter((item) => newsDetail._id !== item._id)
                  ?.map((newsDetail) => (
                    <Link
                      key={newsDetail._id}
                      href={`/tin-tuc/${newsDetail._id}`}
                    >
                      <Card className="overflow-hidden hover:shadow-md transition-shadow h-full">
                        <CardContent className="p-0">
                          <div className="relative">
                            <Image
                              alt={newsDetail.title}
                              className="w-full h-48 object-cover"
                              height={200}
                              src={newsDetail.image || "/placeholder.svg"}
                              width={300}
                            />
                            <div className="absolute top-3 left-3">
                              <span className="px-2 py-1 bg-[#8BC34A] text-white text-xs rounded-md">
                                {newsDetail.topic_id.topic_name}
                              </span>
                            </div>
                          </div>
                          <div className="p-4">
                            <h3 className="font-semibold text-lg mb-2 line-clamp-2">
                              {newsDetail.title}
                            </h3>
                            <p className="text-gray-500 text-sm">
                              {format(
                                newsDetail.created_at,
                                "dd/MM/yyyy HH:mm/ss"
                              )}
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-4">
            {/* Popular Articles */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold mb-4 pb-2 border-b">
                Bài viết gần đây
              </h3>
              <div className="flex flex-col gap-4">
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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
