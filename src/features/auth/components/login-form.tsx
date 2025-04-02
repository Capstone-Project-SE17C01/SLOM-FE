"use client";

import Link from "next/link";

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
import { useLoginWithGoogleMutation } from "../api";
import { useRouter } from "next/navigation";

export function LoginForm() {
  const router = useRouter();

  const [signInWithGoogle] = useLoginWithGoogleMutation();

  const handleGoogleLogin = async () => {
    try {
      const resFirebase = await signInWithPopup(auth, provider.providerGoogle);
      await signInWithGoogle(resFirebase.user).unwrap();
      router.push("/");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Card className="mx-auto max-w-sm">
      <CardHeader>
        <CardTitle className="text-2xl">Đăng nhập</CardTitle>
        <CardDescription>
          Nhập email của bạn bên dưới để đăng nhập vào trang quản trị của
          SLOM
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4">
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="m@example.com"
              required
            />
          </div>
          <div className="grid gap-2">
            <div className="flex items-center">
              <Label htmlFor="password">Mật khẩu</Label>
              <Link href="#" className="ml-auto inline-block text-sm underline">
                Quên mật khẩu?
              </Link>
            </div>
            <Input id="password" type="password" required />
          </div>
          <Button type="submit" className="w-full cursor-pointer" disabled>
            Đăng nhập
          </Button>
          <Button
            variant="outline"
            className="w-full"
            onClick={handleGoogleLogin}
          >
            Đăng nhập với Google
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
