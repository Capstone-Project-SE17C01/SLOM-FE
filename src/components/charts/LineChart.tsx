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
  fillColor?: string;
  showGrid?: boolean;
}

export default function LineChart({
  data,
  label,
  color = "rgba(59,130,246,1)",
  fillColor,
  showGrid = false,
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
        backgroundColor: fillColor || color,
        tension: 0.4,
        fill: !!fillColor,
        pointBackgroundColor: color,
        pointBorderColor: "#fff",
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
    ],
  };

  return (
    <Line
      data={chartData}
      options={{ 
        responsive: true, 
        plugins: { 
          legend: { display: false },
          tooltip: {
            backgroundColor: "rgba(0, 0, 0, 0.75)",
            padding: 10,
            cornerRadius: 4,
            titleFont: { size: 14, weight: 'bold' },
            bodyFont: { size: 13 },
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            grid: {
              display: showGrid,
              color: "rgba(0, 0, 0, 0.05)",
            },
            ticks: {
              precision: 0,
            }
          },
          x: {
            grid: {
              display: false,
            },
          },
        },
      }}
    />
  );
}
