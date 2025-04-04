"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "@/services/firebase/config";
import { useLoginMutation, useLoginWithGoogleMutation } from "../api";
import { LoginResponseDTO } from "../types";
import Cookies from "js-cookie";
import { toast } from "sonner";

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  
  const [login] = useLoginMutation();
  const [signInWithGoogle] = useLoginWithGoogleMutation();

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await login({ email, password }).unwrap();
      const { accessToken, refreshToken, idToken ,userEmail} =
        response as LoginResponseDTO;
      if (response.accessToken) {
          const cookieOptions = rememberMe ? { expires: 7 } : undefined;
          Cookies.set("accessToken", accessToken, cookieOptions);
          Cookies.set("refreshToken", refreshToken, cookieOptions);
          Cookies.set("idToken", idToken, cookieOptions);
          Cookies.set("userEmail", userEmail || "", cookieOptions);
        router.push("/");
      }
    } catch (error) {
      toast.error("Login failed");
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const resFirebase = await signInWithPopup(auth, provider.providerGoogle);
      
      const idToken = await resFirebase.user.getIdToken();
      const refreshToken = resFirebase.user.refreshToken;
      const email = resFirebase.user.email;

      Cookies.set("accessToken", idToken);
      Cookies.set("refreshToken", refreshToken);
      Cookies.set("idToken", idToken);
      Cookies.set("userEmail", email || "");
      
      router.push("/");
    } catch (error) {
      toast.error("Login failed");
    }
  };

  return (
    <Card className="mx-auto max-w-sm">
      <CardHeader>
        <CardTitle className="text-2xl">Login</CardTitle>
        <CardDescription>
          Enter your email below to login to SLOM admin dashboard
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleEmailLogin} className="flex flex-col gap-4">
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="m@example.com"
              required
            />
          </div>
          <div className="grid gap-2">
            <div className="flex items-center">
              <Label htmlFor="password">Password</Label>
              <Link href="/forgot-password" className="ml-auto inline-block text-sm underline">
                Forgot password?
              </Link>
            </div>
            <div className="flex items-center">
              <Input 
                id="password" 
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required 
                className="rounded-r-none"
              />
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => setShowPassword(!showPassword)}
                className="h-10 w-10 rounded-l-none border-l-0"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="remember"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
            />
            <label
              htmlFor="remember"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Remember me
            </label>
          </div>
          <Button type="submit" className="w-full cursor-pointer">
            Login
          </Button>
          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={handleGoogleLogin}
          >
            Login with Google
          </Button>
          <div className="text-center text-sm">
            Don't have an account?{" "}
            <Link href="/register" className="text-blue-500 hover:text-blue-700 underline">
              Register here
            </Link>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
