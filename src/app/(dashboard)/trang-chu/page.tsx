"use client";

import { useTheme } from "@/contexts/ThemeContext";
import { cn } from "@/utils/cn";
import { Button } from "@/components/ui/button";
import { VideoIcon, Users, BookOpen, Globe } from "lucide-react";
import PricingPlans from "@/components/layouts/dashboard/pricing-plans";

export default function TrangChuPage() {
  const { isDarkMode } = useTheme();

  const features = [
    {
      icon: <VideoIcon className="h-10 w-10" />,
      title: "HD Video Optimized for Sign Language",
      description: "Our platform is specifically designed to capture the nuances of sign language with smooth, high-definition video."
    },
    {
      icon: <Users className="h-10 w-10" />,
      title: "Interactive Virtual Classrooms",
      description: "Learn and teach sign language in real-time with specialized tools for visual communication."
    },
    {
      icon: <BookOpen className="h-10 w-10" />,
      title: "Comprehensive Learning Materials",
      description: "Access our library of sign language resources, practice exercises, and recorded lessons."
    },
    {
      icon: <Globe className="h-10 w-10" />,
      title: "Connect With the Signing Community",
      description: "Join a growing community of deaf, hard of hearing, and hearing individuals learning to communicate."
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
              Breaking Communication Barriers with <span className="text-black dark:text-white bg-yellow-300 px-2">SLOM</span>
            </h1>
            <p className={cn(
              "mt-6 text-xl",
              isDarkMode ? "text-gray-300" : "text-gray-500"
            )}>
              The first online meeting platform optimized for sign language communication and learning
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Button size="lg" className="bg-black hover:bg-gray-800 text-white">
                Start Free Trial
              </Button>
              <Button size="lg" variant="outline" className={cn(
                isDarkMode ? "bg-gray-800 text-white hover:bg-gray-700 border-gray-700" : 
                "bg-white text-gray-900 hover:bg-gray-100 border-gray-300"
              )}>
                Watch Demo
              </Button>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">How SLOM Works</h2>
            
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="relative h-64 md:h-80 rounded-lg overflow-hidden shadow-lg">
                {/* Placeholder for video/screenshot of the platform */}
                <div className={cn(
                  "absolute inset-0 flex items-center justify-center",
                  isDarkMode ? "bg-gray-800" : "bg-gray-200"
                )}>
                  <span className="text-2xl font-medium">Platform Demo</span>
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
                    <h3 className="text-xl font-medium">Create or Join a Meeting</h3>
                    <p className="text-muted-foreground">Schedule a class or join an existing session with a simple link.</p>
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
                    <h3 className="text-xl font-medium">Communicate Visually</h3>
                    <p className="text-muted-foreground">Use our optimized video platform designed specifically for sign language.</p>
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
                    <h3 className="text-xl font-medium">Learn and Practice</h3>
                    <p className="text-muted-foreground">Access resources, record sessions, and track your progress.</p>
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
            <h2 className="text-3xl font-bold text-center mb-12">Key Features</h2>
            
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
            <h2 className="text-3xl font-bold text-center mb-12">What Our Users Say</h2>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div className={cn(
                "p-6 rounded-lg",
                isDarkMode ? "bg-gray-800 border border-gray-700" : "bg-white border border-gray-200 shadow-sm"
              )}>
                <p className="italic mb-4">&quot;SLOM has transformed how I teach Vietnamese Sign Language. The video quality and classroom tools are specifically designed for our needs.&quot;</p>
                <div className="flex items-center">
                  <div className="h-10 w-10 rounded-full bg-gray-300 mr-3"></div>
                  <div>
                    <p className="font-medium">Nguyen Thi Mai</p>
                    <p className="text-sm text-muted-foreground">Sign Language Instructor</p>
                  </div>
                </div>
              </div>
              
              <div className={cn(
                "p-6 rounded-lg",
                isDarkMode ? "bg-gray-800 border border-gray-700" : "bg-white border border-gray-200 shadow-sm"
              )}>
                <p className="italic mb-4">&quot;As a deaf student, SLOM gives me equal access to education. The platform is intuitive and designed with our community in mind.&quot;</p>
                <div className="flex items-center">
                  <div className="h-10 w-10 rounded-full bg-gray-300 mr-3"></div>
                  <div>
                    <p className="font-medium">Tran Van Hoang</p>
                    <p className="text-sm text-muted-foreground">University Student</p>
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
            <h2 className="text-3xl font-bold mb-4">Ready to start your sign language journey?</h2>
            <p className="text-xl text-muted-foreground mb-8">
              Choose the plan that&apos;s right for you and start connecting through sign language today.
            </p>
            <Button size="lg" className="bg-black hover:bg-gray-800 text-white">
              View Pricing Plans
            </Button>
          </div>
        </section>
      </div>
      <PricingPlans />
    </>
  );
}
