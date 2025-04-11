"use client";

import { useState } from "react";
import { useTheme } from "@/contexts/ThemeContext";
import { cn } from "@/utils/cn";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Check } from "lucide-react";

export default function PricingPlans() {
  const { isDarkMode } = useTheme();
  const [annual, setAnnual] = useState(false);

  const plans = [
    {
      name: "Individual Learner",
      description: "Perfect for independent sign language learners",
      monthlyPrice: "200,000",
      annualPrice: "1,920,000",
      features: [
        "Access to all sign language lessons",
        "Join up to 5 group sessions per month",
        "HD video quality",
        "Basic learning materials"
      ],
      popular: false
    },
    {
      name: "Professional Educator",
      description: "For sign language teachers and tutors",
      monthlyPrice: "500,000",
      annualPrice: "4,800,000",
      features: [
        "Create and host unlimited classes",
        "Advanced teaching tools",
        "Student progress tracking",
        "Comprehensive resource library",
        "Premium video quality",
        "Recording and playback"
      ],
      popular: true
    },
    {
      name: "Institution",
      description: "For schools and organizations",
      monthlyPrice: "2,000,000",
      annualPrice: "19,200,000",
      features: [
        "Multiple educator accounts",
        "Administrative dashboard",
        "Custom branding options",
        "API access for integration",
        "Priority support",
        "Advanced analytics",
        "Enterprise-grade security"
      ],
      popular: false
    }
  ];

  return (
    <div className={cn(
      "py-20 px-4 sm:px-6 lg:px-8 mx-auto",
      isDarkMode ? "bg-gray-900" : "bg-gray-50"
    )}>
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Pricing Plans</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Choose the plan that best fits your sign language learning or teaching needs
          </p>
          
          <div className="flex items-center justify-center gap-2 mb-8">
            <span className={annual ? "text-muted-foreground" : "font-medium"}>Monthly</span>
            <Switch checked={annual} onCheckedChange={setAnnual} />
            <span className={!annual ? "text-muted-foreground" : "font-medium"}>Annual (Save 20%)</span>
          </div>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <Card key={index} className={cn(
              "relative overflow-hidden",
              plan.popular ? "border-2 border-primary shadow-lg" : "",
              isDarkMode ? "bg-gray-800" : "bg-white"
            )}>
              {plan.popular && (
                <div className="absolute top-0 right-0 bg-primary text-primary-foreground px-3 py-1 text-xs font-medium">
                  Most Popular
                </div>
              )}
              <CardHeader>
                <CardTitle>{plan.name}</CardTitle>
                <CardDescription>{plan.description}</CardDescription>
                <div className="mt-4">
                  <span className="text-3xl font-bold">₫{annual ? plan.annualPrice : plan.monthlyPrice}</span>
                  <span className="text-muted-foreground ml-2">{annual ? "/year" : "/month"}</span>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-primary" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button 
                  className={plan.popular ? "w-full bg-primary hover:bg-primary/90" : "w-full"} 
                  variant={plan.popular ? "default" : "outline"}
                >
                  {plan.popular ? "Start Free Trial" : "Get Started"}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
        
        <div className="text-center mt-12">
          <p className="text-muted-foreground">
            All plans include a 14-day free trial. No credit card required to start.
          </p>
          <p className="mt-2">
            Need a custom solution for your organization? <a href="#" className="underline text-primary">Contact us</a>
          </p>
        </div>
      </div>
    </div>
  );
}
