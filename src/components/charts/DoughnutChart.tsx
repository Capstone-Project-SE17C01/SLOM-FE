"use client";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import React from "react";

ChartJS.register(ArcElement, Tooltip, Legend);

interface DoughnutChartProps {
  value: number;
  total: number;
  label: string;
  colors?: [string, string];
}

export default function DoughnutChart({
  value,
  total,
  label,
  colors = ["#10b981", "#e5e7eb"],
}: DoughnutChartProps) {
  const chartData = {
    labels: [label, "Others"],
    datasets: [
      {
        data: [value, total - value],
        backgroundColor: colors,
        borderWidth: 1,
        borderColor: ["transparent", "transparent"],
      },
    ],
  };

  return <Doughnut 
    data={chartData} 
    options={{ 
      cutout: "70%",
      plugins: {
        legend: {
          display: false,
        },
        tooltip: {
          backgroundColor: "rgba(0, 0, 0, 0.75)",
          padding: 10,
          cornerRadius: 4,
          titleFont: { size: 14, weight: 'bold' },
          bodyFont: { size: 13 },
        },
      },
    }} 
  />;
}
