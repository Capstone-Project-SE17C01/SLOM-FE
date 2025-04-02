import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const upcomingContests = [
  {
    name: "Cuộc Thi Kiến Thức Về Ma Túy",
    date: "15/07/2023",
    participants: 150,
  },
  {
    name: "Cuộc Thi Vẽ Tranh Phòng Chống Ma Túy",
    date: "22/07/2023",
    participants: 75,
  },
  {
    name: "Cuộc Thi Hùng Biện Về Phòng Chống Ma Túy",
    date: "29/07/2023",
    participants: 30,
  },
];

export function ContestManagement() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader>
          <CardTitle>Cuộc Thi Đang Diễn Ra</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-4xl font-bold">12</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Tổng Số Người Tham Gia</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-4xl font-bold">1.890</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Cuộc Thi Sắp Tới</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-4xl font-bold">3</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Tỷ Lệ Tham Gia Trung Bình</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-4xl font-bold">37,8%</div>
        </CardContent>
      </Card>
      <Card className="md:col-span-2 lg:col-span-4">
        <CardHeader>
          <CardTitle>Cuộc Thi Sắp Tới</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tên Cuộc Thi</TableHead>
                <TableHead>Ngày</TableHead>
                <TableHead>Số Người Đăng Ký</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {upcomingContests.map((contest) => (
                <TableRow key={contest.name}>
                  <TableCell>{contest.name}</TableCell>
                  <TableCell>{contest.date}</TableCell>
                  <TableCell>{contest.participants}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
