"use client";

import { useEffect, useLayoutEffect, useState } from "react";
import { useRouter } from "next-nprogress-bar";

import ThemeSwitcher from "./theme-switcher";
import UserDropdown from "./user-dropdown";
import NotificationDropdown from "./notification-dropdown";
import { HeaderBreadcrumb } from "./header-breadcrumb";

import { AppSidebar } from "@/components/layouts/dashboard/app-sidebar";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { cn } from "@/utils/cn";
import { useAppSelector } from "@/hooks/redux-toolkit";

const getScrollbarWidth = (): number => {
  if (typeof window === "undefined" || typeof document === "undefined") {
    return 0;
  }

  return window.innerWidth - document.documentElement.clientWidth;
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [open, setIsOpen] = useState(true);

  const [scrollbarWidth, setScrollbarWidth] = useState(0);

  useEffect(() => {
    const updateScrollbarWidth = () => setScrollbarWidth(getScrollbarWidth());

    updateScrollbarWidth();
    window.addEventListener("resize", updateScrollbarWidth);

    return () => window.removeEventListener("resize", updateScrollbarWidth);
  }, [open]);

  const { userInfo } = useAppSelector((state) => state.auth);
  const { breadcrumbs } = useAppSelector((state) => state.layout);

  const router = useRouter();

  useLayoutEffect(() => {
    if (!userInfo) {
      router.replace("/dang-nhap");
    }
  }, [userInfo]);

  return (
    <SidebarProvider>
      <AppSidebar setIsOpen={setIsOpen} />
      <SidebarInset>
        <header
          className={cn(
            "flex dark:bg-sidebar/60 z-10 backdrop-blur-md h-16 shrink-0 items-center px-4 gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12 shadow-sm fixed right-0 bg-white/60"
          )}
          style={{
            width: open
              ? `calc(100vw - 255px - ${scrollbarWidth}px)`
              : `calc(100vw - 47px - ${scrollbarWidth}px)`,
          }}
        >
          <div className="flex items-center gap-2 justify-between w-full">
            <div className="flex items-center">
              <SidebarTrigger className="-ml-1" />
              <Separator className="mr-2 h-4" orientation="vertical" />
              {breadcrumbs?.length > 0 && (
                <HeaderBreadcrumb items={breadcrumbs} />
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <ThemeSwitcher />
            <NotificationDropdown />
            <UserDropdown />
          </div>
        </header>
        <div
          className={cn(
            "flex flex-1 flex-col gap-4 p-4 dark:bg-foreground/30  bg-[#e2e6dc] transition-all overflow-auto",
            open ? "mt-16" : "mt-12"
          )}
        >
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
