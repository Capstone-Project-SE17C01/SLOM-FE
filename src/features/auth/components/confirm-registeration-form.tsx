"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { HttpStatusCode } from "axios"; 

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
import { useConfirmRegistrationMutation, useResendConfirmationCodeMutation } from "../api";
import type { ConfirmRegisterationRequestDTO, ResendConfirmationCodeDTO } from "../types";


export function ConfirmRegisterationForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get('email') || '';
  
  const [confirmData, setConfirmData] = useState<ConfirmRegisterationRequestDTO>({
    username: email.split('@')[0],
    email: email,
    confirmationCode: "",
    newPassword: null,
    confirmNewPassword: "",
    role: "USER",
    isPasswordReset: false
  });
  
  const [confirmRegistration] = useConfirmRegistrationMutation();
  const [resendCode] = useResendConfirmationCodeMutation();
  const [error, setError] = useState<string>("");
  const [countdown, setCountdown] = useState(0);

  const handleConfirm = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      const response = await confirmRegistration(confirmData).unwrap();
      if (response.httpStatusCode === HttpStatusCode.Ok) {
        toast.success("Registration confirmed successfully!");
        router.push("/login");
      }
    } catch (error: any) {
      const errorMessage = error?.data || "An error occurred";
      setError(errorMessage);
      toast.error(errorMessage);
    }
  };

  const handleResendCode = async () => {
    const resendData: ResendConfirmationCodeDTO = {
      email: confirmData.email
    };

    try {
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

      const response = await resendCode(resendData).unwrap();
      toast.success("Confirmation code sent successfully");
    } catch (error: any) {
      if (error.status === 'PARSING_ERROR' && error.originalStatus === 200) {
        toast.success(error.data);
        return;
      }else{
        const errorMessage = error?.data || "Error sending confirmation code";
        toast.error(errorMessage);
      }
    }
  };

  const isFormValid = 
    confirmData.email.trim() !== "" && 
    confirmData.confirmationCode.trim() !== "";

  return (
    <Card className="mx-auto max-w-sm">
      <CardHeader>
        <CardTitle className="text-2xl">Confirm Registration</CardTitle>
        <CardDescription>
          Enter the confirmation code sent to your email
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleConfirm} className="flex flex-col gap-4">
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={confirmData.email}
              onChange={(e) => setConfirmData({
                ...confirmData,
                email: e.target.value
              })}
              placeholder="m@example.com"
              required
            />
          </div>
          <div className="grid gap-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="confirmationCode">Confirmation Code</Label>
              <Button 
                type="button" 
                variant="ghost" 
                size="sm"
                onClick={handleResendCode}
                disabled={countdown > 0}
                className="text-sm text-blue-500 hover:text-blue-700 disabled:opacity-50"
              >
                {countdown > 0 ? `Resend code (${countdown}s)` : 'Resend code'}
              </Button>
            </div>
            <Input 
              id="confirmationCode" 
              type="text"
              value={confirmData.confirmationCode}
              onChange={(e) => setConfirmData({
                ...confirmData,
                confirmationCode: e.target.value
              })}
              required 
            />
          </div>
          {error && (
            <div className="text-sm text-red-500 mt-2">
              {error}
            </div>
          )}
          <Button 
            type="submit" 
            className="w-full cursor-pointer"
            disabled={!isFormValid}
          >
            Confirm
          </Button>
          <div className="text-center text-sm">
            <Link href="/login" className="underline" onClick={() => router.back()}>Back</Link>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
