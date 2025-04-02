import { ChevronRight } from "lucide-react";
import Image from "next/image";
import React from "react";

function Coverage() {
  const newsCards = [
    {
      logo: {
        alt: "VTV Logo",
        src: "https://cdn-images.vtv.vn/web_images/vtv120.png",
      },
      date: "05/11/2024",
      title: "Ứng dụng CNTT vào dự án &quot;Trường học không ma túy&quot;",
      content:
        "&quot;Dự án SafeEdu đã ứng dụng công nghệ thông tin hiệu quả vào việc phòng chống ma túy trong trường học, cung cấp các công cụ giáo dục và nhận diện sớm các nguy cơ...&quot;",
      link: "https://vtv.vn/cong-nghe/ung-dung-cntt-vao-du-an-truong-hoc-khong-ma-tuy-20241105152003095.htm",
    },
    {
      logo: {
        alt: "Dân Trí Logo",
        src: "https://cdnweb.dantri.com.vn/dist/static-avatar-default.1-0-1.b474c6ca2d1abee5b89b.png",
      },
      date: "05/11/2024",
      title:
        "Trường ĐH FPT nhận vé vào chung kết cuộc thi &quot;Trường học không ma túy&quot; 2024",
      content:
        "&quot;Với ứng dụng SafeEdu, đội thi của Trường Đại học FPT đã xuất sắc lọt vào vòng chung kết cuộc thi &apos;Trường học không ma túy&apos; 2024. Ứng dụng này cung cấp các giải pháp giáo dục và phòng chống ma túy hiệu quả...&quot;",
      link: "https://dantri.com.vn/giao-duc/truong-dh-fpt-nhan-ve-vao-chung-ket-cuoc-thi-truong-hoc-khong-ma-tuy-2024-20241105100835650.htm",
    },
    {
      logo: {
        alt: "FPT Edu Logo",
        src: "https://fpt.edu.vn/icon.png",
      },
      date: "05/11/2024",
      title:
        "Trường ĐH FPT nhận vé vào chung kết cuộc thi &quot;Trường học không ma túy&quot; 2024",
      content:
        "&quot;Dự án SafeEdu của sinh viên Trường Đại học FPT đã được đánh giá cao về tính sáng tạo và khả năng ứng dụng thực tiễn trong việc phòng chống ma túy học đường. Ứng dụng này đã giúp đội thi xuất sắc lọt vào vòng chung kết...&quot;",
      link: "https://fpt.edu.vn/tin-tuc/fpt-edu-tin-tuc-chung/truong-dh-fpt-nhan-ve-vao-chung-ket-cuoc-thi-truong-hoc-khong-ma-tuy-2024",
    },
  ];

  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-muted" id="coverage">
      <div className="container px-4 md:px-6  m-auto">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <div className="inline-block rounded-lg bg-[#8BC34A] px-3 py-1 text-sm text-white">
              Báo chí
            </div>
            <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
              Truyền thông nói gì về chúng tôi
            </h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              SafeEdu tự hào được các cơ quan báo chí uy tín đưa tin về dự án
              &quot;Trường học không ma túy&quot;.
            </p>
          </div>
        </div>

        <div className="mx-auto max-w-5xl py-12">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {newsCards.map((card, index) => (
              <div
                key={index}
                className="flex flex-col space-y-4 rounded-lg border bg-background p-6"
              >
                <div className="flex items-center justify-between">
                  <div className="h-8 w-8 relative">
                    <Image
                      fill
                      alt={card.logo.alt}
                      className="object-contain"
                      src={card.logo.src}
                    />
                  </div>
                  <p className="text-sm text-muted-foreground">{card.date}</p>
                </div>
                <h3
                  dangerouslySetInnerHTML={{ __html: card.title }}
                  className="text-lg font-bold leading-tight"
                />
                <p
                  dangerouslySetInnerHTML={{ __html: card.content }}
                  className="text-sm text-muted-foreground line-clamp-4 flex-1"
                />
                <div className="mt-auto pt-4">
                  <a
                    className="inline-flex items-center text-sm font-medium text-[#8BC34A] hover:underline"
                    href={card.link}
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    Đọc thêm <ChevronRight className="ml-1 h-4 w-4" />
                  </a>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 flex justify-center">
            <div className="relative w-full rounded-lg overflow-hidden shadow-lg">
              <Image
                alt="Bài báo về dự án Trường học không ma túy"
                className="w-full object-cover"
                height={600}
                src="https://cdnphoto.dantri.com.vn/G2VebhxJzjieIU7RyA4Um4vxjLo=/2024/11/05/content-02-pr-svfu-tham-gia-cuoc-thi-phong-chong-ma-tuy-anh-1-1730775937410.jpg"
                width={1200}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-6">
                <div className="text-white">
                  <p className="text-sm mb-2">VTV - 05/11/2024</p>
                  <h3 className="text-xl md:text-2xl font-bold mb-2">
                    Ứng dụng CNTT vào dự án &quot;Trường học không ma túy&quot;
                  </h3>
                  <p className="text-sm md:text-base mb-4 max-w-3xl">
                    Dự án SafeEdu đã thành công trong việc ứng dụng công nghệ
                    thông tin vào công tác phòng chống ma túy trong trường học,
                    mang lại hiệu quả thiết thực trong việc nâng cao nhận thức
                    và kỹ năng phòng chống ma túy cho học sinh, sinh viên.
                  </p>
                  <a
                    className="inline-flex items-center text-white bg-[#8BC34A] px-4 py-2 rounded-md hover:bg-[#7CB342]"
                    href="https://vtv.vn/cong-nghe/ung-dung-cntt-vao-du-an-truong-hoc-khong-ma-tuy-20241105152003095.htm"
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    Xem bài viết đầy đủ{" "}
                    <ChevronRight className="ml-1 h-4 w-4" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Coverage;
