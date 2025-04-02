import React from "react";

import HeroSection from "@/features/marketing/components/hero";
import FeatureSection from "@/features/marketing/components/features";
import ProductSection from "@/features/marketing/components/product";
import ContentPreview from "@/features/marketing/components/content-preview";
import Contact from "@/features/marketing/components/contact";
import Coverage from "@/features/marketing/components/coverage";

export const metadata = {
  title: "Giới thiệu",
  description:
    "Khám phá các giải pháp giáo dục toàn diện và nội dung giáo dục đa dạng của SafeEdu.",
  openGraph: {
    title: "Giới thiệu",
    description:
      "Khám phá các giải pháp giáo dục toàn diện và nội dung giáo dục đa dạng của SafeEdu.",
    url: "https://www.safe-edu.site/",
    images: [
      {
        url: "/images/logo/logo.png",
        width: 800,
        height: 600,
        alt: "SafeEdu Marketing",
      },
    ],
  },
};

function MarketingPage() {
  return (
    <>
      <HeroSection />
      <FeatureSection />
      <ProductSection />
      <ContentPreview />
      <Coverage />
      <Contact />
    </>
  );
}

export default MarketingPage;
