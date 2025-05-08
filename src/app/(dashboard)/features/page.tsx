"use client";

import { useTheme } from "@/contexts/ThemeContext";
import { cn } from "@/utils/cn";
import {
  ArrowRight,
  VideoIcon,
  Users,
  MessageSquare,
  BookOpen,
  Calendar,
  Subtitles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useTranslations } from "next-intl";

export default function FeaturesPage() {
  const { isDarkMode } = useTheme();
  const t = useTranslations("featuresPage");

  const features = [
    { icon: <VideoIcon className="h-10 w-10" />, key: "videoFeature" },
    { icon: <Subtitles className="h-10 w-10" />, key: "subtitlesFeature" },
    { icon: <Users className="h-10 w-10" />, key: "usersFeature" },
    { icon: <MessageSquare className="h-10 w-10" />, key: "messageFeature" },
    { icon: <BookOpen className="h-10 w-10" />, key: "bookFeature" },
    { icon: <Calendar className="h-10 w-10" />, key: "calendarFeature" },
  ];

  return (
    <div className="container max-w-6xl py-8">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl mb-4">
          {t("hero.title")}
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          {t("hero.subtitle")}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {features.map((feature, index) => (
          <Card
            key={index}
            className={cn(
              "border transition-all hover:-translate-y-1 hover:shadow-md",
              isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white"
            )}
          >
            <CardHeader>
              <div
                className={cn(
                  "p-2 w-14 h-14 rounded-lg flex items-center justify-center mb-4",
                  isDarkMode
                    ? "bg-gray-700 text-primary"
                    : "bg-primary/10 text-primary"
                )}
              >
                {feature.icon}
              </div>
              <CardTitle>{t(`${feature.key}.title`)}</CardTitle>
              <CardDescription>
                {t(`${feature.key}.description`)}
              </CardDescription>
            </CardHeader>
          </Card>
        ))}
      </div>

      <div
        className={cn(
          "mt-16 p-8 rounded-xl text-center",
          isDarkMode ? "bg-gray-800 border border-gray-700" : "bg-gray-50"
        )}
      >
        <h2 className="text-3xl font-bold mb-4">{t("hero.ready")}</h2>
        <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
          {t("hero.readySub")}
        </p>
        <Button size="lg" className="gap-2 group">
          {t("hero.cta")}
          <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
        </Button>
      </div>
    </div>
  );
}
