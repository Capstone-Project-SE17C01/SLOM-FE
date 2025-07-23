"use client";

import { BarChart3, Users, BookOpen, MessageSquare, TrendingUp } from "lucide-react";

export default function AdminDashboard() {

  const stats = [
    { title: "Total Users", value: "2,845", change: "+12%", icon: Users, color: "bg-blue-500" },
    { title: "Active Courses", value: "124", change: "+8%", icon: BookOpen, color: "bg-green-500" },
    { title: "Messages Today", value: "1,342", change: "+23%", icon: MessageSquare, color: "bg-purple-500" },
    { title: "Revenue", value: "$52,847", change: "+15%", icon: TrendingUp, color: "bg-orange-500" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-gray-600 dark:text-gray-400">Welcome to SLOM Admin Panel</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
                <p className="text-sm text-green-600 dark:text-green-400">{stat.change}</p>
              </div>
              <div className={`${stat.color} p-3 rounded-lg`}>
                <stat.icon className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
        <div className="space-y-4">
          {[
            { action: "New user registered", user: "john.doe@example.com", time: "2 minutes ago" },
            { action: "Course completed", user: "jane.smith@example.com", time: "5 minutes ago" },
            { action: "Payment received", user: "mike.johnson@example.com", time: "10 minutes ago" },
            { action: "Message sent", user: "sarah.wilson@example.com", time: "15 minutes ago" },
          ].map((activity, index) => (
            <div key={index} className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-700 last:border-0">
              <div>
                <p className="font-medium text-gray-900 dark:text-white">{activity.action}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">{activity.user}</p>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-500">{activity.time}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Chart Placeholder */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-semibold mb-4">Analytics Overview</h2>
        <div className="h-64 bg-gray-50 dark:bg-gray-700 rounded-lg flex items-center justify-center">
          <div className="text-center">
            <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-500 dark:text-gray-400">Chart will be implemented here</p>
          </div>
        </div>
      </div>
    </div>
  );
} 