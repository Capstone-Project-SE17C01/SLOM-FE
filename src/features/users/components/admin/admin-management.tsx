"use client";
import React from "react";

import { useGetAllAdminQuery } from "../../api/admin.api";

import { columns } from "@/app/quan-tri/nguoi-dung/quan-tri-vien/admin.columns";
import DataTable from "@/components/data-table/data-table";
import TitlePage from "@/components/ui/title-page";

const AdminManagement = () => {
  const { adminData, isFetching } = useGetAllAdminQuery(
    {},
    {
      selectFromResult: ({ data, isFetching }) => ({
        adminData: data?.items ?? [],
        isFetching,
      }),
    }
  );

  return (
    <>
      <TitlePage
        contentHref="Thêm Quản trị viên"
        href="nguoi-dung/quan-tri-vien/them"
        title="Quản lí Quản trị viên"
      />
      <DataTable columns={columns} data={adminData} isLoading={isFetching} />
    </>
  );
};

export default AdminManagement;
