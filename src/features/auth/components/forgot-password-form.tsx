"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

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
import { useForgotPasswordMutation, useConfirmRegistrationMutation } from "../api";
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
    isPasswordReset: true
  });

  const [forgotPassword] = useForgotPasswordMutation();
  const [confirmRegistration] = useConfirmRegistrationMutation();

  const handleSendCode = async () => {
    if (!formData.email) {
      toast.error("Please enter your email");
      return;
    }
    try {
      const response = await forgotPassword({ email: formData.email }).unwrap();
      if (response.httpStatusCode === HttpStatusCode.Ok) {
        toast.success("Confirmation code has been sent to your email");
      } else {
        toast.error("Failed to send confirmation code");
      }
    } catch (error) {
      toast.error("Failed to send confirmation code");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.newPassword !== formData.confirmNewPassword) {
      toast.error("Passwords do not match");
      return;
    }
    if (!formData.email || !formData.confirmationCode || !formData.newPassword || !formData.confirmNewPassword) {
      toast.error("Please fill in all fields");
      return;
    }
    try {
     const response = await confirmRegistration(formData).unwrap();
      if (response.httpStatusCode === HttpStatusCode.Ok) {
        toast.success("Password reset successful");
        router.push("/login");
      } else {
        toast.error("Password reset failed");
      }
    } catch (error) {
      toast.error("Password reset failed");
    }
  };

  const handleChange = (field: keyof ConfirmRegisterationRequestDTO) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: e.target.value || "",
    }));
  };

  return (
    <Card className="mx-auto max-w-sm">
      <CardHeader>
        <CardTitle className="text-2xl">Reset Password</CardTitle>
        <CardDescription>
          Enter your email and confirmation code to reset your password
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <div className="flex gap-2">
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={handleChange("email")}
                placeholder="m@example.com"
                required
              />
              <Button type="button" variant="outline" onClick={handleSendCode}>
                Send Code
              </Button>
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="code">Confirmation Code</Label>
            <Input
              id="code"
              value={formData.confirmationCode}
              onChange={handleChange("confirmationCode")}
              placeholder="Enter confirmation code"
              required
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="newPassword">New Password</Label>
            <Input
              id="newPassword"
              type="password"
              value={formData.newPassword || ""}
              onChange={handleChange("newPassword")}
              required
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="confirmNewPassword">Confirm New Password</Label>
            <Input
              id="confirmNewPassword"
              type="password"
              value={formData.confirmNewPassword}
              onChange={handleChange("confirmNewPassword")}
              required
            />
          </div>

          <Button type="submit" className="w-full">
            Confirm Password Reset
          </Button>
          <div className="text-center text-sm">
            <Link href="/login" className="text-blue-500 hover:text-blue-700 underline">
              Back to Login
            </Link>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
