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
import { useGetAllPlanQuery } from "@/api/AuthApi";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useCreatePaymentLinkMutation } from "@/api/AuthApi";
import constants from "@/config/constants";
import {
  APIResponse,
  CreatePaymentLinkResponseDTO,
  SubscriptionPlanDTO,
} from "@/types/IAuth";
import { useTranslations } from "next-intl";
import { useSelector } from "react-redux";
import { RootState } from "@/middleware/store";

export default function PricingPlans() {
  const { isDarkMode } = useTheme();
  const router = useRouter();
  const [annual, setAnnual] = useState(false);
  const [durationPlan, setDurationPlan] = useState<number>(1);
  const [discount, setDiscount] = useState<number>(0);
  const { data, error, isLoading } = useGetAllPlanQuery();
  const [createPaymentLinkMutation] = useCreatePaymentLinkMutation();
  const t_pricing = useTranslations("pricing");
  const t_error_dashboard = useTranslations("errorMessages.errorDashboard");
  const t_error_payment = useTranslations("errorMessages.paymentError");
  const userInfo = useSelector((state: RootState) => state.auth.userInfo);

  useEffect(() => {
    if (error) console.error(t_error_payment("failGetplan"));
  }, [isLoading, error, t_error_payment]);

  useEffect(() => {
    setDurationPlan(annual ? 12 : 1);
    setDiscount(annual ? 20 : 0);
  }, [annual]);

  const handlePayment = async (
    e: React.FormEvent,
    planId: string,
    price: number,
    planName: string
  ) => {
    e.preventDefault();
    try {
      if (!userInfo?.id)
        return toast.error(t_error_dashboard("notAuthenticated"));

      const response = await createPaymentLinkMutation({
        subscriptionId: planId,
        userId: userInfo.id,
        productName: t_pricing(`${planName}.title`),
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
        console.error(t_error_payment(errorMessages[0]));
      }
    } catch {
      console.error(t_error_payment("errorCreatePaymentLink"));
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
          <h2 className="text-4xl font-bold mb-4">{t_pricing("title")}</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            {t_pricing("description")}
          </p>

          <div className="flex items-center justify-center gap-2 mb-8">
            <span className={annual ? "text-muted-foreground" : "font-medium"}>
              {t_pricing("monthly")}
            </span>
            <Switch checked={annual} onCheckedChange={setAnnual} />
            <span className={!annual ? "text-muted-foreground" : "font-medium"}>
              {t_pricing("annual")}
            </span>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {apiPlans
            .map((plan) => {
              const parsedFeatures: string[] = plan.features
                ? JSON.parse(plan.features)?.features
                : [];

              return (
                <Card
                  key={plan.id}
                  className={cn(
                    "relative overflow-hidden flex flex-col",
                    (plan.name === "Pro User" || plan.name === "pro")
                      ? "border-2 border-primary shadow-lg"
                      : "",
                    isDarkMode ? "bg-gray-800" : "bg-white"
                  )}
                >
                  {(plan.name === "Pro User" || plan.name === "pro") && (
                    <div className="absolute top-0 right-0 bg-primary text-primary-foreground px-3 py-1 text-xs font-medium">
                      {t_pricing("mostPopular")}
                    </div>
                  )}
                  <CardHeader>
                    <CardTitle> {t_pricing(`${plan.name}.title`)}</CardTitle>
                    <CardDescription>
                      {t_pricing(`${plan.name}.descriptionPlan`)}
                    </CardDescription>
                    {(plan.name === "Pro User" || plan.name === "pro") && (
                      <div className="mt-4">
                        <span className="text-3xl font-bold">
                          ₫
                          {Math.round(
                            plan.price * durationPlan * (1 - discount / 100)
                          )}
                        </span>
                        <span className="text-muted-foreground ml-2">
                          {annual ? t_pricing("year") : t_pricing("month")}
                        </span>
                        {discount > 0 && (
                          <span className="text-sm text-green-500 ml-2">
                            ({t_pricing("save")} {discount}&#37;)
                          </span>
                        )}
                      </div>
                    )}
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <ul className="space-y-3">
                      {parsedFeatures.map((feature, i) => (
                        <li key={i} className="flex items-center gap-2">
                          <Check className="h-4 w-4 text-primary" />
                          <span>
                            {t_pricing(`${plan.name}.features.${feature}`)}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                  <CardFooter className="mt-auto">
                    {(plan.name === "Free User" || plan.name === "free") ? (
                      <Button className="w-full" variant="outline" disabled>
                        {t_pricing("currentPlan")}
                      </Button>
                    ) : (
                      <Button
                        className="w-full bg-primary hover:bg-primary/90"
                        variant="default"
                        onClick={(e) =>
                          handlePayment(e, plan.id, plan.price, plan.name)
                        }
                      >
                        {t_pricing("buttonText")}
                      </Button>
                    )}
                  </CardFooter>
                </Card>
              );
            })}
        </div>

        <div className="text-center mt-12">
          <p className="text-muted-foreground">{t_pricing("note")}</p>
          <p className="mt-2">
            {t_pricing("contact")}{" "}
            <a href="#" className="underline text-primary">
              {t_pricing("contactLink")}
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
