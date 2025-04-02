import { ChevronRight, Home } from "lucide-react";

import { BreadcrumbItemInterface } from "./slice";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

interface BreadcrumbProps {
  items: BreadcrumbItemInterface[];
}

export function HeaderBreadcrumb({ items }: BreadcrumbProps) {
  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink className="flex items-center" href="/">
            <Home className="h-4 w-4 mr-2" />
            Trang chủ
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator>
          <ChevronRight className="h-4 w-4" />
        </BreadcrumbSeparator>
        {items.map((item, index) => (
          <BreadcrumbItem key={item.href ?? index}>
            {index === items.length - 1 ? (
              <BreadcrumbPage className="max-w-80 truncate">
                {item.label}
              </BreadcrumbPage>
            ) : (
              <>
                <BreadcrumbLink className="max-w-80 truncate" href={item.href}>
                  {item.label}
                </BreadcrumbLink>
                <ChevronRight className="h-4 w-4" />
              </>
            )}
          </BreadcrumbItem>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
