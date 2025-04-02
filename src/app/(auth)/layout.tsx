"use client";

import { useRouter } from "next-nprogress-bar";
import React, { useLayoutEffect } from "react";

import { useAppSelector } from "@/hooks/redux-toolkit";

function AuthLayout({ children }: { children: React.ReactNode }) {
  const { userInfo } = useAppSelector((state) => state.auth);

  const router = useRouter();

  useLayoutEffect(() => {
    if (userInfo) {
      router.replace("/quan-tri/thong-ke");
    }
  }, [userInfo]);

  return <div>{children}</div>;
}

export default AuthLayout;
