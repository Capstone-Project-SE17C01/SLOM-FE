import { UserOverviewPieChart } from "./user-overview-piechart";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const userData = [
  { name: "Học sinh", value: 5000 },
  { name: "Tổ chức", value: 100 },
  { name: "Quản trị viên", value: 20 },
];

export function UserOverview() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader>
          <CardTitle className="h-8 flex leading-tight">
            Tổng Số Người Dùng
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-4xl font-bold">
            {userData.reduce((sum, entry) => sum + entry.value, 0)}
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="h-8 flex leading-tight">
            Người Dùng Hoạt Động <br />
            (7 Ngày Qua)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-4xl font-bold">3.245</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="h-8 flex leading-tight">
            Người Tham Gia Cuộc Thi
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-4xl font-bold">1.890</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="h-8 flex leading-tight">
            Người Dùng Thư Viện
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-4xl font-bold">2.567</div>
        </CardContent>
      </Card>
      <Card className="md:col-span-2 lg:col-span-4">
        <UserOverviewPieChart />
      </Card>
    </div>
  );
}
