"use no memo";

import { Cross2Icon } from "@radix-ui/react-icons";
import { Table } from "@tanstack/react-table";

import { Label } from "../ui/label";

import { DataTableViewOptions } from "./data-table-view-options";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
}

export function DataTableToolbar<TData>({
  table,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;

  return (
    <div className="flex w-full items-center justify-between">
      <div className="flex flex-1 items-end space-x-4 ">
        <div className="flex flex-col w-60">
          <Label className="mb-1 text-sm block" htmlFor="search ">
            Tìm kiếm
          </Label>
          <Input
            className="h-8"
            id="search"
            placeholder="Tìm kiếm"
            // value={
            //   (table.getColumn("userName")?.getFilterValue() as string) ?? ""
            // }
            // onChange={(event) =>
            //   table.getColumn("userName")?.setFilterValue(event.target.value)
            // }
          />
        </div>
        {/* <div className="flex flex-col">
          <Label
            className="mb-1 text-sm block"
            htmlFor={table.getColumn("status")?.id}
          >
            Lọc trạng thái
          </Label>
          {table.getColumn("status") && (
            <DataTableFacetedFilter
              column={table.getColumn("status")}
              id={table.getColumn("status")?.id}
              options={usersStatus}
              title={"Trạng thái"}
            />
          )}
        </div>

        <div className="flex flex-col">
          <Label
            className="mb-1 text-sm block"
            htmlFor={table.getColumn("role")?.id}
          >
            Lọc quyền
          </Label>
          {table.getColumn("status") && (
            <DataTableFacetedFilter
              column={table.getColumn("role")}
              id={table.getColumn("role")?.id}
              options={usersRole}
              title={"Quyền"}
            />
          )}
        </div> */}

        {isFiltered && (
          <Button
            className="h-8 px-2 lg:px-3"
            variant="outline"
            onClick={() => table.resetColumnFilters()}
          >
            <Cross2Icon className=" h-4 w-4" />

            {"Xoá bộ lọc"}
          </Button>
        )}
      </div>
      <DataTableViewOptions table={table} />
    </div>
  );
}
