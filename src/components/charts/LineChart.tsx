"use client";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import React from "react";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface DataPoint {
  date: string;
  value: number;
}

interface LineChartProps {
  data: DataPoint[];
  label: string;
  color?: string;
}

export default function LineChart({
  data,
  label,
  color = "rgba(59,130,246,1)",
}: LineChartProps) {
  const chartData = {
    labels:
      data?.map((d) => {
        const dateObj = new Date(d.date);
        const day = String(dateObj.getDate()).padStart(2, "0");
        const month = String(dateObj.getMonth() + 1).padStart(2, "0");
        const year = dateObj.getFullYear();
        return `${day}/${month}/${year}`;
      }) || [],
    datasets: [
      {
        label,
        data: data?.map((d) => d.value) || [],
        borderColor: color,
        backgroundColor: color,
        tension: 0.4,
        fill: false,
      },
    ],
  };

  return (
    <Line
      data={chartData}
      options={{ responsive: true, plugins: { legend: { display: false } } }}
    />
  );
}
