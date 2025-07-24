"use client";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import React from "react";

ChartJS.register(ArcElement, Tooltip, Legend);

interface DoughnutChartProps {
  value: number;
  total: number;
  label: string;
}

export default function DoughnutChart({
  value,
  total,
  label,
}: DoughnutChartProps) {
  const chartData = {
    labels: [label, "Others"],
    datasets: [
      {
        data: [value, total - value],
        backgroundColor: ["#10b981", "#e5e7eb"],
        borderWidth: 1,
      },
    ],
  };

  return <Doughnut data={chartData} options={{ cutout: "70%" }} />;
}
