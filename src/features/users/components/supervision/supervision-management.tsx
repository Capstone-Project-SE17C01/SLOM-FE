"use client";
import React from "react";

import { useGetAllSupervisionQuery } from "../../api/supervison.api";
import { Supervision } from "../../user.types";

import { columns } from "@/app/quan-tri/nguoi-dung/quan-sat-vien/suppervision.columns";
import DataTable from "@/components/data-table/data-table";
import TitlePage from "@/components/ui/title-page";

const SuperVisionManagement = () => {
  const { adminData, isFetching } = useGetAllSupervisionQuery(
    {},
    {
      selectFromResult: ({ data, isFetching }) => ({
        adminData:
          data?.items?.map((item: Supervision) => ({
            ...item,
            full_name: `${item.first_name} ${item.last_name}`,
          })) ?? [],
        isFetching,
      }),
    }
  );

  return (
    <>
      <TitlePage
        contentHref="Thêm Quản sát viên"
        href="nguoi-dung/quan-sat-vien/them"
        title="Quản lí Quản sát viên"
      />
      <DataTable columns={columns} data={adminData} isLoading={isFetching} />
    </>
  );
};

export default SuperVisionManagement;
