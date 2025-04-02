import Image from "next/image";

import { Button } from "@/components/ui/button";
import { Library } from "@/features/library/library.type";
import { ResourceCard } from "@/features/library/components/resource-card";

type Params = Promise<{ id: string }>;

export async function generateMetadata({ params }: { params: Params }) {
  const { id } = await params;
  const libraryDetail: Library = await fetchLibraryById(id);

  return {
    title: libraryDetail.category_name,
    description: libraryDetail.description,
  };
}

const fetchLibraryById = async (id: string) => {
  const res = await fetch(`https://api-dev.fuses.fun/categories/${id}`);

  const data = await res.json();

  return data;
};

const fetchRelatedLibraries = async (
  topicId: string,
  libraryDetailId: string
) => {
  const res = await fetch("https://api-dev.fuses.fun/categories");

  const data = await res.json();

  const activeLibraries =
    data?.items?.filter(
      (item: Library) => item?.isActive && item._id !== libraryDetailId
    ) ?? [];

  return activeLibraries
    ?.sort(
      (a: Library, b: Library) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    )
    ?.filter((item: Library) => item.topic_id === topicId)
    ?.slice(0, 3);
};

export default async function LibraryDetailPage(props: { params: Params }) {
  const { id } = await props.params;
  const libraryDetail: Library = await fetchLibraryById(id);

  const relatedLibraries: Library[] = await fetchRelatedLibraries(
    libraryDetail?.topic_id,
    libraryDetail?._id
  );

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
            <Link className="hover:text-[#8BC34A]" href="/library">
              Thư viện
            </Link>
            <span className="mx-2">/</span>
            <Link className="hover:text-[#8BC34A]" href="/topics/drugs">
              Ma Túy
            </Link>
            <span className="mx-2">/</span>
            <span className="text-gray-700 truncate max-w-[200px] sm:max-w-md">
              {libraryDetail?.category_name}
            </span>
          </div>
        </div>
      </div> */}

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-8">
            <div className="bg-white rounded-lg shadow-sm p-6 md:p-8">
              {/* Header */}
              {/* <div className="flex items-center gap-2 mb-4">
                <Badge className="bg-[#8BC34A] hover:bg-[#7CB342]">
                  Ma Túy
                </Badge>
                <Badge variant="outline">Tài liệu giáo dục</Badge>
              </div> */}

              {/* Title */}
              <h1 className="text-3xl md:text-4xl font-bold mb-6">
                {libraryDetail?.category_name}
              </h1>

              {/* Featured Image */}
              <div className="mb-8">
                <Image
                  alt={libraryDetail?.category_name}
                  className="w-full h-auto rounded-lg"
                  height={450}
                  src={libraryDetail?.image || "/placeholder.svg"}
                  width={800}
                />
              </div>

              {/* Action Buttons */}
              {/* <div className="flex flex-wrap gap-3 mb-8">
                <Button className="bg-[#8BC34A] hover:bg-[#7CB342] flex items-center gap-2">
                  <BookOpen className="h-4 w-4" />
                  Đọc tài liệu
                </Button>
                <Button className="flex items-center gap-2" variant="outline">
                  <Download className="h-4 w-4" />
                  Tải xuống PDF
                </Button>
                <Button className="flex items-center gap-2" variant="outline">
                  <Share2 className="h-4 w-4" />
                  Chia sẻ
                </Button>
                <Button className="flex items-center gap-2" variant="outline">
                  <Printer className="h-4 w-4" />
                  In tài liệu
                </Button>
              </div> */}

              <div
                dangerouslySetInnerHTML={{
                  __html: libraryDetail?.description,
                }}
                className="prose max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 prose-strong:text-gray-900 prose-img:rounded-lg prose-li:text-gray-700"
              />
            </div>

            {/* Related Resources */}
            <div className="mt-8">
              <h3 className="text-2xl font-bold mb-6">Tài liệu liên quan</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {relatedLibraries.map((item: Library) => (
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
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-4">
            {/* Table of Contents */}
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-4">
              {/* Help Box */}
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-semibold text-blue-700 mb-2">
                  Cần hỗ trợ?
                </h4>
                <p className="text-blue-600 text-sm mb-3">
                  Nếu bạn hoặc người thân đang gặp vấn đề liên quan đến ma túy,
                  hãy liên hệ ngay với các đường dây hỗ trợ.
                </p>
                <Button className="w-full bg-blue-600 hover:bg-blue-700">
                  Xem thông tin hỗ trợ
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
