"use client";

import { useTheme } from "@/contexts/ThemeContext";
import { cn } from "@/utils/cn";
import { ArrowRight, VideoIcon, Users, MessageSquare, BookOpen, Calendar, Subtitles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function FeaturesPage() {
  const { isDarkMode } = useTheme();

  const features = [
    {
      icon: <VideoIcon className="h-10 w-10" />,
      title: "High-Quality Video Optimization",
      description: "Crisp, clear video optimized specifically for sign language movements with reduced latency and adjustable frame rates."
    },
    {
      icon: <Subtitles className="h-10 w-10" />,
      title: "Real-time Captioning",
      description: "AI-powered live captioning and transcription to enhance communication between hearing and deaf participants."
    },
    {
      icon: <Users className="h-10 w-10" />,
      title: "Interactive Classrooms",
      description: "Virtual classrooms designed for sign language instruction with specialized teacher tools and breakout rooms."
    },
    {
      icon: <MessageSquare className="h-10 w-10" />,
      title: "Visual Communication Tools",
      description: "Integrated chat with emoji support, visual reaction buttons, and drawing tools for effective communication."
    },
    {
      icon: <BookOpen className="h-10 w-10" />,
      title: "Learning Resources",
      description: "Built-in sign language dictionary, lesson plans, and practice materials for students and educators."
    },
    {
      icon: <Calendar className="h-10 w-10" />,
      title: "Scheduling & Recordings",
      description: "Easy scheduling for classes, private tutoring, and automatic recording with searchable transcripts for later review."
    }
  ];

  return (
    <div className="container max-w-6xl py-8">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl mb-4">
          Features Designed for Sign Language Communication
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          SLOM provides specialized tools to make online sign language learning and communication 
          accessible and effective for everyone.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {features.map((feature, index) => (
          <Card key={index} className={cn(
            "border transition-all hover:-translate-y-1 hover:shadow-md",
            isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white"
          )}>
            <CardHeader>
              <div className={cn(
                "p-2 w-14 h-14 rounded-lg flex items-center justify-center mb-4",
                isDarkMode ? "bg-gray-700 text-primary" : "bg-primary/10 text-primary"
              )}>
                {feature.icon}
              </div>
              <CardTitle>{feature.title}</CardTitle>
              <CardDescription>{feature.description}</CardDescription>
            </CardHeader>
          </Card>
        ))}
      </div>

      <div className={cn(
        "mt-16 p-8 rounded-xl text-center",
        isDarkMode ? "bg-gray-800 border border-gray-700" : "bg-gray-50"
      )}>
        <h2 className="text-3xl font-bold mb-4">Ready to enhance sign language communication?</h2>
        <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
          Join thousands of users who are already breaking communication barriers with SLOM.
        </p>
        <Button size="lg" className="gap-2 group">
          Start Free Trial
          <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
        </Button>
      </div>
    </div>
  );
}