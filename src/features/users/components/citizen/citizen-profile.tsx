"use client";

import { CheckCircledIcon, CrossCircledIcon } from "@radix-ui/react-icons";
import { Edit } from "lucide-react";
import { useParams } from "next/navigation";

import CitizenProfileSkeleton from "../sekeleton/admin.sekeleton";
import { useGetCitizenByIdQuery } from "../../api/citizen.api";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import TitlePage from "@/components/ui/title-page";
import { formatDate } from "@/utils/format-date";
import useBreadcrumb from "@/hooks/useBreadcrumb";

export default function CitizenProfileModule() {
  const { id } = useParams();
  const { data: citizenProfile, isFetching } = useGetCitizenByIdQuery({
    id,
  });

  useBreadcrumb([
    {
      label: "Công dân",
      href: "/nguoi-dung?tab=citizen",
    },
    {
      label: `${citizenProfile?.first_name} ${citizenProfile?.last_name}`,
    },
  ]);

  return (
    <>
      <TitlePage
        contentHref="Chỉnh sửa thông tin"
        href={`/nguoi-dung/cong-dan/${id}/chinh-sua`}
        startIcon={<Edit />}
        title="Trang cá nhân"
      />
      {isFetching ? (
        <CitizenProfileSkeleton />
      ) : (
        <div className="ml-4">
          <div className="flex items-center py-4 gap-4">
            <Avatar className="size-20">
              <AvatarImage
                alt={`Ảnh đại diện của ${citizenProfile?.first_name} ${citizenProfile?.last_name}`}
                src={citizenProfile?.avatar}
              />
              <AvatarFallback>{citizenProfile?.avatar}</AvatarFallback>
            </Avatar>
            <div>
              <span className="flex gap-2 items-center">
                <h2 className="font-semibold text-2xl">
                  {citizenProfile?.first_name} {citizenProfile?.last_name}
                </h2>
                <span>
                  {citizenProfile?.isActive ? (
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
                {citizenProfile?.email}
              </p>
              <p className="font-normal text-md text-primary/50">
                {citizenProfile?.phone_number}
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
                  {formatDate(citizenProfile?.created_at)}
                </p>
              </span>
              <span className="flex gap-2 text-sm">
                <h4>Chỉnh sửa gần nhất vào:</h4>
                <p className="text-primary/40">
                  {formatDate(citizenProfile?.updated_at)}
                </p>
              </span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
