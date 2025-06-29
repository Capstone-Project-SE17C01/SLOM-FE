"use client";

import { useState } from "react";
import { useTheme } from "@/contexts/ThemeContext";
import { cn } from "@/utils/cn";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { MapPin, Mail, Phone, MessageSquare } from "lucide-react";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import { useCreateFeedbackMutation } from "@/features/feedback/api";

export default function ContactPage() {
  const { isDarkMode } = useTheme();
  const t = useTranslations("contactPage");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [createFeedback] = useCreateFeedbackMutation();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await createFeedback(formData).unwrap();
      toast.success(t("success"));
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
      });
    } catch {
      toast.error(t("error") || "Gửi phản hồi thất bại");
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactInfo = [
    {
      icon: <MapPin className="h-5 w-5" />,
      title: t("location"),
      details: t("locationDetails"),
    },
    {
      icon: <Mail className="h-5 w-5" />,
      title: t("email"),
      details: t("emailDetails"),
    },
    {
      icon: <Phone className="h-5 w-5" />,
      title: t("phone"),
      details: t("phoneDetails"),
    },
    {
      icon: <MessageSquare className="h-5 w-5" />,
      title: t("videoSupport"),
      details: t("videoSupportDetails"),
    },
  ];

  return (
    <div className="container max-w-6xl py-8 mx-auto text-center">
      <div className="mb-12">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl mb-4">
          {t("title")}
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          {t("subtitle")}
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 mb-12 max-w-5xl mx-auto">
        {contactInfo.map((item, index) => (
          <div
            key={index}
            className={cn(
              "p-6 rounded-lg flex gap-4 border",
              isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white"
            )}
          >
            <div
              className={cn(
                "p-3 h-12 w-12 rounded-full flex items-center justify-center shrink-0",
                isDarkMode
                  ? "bg-gray-700 text-primary"
                  : "bg-primary/10 text-primary"
              )}
            >
              {item.icon}
            </div>
            <div className="text-left">
              <h3 className="font-medium text-lg mb-1">{item.title}</h3>
              <p className="text-muted-foreground">{item.details}</p>
            </div>
          </div>
        ))}
      </div>

      <Card
        className={cn(
          "border max-w-4xl mx-auto",
          isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white"
        )}
      >
        <CardHeader>
          <CardTitle>{t("formTitle")}</CardTitle>
          <CardDescription>{t("formDesc")}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name">{t("yourName")}</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">{t("emailAddress")}</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="space-y-2 text-left">
              <Label htmlFor="subject">{t("subject")}</Label>
              <Input
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2 text-left">
              <Label htmlFor="message">{t("message")}</Label>
              <Textarea
                id="message"
                name="message"
                rows={5}
                value={formData.message}
                onChange={handleChange}
                required
              />
            </div>

            <div className="flex flex-wrap gap-4">
              <Button
                type="submit"
                className="w-full md:w-auto"
                disabled={isSubmitting}
              >
                {isSubmitting ? t("sending") : t("send")}
              </Button>

              <Button
                type="button"
                variant="outline"
                className="w-full md:w-auto"
              >
                {t("schedule")}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
