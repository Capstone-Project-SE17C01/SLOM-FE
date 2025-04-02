"use client";

import { CheckCircledIcon, CrossCircledIcon } from "@radix-ui/react-icons";
import { Edit } from "lucide-react";
import { useParams } from "next/navigation";

import AdminProfileSkeleton from "../sekeleton/admin.sekeleton";
import { useGetAdminQuery } from "../../api/admin.api";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import TitlePage from "@/components/ui/title-page";
import { formatDate } from "@/utils/format-date";
import useBreadcrumb from "@/hooks/useBreadcrumb";

export default function UserProfileModule() {
  const { id } = useParams();
  const { data: adminProfile, isFetching } = useGetAdminQuery({ id });

  useBreadcrumb([
    {
      label: "Quản trị viên",
      href: "/nguoi-dung?tab=admin",
    },
    {
      label: adminProfile?.full_name,
    },
  ]);

  return (
    <>
      <TitlePage
        contentHref="Chỉnh sửa thông tin"
        href={`/nguoi-dung/quan-tri-vien/${id}/chinh-sua`}
        startIcon={<Edit />}
        title="Trang cá nhân"
      />
      {isFetching ? (
        <AdminProfileSkeleton />
      ) : (
        <div className="ml-4">
          <div className="flex items-center py-4 gap-4">
            <Avatar className="size-20">
              <AvatarImage
                alt={`Ảnh đại diện của ${adminProfile?.full_name}`}
                src={adminProfile?.avatar}
              />
              <AvatarFallback>{adminProfile?.avatar}</AvatarFallback>
            </Avatar>
            <div>
              <span className="flex gap-2 items-center">
                <h2 className="font-semibold text-2xl">
                  {adminProfile?.full_name}
                </h2>
                <span>
                  {adminProfile?.isActive ? (
                    <span className="text-green-500 flex gap-1 items-center">
                      <CheckCircledIcon className="size-4 " />
                      <p>Hoạt động</p>
                    </span>
                  ) : (
                    <span className="text-red-500 flex gap-1 items-center">
                      <CrossCircledIcon className="size-4" />
                      <p>Tạm ngừng</p>
                    </span>
                  )}
                </span>
              </span>
              <p className="font-medium text-lg text-primary/80">
                {adminProfile?.email}
              </p>
              <p className="font-normal text-md text-primary/50">
                {adminProfile?.phone_number}
              </p>
            </div>
          </div>
          <Separator className="my-2" />
          <div className="">
            <h4 className="text-xl font-bold mb-4">Thông tin khác</h4>
            <div className="space-y-2">
              <span className="flex gap-2 text-sm">
                <h4>Tài khoản được tạo vào:</h4>
                <p className="text-primary/40">
                  {formatDate(adminProfile?.created_at)}
                </p>
              </span>
              <span className="flex gap-2 text-sm">
                <h4>Chỉnh sửa gần nhất vào:</h4>
                <p className="text-primary/40">
                  {formatDate(adminProfile?.updated_at)}
                </p>
              </span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
