"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { HttpStatusCode } from "axios";
import { Mail, KeyRound, Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  useConfirmRegistrationMutation,
  useResendConfirmationCodeMutation,
} from "../api";
import type {
  ConfirmRegisterationRequestDTO,
  ResendConfirmationCodeDTO,
} from "../types";

export function ConfirmRegisterationForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";

  const [confirmData, setConfirmData] =
    useState<ConfirmRegisterationRequestDTO>({
      username: email.split("@")[0],
      email: email,
      confirmationCode: "",
      newPassword: null,
      confirmNewPassword: "",
      role: "USER",
      isPasswordReset: false,
    });

  const [confirmRegistration] = useConfirmRegistrationMutation();
  const [resendCode] = useResendConfirmationCodeMutation();
  const [error, setError] = useState<string>("");
  const [countdown, setCountdown] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);

  const t2 = useTranslations("confirmRegisterPage");
  const t = useTranslations("errorMessages.authError");
  const t3 = useTranslations("successMessages.authMessage");

  const handleConfirm = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    await confirmRegistration(confirmData)
      .unwrap()
      .then((response) => {
        if (response.httpStatusCode === HttpStatusCode.Ok) {
          toast.success(t3("successRegisterationConfirm"));
          router.push("/login");
        }
      })
      .catch((error) => {
        console.log("Error confirm registration\n", error);
        error.data.errorMessages.forEach((message: string) => {
          setError(t(message));
        });
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleResendCode = async () => {
    const resendData: ResendConfirmationCodeDTO = {
      email: confirmData.email,
    };

    setIsResending(true);
    setCountdown(10);
    const timer = setInterval(() => {
      setCountdown((current) => {
        if (current <= 1) {
          clearInterval(timer);
          return 0;
        }
        return current - 1;
      });
    }, 1000);

    await resendCode(resendData)
      .unwrap()
      .then((response) => {
        if (response.status === HttpStatusCode.Ok) {
          toast.success(t3(response.data));
        }
      })
      .catch((error) => {
        console.log("Error resend code\n", error);
      })
      .finally(() => {
        setIsResending(false);
      });
  };

  const isFormValid =
    confirmData.email.trim() !== "" &&
    confirmData.confirmationCode.trim() !== "";

  return (
    <>
      <div
        className="fixed inset-0"
        style={{
          backgroundImage: `url('/images/bg-login.png')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div className="absolute inset-0 bg-black/60" />
      </div>

      <div className="fixed inset-0 flex items-center justify-center p-4 overflow-hidden">
        <Card className="w-full max-w-[400px] sm:min-w-[400px] bg-white/90 backdrop-blur-sm max-h-screen overflow-auto">
          <CardContent className="pt-6 px-4 sm:px-6">
            <h1 className="text-center text-xl sm:text-2xl font-normal mb-6">
              {t2("title")} <span className="text-primary">SLOM!</span>
            </h1>
            <form onSubmit={handleConfirm} className="flex flex-col gap-4">
              <div className="grid gap-2">
                <Label htmlFor="email" className="text-sm sm:text-base">
                  {t2("emailLabel")}
                </Label>
                <div className="relative">
                  <Input
                    id="email"
                    type="email"
                    value={confirmData.email}
                    onChange={(e) =>
                      setConfirmData({
                        ...confirmData,
                        email: e.target.value,
                        username: e.target.value.split("@")[0],
                      })
                    }
                    placeholder={t2("emailPlaceholder")}
                    required
                    className="h-9 sm:h-10 text-sm sm:text-base pl-9"
                    disabled={!!email}
                  />
                  <Mail className="h-4 w-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
                </div>
              </div>
              <div className="grid gap-2">
                <div className="flex items-center justify-between">
                  <Label
                    htmlFor="confirmationCode"
                    className="text-sm sm:text-base"
                  >
                    {t2("confirmationCodeLabel")}
                  </Label>
                </div>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Input
                      id="confirmationCode"
                      type="text"
                      value={confirmData.confirmationCode}
                      onChange={(e) =>
                        setConfirmData({
                          ...confirmData,
                          confirmationCode: e.target.value,
                        })
                      }
                      placeholder={t2("confirmationCodePlaceholder")}
                      required
                      className="h-9 sm:h-10 text-sm sm:text-base pl-9 w-full"
                    />
                    <KeyRound className="h-4 w-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleResendCode}
                    disabled={
                      countdown > 0 || isResending || !confirmData.email
                    }
                    className="min-h-[36px] sm:min-h-[40px] text-sm sm:text-base whitespace-nowrap bg-primary text-white hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed border-0"
                  >
                    {isResending ? (
                      <div className="flex items-center justify-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        {t2("sending")}
                      </div>
                    ) : countdown > 0 ? (
                      `${t2("resend")} (${countdown}s)`
                    ) : (
                      t2("resendCode")
                    )}
                  </Button>
                </div>
              </div>
              {error && (
                <div className="text-sm text-red-500 mt-2">{error}</div>
              )}
              <Button
                type="submit"
                className="w-full cursor-pointer bg-primary hover:bg-primary/90 h-9 sm:h-10 text-sm sm:text-base"
                disabled={!isFormValid || isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    {t2("confirming")}
                  </div>
                ) : (
                  t2("confirmButton")
                )}
              </Button>
              <div className="text-center text-xs sm:text-sm">
                <Link href="/login" className="text-primary hover:underline">
                  {t2("backToLogin")}
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
      {(isLoading || isResending) && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg">
            <Loader2 className="h-5 w-5 animate-spin text-primary" />
            <span>{isLoading ? "Confirming..." : "Sending code..."}</span>
          </div>
        </div>
      )}
    </>
  );
}
