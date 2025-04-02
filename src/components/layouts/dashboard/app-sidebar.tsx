"use client";

import * as React from "react";
import {
  Home,
  LibraryBig,
  Newspaper,
  Pyramid,
  School,
  Users,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/utils/cn";

const sideBarItems = [
  {
    name: "Trang chủ",
    url: "/trang-chu",
    icon: Home,
  },
  {
    name: "Người dùng",
    url: "/nguoi-dung",
    icon: Users,
  },
  {
    name: "Tổ chức",
    url: "/to-chuc",
    icon: School,
  },
  {
    name: "Cuộc thi",
    url: "/cuoc-thi",
    icon: Pyramid,
  },
  {
    name: "Tin tức",
    url: "/tin-tuc",
    icon: Newspaper,
  },
  {
    name: "Thư viện",
    url: "/thu-vien",
    icon: LibraryBig,
  },
];

export function AppSidebar({
  setIsOpen,
  ...props
}: {
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
} & React.ComponentProps<typeof Sidebar>) {
  const { open } = useSidebar();
  const pathname = usePathname();

  const rootPath = pathname?.split("/")?.[1];

  React.useEffect(() => {
    setIsOpen(open);
  }, [open, setIsOpen]);

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader className=" ">
        <div
          className={cn(
            "flex gap-2 items-center transition-all",
            open ? "p-2" : "p-0"
          )}
        >
          <Image
            src="/images/logo/logo.png"
            width={100}
            height={100}
            className="w-9 h-auto"
            alt="logo"
          />
          {open && <h3 className="text-xl font-bold">SafeEdu</h3>}
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            {sideBarItems.map((item) => (
              <SidebarMenuItem key={item.name}>
                <SidebarMenuButton
                  asChild
                  className={cn(
                    item.url === `/${rootPath}` && " bg-sidebar-accent"
                  )}
                >
                  <Link href={item.url}>
                    <item.icon />
                    <span>{item.name}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
