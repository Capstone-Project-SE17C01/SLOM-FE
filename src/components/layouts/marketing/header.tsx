import Link from "next/link";
import React from "react";
import Image from "next/image";

import { Button } from "@/components/ui/button";

function MarketingHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between m-auto px-4">
        <div className="flex items-center gap-2">
          <Image
            alt="logo"
            className="w-9 h-auto"
            height={100}
            src="/images/logo/logo.png"
            width={100}
          />
          <span className="text-xl font-bold">SafeEdu</span>
        </div>
        <nav className="hidden md:flex gap-6">
          <Link className="text-sm font-medium hover:text-[#8BC34A]" href="#">
            Trang chủ
          </Link>
          <Link
            className="text-sm font-medium hover:text-[#8BC34A]"
            href="#features"
          >
            Tính năng
          </Link>
          <Link
            className="text-sm font-medium hover:text-[#8BC34A]"
            href="#products"
          >
            Sản phẩm
          </Link>
          <Link
            className="text-sm font-medium hover:text-[#8BC34A]"
            href="#coverage"
          >
            Truyền thông
          </Link>
          <Link
            className="text-sm font-medium hover:text-[#8BC34A]"
            href="#contact"
          >
            Liên hệ
          </Link>
        </nav>
        <div className="flex items-center gap-4">
          {/* <Button className="hidden md:flex" variant="outline">
            Đăng nhập
          </Button> */}
          <Link href={"/trang-chu"}>
            <Button className="bg-[#8BC34A] hover:bg-[#7CB342]">
              Khám phá ngay
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
}

export default MarketingHeader;
