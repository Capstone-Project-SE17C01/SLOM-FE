"use no memo";

// import { UserSchema } from "@/app/users/userSchema";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import { Row } from "@tanstack/react-table";
import { Eye, Pencil, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface DataTableRowActionsProps<TData> {
  row: Row<TData>;
}

export function DataTableRowActions<TData>({
  row,
}: DataTableRowActionsProps<TData>) {
  // const user = UserSchema.parse(row.original);
  // console.log(user.id); // Note: use the id for any action (example: delete, view, edit)

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
          <Eye className="w-4 h-4 text-blue-500" />
          {<span className="">{"View"}</span>}
        </DropdownMenuItem>

        <DropdownMenuItem>
          <Pencil className="h-4 w-4 text-green-500" />
          {<span className="">{"Update"}</span>}
        </DropdownMenuItem>

        <DropdownMenuItem>
          <Trash2 className="h-4 w-4 text-red-500" />
          {<span className="">{"Delete"}</span>}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
