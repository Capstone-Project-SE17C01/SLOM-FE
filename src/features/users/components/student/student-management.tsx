"use client";
import React from "react";

import { useGetAllStudentsQuery } from "../../api/student.api";
import { Student } from "../../user.types";

import { columns } from "@/app/quan-tri/nguoi-dung/hoc-sinh/student.columns";
import DataTable from "@/components/data-table/data-table";
import TitlePage from "@/components/ui/title-page";

const StudentManagement = () => {
  const { students, isFetching } = useGetAllStudentsQuery(
    {},
    {
      selectFromResult: ({ data, isFetching }) => ({
        students:
          data?.items?.map((item: Student) => ({
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
        contentHref="Thêm học sinh viên"
        href="nguoi-dung/hoc-sinh/them"
        title="Quản lí học sinh"
      />
      <DataTable columns={columns} data={students} isLoading={isFetching} />
    </>
  );
};

export default StudentManagement;
