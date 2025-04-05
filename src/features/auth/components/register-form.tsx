"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

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
import { useRegisterMutation } from "../api";
import type { RegisterationRequestDTO } from "../types";
import { toast } from "sonner";
export function RegisterForm() {
  const router = useRouter();
  const [registerData, setRegisterData] = useState<RegisterationRequestDTO>({
    email: "",
    password: "",
    role: "USER"
  });
  const [confirmPassword, setConfirmPassword] = useState("");
  
  const [register] = useRegisterMutation();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (registerData.password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    try {
      const response = await register(registerData).unwrap();
      if (response.email) {
        router.push(
          `/confirm-registeration?email=${encodeURIComponent(response.email)}`
        );
      }
    } catch (error) {
      toast.error("Registration failed");
    }
  };

  // Thêm validation
  const isFormValid = 
    registerData.email.trim() !== "" && 
    registerData.password.trim() !== "" && 
    confirmPassword.trim() !== "";

  return (
    <Card className="mx-auto max-w-sm">
      <CardHeader>
        <CardTitle className="text-2xl">Register</CardTitle>
        <CardDescription>
          Create a new account to use SLOM
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleRegister} className="flex flex-col gap-4">
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={registerData.email}
              onChange={(e) => setRegisterData({
                ...registerData,
                email: e.target.value
              })}
              placeholder="m@example.com"
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input 
              id="password" 
              type="password" 
              value={registerData.password}
              onChange={(e) => setRegisterData({
                ...registerData,
                password: e.target.value
              })}
              required 
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <Input 
              id="confirmPassword" 
              type="password" 
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required 
            />
          </div>
          <Button 
            type="submit" 
            className="w-full cursor-pointer"
            disabled={!isFormValid || registerData.password !== confirmPassword}
          >
            Register
          </Button>
          <div className="text-center text-sm">
            Already have an account? <Link href="/login" className="underline">Login</Link>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
