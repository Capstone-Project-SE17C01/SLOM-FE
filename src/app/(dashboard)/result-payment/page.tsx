"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { CheckCircle, Loader2, AlertCircle, XCircle } from "lucide-react";
import { useUpdatePlanMutation } from "@/features/auth/api";
import { toast } from "sonner";
import type { ReturnUrlQueryDTO } from "@/features/auth/types";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import constants from "@/settings/constants";
import { useTranslations } from "next-intl";

type Status = "loading" | "success" | "error" | "cancelled";

export default function Page() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [countdown, setCountdown] = useState(5);
  const [updatePlan] = useUpdatePlanMutation();
  const [status, setStatus] = useState<Status>("loading");
  const [shouldNavigate, setShouldNavigate] = useState(false);
  const accessToken = Cookies.get(constants.ACCESS_TOKEN);
  const t_error_dashboard = useTranslations("errorMessages.errorDashboard");
  const t_result_payment = useTranslations("resultPaymentPage");

  const params = useMemo(
    () => ({
      period: searchParams.get("period"),
      code: searchParams.get("code"),
      id: searchParams.get("id"),
      cancel: searchParams.get("cancel"),
      status: searchParams.get("status") as ReturnUrlQueryDTO["status"],
      orderCode: Number(searchParams.get("orderCode")),
    }),
    [searchParams]
  );

  useEffect(() => {
    if (params.code && params.id && params.status && params.orderCode) {
      (async () => {
        try {
          if (!accessToken) {
            toast.error(t_error_dashboard("notAuthenticated"));
            setStatus("error");
            return;
          }
          const tokenInfo = jwtDecode<{ sub: string }>(accessToken);
          const userId = tokenInfo.sub;
          const response = await updatePlan({
            userId,
            period: Number(params.period),
            code: params.code as string,
            id: params.id as string,
            cancel: params.cancel === "false",
            status: params.status,
            orderCode: params.orderCode,
          }).unwrap();

          if (response.errorMessages?.length) {
            toast.error(t_result_payment("paymentStatusWrong"));
            setStatus("error");
          }
          if (response.result) {
            console.log("response.result", response.result);
            if (params.cancel === "false") {
              setStatus("success");
            } else {
              setStatus("cancelled");
            }
          }
        } catch {
          toast.error(t_result_payment("paymentUpdateFailed"));
          setStatus("error");
        }
      })();
    } else {
      toast.error(t_result_payment("paymentStatusWrong"));
      setStatus("error");
    }
  }, [params, updatePlan, accessToken, t_result_payment, t_error_dashboard]);

  useEffect(() => {
    if (status === "loading") return;

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setShouldNavigate(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [status]);

  useEffect(() => {
    if (shouldNavigate) {
      router.push("/home");
    }
  }, [shouldNavigate, router]);

  const handleNavigate = () => {
    setShouldNavigate(true);
  };

  const renderIcon = () => {
    switch (status) {
      case "loading":
        return <Loader2 className="h-16 w-16 animate-spin text-blue-500" />;
      case "error":
        return <AlertCircle className="h-16 w-16 text-red-500" />;
      case "success":
        return <CheckCircle className="h-16 w-16 text-green-500" />;
      case "cancelled":
        return <XCircle className="h-16 w-16 text-red-500" />;
      default:
        return <Loader2 className="h-16 w-16 animate-spin text-blue-500" />;
    }
  };

  const renderMessage = () => {
    switch (status) {
      case "loading":
        return t_result_payment("processing");
      case "error":
        return (
          <>
            {t_result_payment("paymentFailedMsg")}
            <br />
            {t_result_payment("redirectIn", { seconds: countdown })}
          </>
        );
      case "success":
        return (
          <>
            {t_result_payment("paymentSuccessMsg")}
            {t_result_payment("redirectIn", { seconds: countdown })}
          </>
        );
      case "cancelled":
        return (
          <>
            {t_result_payment("paymentCancelledMsg")}
            {t_result_payment("redirectIn", { seconds: countdown })}
          </>
        );
      default:
        return t_result_payment("processing");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="mx-auto max-w-md rounded-lg bg-white p-8 shadow-lg">
        <div className="flex flex-col items-center space-y-4">
          {renderIcon()}
          <h1 className="text-2xl font-bold">
            {
              {
                success: t_result_payment("paymentSuccess"),
                error: t_result_payment("paymentFailed"),
                cancelled: t_result_payment("paymentCancelled"),
                loading: t_result_payment("processingTitle"),
              }[status]
            }
          </h1>
          <p className="text-center text-gray-600">{renderMessage()}</p>
          <Button
            onClick={handleNavigate}
            className="mt-4"
            disabled={status !== "success" && status !== "cancelled"}
          >
            {t_result_payment("goHome")}
          </Button>
        </div>
      </div>
    </div>
  );
}
