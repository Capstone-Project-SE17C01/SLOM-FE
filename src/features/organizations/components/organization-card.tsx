import { Organization } from "@/features/organizations/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface OrganizationCardProps {
  organization: Organization;
}

export function OrganizationCard({ organization }: OrganizationCardProps) {
  return (
    <Card className="w-full max-w-md hover:bg-accent hover:text-accent-foreground transition-all">
      <CardHeader className="flex flex-row items-center gap-4">
        <Avatar className="h-16 w-16">
          <AvatarImage alt={organization.name} src={organization.image} />
          <AvatarFallback>
            {organization.name.slice(0, 3).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          <CardTitle>{organization.name}</CardTitle>
          <p className="text-sm text-muted-foreground">{organization.email}</p>
        </div>
      </CardHeader>
      <CardContent>
        <dl className="grid grid-cols-3 gap-2 text-sm">
          {/* <dt className="font-semibold">Password:</dt>
          <dd>{"•".repeat(8)}</dd> */}
          <dt className="col-span-1 font-semibold">Tỉnh Thành:</dt>
          <dd className="col-span-2">{organization.province}</dd>
          <dt className="col-span-1 font-semibold ">Mô tả:</dt>
          <dd className="col-span-2 text-ellipsis overflow-hidden">
            {organization.description}
          </dd>
        </dl>
      </CardContent>
    </Card>
  );
}
