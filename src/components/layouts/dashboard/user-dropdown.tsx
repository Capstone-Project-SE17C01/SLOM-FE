"use client";

import React, { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { User } from "lucide-react";
import Link from "next/link";
import { useAppSelector } from "@/hooks/redux-toolkit";
import { useRouter } from "next/navigation";

const user = {
  fullName: "Jane Doe",
  imageUrl: "https://randomuser",
  emailAddresses: "thangtvb.dev@gmail.com",
};

function UserDropdown() {
  const router = useRouter();

  const { userInfo } = useAppSelector((state) => state.auth);

  const [isOpen, setIsOpen] = useState(false);

  const handleSignOut = () => {
    router.push("/dang-nhap");
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarImage
              src={userInfo?.avatarUrl}
              alt={`${userInfo?.firstname || ""} ${userInfo?.lastname || ""}`}
            />
            <AvatarFallback>
              <User className="h-4 w-4" />
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">
              {`${userInfo?.firstname || ""} ${userInfo?.lastname || ""}`}
            </p>
            <p className="text-xs leading-none text-muted-foreground">
              {user?.emailAddresses}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <Link href="/profile" className="w-full">
            Profile
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Link href="/cv" className="w-full">
            CV Attachment
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Link href="/settings" className="w-full">
            Settings
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <button className="w-full text-left" onClick={handleSignOut}>
            Sign out
          </button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default UserDropdown;
