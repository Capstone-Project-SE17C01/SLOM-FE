import Link from "next/link";
import React from "react";
import Image from "next/image";

function MarketingHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between m-auto px-4">
        <Link href={"/trang-chu"}>
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
        </Link>
        <nav className="hidden md:flex gap-6">
          <Link
            className="text-sm font-medium hover:text-[#8BC34A]"
            href="/trang-chu"
          >
            Trang chủ
          </Link>
          <Link
            className="text-sm font-medium hover:text-[#8BC34A]"
            href="/tin-tuc"
          >
            Tin tức
          </Link>
          <Link
            className="text-sm font-medium hover:text-[#8BC34A]"
            href="/thu-vien"
          >
            Thư viện
          </Link>
        </nav>
        {/* <div className="flex items-center gap-4">
          <Button className="bg-[#8BC34A] hover:bg-[#7CB342]">
            Khám phá ngay
          </Button>
        </div> */}
      </div>
    </header>
  );
}

export default MarketingHeader;
