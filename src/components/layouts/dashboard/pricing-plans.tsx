"use client";

import { useState, useEffect } from "react";
import { useTheme } from "@/contexts/ThemeContext";
import { cn } from "@/utils/cn";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Check } from "lucide-react";
import { useGetAllPlanQuery } from "@/features/auth/api";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useCreatePaymentLinkMutation } from "@/features/auth/api";
import constants from "@/settings/constants";
import {
  APIResponse,
  CreatePaymentLinkResponseDTO,
  SubscriptionPlanDTO,
} from "@/features/auth/types";
import Cookies from "js-cookie";

export default function PricingPlans() {
  const { isDarkMode } = useTheme();
  const router = useRouter();
  const [annual, setAnnual] = useState(false);
  const [durationPlan, setDurationPlan] = useState<number>(1);
  const [discount, setDiscount] = useState<number>(0);
  const [userInfo, setUserInfo] = useState<{id: string; email?: string; username?: string} | null>(null);
  const { data, error, isLoading } = useGetAllPlanQuery();
  const [createPaymentLinkMutation] = useCreatePaymentLinkMutation();

  useEffect(() => {
    const userInfoCookie = Cookies.get(constants.USER_INFO);
    if (userInfoCookie != null && userInfoCookie != "undefined") {
      setUserInfo(JSON.parse(userInfoCookie));
    }
  }, []);

  useEffect(() => {
    if (error) console.log(error);
  }, [isLoading, error]);

  useEffect(() => {
    setDurationPlan(annual ? 12 : 1);
    setDiscount(annual ? 20 : 0);
  }, [annual]);

  const handlePayment = async (
    e: React.FormEvent,
    planId: string,
    price: number
  ) => {
    e.preventDefault();
    try {
      if (!userInfo?.id) return toast.error("Not authenticated");

      const response = await createPaymentLinkMutation({
        subscriptionId: planId,
        userId: userInfo.id,
        paymentMethod: "PAYOS",
        status: "PENDING",
        durationMonth: durationPlan,
        returnUrl: constants.RETURN_URL + "?period=" + durationPlan,
        cancelUrl: constants.RETURN_URL + "?period=" + durationPlan,
        price,
        description: `Payment ${durationPlan > 1 ? "annual" : "monthly"} plan`,
      }).unwrap();

      const { result, errorMessages } =
        response as APIResponse<CreatePaymentLinkResponseDTO>;
      if (result?.checkoutUrl) {
        router.push(result.checkoutUrl);
      } else {
        console.log(errorMessages[0]);
      }
    } catch {
      console.log("Error creating payment link");
    }
  };

  const apiPlans: SubscriptionPlanDTO[] = Array.isArray(data?.result)
    ? data.result
    : [];

  return (
    <div
      className={cn(
        "py-20 px-4 sm:px-6 lg:px-8 mx-auto",
        isDarkMode ? "bg-gray-900" : "bg-gray-50"
      )}
    >
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Pricing Plans</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Choose the plan that best fits your sign language learning or
            teaching needs
          </p>

          <div className="flex items-center justify-center gap-2 mb-8">
            <span className={annual ? "text-muted-foreground" : "font-medium"}>
              Monthly
            </span>
            <Switch checked={annual} onCheckedChange={setAnnual} />
            <span className={!annual ? "text-muted-foreground" : "font-medium"}>
              Annual (Save 20%)
            </span>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {apiPlans.map((plan) => {
            const parsedFeatures: string[] = plan.features
              ? JSON.parse(plan.features)?.features
              : [];

            return (
              <Card
                key={plan.id}
                className={cn(
                  "relative overflow-hidden flex flex-col",
                  plan.name === "Professional Educator"
                    ? "border-2 border-primary shadow-lg"
                    : "",
                  isDarkMode ? "bg-gray-800" : "bg-white"
                )}
              >
                {plan.name === "Professional Educator" && (
                  <div className="absolute top-0 right-0 bg-primary text-primary-foreground px-3 py-1 text-xs font-medium">
                    Most Popular
                  </div>
                )}
                <CardHeader>
                  <CardTitle>{plan.name}</CardTitle>
                  <CardDescription>{plan.description}</CardDescription>
                  <div className="mt-4">
                    <span className="text-3xl font-bold">
                      ₫
                      {Math.round(
                        plan.price * durationPlan * (1 - discount / 100)
                      )}
                    </span>
                    <span className="text-muted-foreground ml-2">
                      {annual ? "/year" : "/month"}
                    </span>
                    {discount > 0 && (
                      <span className="text-sm text-green-500 ml-2">
                        (-{discount}%)
                      </span>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="flex-grow">
                  <ul className="space-y-3">
                    {parsedFeatures.map((feature, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-primary" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter className="mt-auto">
                  <Button
                    className={
                      plan.name === "Professional Educator"
                        ? "w-full bg-primary hover:bg-primary/90"
                        : "w-full"
                    }
                    variant={
                      plan.name === "Professional Educator"
                        ? "default"
                        : "outline"
                    }
                    onClick={(e) => handlePayment(e, plan.id, plan.price)}
                  >
                    Get Started
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>

        <div className="text-center mt-12">
          <p className="text-muted-foreground">
            All plans include a 14-day free trial. No credit card required to
            start.
          </p>
          <p className="mt-2">
            Need a custom solution for your organization?{" "}
            <a href="#" className="underline text-primary">
              Contact us
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
