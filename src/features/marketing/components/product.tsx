import { CheckCircle } from "lucide-react";
import Image from "next/image";
import React from "react";

function ProductSection() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-muted" id="products">
      <div className="container px-4 md:px-6 m-auto">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <div className="inline-block rounded-lg bg-[#8BC34A] px-3 py-1 text-sm text-white">
              Sản phẩm của chúng tôi
            </div>
            <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
              Giải pháp giáo dục toàn diện
            </h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              SafeEdu cung cấp nhiều sản phẩm và dịch vụ để hỗ trợ giáo dục an
              toàn và bình đẳng.
            </p>
          </div>
        </div>

        <div className="mx-auto max-w-5xl py-12">
          <div className="grid gap-6 md:grid-cols-2 lg:gap-12">
            <div className="flex flex-col justify-center space-y-4">
              <h3 className="text-2xl font-bold">Ứng dụng SafeEdu</h3>
              <p className="text-muted-foreground">
                Ứng dụng di động SafeEdu cung cấp các tài liệu giáo dục, công cụ
                báo cáo và hỗ trợ cho học sinh, giáo viên và phụ huynh.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-[#8BC34A] mr-2" />
                  <span>Thư viện tài liệu giáo dục toàn diện</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-[#8BC34A] mr-2" />
                  <span>Công cụ báo cáo và hỗ trợ khẩn cấp</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-[#8BC34A] mr-2" />
                  <span>Tư vấn tâm lý và hỗ trợ trực tuyến</span>
                </li>
              </ul>
              {/* <Button className="w-fit bg-[#8BC34A] hover:bg-[#7CB342]">
                Tải ứng dụng
              </Button> */}
            </div>
            <div className="flex items-center justify-center">
              <Image
                alt="SafeEdu App Screenshot"
                className="object-cover"
                height={1000}
                src="/images/marketing/mockup2.png"
                width={1000}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ProductSection;
