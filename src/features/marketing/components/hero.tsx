import { ChevronRight } from "lucide-react";
import React from "react";
import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";

function HeroSection() {
  return (
    <section className="w-full  bg-gradient-to-b from-background to-muted">
      <div className="container px-4 md:px-6 m-auto">
        <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 xl:gap-16">
          <div className="flex flex-col justify-center space-y-4 ">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                Bảo vệ học sinh, xây dựng môi trường học đường an toàn
              </h1>
              <p className="max-w-[600px] text-muted-foreground md:text-xl">
                SafeEdu - Nền tảng giáo dục toàn diện giúp nhận diện và phòng
                chống bạo lực học đường, ma túy và thúc đẩy bình đẳng giới.
              </p>
            </div>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <Link href={"/trang-chu"}>
                <Button
                  className="gap-1 bg-[#8BC34A] hover:bg-[#7CB342]"
                  size="lg"
                >
                  Khám phá ngay <ChevronRight className="h-4 w-4" />
                </Button>
              </Link>

              {/* <Button size="lg" variant="outline">
                Tìm hiểu thêm
              </Button> */}
            </div>
          </div>
          <div className="flex items-center justify-center">
            <Image
              alt="SafeEdu App Screenshot"
              className="object-contain h-full max-h-[500px] my-20"
              height={1000}
              src="/images/marketing/mockup1.png"
              width={1000}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;
