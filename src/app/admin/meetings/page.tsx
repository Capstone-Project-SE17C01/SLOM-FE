"use client";

import {
  useGetActiveMeetingQuery,
  useGetScheduledMeetingQuery,
  useGetMeetingRecordQuery,
  useGetAllMeetingsQuery
} from "@/api/MeetingApi";
import { Bar, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Tooltip,
  Legend,
  Title,
} from "chart.js";

import "chart.js/auto";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Tooltip,
  Legend,
  Title
);

export default function MeetingsPage() {
  const { data: activeData, isLoading: loadingActive, error: errorActive } = useGetActiveMeetingQuery();
  const { data: scheduledData, isLoading: loadingScheduled, error: errorScheduled } = useGetScheduledMeetingQuery();
  const { data: recordData, isLoading: loadingRecord, error: errorRecord } = useGetMeetingRecordQuery();
  const { data: allMeetings, isLoading: loadingAllMeetings, error: errorAllMeetings } = useGetAllMeetingsQuery();

  const activeChartData = {
    labels: ["Active"],
    datasets: [
      {
        label: "Active Meetings",
        data: [typeof activeData === "number" ? activeData : 0],
        backgroundColor: "rgba(105, 71, 168, 0.8)",
        borderColor: "rgba(105, 71, 168, 1)",
        borderWidth: 1,
        borderRadius: 6,
      },
    ],
  };

  const scheduledChartData = {
    labels: ["Scheduled"],
    datasets: [
      {
        label: "Scheduled Meetings",
        data: [typeof scheduledData === "number" ? scheduledData : 0],
        backgroundColor: "rgba(54, 162, 235, 0.8)",
        borderColor: "rgba(54, 162, 235, 1)",
        borderWidth: 1,
        borderRadius: 6,
      },
    ],
  };

  const recordChartData = {
    labels: ["Records"],
    datasets: [
      {
        label: "Meeting Records",
        data: [typeof recordData === "number" ? recordData : 0],
        backgroundColor: "rgba(67, 185, 127, 0.8)",
        borderColor: "rgba(67, 185, 127, 1)",
        borderWidth: 1,
        borderRadius: 6,
      },
    ],
  };

  const processDataByDate = () => {
    if (!allMeetings) return { labels: [], data: [] };

    const meetingsByDate: Record<string, number> = allMeetings.reduce((acc, meeting) => {
      const date = new Date(meeting.startTime).toLocaleDateString();
      acc[date] = (acc[date] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const sortedDates = Object.keys(meetingsByDate).sort((a, b) => 
      new Date(a).getTime() - new Date(b).getTime()
    );
    
    return {
      labels: sortedDates,
      data: sortedDates.map(date => meetingsByDate[date])
    };
  };

  const meetingTrendData = processDataByDate();

  const trendChartData = {
    labels: meetingTrendData.labels,
    datasets: [
      {
        label: "Meetings per Day",
        data: meetingTrendData.data,
        borderColor: "rgba(75, 192, 192, 1)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      title: { display: false },
      tooltip: {
        backgroundColor: "rgba(0, 0, 0, 0.7)",
        padding: 10,
        cornerRadius: 4,
        titleFont: { size: 14 },
        bodyFont: { size: 13 },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          display: true,
          color: "rgba(0, 0, 0, 0.05)",
        },
      },
      x: {
        grid: {
          display: false,
        },
      },
    },
  };

  const lineOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: true },
      title: { 
        display: true,
        text: "Meeting Trends Over Time",
        font: { size: 16 }
      },
      tooltip: {
        backgroundColor: "rgba(0, 0, 0, 0.7)",
        padding: 10,
        cornerRadius: 4,
        titleFont: { size: 14 },
        bodyFont: { size: 13 },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          display: true,
          color: "rgba(0, 0, 0, 0.05)",
        },
        title: {
          display: true,
          text: "Number of Meetings"
        }
      },
      x: {
        grid: {
          display: false,
        },
        title: {
          display: true,
          text: "Date"
        }
      },
    },
  };

  const renderSkeleton = () => (
    <div className="w-full h-52 bg-gray-200 dark:bg-gray-700 animate-pulse rounded-lg"></div>
  );

  const renderError = () => (
    <div className="flex flex-col items-center justify-center h-40">
      <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-red-500 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <p className="text-red-500">Failed to load data</p>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#f8fafc] to-[#e9e4f0] dark:from-[#232946] dark:to-[#1a1f35] py-8 px-4 sm:px-6">
      <header className="mb-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold text-[#6947A8] dark:text-white">
            Meeting Statistics
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-300">
            Track all current, scheduled, and recorded meetings
          </p>
        </div>
      </header>

      <div className="max-w-7xl mx-auto w-full">
        {/* Meeting Trend Chart */}
        <div className="mb-6 bg-white dark:bg-[#232946] rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
          <div className="px-6 py-5 border-b border-gray-100 dark:border-gray-800">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              Meeting Trends
            </h2>
          </div>
          <div className="p-6 h-96">
            {loadingAllMeetings ? (
              renderSkeleton()
            ) : errorAllMeetings ? (
              renderError()
            ) : (
              <Line data={trendChartData} options={lineOptions} />
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-[#232946] rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
            <div className="px-6 py-5 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center">
              <h2 className="text-xl font-semibold text-[#6947A8] dark:text-white flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                </svg>
                Active Meetings
              </h2>
              <div className="h-8 w-8 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center">
                <span className="font-semibold text-sm text-[#6947A8] dark:text-purple-200">
                  {typeof activeData === "number" ? activeData : "-"}
                </span>
              </div>
            </div>
            <div className="p-6 h-64">
              {loadingActive ? (
                renderSkeleton()
              ) : errorActive ? (
                renderError()
              ) : (
                <Bar data={activeChartData} options={barOptions} />
              )}
            </div>
          </div>

          <div className="bg-white dark:bg-[#232946] rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
            <div className="px-6 py-5 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center">
              <h2 className="text-xl font-semibold text-[#36A2EB] dark:text-white flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Scheduled Meetings
              </h2>
              <div className="h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                <span className="font-semibold text-sm text-[#36A2EB] dark:text-blue-200">
                  {typeof scheduledData === "number" ? scheduledData : "-"}
                </span>
              </div>
            </div>
            <div className="p-6 h-64">
              {loadingScheduled ? (
                renderSkeleton()
              ) : errorScheduled ? (
                renderError()
              ) : (
                <Bar data={scheduledChartData} options={barOptions} />
              )}
            </div>
          </div>

          <div className="bg-white dark:bg-[#232946] rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
            <div className="px-6 py-5 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center">
              <h2 className="text-xl font-semibold text-[#43B97F] dark:text-white flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
                Meeting Records
              </h2>
              <div className="h-8 w-8 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
                <span className="font-semibold text-sm text-[#43B97F] dark:text-green-200">
                  {typeof recordData === "number" ? recordData : "-"}
                </span>
              </div>
            </div>
            <div className="p-6 h-64">
              {loadingRecord ? (
                renderSkeleton()
              ) : errorRecord ? (
                renderError()
              ) : (
                <Bar data={recordChartData} options={barOptions} />
              )}
            </div>
          </div>
        </div>

        <div className="mt-10 bg-white dark:bg-[#232946] rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
            Meeting Overview
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4 flex items-center">
              <div className="h-12 w-12 rounded-full bg-purple-100 dark:bg-purple-800 flex items-center justify-center mr-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#6947A8]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Active Meetings</p>
                <p className="text-2xl font-bold text-[#6947A8] dark:text-purple-300">
                  {typeof activeData === "number" ? activeData : "-"}
                </p>
              </div>
            </div>

            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 flex items-center">
              <div className="h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-800 flex items-center justify-center mr-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#36A2EB]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Scheduled Meetings</p>
                <p className="text-2xl font-bold text-[#36A2EB] dark:text-blue-300">
                  {typeof scheduledData === "number" ? scheduledData : "-"}
                </p>
              </div>
            </div>

            <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 flex items-center">
              <div className="h-12 w-12 rounded-full bg-green-100 dark:bg-green-800 flex items-center justify-center mr-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#43B97F]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Meeting Records</p>
                <p className="text-2xl font-bold text-[#43B97F] dark:text-green-300">
                  {typeof recordData === "number" ? recordData : "-"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
