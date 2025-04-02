import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";

export default function AdminProfileSkeleton() {
  return (
    <div className="ml-4">
      <div className="flex items-center py-4 gap-4">
        <Skeleton className="h-20 w-20 rounded-full" />
        <div>
          <span className="flex gap-2 items-center">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-6 w-24" />
          </span>
          <Skeleton className="h-6 w-40 mt-2" />
          <Skeleton className="h-5 w-32 mt-1" />
        </div>
      </div>
      <Separator className="my-2" />
      <div className="">
        <Skeleton className="h-7 w-40 mb-4" />
        <div className="space-y-2">
          <span className="flex gap-2 text-sm">
            <Skeleton className="h-5 w-48" />
            <Skeleton className="h-5 w-32" />
          </span>
          <span className="flex gap-2 text-sm">
            <Skeleton className="h-5 w-48" />
            <Skeleton className="h-5 w-32" />
          </span>
          <span className="flex gap-2 text-sm">
            <Skeleton className="h-5 w-48" />
            <Skeleton className="h-5 w-32" />
          </span>
        </div>
      </div>
    </div>
  );
}
