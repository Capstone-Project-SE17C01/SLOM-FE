"use client";
import React from "react";

import { Manager } from "../../user.types";
import { useGetAllManagerQuery } from "../../api/manager.api";

import { columns } from "@/app/quan-tri/nguoi-dung/quan-li-vien/manager.columns";
import DataTable from "@/components/data-table/data-table";
import TitlePage from "@/components/ui/title-page";

const ManagerManagement = () => {
  const { managers, isFetching } = useGetAllManagerQuery(
    {},
    {
      selectFromResult: ({ data, isFetching }) => ({
        managers:
          data?.items?.map((item: Manager) => ({
            ...item,
            full_name: `${item?.first_name} ${item?.last_name}`,
          })) ?? [],
        isFetching,
      }),
    }
  );

  return (
    <>
      <TitlePage
        contentHref="Thêm Quản lí viên"
        href="nguoi-dung/quan-li-vien/them"
        title="Quản lí Quản lí viên"
      />
      <DataTable columns={columns} data={managers} isLoading={isFetching} />
    </>
  );
};

export default ManagerManagement;
