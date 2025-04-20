"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Mail, Lock, Loader2 } from "lucide-react";
import { useDispatch } from "react-redux";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { useLoginMutation, useLoginWithGoogleMutation } from "../api";
import { LoginResponseDTO } from "../types";
import Cookies from "js-cookie";
import { toast } from "sonner";
import constants from "@/settings/constants";

export function LoginForm() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>("");

  const [login] = useLoginMutation();
  const [signInWithGoogle] = useLoginWithGoogleMutation();

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    await login({ email, password })
      .unwrap()
      .then((payload) => {
        if (payload.result) {
          const { accessToken } = payload.result as LoginResponseDTO;
          if (accessToken) {
            router.push("/");
          }
        }
      })
      .catch((error) => {
        console.log("Error Login Email\n", error);
        const errorMessage = Array.isArray(error.data.errorMessages)
          ? error.data.errorMessages[0]
          : error.data.errorMessages;
        setError(errorMessage);
        toast.error(errorMessage);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };
  useEffect(() => {
    handleGoogleLogin();
  }, []);

  const handleGoogleLogin = async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");

    if (code) {
      setIsLoading(true);
      await signInWithGoogle({
        code,
        redirectUri: constants.REDIRECT_URL_GOOGLE,
        role: "USER",
        languageCode: "en",
      })
        .unwrap()
        .then((payload) => {
          if (payload.result) {
            const { accessToken } = payload.result as LoginResponseDTO;
            if (accessToken) {
              router.push("/");
            }
          }
        })
        .catch((error) => {
          console.log("Error Login Email\n", error);
          const errorMessage = Array.isArray(error.data.errorMessages)
            ? error.data.errorMessages[0]
            : error.data.errorMessages;
          setError(errorMessage);
          toast.error(errorMessage);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  };

  const redirectToGoogleLogin = () => {
    router.push(constants.ENPOINT_URL_GOOGLE);
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
              Login to <span className="text-primary">SLOM!</span>
            </h1>
            <form onSubmit={handleEmailLogin} className="flex flex-col gap-4">
              <div className="grid gap-2">
                <Label htmlFor="email" className="text-sm sm:text-base">
                  Email
                </Label>
                <div className="relative">
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="Enter your email"
                    className="h-9 sm:h-10 text-sm sm:text-base pl-9"
                    autoComplete="username"
                  />
                  <Mail className="h-4 w-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password" className="text-sm sm:text-base">
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="Enter your password"
                    className="h-9 sm:h-10 pr-10 pl-9 text-sm sm:text-base w-full"
                    autoComplete="current-password"
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
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="remember"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <label
                    htmlFor="remember"
                    className="text-xs sm:text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Remember me
                  </label>
                </div>
                <Link
                  href="/forgot-password"
                  className="text-xs sm:text-sm text-primary hover:underline"
                >
                  Forget password
                </Link>
              </div>
              {error && (
                <div className="text-sm text-red-500 mt-2">{error}</div>
              )}
              <Button
                type="submit"
                className="w-full cursor-pointer bg-primary hover:bg-primary/90 h-9 sm:h-10 text-sm sm:text-base"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Logging in...
                  </div>
                ) : (
                  "Login"
                )}
              </Button>
            </form>
            <div className="flex items-center gap-4 my-4">
              <div className="h-[1px] flex-1 bg-gray-300"></div>
              <span className="text-gray-500 text-sm sm:text-base">Or</span>
              <div className="h-[1px] flex-1 bg-gray-300"></div>
            </div>
            <Button
              type="button"
              variant="outline"
              className="w-full h-9 sm:h-10 bg-white hover:bg-gray-50 flex items-center justify-center gap-2 text-sm sm:text-base border-0"
              onClick={redirectToGoogleLogin}
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Logging in...
                </div>
              ) : (
                <>
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="sm:w-6 sm:h-6"
                  >
                    <path
                      d="M21.8055 10.0415H21V10H12V14H17.6515C16.827 16.3285 14.6115 18 12 18C8.6865 18 6 15.3135 6 12C6 8.6865 8.6865 6 12 6C13.5295 6 14.921 6.577 15.9805 7.5195L18.809 4.691C17.023 3.0265 14.634 2 12 2C6.4775 2 2 6.4775 2 12C2 17.5225 6.4775 22 12 22C17.5225 22 22 17.5225 22 12C22 11.3295 21.931 10.675 21.8055 10.0415Z"
                      fill="#4285F4"
                    />
                    <path
                      d="M3.15302 7.3455L6.43852 9.755C7.32752 7.554 9.48052 6 12 6C13.5295 6 14.921 6.577 15.9805 7.5195L18.809 4.691C17.023 3.0265 14.634 2 12 2C8.15902 2 4.82802 4.1685 3.15302 7.3455Z"
                      fill="#EA4335"
                    />
                    <path
                      d="M12 22C14.5875 22 16.93 21.0115 18.7045 19.404L15.6095 16.785C14.5718 17.5742 13.3037 18.001 12 18C9.39897 18 7.19047 16.3415 6.35847 14.027L3.09747 16.5395C4.75247 19.778 8.11347 22 12 22Z"
                      fill="#34A853"
                    />
                    <path
                      d="M21.8055 10.0415H21V10H12V14H17.6515C17.2571 15.1082 16.5467 16.0766 15.608 16.7855L15.6095 16.785L18.7045 19.404C18.4855 19.6025 22 17 22 12C22 11.3295 21.931 10.675 21.8055 10.0415Z"
                      fill="#4285F4"
                    />
                  </svg>
                  Login with Google
                </>
              )}
            </Button>
            <div className="text-center text-xs sm:text-sm mt-4">
              Don't have an account yet?{" "}
              <Link href="/register" className="text-primary hover:underline">
                Register
              </Link>
            </div>
          </CardContent>
        </Card>
        {isLoading && (
          <div className="bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 w-screen h-screen fixed inset-0">
            <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg">
              <Loader2 className="h-5 w-5 animate-spin text-primary" />
              <span>Logging in...</span>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
