"use client";

import { useState } from "react";
import { Search, Plus, Edit, Trash2, MoreHorizontal, BookOpen, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Image from "next/image";

export default function CoursesPage() {
  const [searchTerm, setSearchTerm] = useState("");

  // Mock data - replace with real API call
  const courses = [
    {
      id: 1,
      title: "Sign Language Basics",
      description: "Learn fundamental sign language gestures and communication",
      image: "/images/banner.png",
      instructor: "John Smith",
      students: 245,
      modules: 12,
      status: "Published",
      createdDate: "2024-01-10",
      price: "$49.99",
    },
    {
      id: 2,
      title: "Advanced Sign Language",
      description: "Master complex sign language conversations and expressions",
      image: "/images/banner.png",
      instructor: "Sarah Johnson",
      students: 156,
      modules: 18,
      status: "Published",
      createdDate: "2024-01-08",
      price: "$79.99",
    },
    {
      id: 3,
      title: "Sign Language for Kids",
      description: "Fun and interactive sign language learning for children",
      image: "/images/banner.png",
      instructor: "Mike Davis",
      students: 89,
      modules: 8,
      status: "Draft",
      createdDate: "2024-01-12",
      price: "$29.99",
    },
    {
      id: 4,
      title: "Business Sign Language",
      description: "Professional sign language skills for workplace communication",
      image: "/images/banner.png",
      instructor: "Lisa Brown",
      students: 67,
      modules: 15,
      status: "Published",
      createdDate: "2024-01-05",
      price: "$99.99",
    },
  ];

  const filteredCourses = courses.filter((course) =>
    course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.instructor.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Course Management</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage all courses and content</p>
        </div>
        <Button className="bg-[#6947A8] hover:bg-[#5a3d8c]">
          <Plus className="h-4 w-4 mr-2" />
          Add Course
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="flex items-center space-x-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search courses..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-[#6947A8] focus:border-transparent"
          />
        </div>
      </div>

      {/* Courses Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCourses.map((course) => (
          <div
            key={course.id}
            className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-lg transition-shadow"
          >
            <div className="relative h-48">
              <Image
                src={course.image}
                alt={course.title}
                fill
                className="object-cover"
              />
              <div className="absolute top-3 right-3">
                <span
                  className={`px-2 py-1 text-xs font-medium rounded-full ${
                    course.status === "Published"
                      ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                      : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
                  }`}
                >
                  {course.status}
                </span>
              </div>
            </div>

            <div className="p-6">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white line-clamp-1">
                  {course.title}
                </h3>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      <Edit className="mr-2 h-4 w-4" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-red-600">
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                {course.description}
              </p>

              <div className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                Instructor: <span className="font-medium">{course.instructor}</span>
              </div>

              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                  <div className="flex items-center">
                    <Users className="h-4 w-4 mr-1" />
                    {course.students}
                  </div>
                  <div className="flex items-center">
                    <BookOpen className="h-4 w-4 mr-1" />
                    {course.modules} modules
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-lg font-bold text-[#6947A8]">{course.price}</span>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  Created: {course.createdDate}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-700 dark:text-gray-300">
          Showing {filteredCourses.length} of {courses.length} courses
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" disabled>
            Previous
          </Button>
          <Button variant="outline" size="sm" disabled>
            Next
          </Button>
        </div>
      </div>
    </div>
  );
} 