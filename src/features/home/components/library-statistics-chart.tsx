"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

const documentData = [
  { category: "Video", count: 150 },
  { category: "Bài viết", count: 300 },
  { category: "Báo cáo nghiên cứu", count: 75 },
];

const viewsTrendData = [
  { month: "T1", views: 5000 },
  { month: "T2", views: 6200 },
  { month: "T3", views: 7800 },
  { month: "T4", views: 9100 },
  { month: "T5", views: 11000 },
  { month: "T6", views: 13500 },
];

export function LibraryStatisticsChart() {
  return (
    <Card className="md:col-span-2 lg:col-span-3">
      <CardHeader>
        <CardTitle>Thống Kê Tài Liệu</CardTitle>
        <CardDescription>
          Phân loại tài liệu và xu hướng lượt xem
        </CardDescription>
      </CardHeader>
      <CardContent className="grid lg:grid-cols-2 md:grid-cols-1">
        <ChartContainer className="h-[300px]" config={{}}>
          <ResponsiveContainer height="100%" width="100%">
            <BarChart data={documentData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="category" />
              <YAxis />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="count" fill="hsl(var(--chart-1))" />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
        <ChartContainer className="h-[300px]" config={{}}>
          <ResponsiveContainer height="100%" width="100%">
            <LineChart data={viewsTrendData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Line
                dataKey="views"
                stroke="hsl(var(--chart-2))"
                type="monotone"
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
