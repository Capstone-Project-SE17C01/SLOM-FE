import { BookOpen, Newspaper, Shapes } from "lucide-react";
import React from "react";

function FeatureSection() {
  const features = [
    {
      icon: <Shapes className="h-6 w-6 text-[#8BC34A]" />,
      title: "Tổ chức cuộc thi",
      description:
        "Tổ chức các cuộc thi học thuật và sáng tạo, khuyến khích học sinh phát triển toàn diện.",
    },
    {
      icon: <Newspaper className="h-6 w-6 text-[#8BC34A]" />,
      title: "Tin tức",
      description:
        "Cập nhật tin tức mới nhất về giáo dục và các hoạt động học đường.",
    },
    {
      icon: <BookOpen className="h-6 w-6 text-[#8BC34A]" />,
      title: "Thư viện kiến thức",
      description:
        "Cung cấp tài liệu giáo dục toàn diện về các vấn đề xã hội và an toàn học đường.",
    },
  ];

  return (
    <section className="w-full py-12 md:py-24 lg:py-32" id="features">
      <div className="container px-4 md:px-6 m-auto">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <div className="inline-block rounded-lg bg-[#8BC34A] px-3 py-1 text-sm text-white">
              Tính năng nổi bật
            </div>
            <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
              Bảo vệ và giáo dục toàn diện
            </h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              SafeEdu cung cấp các công cụ và tài nguyên giáo dục để bảo vệ học
              sinh và xây dựng môi trường học tập an toàn.
            </p>
          </div>
        </div>
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <div
              key={index}
              className="flex flex-col items-center space-y-4 rounded-lg border p-6"
            >
              <div className="rounded-full bg-[#8BC34A]/10 p-4">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold">{feature.title}</h3>
              <p className="text-center text-muted-foreground">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default FeatureSection;
