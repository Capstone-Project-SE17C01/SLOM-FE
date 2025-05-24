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
  const t = useTranslations("errorMessages.errorDashboard");
  const t3 = useTranslations("successMessages.authMessage");
  const t2 = useTranslations("resultPaymentPage");

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
    if (params.cancel === "false") {
      if (params.code && params.id && params.status && params.orderCode) {
        (async () => {
          try {
            if (!accessToken) {
              toast.error(t("notAuthenticated"));
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
              toast.error(t("paymentStatusWrong"));
              setStatus("error");
            }
            if (response.result) {
              toast.success(t3(response.result));
              setStatus("success");
            }
          } catch {
            toast.error(t("paymentUpdateFailed"));
            setStatus("error");
          }
        })();
      } else {
        toast.error(t("paymentStatusWrong"));
        setStatus("error");
      }
    } else {
      setStatus("cancelled");
    }
  }, [params, updatePlan, accessToken, t, t3]);

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
        return t2("processing");
      case "error":
        return (
          <>
            {t2("paymentFailedMsg")}
            <br />
            {t2("redirectIn", { seconds: countdown })}
          </>
        );
      case "success":
        return (
          <>
            {t2("paymentSuccessMsg")}
            {t2("redirectIn", { seconds: countdown })}
          </>
        );
      case "cancelled":
        return (
          <>
            {t2("paymentCancelledMsg")}
            {t2("redirectIn", { seconds: countdown })}
          </>
        );
      default:
        return t2("processing");
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
                success: t2("paymentSuccess"),
                error: t2("paymentFailed"),
                cancelled: t2("paymentCancelled"),
                loading: t2("processingTitle"),
              }[status]
            }
          </h1>
          <p className="text-center text-gray-600">{renderMessage()}</p>
          <Button
            onClick={handleNavigate}
            className="mt-4"
            disabled={status !== "success" && status !== "cancelled"}
          >
            {t2("goHome")}
          </Button>
        </div>
      </div>
    </div>
  );
}
