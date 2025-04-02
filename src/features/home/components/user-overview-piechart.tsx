"use client";

import {
  Bar,
  BarChart,
  Pie,
  PieChart,
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
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

const userData = [
  { name: "Học sinh", value: 500, fill: "var(--color-student)" },
  { name: "Tổ chức", value: 100, fill: "var(--color-organization)" },
  { name: "Quản trị viên", value: 20, fill: "var(--color-admin)" },
];

const weeklyActiveUsers = [
  { day: "T2", users: 450 },
  { day: "T3", users: 530 },
  { day: "T4", users: 620 },
  { day: "T5", users: 590 },
  { day: "T6", users: 680 },
  { day: "T7", users: 510 },
  { day: "CN", users: 420 },
];

const chartConfig = {
  value: {
    label: "Value",
  },
  student: {
    label: "Học sinh",
    color: "hsl(var(--chart-1))",
  },
  organization: {
    label: "Tổ chức",
    color: "hsl(var(--chart-2))",
  },
  admin: {
    label: "Quản trị viên",
    color: "hsl(var(--chart-3))",
  },
} satisfies ChartConfig;

export function UserOverviewPieChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Phân Bố và Hoạt Động Người Dùng</CardTitle>
        <CardDescription>
          Phân bố người dùng theo vai trò và hoạt động hàng ngày
        </CardDescription>
      </CardHeader>
      <CardContent className="grid lg:grid-cols-2 md:grid-cols-1 pb-0">
        <ChartContainer
          className="mx-auto aspect-square max-h-[300px]"
          config={chartConfig}
        >
          <PieChart>
            <ChartTooltip
              content={<ChartTooltipContent hideLabel />}
              cursor={false}
            />
            <Pie data={userData} dataKey="value" />
            <ChartLegend className="-translate-y-2 flex-wrap gap-2 [&>*]:basis-1/4 [&>*]:justify-center" />
          </PieChart>
        </ChartContainer>
        <ChartContainer className="h-[300px]" config={{}}>
          <ResponsiveContainer height="100%" width="100%">
            <BarChart data={weeklyActiveUsers}>
              <XAxis dataKey="day" />
              <YAxis />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="users" fill="hsl(var(--chart-1))" />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
