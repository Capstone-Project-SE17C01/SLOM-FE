"use client";

import React from "react";
import { Mail, MapPin, Phone } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";

function Contact() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32" id="contact">
      <div className="container px-4 md:px-6 mx-auto">
        <div className="grid gap-6 lg:grid-cols-2 lg:gap-12">
          <div className="flex flex-col justify-center space-y-4">
            <div className="space-y-2">
              <div className="inline-block rounded-lg bg-[#8BC34A] px-3 py-1 text-sm text-white">
                Liên hệ
              </div>
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
                Kết nối với chúng tôi
              </h2>
              <p className="text-muted-foreground md:text-xl/relaxed">
                Chúng tôi luôn sẵn sàng hỗ trợ và trả lời mọi thắc mắc của bạn.
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-start space-x-4">
                <MapPin className="h-5 w-5 text-[#8BC34A] mt-0.5" />
                <div>
                  <h3 className="font-bold">Địa chỉ</h3>
                  <p className="text-muted-foreground">
                    Khu đô thị FPT City, Ngũ Hành Sơn, Đà Nẵng
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <Mail className="h-5 w-5 text-[#8BC34A] mt-0.5" />
                <div>
                  <h3 className="font-bold">Email</h3>
                  <p className="text-muted-foreground">
                    thangtvb.dev@gmail.com
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <Phone className="h-5 w-5 text-[#8BC34A] mt-0.5" />
                <div>
                  <h3 className="font-bold">Điện thoại</h3>
                  <p className="text-muted-foreground">(+84) 828 828 497</p>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-lg border bg-background p-8">
            <form
              className="space-y-4"
              onSubmit={(e) => {
                e.preventDefault();
                // Reset form
                toast.success(
                  "Xin cảm ơn! Chúng tôi đã ghi nhận tin nhắn từ bạn và sẽ phản hồi sớm!"
                );
                e.currentTarget.reset();
              }}
            >
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <label
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    htmlFor="name"
                  >
                    Họ và tên
                  </label>
                  <input
                    required
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    id="name"
                    placeholder="Nhập họ và tên"
                  />
                </div>
                <div className="space-y-2">
                  <label
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    htmlFor="email"
                  >
                    Email
                  </label>
                  <input
                    required
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    id="email"
                    placeholder="Nhập địa chỉ email"
                    type="email"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  htmlFor="subject"
                >
                  Tiêu đề
                </label>
                <input
                  required
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  id="subject"
                  placeholder="Nhập tiêu đề"
                />
              </div>
              <div className="space-y-2">
                <label
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  htmlFor="message"
                >
                  Nội dung
                </label>
                <textarea
                  required
                  className="flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  id="message"
                  placeholder="Nhập nội dung tin nhắn"
                />
              </div>
              <Button
                className="w-full bg-[#8BC34A] hover:bg-[#7CB342]"
                type="submit"
              >
                Gửi tin nhắn
              </Button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Contact;
