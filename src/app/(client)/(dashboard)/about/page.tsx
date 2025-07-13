"use client";


import { cn } from "@/utils/cn";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTranslations } from "next-intl";
import { useTheme } from "@/contexts/ThemeContext";

export default function AboutPage() {
  const { isDarkMode } = useTheme();
  const t = useTranslations("aboutPage");

  const team = [
    {
      name: "Nguyen Van Minh",
      role: t("ceo"),
      image: "https://i.pravatar.cc/150?u=minh",
      initials: "NVM",
    },
    {
      name: "Tran Thi Lan",
      role: t("expert"),
      image: "https://i.pravatar.cc/150?u=lan",
      initials: "TTL",
    },
    {
      name: "Le Quoc Bao",
      role: t("leadDev"),
      image: "https://i.pravatar.cc/150?u=bao",
      initials: "LQB",
    },
    {
      name: "Pham Mai Anh",
      role: t("accessibility"),
      image: "https://i.pravatar.cc/150?u=anh",
      initials: "PMA",
    },
  ];

  return (
    <div className="container max-w-5xl py-8 mx-auto text-center">
      {/* Company Story */}
      <section className="mb-16">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl mb-4">
          {t("ourStory")}
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
          {t("ourStoryDesc")}
        </p>

        <div
          className={cn(
            "p-8 rounded-lg mx-auto text-left",
            isDarkMode ? "bg-gray-800 border border-gray-700" : "bg-gray-50"
          )}
        >
          <p className="mb-4">{t("story1")}</p>
          <p className="mb-4">{t("story2")}</p>
          <p>{t("story3")}</p>
        </div>
      </section>

      {/* Mission & Values */}
      <section className="mb-16">
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <Card
            className={cn(
              "border text-left",
              isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white"
            )}
          >
            <CardHeader>
              <CardTitle className="text-2xl">{t("mission")}</CardTitle>
            </CardHeader>
            <CardContent>
              <p>{t("missionDesc")}</p>
            </CardContent>
          </Card>

          <Card
            className={cn(
              "border text-left",
              isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white"
            )}
          >
            <CardHeader>
              <CardTitle className="text-2xl">{t("vision")}</CardTitle>
            </CardHeader>
            <CardContent>
              <p>{t("visionDesc")}</p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Team Section */}
      <section>
        <div className="mb-10">
          <h2 className="text-3xl font-bold">{t("meetTeam")}</h2>
          <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">
            {t("teamDesc")}
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
          {team.map((member, index) => (
            <div key={index} className="flex flex-col items-center">
              <Avatar className="h-24 w-24 mb-3">
                <AvatarImage src={member.image} alt={member.name} />
                <AvatarFallback>{member.initials}</AvatarFallback>
              </Avatar>
              <h3 className="font-medium text-lg">{member.name}</h3>
              <p className="text-sm text-muted-foreground">{member.role}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
