"use client";

import { TrendingUp, Users, BookOpen, Calendar } from "lucide-react";
import LineChart from "@/components/charts/LineChart";
import DoughnutChart from "@/components/charts/DoughnutChart";
import { useGetSummaryAdminMutation } from "@/api/AdminApi";
import { useEffect, useState } from "react";
import { SummaryAdminDTO } from "@/types/IAdmin";

export default function AdminDashboard() {
  const [getSummaryAdmin] = useGetSummaryAdminMutation();
  const [stats, setStats] = useState<SummaryAdminDTO | null>(null);
  useEffect(() => {
    const fetchSummary = async () => {
      await getSummaryAdmin()
        .unwrap()
        .then((res) => {
          if (res.result) {
            setStats(res.result || null);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    };
    fetchSummary();
  }, [getSummaryAdmin, stats]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Welcome to SLOM Admin Panel
        </p>
      </div>

      {/* Stats Grid */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Total Users */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Total Users
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stats.totalUsers}
                </p>
                <p className="text-sm text-green-600 dark:text-green-400">
                  +
                  {stats.newUserToday &&
                  stats.totalUsers &&
                  stats.totalUsers > 0
                    ? ((stats.newUserToday / stats.totalUsers) * 100).toFixed(2)
                    : 0}
                  %
                </p>
              </div>
              <div className="bg-blue-500 p-3 rounded-lg">
                <Users className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>
          {/* Total Revenue */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Total Revenue
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stats.totalRevenue.toLocaleString("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  })}
                </p>
                <p className="text-sm text-green-600 dark:text-green-400">
                  +
                  {stats.revenueToday &&
                  stats.totalRevenue &&
                  stats.totalRevenue > 0
                    ? ((stats.revenueToday / stats.totalRevenue) * 100).toFixed(
                        2
                      )
                    : 0}
                  %
                </p>
              </div>
              <div className="bg-green-500 p-3 rounded-lg">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>
          {/* Total Courses */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Total Courses
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stats.totalCourses}
                </p>
              </div>
              <div className="bg-yellow-500 p-3 rounded-lg">
                <BookOpen className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>
          {/* Total Meetings */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Total Meetings
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stats.totalMeetings}
                </p>
              </div>
              <div className="bg-red-500 p-3 rounded-lg">
                <Calendar className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Chart Grid Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* User Growth Chart */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold mb-4">User Growth</h2>
          <LineChart
            data={stats?.newUserStats || []}
            label="New Users"
            color="rgba(59,130,246,1)"
          />
        </div>

        {/* Revenue Growth Chart */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold mb-4">Revenue Growth</h2>
          <LineChart
            data={stats?.revenueStats || []}
            label="Revenue"
            color="rgba(16,185,129,1)"
          />
        </div>

        {/* User Today Doughnut Chart */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold mb-4">User Today</h2>
          <DoughnutChart
            value={stats?.userInUseToday || 0}
            total={stats?.totalUsers || 1}
            label="In Use Today"
          />
        </div>
      </div>
    </div>
  );
}
