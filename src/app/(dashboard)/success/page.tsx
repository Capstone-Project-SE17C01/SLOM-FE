"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { CheckCircle, Loader2, AlertCircle } from "lucide-react";
import { useUpdatePlanMutation } from "@/features/auth/api";
import { toast } from "sonner";
import type { ReturnUrlQueryDTO } from "@/features/auth/types";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import constants from "@/settings/constants";

type Status = "loading" | "success" | "error";

export default function Page() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [countdown, setCountdown] = useState(5);
  const [updatePlan] = useUpdatePlanMutation();
  const [status, setStatus] = useState<Status>("loading");
  const [shouldNavigate, setShouldNavigate] = useState(false);
  const accessToken = Cookies.get(constants.ACCESS_TOKEN);

  // Tách riêng các tham số từ searchParams
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

  // Gọi API cập nhật kế hoạch thanh toán
  useEffect(() => {
    if (params.code && params.id && params.status && params.orderCode) {
      (async () => {
        try {
          if (!accessToken) {
            toast.error("Not authenticated");
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
            toast.error("Something wrong with payment status");
            setStatus("error");
          }
          if (response.result) {
            toast.success(response.result);
            setStatus("success");
          }
        } catch (error) {
          toast.error("Failed to update payment status");
          setStatus("error");
        }
      })();
    } else {
      toast.error("Something wrong with payment status");
      setStatus("error");
    }
  }, [params, updatePlan, accessToken]);

  // Đếm ngược và chuyển hướng khi trạng thái không còn là 'loading'
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

  // Xử lý navigation
  useEffect(() => {
    if (shouldNavigate) {
      router.push("/");
    }
  }, [shouldNavigate, router]);

  const handleNavigate = () => {
    setShouldNavigate(true);
  };

  // Hàm trả về icon theo trạng thái
  const renderIcon = () => {
    switch (status) {
      case "loading":
        return <Loader2 className="h-16 w-16 animate-spin text-blue-500" />;
      case "error":
        return <AlertCircle className="h-16 w-16 text-red-500" />;
      case "success":
        return <CheckCircle className="h-16 w-16 text-green-500" />;
      default:
        return <Loader2 className="h-16 w-16 animate-spin text-blue-500" />;
    }
  };

  // Hàm trả về thông báo theo trạng thái
  const renderMessage = () => {
    switch (status) {
      case "loading":
        return "Processing your payment...";
      case "error":
        return (
          <>
            Payment processing failed. Please try again or contact support.
            <br />
            You will be redirected to the home page in{" "}
            <span className="font-semibold">{countdown}</span> seconds.
          </>
        );
      case "success":
        return (
          <>
            Thank you for your payment. You will be redirected to the home page in{" "}
            <span className="font-semibold">{countdown}</span> seconds.
          </>
        );
      default:
        return "Processing your payment...";
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="mx-auto max-w-md rounded-lg bg-white p-8 shadow-lg">
        <div className="flex flex-col items-center space-y-4">
          {renderIcon()}
          <h1 className="text-2xl font-bold">
            {status === "error" ? "Payment Failed" : "Payment Successful!"}
          </h1>
          <p className="text-center text-gray-600">{renderMessage()}</p>
          <Button
            onClick={handleNavigate}
            className="mt-4"
            disabled={status !== "success"}
          >
            Go to Home Page
          </Button>
        </div>
      </div>
    </div>
  );
}
