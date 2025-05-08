"use client";

import { useTheme } from "@/contexts/ThemeContext";
import { cn } from "@/utils/cn";
import { Button } from "@/components/ui/button";
import { VideoIcon, Users, BookOpen, Globe } from "lucide-react";
import PricingPlans from "@/components/layouts/dashboard/pricing-plans";
import { useTranslations } from 'next-intl';

export default function TrangChuPage() {
  const { isDarkMode } = useTheme();
  const t = useTranslations('home');

  const features = [
    {
      icon: <VideoIcon className="h-10 w-10" />,
      title: t('features.video.title'),
      description: t('features.video.description')
    },
    {
      icon: <Users className="h-10 w-10" />,
      title: t('features.classroom.title'),
      description: t('features.classroom.description')
    },
    {
      icon: <BookOpen className="h-10 w-10" />,
      title: t('features.materials.title'),
      description: t('features.materials.description')
    },
    {
      icon: <Globe className="h-10 w-10" />,
      title: t('features.community.title'),
      description: t('features.community.description')
    }
  ];

  return (
    <>
      <div className="p-4">
        {/* Hero Section */}
        <section className={cn(
          "py-16 px-4 sm:px-6 lg:px-8 text-center",
          isDarkMode ? "bg-black" : "bg-gray-50"
        )}>
          <div className="max-w-3xl mx-auto">
            <h1 className="text-4xl font-extrabold sm:text-5xl">
              {t('hero.title')} <span className="text-black dark:text-white bg-yellow-300 px-2">SLOM</span>
            </h1>
            <p className={cn(
              "mt-6 text-xl",
              isDarkMode ? "text-gray-300" : "text-gray-500"
            )}>
              {t('hero.subtitle')}
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Button size="lg" className="bg-black hover:bg-gray-800 text-white">
                {t('hero.cta')}
              </Button>
              <Button size="lg" variant="outline" className={cn(
                isDarkMode ? "bg-gray-800 text-white hover:bg-gray-700 border-gray-700" : 
                "bg-white text-gray-900 hover:bg-gray-100 border-gray-300"
              )}>
                {t('hero.demo')}
              </Button>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">{t('how.title')}</h2>
            
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="relative h-64 md:h-80 rounded-lg overflow-hidden shadow-lg">
                {/* Placeholder for video/screenshot of the platform */}
                <div className={cn(
                  "absolute inset-0 flex items-center justify-center",
                  isDarkMode ? "bg-gray-800" : "bg-gray-200"
                )}>
                  <span className="text-2xl font-medium">{t('how.demo')}</span>
                </div>
              </div>
              
              <div className="space-y-6">
                <div className="flex gap-3">
                  <div className={cn(
                    "flex h-10 w-10 shrink-0 items-center justify-center rounded-full",
                    isDarkMode ? "bg-gray-700" : "bg-primary/10"
                  )}>
                    <span className="font-bold">1</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-medium">{t('how.step1.title')}</h3>
                    <p className="text-muted-foreground">{t('how.step1.description')}</p>
                  </div>
                </div>
                
                <div className="flex gap-3">
                  <div className={cn(
                    "flex h-10 w-10 shrink-0 items-center justify-center rounded-full",
                    isDarkMode ? "bg-gray-700" : "bg-primary/10"
                  )}>
                    <span className="font-bold">2</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-medium">{t('how.step2.title')}</h3>
                    <p className="text-muted-foreground">{t('how.step2.description')}</p>
                  </div>
                </div>
                
                <div className="flex gap-3">
                  <div className={cn(
                    "flex h-10 w-10 shrink-0 items-center justify-center rounded-full",
                    isDarkMode ? "bg-gray-700" : "bg-primary/10"
                  )}>
                    <span className="font-bold">3</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-medium">{t('how.step3.title')}</h3>
                    <p className="text-muted-foreground">{t('how.step3.description')}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className={cn(
          "py-16 px-4 sm:px-6 lg:px-8",
          isDarkMode ? "bg-gray-900" : "bg-white"
        )}>
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">{t('features.title')}</h2>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => (
                <div key={index} className={cn(
                  "p-6 rounded-lg",
                  isDarkMode ? "bg-gray-800" : "bg-gray-50"
                )}>
                  <div className={cn(
                    "p-3 w-14 h-14 rounded-lg flex items-center justify-center mb-4",
                    isDarkMode ? "bg-gray-700 text-primary" : "bg-primary/10 text-primary"
                  )}>
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
            <h2 className="text-3xl font-bold text-center mb-12">{t('testimonials.title')}</h2>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div className={cn(
                "p-6 rounded-lg",
                isDarkMode ? "bg-gray-800 border border-gray-700" : "bg-white border border-gray-200 shadow-sm"
              )}>
                <p className="italic mb-4">{t('testimonials.quote1')}</p>
                <div className="flex items-center">
                  <div className="h-10 w-10 rounded-full bg-gray-300 mr-3"></div>
                  <div>
                    <p className="font-medium">{t('testimonials.author1')}</p>
                    <p className="text-sm text-muted-foreground">{t('testimonials.position1')}</p>
                  </div>
                </div>
              </div>
              
              <div className={cn(
                "p-6 rounded-lg",
                isDarkMode ? "bg-gray-800 border border-gray-700" : "bg-white border border-gray-200 shadow-sm"
              )}>
                <p className="italic mb-4">{t('testimonials.quote2')}</p>
                <div className="flex items-center">
                  <div className="h-10 w-10 rounded-full bg-gray-300 mr-3"></div>
                  <div>
                    <p className="font-medium">{t('testimonials.author2')}</p>
                    <p className="text-sm text-muted-foreground">{t('testimonials.position2')}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className={cn(
          "py-16 px-4 sm:px-6 lg:px-8 text-center rounded-lg my-8",
          isDarkMode ? "bg-gray-800" : "bg-primary/10"
        )}>
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold mb-4">{t('cta.title')}</h2>
            <p className="text-xl text-muted-foreground mb-8">
              {t('cta.description')}
            </p>
            <Button size="lg" className="bg-black hover:bg-gray-800 text-white">
              {t('cta.button')}
            </Button>
          </div>
        </section>
      </div>
      <PricingPlans />
    </>
  );
}
