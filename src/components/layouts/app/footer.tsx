import Image from "next/image";
import Link from "next/link";
import React from "react";

function MarketingFooter() {
  return (
    <footer className="w-full border-t py-6 md:py-0">
      <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row m-auto">
        <div className="flex items-center gap-2">
          <Image
            alt="logo"
            className="w-9 h-auto"
            height={100}
            src="/images/logo/logo.png"
            width={100}
          />
          <span className="text-lg font-bold">SafeEdu</span>
        </div>
        <p className="text-center text-sm text-muted-foreground md:text-left">
          © 2025 SafeEdu.
        </p>
        <div className="flex gap-4">
          <Link
            className="text-sm font-medium hover:text-[#8BC34A]"
            href="/dieu-khoan"
          >
            Điều khoản
          </Link>
          <Link
            className="text-sm font-medium hover:text-[#8BC34A]"
            href="/chinh-sach-bao-mat"
          >
            Chính sách bảo mật
          </Link>
          <Link
            className="text-sm font-medium hover:text-[#8BC34A]"
            href="/#contact"
          >
            Liên hệ
          </Link>
        </div>
      </div>
    </footer>
  );
}

export default MarketingFooter;
