"use client";

import { useEffect, useState, useCallback } from "react";
import { Plus, Edit, Trash2, Book } from "lucide-react";
import { Button } from "@/components/ui/button";
import TableWithStatsCard from "@/components/layouts/admin/TableWithStatsCard";
import { useRouter } from "next/navigation";
import EntityModal, {
  FieldConfig,
} from "@/components/layouts/admin/EntityModal";
import {
  useCreateCourseMutation,
  useGetListCourseMutation,
} from "@/api/AdminApi";
import { Course } from "@/types/ICourse";
import { v4 as uuidv4 } from "uuid";
import { toast } from "sonner";
import Image from "next/image";

export default function CoursePage() {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;
  const [courses, setCourses] = useState<Course[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalFields, setModalFields] = useState<FieldConfig[]>([]);
  const [modalTitle, setModalTitle] = useState("");

  // Config fields cho course
  const courseFields: FieldConfig[] = [
    { label: "Title", name: "title", type: "text", required: true },
    { label: "Description", name: "description", type: "textarea" },
    { label: "Thumbnail URL", name: "thumbnailUrl", type: "text" },
  ];

  // API hooks
  const [getListCourse] = useGetListCourseMutation();
  const [createCourse] = useCreateCourseMutation(); // Giả sử mutation này là createCourse

  // Fetch courses
  const getAllCourse = useCallback(async () => {
    await getListCourse()
      .unwrap()
      .then((res) => {
        setCourses(Array.isArray(res.result) ? res.result : []);
      });
  }, [getListCourse]);
  useEffect(() => {
    getAllCourse();
  }, [getAllCourse]);

  // Modal logic
  const openModal = () => {
    setModalFields(courseFields);
    setModalTitle("Add Course");
    setModalOpen(true);
  };
  const closeModal = () => setModalOpen(false);

  const handleModalSubmit = async (values: Record<string, string>) => {
    await createCourse({
      id: uuidv4(),
      title: values.title,
      description: values.description,
      thumbnailUrl: values.thumbnailUrl,
      isPublished: true,
      updatedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    })
      .then((res) => {
        if (res.data) {
          toast.success("Create course success");
        } else {
          toast.error("Create course failed");
        }
        getAllCourse();
      })
      .catch((err) => {
        console.log(err);
      });
    setModalOpen(false);
  };

  // Pagination logic cho courses
  const totalCoursePages = Math.ceil(courses.length / itemsPerPage);
  const paginatedCourses = courses.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Table header và renderRow cho course
  const courseTableHeaders = (
    <>
      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
        Course Title
      </th>
      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
        Description
      </th>
      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
        Thumbnail
      </th>
      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
        Created At
      </th>
      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
        Actions
      </th>
    </>
  );
  const renderCourseRow = (course: Course) => {
    if (!course) {
      return (
        <tr>
          <td colSpan={5} className="text-center">
            No data
          </td>
        </tr>
      );
    }
    return (
      <tr key={course.id}>
        <td className="px-6 py-4 w-1/4">
          <div className="text-sm font-medium text-gray-900 dark:text-white">
            {course.title}
          </div>
        </td>
        <td className="px-6 py-4">
          <div className="text-sm text-gray-500 dark:text-gray-400">
            {course.description}
          </div>
        </td>
        <td className="px-6 py-4">
          <Image
            src={course.thumbnailUrl || ""}
            alt={course.title}
            width={80}
            height={48}
            className="w-20 h-12 object-cover rounded"
          />
        </td>
        <td className="px-6 py-4">{course.createdAt}</td>
        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
          <div className="flex space-x-2 justify-end">
            <Button size="sm" variant="ghost">
              <Edit className="h-4 w-4" />
            </Button>
            <Button size="sm" variant="ghost" className="text-red-600">
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </td>
      </tr>
    );
  };

  // Stats cards cho course
  const courseStats = [
    {
      icon: <Book className="h-8 w-8 text-blue-500" />,
      label: "Total Courses",
      value: courses.length,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Course Management</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage courses</p>
        </div>
        <Button className="bg-[#6947A8] hover:bg-[#5a3d8c]" onClick={openModal}>
          <Plus className="h-4 w-4 mr-2" />
          Add Course
        </Button>
      </div>
      {/* View Filters */}
      <div className="flex space-x-2">
        <Button variant="default" onClick={() => router.push("/admin/courses")}>
          All Courses
        </Button>
        <Button variant="outline" onClick={() => router.push("/admin/modules")}>
          All Modules
        </Button>
        <Button variant="outline" onClick={() => router.push("/admin/lessons")}>
          All Lessons
        </Button>
        <Button variant="outline" onClick={() => router.push("/admin/quizzes")}>
          All Quizzes
        </Button>
        <Button variant="outline" onClick={() => router.push("/admin/words")}>
          All Words
        </Button>
      </div>
      {/* Table + Stats Cards */}
      <TableWithStatsCard
        tableHeaders={courseTableHeaders}
        renderRow={renderCourseRow}
        data={paginatedCourses}
        statsTitle="Course Stats"
        statsData={courseStats}
        pagination={{
          currentPage,
          totalPages: totalCoursePages,
          onPageChange: setCurrentPage,
        }}
      />
      {/* Modal động */}
      <EntityModal
        open={modalOpen}
        onClose={closeModal}
        onSubmit={handleModalSubmit}
        fields={modalFields}
        title={modalTitle}
      />
    </div>
  );
}
