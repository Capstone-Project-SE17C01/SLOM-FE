import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export function OrganizationManagement() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <Card>
        <CardHeader>
          <CardTitle>Tổng Số Tổ Chức</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-4xl font-bold">100</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Tổ Chức Có Cuộc Thi</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-4xl font-bold">78</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Tỷ lệ các tổ chức đã tổ chức cuộc thi</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-4xl font-bold">85%</div>
          <Progress className="mt-2" value={85} />
        </CardContent>
      </Card>
    </div>
  );
}
