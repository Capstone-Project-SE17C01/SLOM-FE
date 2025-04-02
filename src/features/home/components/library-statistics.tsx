import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LibraryStatisticsChart } from "@/features/home/components/library-statistics-chart";

const popularDocuments = [
  { title: "Hiểu về Nghiện Ma Túy", views: 1250 },
  { title: "Tác Động của Lạm Dụng Ma Túy đối với Gia Đình", views: 980 },
  { title: "Chiến Lược Phòng Chống Ma Túy cho Trường Học", views: 875 },
];

export function LibraryStatistics() {
  return (
    <div className="grid gap-4 grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Tổng Số Tài Liệu</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-4xl font-bold">525</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Tổng Lượt Xem Tài Liệu</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-4xl font-bold">15.780</div>
        </CardContent>
      </Card>
      <Card className="md:col-span-2 lg:col-span-2">
        <CardHeader>
          <CardTitle>Tài Liệu Phổ Biến Nhất</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {popularDocuments.map((doc, index) => (
              <li key={index} className="flex justify-between">
                <span>{doc.title}</span>
                <span className="font-semibold">{doc.views} lượt xem</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
      <LibraryStatisticsChart />
    </div>
  );
}
