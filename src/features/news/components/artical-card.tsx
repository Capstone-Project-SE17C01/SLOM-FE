import Image from "next/image";
import Link from "next/link";

import { Card, CardContent } from "@/components/ui/card";

export function ArticleCard({
  title,
  date,
  category,
  image,
  id,
}: {
  title: string;
  date: string;
  category: string;
  image: string;
  id: string;
}) {
  return (
    <Link href={`/tin-tuc/${id}`}>
      <Card className="overflow-hidden hover:shadow-md transition-shadow h-full">
        <CardContent className="p-0">
          <div className="relative">
            <Image
              alt={title}
              className="w-full h-48 object-cover"
              height={200}
              src={image || "/placeholder.svg"}
              width={300}
            />
            <div className="absolute top-3 left-3">
              <span className="px-2 py-1 bg-[#8BC34A] text-white text-xs rounded-md">
                {category}
              </span>
            </div>
          </div>
          <div className="p-4">
            <h3 className="font-semibold text-lg mb-2 line-clamp-2">{title}</h3>
            <p className="text-gray-500 text-sm">{date}</p>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
