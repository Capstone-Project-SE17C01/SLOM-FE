"use client";
import React from "react";

import { Citizens } from "../../user.types";
import { useGetAllCitizensQuery } from "../../api/citizen.api";

import { columns } from "@/app/quan-tri/nguoi-dung/cong-dan/citizen.columns";
import DataTable from "@/components/data-table/data-table";
import TitlePage from "@/components/ui/title-page";

const CitizenManagement = () => {
  const { citizens, isFetching } = useGetAllCitizensQuery(
    {},
    {
      selectFromResult: ({ data, isFetching }) => ({
        citizens:
          data?.items?.map((item: Citizens) => ({
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
        contentHref="Thêm công dân"
        href="nguoi-dung/cong-dan/them"
        title="Quản lí công dân"
      />
      <DataTable columns={columns} data={citizens} isLoading={isFetching} />
    </>
  );
};

export default CitizenManagement;
