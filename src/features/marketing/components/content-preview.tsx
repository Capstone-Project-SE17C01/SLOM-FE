import Image from "next/image";
import React from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

function ContentPreview() {
  const cards = [
    {
      title: "Ma túy học đường",
      image: "/images/marketing/ma-tuy.png",
      alt: "Ma túy học đường",
      content:
        "Tìm hiểu về tác hại của ma túy và cách phòng chống ma túy trong trường học.",
    },
    {
      title: "Bạo lực học đường",
      image: "/images/marketing/bao-luc-hoc-duong.png",
      alt: "Bạo lực học đường",
      content:
        "Tìm hiểu cách nhận diện, phòng ngừa và ứng phó với bạo lực học đường.",
    },
    {
      title: "Bình đẳng giới",
      image: "/images/marketing/binh-dang-gioi.png",
      alt: "Bình đẳng giới",
      content:
        "Tìm hiểu về bình đẳng giới và cách thúc đẩy cơ hội bình đẳng cho mọi người.",
    },
  ];

  return (
    <section className="w-full py-12 md:py-24 lg:py-32">
      <div className="container px-4 md:px-6 m-auto">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <div className="inline-block rounded-lg bg-[#8BC34A] px-3 py-1 text-sm text-white">
              Nội dung giáo dục
            </div>
            <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
              Khám phá thư viện kiến thức
            </h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              SafeEdu cung cấp nội dung giáo dục đa dạng về các chủ đề quan
              trọng.
            </p>
          </div>
        </div>

        <div className="mx-auto max-w-5xl py-12">
          <div className="grid gap-6 md:grid-cols-3">
            {cards.map((card, index) => (
              <Card key={index}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg text-center">
                    {card.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="aspect-video relative overflow-hidden rounded-lg">
                    <Image
                      fill
                      alt={card.alt}
                      className="object-contain"
                      src={card.image}
                    />
                  </div>
                  <p className="mt-4 text-sm text-muted-foreground text-center">
                    {card.content}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default ContentPreview;
