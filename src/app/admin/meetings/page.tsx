"use client";

import {
  useGetActiveMeetingQuery,
  useGetScheduledMeetingQuery,
  useGetMeetingRecordQuery,
} from "@/api/MeetingApi";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
  Title,
} from "chart.js";

import "chart.js/auto";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
  Title
);

export default function MeetingsPage() {
  const { data: activeData, isLoading: loadingActive, error: errorActive } = useGetActiveMeetingQuery();
  const { data: scheduledData, isLoading: loadingScheduled, error: errorScheduled } = useGetScheduledMeetingQuery();
  const { data: recordData, isLoading: loadingRecord, error: errorRecord } = useGetMeetingRecordQuery();

  const activeChartData = {
    labels: ["Active Meetings"],
    datasets: [
      {
        label: "Active Meetings",
        data: [typeof activeData === "number" ? activeData : 0],
        backgroundColor: "#6947A8",
      },
    ],
  };

  const scheduledChartData = {
    labels: ["Scheduled Meetings"],
    datasets: [
      {
        label: "Scheduled Meetings",
        data: [typeof scheduledData === "number" ? scheduledData : 0],
        backgroundColor: "#36A2EB",
      },
    ],
  };

  const recordChartData = {
    labels: ["Meeting Records"],
    datasets: [
      {
        label: "Meeting Records",
        data: [typeof recordData === "number" ? recordData : 0],
        backgroundColor: "#43B97F",
      },
    ],
  };

  const barOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
      title: { display: false },
    },
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#f8fafc] to-[#e9e4f0] dark:from-[#232946] dark:to-[#6947A8] py-10">
      <h1 className="text-4xl font-bold mb-10 text-[#6947A8] dark:text-white text-center drop-shadow-lg">
        Meeting Statistics
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10 w-full max-w-6xl">
        <div className="bg-white dark:bg-[#232946] rounded-2xl shadow-lg p-8 flex flex-col items-center">
          <h2 className="text-xl font-semibold mb-4 text-[#6947A8] dark:text-white">Active Meetings</h2>
          {loadingActive ? (
            <div className="text-gray-500">Loading...</div>
          ) : errorActive ? (
            <div className="text-red-500">Failed to load data</div>
          ) : (
            <Bar data={activeChartData} options={barOptions} />
          )}
        </div>
        <div className="bg-white dark:bg-[#232946] rounded-2xl shadow-lg p-8 flex flex-col items-center">
          <h2 className="text-xl font-semibold mb-4 text-[#6947A8] dark:text-white">Scheduled Meetings</h2>
          {loadingScheduled ? (
            <div className="text-gray-500">Loading...</div>
          ) : errorScheduled ? (
            <div className="text-red-500">Failed to load data</div>
          ) : (
            <Bar data={scheduledChartData} options={barOptions} />
          )}
        </div>
        <div className="bg-white dark:bg-[#232946] rounded-2xl shadow-lg p-8 flex flex-col items-center">
          <h2 className="text-xl font-semibold mb-4 text-[#6947A8] dark:text-white">Meeting Records</h2>
          {loadingRecord ? (
            <div className="text-gray-500">Loading...</div>
          ) : errorRecord ? (
            <div className="text-red-500">Failed to load data</div>
          ) : (
            <Bar data={recordChartData} options={barOptions} />
          )}
        </div>
      </div>
    </div>
  );
}
