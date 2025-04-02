import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export function ResourceCard({
  title,
  description,
  icon,
  id,
}: {
  id: string;
  title: string;
  description: string;
  icon: string;
}) {
  return (
    <Card className={`overflow-hidden `}>
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0">
            <Image
              alt={title}
              className="object-contain"
              height={80}
              src={icon}
              width={80}
            />
          </div>
          <div>
            <h3 className="text-xl font-bold mb-2 line-clamp-1">{title}</h3>
            {/* <p className="mb-4">{description}</p> */}
            <Link href={`/thu-vien/${id}`}>
              <Button className="ml-auto" size="sm">
                Xem thông tin
              </Button>
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
