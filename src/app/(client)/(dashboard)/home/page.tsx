"use client";

import { cn } from "@/utils/cn";
import { Button } from "@/components/ui/button";
import { VideoIcon, Users, BookOpen, Globe } from "lucide-react";
import PricingPlans from "@/components/layouts/dashboard/pricing-plans";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useTheme } from "@/contexts/ThemeContext";
import Chatbot from "@/components/ui/chatbot";

export default function TrangChuPage() {
  const { isDarkMode } = useTheme();
  const t = useTranslations("home");

  const features = [
    {
      icon: <VideoIcon className="h-10 w-10" />,
      title: t("features.video.title"),
      description: t("features.video.description"),
    },
    {
      icon: <Users className="h-10 w-10" />,
      title: t("features.classroom.title"),
      description: t("features.classroom.description"),
    },
    {
      icon: <BookOpen className="h-10 w-10" />,
      title: t("features.materials.title"),
      description: t("features.materials.description"),
    },
    {
      icon: <Globe className="h-10 w-10" />,
      title: t("features.community.title"),
      description: t("features.community.description"),
    },
  ];

  return (
    <>
      <div className="p-4">
        <Chatbot />
        <section
          className={cn(
            "relative py-16 px-4 sm:px-6 lg:px-8 text-center overflow-hidden rounded-xl"
          )}
        >
          <Image
            src="/images/banner.png"
            alt="Banner"
            layout="fill"
            objectFit="cover"
            className="absolute inset-0 z-0"
          />
          <div
            className={cn(
              "absolute inset-0 z-0",
              isDarkMode ? "bg-black/70" : "bg-black/50"
            )}
          ></div>
          <div className="relative z-10 max-w-3xl mx-auto">
            <h1 className="text-4xl font-extrabold sm:text-5xl text-white">
              WE ARE <span className="text-primary">SLOM</span>
            </h1>
            <p
              className={cn(
                "mt-6 text-xl",
                isDarkMode ? "text-gray-200" : "text-gray-100"
              )}
            >
              {t("hero.description")}
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              {/* Buttons can be added here if needed */}
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">
              {t("how.title")}
            </h2>

            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="relative h-64 md:h-80 rounded-lg overflow-hidden shadow-lg">
                {/* Placeholder for video/screenshot of the platform */}
                <video
                  className="absolute inset-0 w-full h-full object-cover"
                  src="/videos/demo.mp4"
                  controls
                  poster="/images/video-poster.png"
                >
                  {t("how.demo")}
                </video>
              </div>

              <div className="space-y-6">
                <div className="flex gap-3">
                  <div
                    className={cn(
                      "flex h-10 w-10 shrink-0 items-center justify-center rounded-full",
                      isDarkMode ? "bg-gray-700" : "bg-primary/10"
                    )}
                  >
                    <span className="font-bold">1</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-medium">
                      {t("how.step1.title")}
                    </h3>
                    <p className="text-muted-foreground">
                      {t("how.step1.description")}
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div
                    className={cn(
                      "flex h-10 w-10 shrink-0 items-center justify-center rounded-full",
                      isDarkMode ? "bg-gray-700" : "bg-primary/10"
                    )}
                  >
                    <span className="font-bold">2</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-medium">
                      {t("how.step2.title")}
                    </h3>
                    <p className="text-muted-foreground">
                      {t("how.step2.description")}
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div
                    className={cn(
                      "flex h-10 w-10 shrink-0 items-center justify-center rounded-full",
                      isDarkMode ? "bg-gray-700" : "bg-primary/10"
                    )}
                  >
                    <span className="font-bold">3</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-medium">
                      {t("how.step3.title")}
                    </h3>
                    <p className="text-muted-foreground">
                      {t("how.step3.description")}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section
          className={cn(
            "py-16 px-4 sm:px-6 lg:px-8",
            isDarkMode ? "bg-gray-900" : "bg-white"
          )}
        >
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">
              {t("features.title")}
            </h2>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className={cn(
                    "p-6 rounded-lg",
                    isDarkMode ? "bg-gray-800" : "bg-gray-50"
                  )}
                >
                  <div
                    className={cn(
                      "p-3 w-14 h-14 rounded-lg flex items-center justify-center mb-4",
                      isDarkMode
                        ? "bg-gray-700 text-primary"
                        : "bg-primary/10 text-primary"
                    )}
                  >
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-medium mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">
              {t("testimonials.title")}
            </h2>

            <div className="grid md:grid-cols-2 gap-8">
              <div
                className={cn(
                  "p-6 rounded-lg",
                  isDarkMode
                    ? "bg-gray-800 border border-gray-700"
                    : "bg-white border border-gray-200 shadow-sm"
                )}
              >
                <p className="italic mb-4">{t("testimonials.quote1")}</p>
                <div className="flex items-center">
                  <Image
                    src="/images/avatar-1.jpg"
                    alt="User Avatar"
                    width={40}
                    height={40}
                    className="rounded-full mr-3"                   
                  />
                  <div>
                    <p className="font-medium">{t("testimonials.author1")}</p>
                    <p className="text-sm text-muted-foreground">
                      {t("testimonials.position1")}
                    </p>
                  </div>
                </div>
              </div>

              <div
                className={cn(
                  "p-6 rounded-lg",
                  isDarkMode
                    ? "bg-gray-800 border border-gray-700"
                    : "bg-white border border-gray-200 shadow-sm"
                )}
              >
                <p className="italic mb-4">{t("testimonials.quote2")}</p>
                <div className="flex items-center">
                  <Image
                    src="/images/avatar-2.jpg"
                    alt="User Avatar"
                    width={40}
                    height={40}
                    className="rounded-full mr-3"                   
                  />
                  <div>
                    <p className="font-medium">{t("testimonials.author2")}</p>
                    <p className="text-sm text-muted-foreground">
                      {t("testimonials.position2")}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section
          className={cn(
            "py-16 px-4 sm:px-6 lg:px-8 text-center rounded-lg my-8",
            isDarkMode ? "bg-gray-800" : "bg-primary/10"
          )}
        >
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold mb-4">{t("cta.title")}</h2>
            <p className="text-xl text-muted-foreground mb-8">
              {t("cta.description")}
            </p>
            <Button
              size="lg"
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              {t("cta.button")}
            </Button>
          </div>
        </section>
      </div>
      <PricingPlans />
    </>
  );
}
