"use client";

import { CheckCircledIcon, CrossCircledIcon } from "@radix-ui/react-icons";
import { Edit } from "lucide-react";
import { useParams } from "next/navigation";

import ManagerProfileSkeleton from "../sekeleton/admin.sekeleton";
import { useGetManagerQuery } from "../../api/manager.api";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import TitlePage from "@/components/ui/title-page";
import { formatDate } from "@/utils/format-date";
import useBreadcrumb from "@/hooks/useBreadcrumb";

export default function ManagerProfileModule() {
  const { id } = useParams();
  const { data: ManagerProfile, isFetching } = useGetManagerQuery({
    id,
  });

  useBreadcrumb([
    {
      label: "Quản lí viên",
      href: "/nguoi-dung?tab=manager",
    },
    {
      label: ManagerProfile?.full_name,
    },
  ]);

  return (
    <>
      <TitlePage
        contentHref="Chỉnh sửa thông tin"
        href={`/nguoi-dung/quan-li-vien/${id}/chinh-sua`}
        startIcon={<Edit />}
        title="Trang cá nhân"
      />
      {isFetching ? (
        <ManagerProfileSkeleton />
      ) : (
        <div className="ml-4">
          <div className="flex items-center py-4 gap-4">
            <Avatar className="size-20">
              <AvatarImage
                alt={`Ảnh đại diện của ${ManagerProfile?.full_name}`}
                src={ManagerProfile?.avatar}
              />
              <AvatarFallback>{ManagerProfile?.avatar}</AvatarFallback>
            </Avatar>
            <div>
              <span className="flex gap-2 items-center">
                <h2 className="font-semibold text-2xl">
                  {ManagerProfile?.full_name}
                </h2>
                <span>
                  {ManagerProfile?.isActive ? (
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
                {ManagerProfile?.email}
              </p>
              <p className="font-normal text-md text-primary/50">
                {ManagerProfile?.phone_number}
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
                  {formatDate(ManagerProfile?.created_at)}
                </p>
              </span>
              <span className="flex gap-2 text-sm">
                <h4>Chỉnh sửa gần nhất vào:</h4>
                <p className="text-primary/40">
                  {formatDate(ManagerProfile?.updated_at)}
                </p>
              </span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
