"use client";

import { TrendingUp, Users, BookOpen, Calendar } from "lucide-react";
import { Line, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import { useGetSummaryAdminMutation } from "@/api/AdminApi";
import { useGetAllPaymentsQuery } from "@/api/PaymentApi";
import { useEffect, useState } from "react";
import { SummaryAdminDTO } from "@/types/IAdmin";
import { TooltipItem } from "chart.js";
import { useGetAllProfilesQuery } from "@/api/ProfileApi";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

export default function AdminDashboard() {
  const [getSummaryAdmin] = useGetSummaryAdminMutation();
  const { data: paymentsData, isLoading: loadingPayments } = useGetAllPaymentsQuery();
  const { data: profilesData, isLoading: loadingProfiles } = useGetAllProfilesQuery();
  const [stats, setStats] = useState<SummaryAdminDTO | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchSummary = async () => {
      setLoading(true);
      try {
        const res = await getSummaryAdmin().unwrap();
        if (res.result) {
          setStats(res.result);
        }
      } catch (err) {
        console.error("Failed to fetch admin summary:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchSummary();
  }, [getSummaryAdmin]);

  // Xử lý dữ liệu cho biểu đồ
  const processPaymentData = () => {
    if (!paymentsData?.result) return { labels: [], data: [] };

    const paymentsByDate = paymentsData.result.reduce((acc, payment) => {
      const date = new Date(payment.createdAt).toLocaleDateString();
      acc[date] = (acc[date] || 0) + payment.amount;
      return acc;
    }, {} as Record<string, number>);

    const sortedDates = Object.keys(paymentsByDate).sort((a, b) => 
      new Date(a).getTime() - new Date(b).getTime()
    );
    
    return {
      labels: sortedDates.map(date => {
        const [day, month] = date.split('/');
        return `${day}/${month}`;
      }),
      data: sortedDates.map(date => paymentsByDate[date])
    };
  };

  const processUserData = () => {
    if (!profilesData?.result) return { labels: [], data: [] };

    const usersByDate = profilesData.result.reduce((acc, profile) => {
      const date = new Date(profile.createdAt || '').toLocaleDateString();
      acc[date] = (acc[date] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const sortedDates = Object.keys(usersByDate).sort((a, b) => 
      new Date(a).getTime() - new Date(b).getTime()
    );
    
    return {
      labels: sortedDates.map(date => {
        const [day, month] = date.split('/');
        return `${day}/${month}`;
      }),
      data: sortedDates.map(date => usersByDate[date])
    };
  };

  const paymentChartData = {
    labels: processPaymentData().labels,
    datasets: [
      {
        label: "Revenue",
        data: processPaymentData().data,
        borderColor: "rgba(16,185,129,1)",
        backgroundColor: "rgba(16,185,129,0.1)",
        tension: 0.4,
        fill: true,
        pointBackgroundColor: "rgba(16,185,129,1)",
        pointBorderColor: "#fff",
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
    ],
  };

  const userChartData = {
    labels: processUserData().labels,
    datasets: [
      {
        label: "New Users",
        data: processUserData().data,
        borderColor: "rgba(59,130,246,1)",
        backgroundColor: "rgba(59,130,246,0.1)",
        tension: 0.4,
        fill: true,
        pointBackgroundColor: "rgba(59,130,246,1)",
        pointBorderColor: "#fff",
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { 
        display: true,
        position: 'top' as const,
        labels: {
          boxWidth: 15,
          usePointStyle: true,
          pointStyle: 'circle',
          padding: 20,
          font: {
            size: 14
          }
        }
      },
      tooltip: {
        backgroundColor: "rgba(0, 0, 0, 0.75)",
        padding: 12,
        cornerRadius: 6,
        titleFont: { 
          size: 16, 
          weight: "bold" as const 
        },
        bodyFont: { size: 14 },
        callbacks: {
          label: function(tooltipItem: TooltipItem<"line">) {
            const value = tooltipItem.raw as number;
            if (tooltipItem.dataset.label === "Revenue") {
              return `${tooltipItem.dataset.label}: ${value.toLocaleString('vi-VN')} VND`;
            }
            return `${tooltipItem.dataset.label}: ${value}`;
          }
        }
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          display: true,
          color: "rgba(0, 0, 0, 0.05)",
        },
        ticks: {
          font: {
            size: 12
          }
        }
      },
      x: {
        grid: {
          display: false,
        },
        ticks: {
          maxRotation: 45,
          minRotation: 45,
          font: {
            size: 12
          }
        }
      },
    },
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '70%',
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        backgroundColor: "rgba(0, 0, 0, 0.75)",
        padding: 12,
        cornerRadius: 6,
        titleFont: { 
          size: 16, 
          weight: "bold" as const 
        },
        bodyFont: { size: 14 },
        callbacks: {
          label: function(tooltipItem: TooltipItem<"doughnut">) {
            const value = tooltipItem.raw as number;
            const total = tooltipItem.dataset.data.reduce((a: number, b: number) => a + b, 0);
            const percentage = ((value / total) * 100).toFixed(1);
            return `${tooltipItem.label}: ${percentage}%`;
          }
        }
      }
    }
  };

  const renderSkeleton = () => (
    <div className="w-full h-full bg-gray-200 dark:bg-gray-700 animate-pulse rounded-lg flex items-center justify-center">
      <div className="flex flex-col items-center">
        <svg className="w-12 h-12 text-gray-300 dark:text-gray-500 mb-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
        <p className="text-gray-400 dark:text-gray-500">Loading data...</p>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard Overview</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Monitor and manage your system performance
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm animate-pulse">
              <div className="flex items-center justify-between">
                <div className="space-y-3">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
                  <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-12"></div>
                </div>
                <div className="h-12 w-12 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
              </div>
            </div>
          ))}
        </div>
      ) : stats ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Total Users */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Total Users
                </p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                  {stats.totalUsers.toLocaleString()}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                  {stats.newUserToday} new today
                </p>
              </div>
              <div className="bg-blue-500 p-3 rounded-lg shadow-md">
                <Users className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>

          {/* Total Revenue */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Total Revenue
                </p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                  {stats.totalRevenue.toLocaleString("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  })}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                  {stats.revenueToday.toLocaleString("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  })} today
                </p>
              </div>
              <div className="bg-emerald-500 p-3 rounded-lg shadow-md">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>

          {/* Total Courses */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Total Courses
                </p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                  {stats.totalCourses.toLocaleString()}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                  Latest update
                </p>
              </div>
              <div className="bg-amber-500 p-3 rounded-lg shadow-md">
                <BookOpen className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>

          {/* Total Meetings */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Total Meetings
                </p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                  {stats.totalMeetings.toLocaleString()}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                  Latest update
                </p>
              </div>
              <div className="bg-rose-500 p-3 rounded-lg shadow-md">
                <Calendar className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
          <p className="text-center text-gray-500 dark:text-gray-400">Unable to load data. Please try again later.</p>
        </div>
      )}

      {/* Chart Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Revenue Chart */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl transition-shadow">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Revenue Trends</h2>
            <div className="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-300 text-xs font-medium px-2.5 py-0.5 rounded-full">
              Daily Revenue
            </div>
          </div>
          <div className="h-96">
            {loadingPayments ? (
              renderSkeleton()
            ) : (
              <Line id="revenue-chart" data={paymentChartData} options={chartOptions} />
            )}
          </div>
        </div>

        {/* User Growth Chart */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl transition-shadow">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white">User Growth</h2>
            <div className="bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300 text-xs font-medium px-2.5 py-0.5 rounded-full">
              New Users
            </div>
          </div>
          <div className="h-96">
            {loadingProfiles ? (
              renderSkeleton()
            ) : (
              <Line id="user-chart" data={userChartData} options={chartOptions} />
            )}
          </div>
        </div>

        {/* Active Users Chart */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl transition-shadow">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Active Users</h2>
            <div className="bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-300 text-xs font-medium px-2.5 py-0.5 rounded-full">
              Today
            </div>
          </div>
          <div className="flex flex-col items-center justify-center h-96">
            {loading ? (
              renderSkeleton()
            ) : stats ? (
              <>
                <div className="relative w-48 h-48">
                  <Doughnut
                    data={{
                      labels: ['Active', 'Inactive'],
                      datasets: [{
                        data: [stats.userInUseToday || 0, (stats.totalUsers || 1) - (stats.userInUseToday || 0)],
                        backgroundColor: [
                          'rgba(124,58,237,1)',
                          'rgba(229,231,235,0.5)'
                        ],
                        borderWidth: 0
                      }]
                    }}
                    options={doughnutOptions}
                  />
                </div>
                <div className="mt-6 text-center">
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">
                    {stats.userInUseToday || 0}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    Active users today
                  </p>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
                    {((stats.userInUseToday || 0) / (stats.totalUsers || 1) * 100).toFixed(1)}% of total users
                  </p>
                </div>
              </>
            ) : (
              <p className="text-gray-500 dark:text-gray-400">No data available</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
