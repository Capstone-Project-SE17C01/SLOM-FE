"use client";

import { useEffect, useState, useCallback } from "react";
import { Plus, Edit, Trash2, Book } from "lucide-react";
import { Button } from "@/components/ui/button";
import TableWithStatsCard from "@/components/layouts/admin/TableWithStatsCard";
import { useRouter } from "next/navigation";
import EntityModal, { FieldConfig } from "@/components/layouts/admin/EntityModal";
import {
  useCreateCourseMutation,
  useGetListCourseMutation,
} from "@/api/AdminApi";
import {
  useGetCourseByIdMutation,
  useUpdateCourseMutation,
  useDeleteCourseMutation,
} from "@/api/CourseApi";
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

  const courseFields: FieldConfig[] = [
    { label: "Title", name: "title", type: "text", required: true },
    { label: "Description", name: "description", type: "textarea" },
    { label: "Thumbnail URL", name: "thumbnailUrl", type: "text" },
  ];

  const [getListCourse] = useGetListCourseMutation();
  const [createCourse] = useCreateCourseMutation();
  const [getCourseById] = useGetCourseByIdMutation();
  const [updateCourse] = useUpdateCourseMutation();
  const [deleteCourseApi] = useDeleteCourseMutation();

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [editCourse, setEditCourse] = useState<Course | null>(null);
  const [deleteCourseId, setDeleteCourseId] = useState<string | null>(null);

  const handleOpenEdit = async (courseId: string) => {
    try {
      const res = await getCourseById(courseId).unwrap();
      setEditCourse(res.result);
      setModalFields(
        courseFields.map((f) => ({
          ...f,
          defaultValue: res.result?.[f.name as keyof Course] ?? "",
        }))
      );
      setModalTitle("Edit Course");
      setEditModalOpen(true);
    } catch (error) {
      toast.error(String(error));
    }
  };
  const closeEditModal = () => setEditModalOpen(false);

  const handleEditSubmit = async (values: Record<string, string>) => {
    if (!editCourse) return;
    await updateCourse({
      ...editCourse,
      title: values.title,
      description: values.description,
      thumbnailUrl: values.thumbnailUrl,
      updatedAt: new Date().toISOString(),
    })
      .then((res) => {
        if (res.data) {
          toast.success("Update course successfully");
        } else {
          toast.error("Update course failed");
        }
        getAllCourse();
      })
      .catch(() => {
        toast.error("Error updating course");
      });
    setEditModalOpen(false);
  };

  const handleOpenDelete = (courseId: string) => {
    setDeleteCourseId(courseId);
    setDeleteModalOpen(true);
  };
  const closeDeleteModal = () => setDeleteModalOpen(false);

  const handleDeleteCourse = async () => {
    if (!deleteCourseId) return;
    await deleteCourseApi(deleteCourseId)
      .then((res) => {
        if (res.data) {
          toast.success("Delete course successfully");
        } else {
          toast.error("Delete course failed");
        }
        getAllCourse();
      })
      .catch(() => {
        toast.error("Error deleting course");
      });
    setDeleteModalOpen(false);
    setDeleteCourseId(null);
  };

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
          toast.success("Create course successfully");
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

  const totalCoursePages = Math.ceil(courses.length / itemsPerPage);
  const paginatedCourses = courses.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

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
            <Button
              size="sm"
              variant="ghost"
              onClick={() => handleOpenEdit(course.id)}
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              className="text-red-600"
              onClick={() => handleOpenDelete(course.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </td>
      </tr>
    );
  };

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
      <EntityModal
        open={modalOpen}
        onClose={closeModal}
        onSubmit={handleModalSubmit}
        fields={modalFields}
        title={modalTitle}
      />
      <EntityModal
        open={editModalOpen}
        onClose={closeEditModal}
        onSubmit={handleEditSubmit}
        fields={modalFields}
        title={modalTitle}
        initialValues={
          editCourse
            ? {
                title: editCourse.title ?? "",
                description: editCourse.description ?? "",
                thumbnailUrl: editCourse.thumbnailUrl ?? "",
              }
            : {}
        }
      />
      {deleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-sm shadow-lg">
            <h2 className="text-lg font-semibold mb-4">Confirm delete course</h2>
            <p className="mb-6">Are you sure you want to delete this course?</p>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={closeDeleteModal}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleDeleteCourse}>
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
