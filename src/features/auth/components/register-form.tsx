"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Mail, Lock, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRegisterMutation } from "../api";
import type { RegisterationRequestDTO } from "../types";
import { useTranslations } from "next-intl";

export function RegisterForm() {
  const router = useRouter();
  const [registerData, setRegisterData] = useState<RegisterationRequestDTO>({
    email: "",
    password: "",
    role: "USER",
  });
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const t = useTranslations("registerPage");
  const tError = useTranslations("errorMessages.authError");

  const [register] = useRegisterMutation();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (registerData.password !== confirmPassword) {
      setError(tError("passwordsNotMatch"));
      return;
    }
    setIsLoading(true);
    await register(registerData)
      .unwrap()
      .then((payload) => {
        if (payload.result) {
          const { email } = payload.result;
          if (email) {
            router.push(
              `/confirm-registeration?email=${encodeURIComponent(email)}`
            );
          }
        }
      })
      .catch((error) => {
        console.log("Error Register\n", error);
        const errorMessage = Array.isArray(error.data.errorMessages)
          ? error.data.errorMessages[0]
          : error.data.errorMessages;
        setError(tError(errorMessage));
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  // Thêm validation
  const isFormValid =
    registerData.email.trim() !== "" &&
    registerData.password.trim() !== "" &&
    confirmPassword.trim() !== "";

  return (
    <>
      {/* Background container */}
      <div
        className="fixed inset-0"
        style={{
          backgroundImage: `url('/images/bg-login.png')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/60" />
      </div>

      {/* Content container */}
      <div className="fixed inset-0 flex items-center justify-center p-4 overflow-hidden">
        <Card className="w-full max-w-[400px] sm:min-w-[400px] bg-white/90 backdrop-blur-sm max-h-screen overflow-auto">
          <CardContent className="pt-6 px-4 sm:px-6">
            <h1 className="text-center text-xl sm:text-2xl font-normal mb-6">
              {t("title")}
            </h1>
            <form onSubmit={handleRegister} className="flex flex-col gap-4">
              <div className="grid gap-2">
                <Label htmlFor="email" className="text-sm sm:text-base">
                  {t("emailLabel")}
                </Label>
                <div className="relative">
                  <Input
                    id="email"
                    type="email"
                    autoComplete="new-password"
                    value={registerData.email}
                    onChange={(e) =>
                      setRegisterData({
                        ...registerData,
                        email: e.target.value,
                      })
                    }
                    placeholder={t("emailPlaceholder")}
                    required
                    className="h-9 sm:h-10 text-sm sm:text-base pl-9"
                  />
                  <Mail className="h-4 w-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password" className="text-sm sm:text-base">
                  {t("passwordLabel")}
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    autoComplete="new-password"
                    type={showPassword ? "text" : "password"}
                    value={registerData.password}
                    onChange={(e) =>
                      setRegisterData({
                        ...registerData,
                        password: e.target.value,
                      })
                    }
                    placeholder={t("passwordPlaceholder")}
                    required
                    className="h-9 sm:h-10 pr-10 pl-9 text-sm sm:text-base w-full"
                  />
                  <Lock className="h-4 w-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 rounded-full"
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-500" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-500" />
                    )}
                  </button>
                </div>
              </div>
              <div className="grid gap-2">
                <Label
                  htmlFor="confirmPassword"
                  className="text-sm sm:text-base"
                >
                  {t("confirmPasswordLabel")}
                </Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder={t("confirmPasswordPlaceholder")}
                    autoComplete="new-password"
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
                <div className="text-sm text-red-500 mt-2">{error}</div>
              )}
              <Button
                type="submit"
                className="w-full cursor-pointer bg-primary hover:bg-primary/90 h-9 sm:h-10 text-sm sm:text-base"
                disabled={
                  !isFormValid ||
                  registerData.password !== confirmPassword ||
                  isLoading
                }
              >
                {isLoading ? (
                  <div className="flex items-center justify-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    {t("registering")}
                  </div>
                ) : (
                  t("registerButton")
                )}
              </Button>
              <div className="text-center text-xs sm:text-sm">
                {t("alreadyHaveAccount")}{" "}
                <Link href="/login" className="text-primary hover:underline">
                  {t("login")}
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>

      {/* Loading overlay */}
      {isLoading && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg">
            <Loader2 className="h-5 w-5 animate-spin text-primary" />
            <span>{t("registering")}</span>
          </div>
        </div>
      )}
    </>
  );
}
