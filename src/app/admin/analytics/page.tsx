"use client";

import { TrendingUp, Users, BookOpen, MessageSquare, Calendar } from "lucide-react";

export default function AnalyticsPage() {
  const monthlyStats = [
    { month: "Jan", users: 120, courses: 15, revenue: 12000 },
    { month: "Feb", users: 180, courses: 22, revenue: 18000 },
    { month: "Mar", users: 240, courses: 28, revenue: 24000 },
    { month: "Apr", users: 310, courses: 35, revenue: 31000 },
    { month: "May", users: 420, courses: 42, revenue: 42000 },
    { month: "Jun", users: 520, courses: 48, revenue: 52000 },
  ];

  const topCourses = [
    { name: "Sign Language Basics", students: 245, revenue: "$12,250" },
    { name: "Advanced Sign Language", students: 156, revenue: "$12,480" },
    { name: "Business Sign Language", students: 67, revenue: "$6,693" },
    { name: "Sign Language for Kids", students: 89, revenue: "$2,667" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Analytics & Reports</h1>
        <p className="text-gray-600 dark:text-gray-400">Track performance and user engagement</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { title: "Total Revenue", value: "$127,090", change: "+23%", icon: TrendingUp, color: "bg-green-500" },
          { title: "Active Users", value: "2,847", change: "+12%", icon: Users, color: "bg-blue-500" },
          { title: "Course Completions", value: "1,234", change: "+18%", icon: BookOpen, color: "bg-purple-500" },
          { title: "Messages Sent", value: "45,678", change: "+35%", icon: MessageSquare, color: "bg-orange-500" },
        ].map((metric, index) => (
          <div
            key={index}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{metric.title}</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{metric.value}</p>
                <p className="text-sm text-green-600 dark:text-green-400">{metric.change}</p>
              </div>
              <div className={`${metric.color} p-3 rounded-lg`}>
                <metric.icon className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Growth Chart */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold mb-4">User Growth</h2>
          <div className="h-64 bg-gray-50 dark:bg-gray-700 rounded-lg flex items-end justify-center p-4 space-x-2">
            {monthlyStats.map((stat, index) => (
              <div key={index} className="flex flex-col items-center">
                <div
                  className="bg-[#6947A8] rounded-t w-8 mb-2"
                  style={{ height: `${(stat.users / 520) * 200}px` }}
                ></div>
                <span className="text-xs text-gray-600 dark:text-gray-400">{stat.month}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Revenue Chart */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold mb-4">Monthly Revenue</h2>
          <div className="h-64 bg-gray-50 dark:bg-gray-700 rounded-lg flex items-end justify-center p-4 space-x-2">
            {monthlyStats.map((stat, index) => (
              <div key={index} className="flex flex-col items-center">
                <div
                  className="bg-green-500 rounded-t w-8 mb-2"
                  style={{ height: `${(stat.revenue / 52000) * 200}px` }}
                ></div>
                <span className="text-xs text-gray-600 dark:text-gray-400">{stat.month}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Performing Courses */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-semibold mb-4">Top Performing Courses</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600 dark:text-gray-400">Course Name</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600 dark:text-gray-400">Students</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600 dark:text-gray-400">Revenue</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600 dark:text-gray-400">Performance</th>
              </tr>
            </thead>
            <tbody>
              {topCourses.map((course, index) => (
                <tr key={index} className="border-b border-gray-100 dark:border-gray-700 last:border-0">
                  <td className="py-4 px-4 text-gray-900 dark:text-white font-medium">{course.name}</td>
                  <td className="py-4 px-4 text-gray-600 dark:text-gray-400">{course.students}</td>
                  <td className="py-4 px-4 text-gray-600 dark:text-gray-400">{course.revenue}</td>
                  <td className="py-4 px-4">
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-[#6947A8] h-2 rounded-full"
                        style={{ width: `${(course.students / 245) * 100}%` }}
                      ></div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Activity Timeline */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
        <div className="space-y-4">
          {[
            { time: "2 hours ago", action: "New course published", details: "Advanced Sign Language" },
            { time: "4 hours ago", action: "User milestone reached", details: "1000 active users" },
            { time: "6 hours ago", action: "Payment processed", details: "$2,450 from course sales" },
            { time: "8 hours ago", action: "Course updated", details: "Sign Language Basics - Module 5" },
            { time: "1 day ago", action: "New instructor added", details: "Sarah Johnson joined the platform" },
          ].map((activity, index) => (
            <div key={index} className="flex items-start space-x-3">
              <div className="bg-[#6947A8] rounded-full p-1 mt-1">
                <Calendar className="h-3 w-3 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900 dark:text-white">{activity.action}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">{activity.details}</p>
                <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 