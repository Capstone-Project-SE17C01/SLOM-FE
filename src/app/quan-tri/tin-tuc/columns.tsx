"use client";

import { ColumnDef, Row } from "@tanstack/react-table";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import { Eye, Pencil, Trash2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { toast } from "sonner";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { TypeNews } from "@/features/news/news.type";
import { isImageLink } from "@/utils/checkimage";
import { useDeleteNewsMutation } from "@/features/news/api";
import { formatDate } from "@/utils/format-date";
import { DataTopic } from "@/features/topic/topic.type";

export const columns: ColumnDef<TypeNews>[] = [
  {
    accessorKey: "title",
    header: "Tiêu đề",
    cell: ({ row }) => {
      return <div className="font-medium">{row.getValue("title")}</div>;
    },
  },
  {
    accessorKey: "author",
    header: "Tác giả",
  },
  {
    accessorKey: "created_by",
    header: "Người đăng",
    cell: ({ row }) => {
      const value = row.getValue("created_by");

      return value ? (
        <div className="font-medium">{row.getValue("title")}</div>
      ) : (
        <p className="text-red-500">*không tìm thấy người đăng</p>
      );
    },
  },
  {
    accessorKey: "topic_id",
    header: "Chủ đề",
    cell: ({ row }) => {
      const topic: DataTopic = row.getValue("topic_id");

      return <p>{topic?.topic_name}</p>;
    },
  },
  {
    accessorKey: "created_at",
    header: "Ngày đăng tải",
    cell: ({ row }) => formatDate(row.getValue("created_at")),
  },
  {
    accessorKey: "image",
    header: "Ảnh Bìa",
    cell: ({ row }) => {
      const value: string | null = isImageLink(row.getValue("image"))
        ? row.getValue("image")
        : null;

      return value ? (
        <Image alt="icon" height={400} src={value} width={400} />
      ) : (
        <p className="text-red-500">*không tìm thấy ảnh</p>
      );
    },
  },
  {
    accessorKey: "otherInformation",
    header: "Thông tin khác",
  },
  {
    id: "actions",
    cell: ({ row }) => {
      return <ActionRow row={row} />;
    },
  },
];

const ActionRow = ({ row }: { row: Row<TypeNews> }) => {
  const [deleteNews] = useDeleteNewsMutation();
  const handleDeleteNews = async (id: string) => {
    const toastID = toast.loading("đang xóa bài báo...");

    try {
      await deleteNews({ id }).unwrap();

      toast.success("Xóa bài báo thành công", { id: toastID });
    } catch (err) {
      toast.error("Xóa bài báo thất bại", { id: toastID });
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
          variant="ghost"
        >
          <DotsHorizontalIcon className="h-4 w-4" />
          <span className="sr-only">{"Open Menu"}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem>
          <Link
            className="flex gap-2 w-full"
            href={`tin-tuc/${row.original._id}`}
          >
            <Eye className="w-4 h-4 text-blue-500" />
            {<span className="">{"Xem"}</span>}
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Link
            className="flex gap-2 w-full"
            href={`tin-tuc/${row.original._id}/chinh-sua`}
          >
            <Pencil className="h-4 w-4 text-green-500" />
            {<span className="">{"Thay đổi"}</span>}
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem>
          <button
            className="flex gap-2 w-full"
            onClick={() => handleDeleteNews(row.original._id)}
          >
            <Trash2 className="h-4 w-4 text-red-500" />
            {<span className="">{"Xóa"}</span>}
          </button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
