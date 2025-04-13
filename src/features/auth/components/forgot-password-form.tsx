"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Eye, EyeOff, Mail, Lock, KeyRound, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  useForgotPasswordMutation,
  useConfirmRegistrationMutation,
} from "../api";
import type { ConfirmRegisterationRequestDTO } from "../types";
import { HttpStatusCode } from "axios";

export function ForgotPasswordForm() {
  const router = useRouter();
  const [formData, setFormData] = useState<ConfirmRegisterationRequestDTO>({
    email: "",
    confirmationCode: "",
    newPassword: "",
    confirmNewPassword: "",
    username: null,
    role: "USER",
    isPasswordReset: true,
  });
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSendingCode, setIsSendingCode] = useState(false);
  const [error, setError] = useState<Array<string>>([]);
  const [countdown, setCountdown] = useState(0);

  const [forgotPassword] = useForgotPasswordMutation();
  const [confirmRegistration] = useConfirmRegistrationMutation();

  const handleSendCode = async () => {
    if (!formData.email) {
      setError(["Please enter your email"]);
      toast.error("Please enter your email");
      return;
    }
    setIsSendingCode(true);
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

    await forgotPassword({ email: formData.email })
      .unwrap()
      .then((response) => {
        if (response.httpStatusCode === HttpStatusCode.Ok) {
          toast.success("Confirmation code has been sent to your email");
        }
      })
      .catch((error) => {
        error.data.errorMessages.forEach((message: string) => {
          setError((prev) => [...prev, message]);
          console.log("Error send code\n", message);
        });
      })
      .finally(() => {
        setIsSendingCode(false);
      });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError([]);
    if (formData.newPassword !== formData.confirmNewPassword) {
      setError(["Passwords do not match"]);
      return;
    }
    if (
      !formData.email ||
      !formData.confirmationCode ||
      !formData.newPassword ||
      !formData.confirmNewPassword
    ) {
      setError(["Please fill in all fields"]);
      return;
    }
    setIsLoading(true);
    await confirmRegistration(formData)
      .unwrap()
      .then((response) => {
        if (response.httpStatusCode === HttpStatusCode.Ok) {
          toast.success("Password reset successful");
          router.push("/login");
        }
      })
      .catch((error) => {
        error.data.errorMessages.forEach((message: string) => {
          setError((prev) => [...prev, message]);
          toast.error(message);
        });
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleChange =
    (field: keyof ConfirmRegisterationRequestDTO) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormData((prev) => ({
        ...prev,
        [field]: e.target.value || "",
      }));
    };

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
              Reset Password <span className="text-primary">SLOM!</span>
            </h1>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="grid gap-2">
                <Label htmlFor="email" className="text-sm sm:text-base">
                  Email
                </Label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange("email")}
                      placeholder="Enter your email"
                      required
                      className="h-9 sm:h-10 text-sm sm:text-base pl-9 w-full"
                    />
                    <Mail className="h-4 w-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleSendCode}
                    disabled={countdown > 0 || isSendingCode || !formData.email}
                    className="min-h-[36px] sm:min-h-[40px] text-sm sm:text-base whitespace-nowrap bg-primary text-white hover:bg-primary/90 border-0 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSendingCode ? (
                      <div className="flex items-center justify-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Sending...
                      </div>
                    ) : countdown > 0 ? (
                      `Resend (${countdown}s)`
                    ) : (
                      "Send Code"
                    )}
                  </Button>
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="code" className="text-sm sm:text-base">
                  Confirmation Code
                </Label>
                <div className="relative">
                  <Input
                    id="code"
                    value={formData.confirmationCode}
                    onChange={handleChange("confirmationCode")}
                    placeholder="Enter confirmation code"
                    required
                    className="h-9 sm:h-10 text-sm sm:text-base pl-9"
                  />
                  <KeyRound className="h-4 w-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="newPassword" className="text-sm sm:text-base">
                  New Password
                </Label>
                <div className="relative">
                  <Input
                    id="newPassword"
                    type={showNewPassword ? "text" : "password"}
                    value={formData.newPassword || ""}
                    onChange={handleChange("newPassword")}
                    placeholder="Enter new password"
                    required
                    className="h-9 sm:h-10 pr-10 pl-9 text-sm sm:text-base w-full"
                  />
                  <Lock className="h-4 w-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 rounded-full"
                    aria-label={
                      showNewPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showNewPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-500" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-500" />
                    )}
                  </button>
                </div>
              </div>

              <div className="grid gap-2">
                <Label
                  htmlFor="confirmNewPassword"
                  className="text-sm sm:text-base"
                >
                  Confirm New Password
                </Label>
                <div className="relative">
                  <Input
                    id="confirmNewPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={formData.confirmNewPassword}
                    onChange={handleChange("confirmNewPassword")}
                    placeholder="Confirm new password"
                    required
                    className="h-9 sm:h-10 pr-10 pl-9 text-sm sm:text-base w-full"
                  />
                  <Lock className="h-4 w-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 rounded-full"
                    aria-label={
                      showConfirmPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-500" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-500" />
                    )}
                  </button>
                </div>
              </div>
              {error && (
                <div className="text-sm text-red-500 mt-2">
                  {error.map((error) => error).join(", ")}
                </div>
              )}
              <Button
                type="submit"
                className="w-full cursor-pointer bg-primary hover:bg-primary/90 h-9 sm:h-10 text-sm sm:text-base"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Resetting...
                  </div>
                ) : (
                  "Reset Password"
                )}
              </Button>
              <div className="text-center text-xs sm:text-sm">
                Remember your password?{" "}
                <Link href="/login" className="text-primary hover:underline">
                  Back to Login
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
      {(isLoading || isSendingCode) && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg">
            <Loader2 className="h-5 w-5 animate-spin text-primary" />
            <span>
              {isLoading ? "Resetting password..." : "Sending code..."}
            </span>
          </div>
        </div>
      )}
    </>
  );
}
