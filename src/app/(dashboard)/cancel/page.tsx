"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { XCircle } from "lucide-react";

export default function Page() {
  const router = useRouter();
  const [countdown, setCountdown] = useState(5);
  const [shouldNavigate, setShouldNavigate] = useState(false);

  useEffect(() => {
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
  }, []);

  useEffect(() => {
    if (shouldNavigate) {
      router.push("/");
    }
  }, [shouldNavigate, router]);

  const handleNavigate = () => {
    setShouldNavigate(true);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="mx-auto max-w-md rounded-lg bg-white p-8 shadow-lg">
        <div className="flex flex-col items-center space-y-4">
          <XCircle className="h-16 w-16 text-red-500" />
          <h1 className="text-2xl font-bold">Payment Cancelled</h1>
          <p className="text-center text-gray-600">
            Your payment has been cancelled. You will be redirected to the home page in{" "}
            <span className="font-semibold">{countdown}</span> seconds.
          </p>
          <Button
            onClick={handleNavigate}
            className="mt-4"
          >
            Go to Home Page
          </Button>
        </div>
      </div>
    </div>
  );
}
