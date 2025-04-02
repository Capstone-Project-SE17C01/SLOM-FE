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
import { Library } from "@/features/library/library.type";
import { useDeleteLibraryMutation } from "@/features/library/api";
import { isImageLink } from "@/utils/checkimage";

export const columns: ColumnDef<Library>[] = [
  {
    accessorKey: "category_name",
    header: "Tiêu đề",
    cell: ({ row }) => {
      return <div className="font-medium">{row.getValue("category_name")}</div>;
    },
  },
  {
    accessorKey: "topic_name",
    header: "Chủ đề",
  },
  {
    accessorKey: "image",
    header: "Ảnh biểu tượng",
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
    cell: ({ row }) => ActionRow({ row }),
  },
];

const ActionRow = ({ row }: { row: Row<Library> }) => {
  const [deleteLibrary] = useDeleteLibraryMutation();
  const handleDeleteLibrary = async (id: string) => {
    try {
      const promise = () =>
        new Promise((resolve) => {
          resolve(deleteLibrary({ id }).unwrap());
        });

      toast.promise(promise, {
        loading: "đang xóa thư viện...",
        success: "Xóa thư viện thành công",
        error: "Không thể xóa",
      });
    } catch (err) {}
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
            href={`thu-vien/${row.original._id}`}
          >
            <Eye className="w-4 h-4 text-blue-500" />
            {<span className="">{"Xem"}</span>}
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Link
            className="flex gap-2 w-full"
            href={`thu-vien/${row.original._id}/chinh-sua`}
          >
            <Pencil className="h-4 w-4 text-green-500" />
            {<span className="">{"Thay đổi"}</span>}
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem>
          <button
            className="flex gap-2 w-full"
            onClick={() => handleDeleteLibrary(row.original._id)}
          >
            <Trash2 className="h-4 w-4 text-red-500" />
            {<span className="">{"Xóa"}</span>}
          </button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
