import { useEffect, useState, useCallback } from "react";
import { Plus, Edit, Trash2, Book } from "lucide-react";
import { Button } from "@/components/ui/button";
import TableWithStatsCard from "@/components/layouts/admin/TableWithStatsCard";
import { useRouter } from "next/navigation";
import EntityModal, {
  FieldConfig,
} from "@/components/layouts/admin/EntityModal";
import {
  useCreateLessonMutation,
  useGetListLessonMutation,
  useGetListModuleMutation,
  useUpdateLessonMutation,
  useDeleteLessonMutation,
} from "@/api/AdminApi";
import { Module, Lesson } from "@/types/ICourse";
import { v4 as uuidv4 } from "uuid";
import { toast } from "sonner";

export default function AdminLesson() {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalFields, setModalFields] = useState<FieldConfig[]>([]);
  const [modalTitle, setModalTitle] = useState("");
  const [modulesSelect, setModulesSelect] = useState<Module[]>([]);
  const [updateLesson] = useUpdateLessonMutation();
  const [editLesson, setEditLesson] = useState<Lesson | null>(null);
  const [deleteLessonApi] = useDeleteLessonMutation();
  const [deleteLesson, setDeleteLesson] = useState<Lesson | null>(null);

  // Config fields for lesson
  const lessonFields: FieldConfig[] = [
    { label: "Title", name: "title", type: "text", required: true },
    { label: "Content", name: "content", type: "textarea" },
    {
      label: "Module",
      name: "moduleId",
      type: "select",
      required: true,
      options: modulesSelect.map((m) => ({ label: m.title, value: m.id })),
    },
    { label: "Order", name: "orderNumber", type: "number" },
  ];

  // API hooks
  const [getListModule] = useGetListModuleMutation();
  const [getListLesson] = useGetListLessonMutation();
  const [createLesson] = useCreateLessonMutation();

  // Fetch modules for select
  useEffect(() => {
    const getAllModule = async () => {
      await getListModule()
        .unwrap()
        .then((res) => {
          setModulesSelect(Array.isArray(res.result) ? res.result : []);
        });
    };
    getAllModule();
  }, [getListModule]);

  const getAllLesson = useCallback(async () => {
    await getListLesson()
      .unwrap()
      .then((res) => {
        setLessons(Array.isArray(res.result) ? res.result : []);
      });
  }, [getListLesson]);

  // Fetch lessons
  useEffect(() => {
    getAllLesson();
  }, [getAllLesson]);

  // Modal logic
  const openModal = (lesson?: Lesson) => {
    if (lesson) {
      setEditLesson(lesson);
      setModalFields(lessonFields);
      setModalTitle("Update Lesson");
      setDeleteLesson(null);
    } else {
      setEditLesson(null);
      setModalFields(lessonFields);
      setModalTitle("Add Lesson");
      setDeleteLesson(null);
    }
    setModalOpen(true);
  };
  const openDeleteModal = (lesson: Lesson) => {
    setDeleteLesson(lesson);
    setEditLesson(null);
    setModalFields([]);
    setModalTitle("Delete Lesson");
    setModalOpen(true);
  };
  const closeModal = () => {
    setModalOpen(false);
    setEditLesson(null);
    setDeleteLesson(null);
  };

  const handleModalSubmit = async (values: Record<string, string>) => {
    if (deleteLesson) {
      await deleteLessonApi(deleteLesson.id)
        .then((res) => {
          if (res.data?.result) {
            toast.success(res.data.result);
          } else {
            toast.error(res.data?.errorMessages?.[0] || "Delete lesson failed");
          }
          getAllLesson();
        })
        .catch((err) => {
          console.log(err);
        });
      setModalOpen(false);
      setDeleteLesson(null);
      return;
    }
    if (editLesson) {
      await updateLesson({
        ...editLesson,
        ...values,
        orderNumber: parseInt(values.orderNumber),
        moduleId: values.moduleId,
      })
        .then((res) => {
          if (res.data?.result) {
            toast.success("Update lesson success");
          } else {
            toast.error("Update lesson failed");
          }
          getAllLesson();
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      await createLesson({
        id: uuidv4(),
        title: values.title,
        content: values.content,
        moduleId: values.moduleId,
        orderNumber: parseInt(values.orderNumber),
        createdAt: new Date().toISOString(),
      })
        .then((res) => {
          if (res.data?.result) {
            toast.success("Create lesson success");
          } else {
            toast.error("Create lesson failed");
          }
          getAllLesson();
        })
        .catch((err) => {
          console.log(err);
        });
    }
    setModalOpen(false);
    setEditLesson(null);
    setDeleteLesson(null);
  };

  // Pagination logic for lessons
  const totalLessonPages = Math.ceil(lessons.length / itemsPerPage);
  const paginatedLessons = lessons.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Table header and renderRow for lesson
  const lessonTableHeaders = (
    <>
      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
        Lesson Title
      </th>
      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
        Content
      </th>
      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
        Module Title
      </th>
      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
        Order
      </th>
      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
        Created At
      </th>
      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
        Actions
      </th>
    </>
  );
  const renderLessonRow = (lesson: Lesson) => {
    if (!lesson) {
      return (
        <tr>
          <td colSpan={6} className="text-center">
            No data
          </td>
        </tr>
      );
    }
    return (
      <tr key={lesson.id}>
        <td className="px-6 py-4 w-1/4">
          <div className="text-sm font-medium text-gray-900 dark:text-white">
            {lesson.title}
          </div>
        </td>
        <td className="px-6 py-4">{lesson.content}</td>
        <td className="px-6 py-4">{lesson.module?.title}</td>
        <td className="px-6 py-4">{lesson.orderNumber}</td>
        <td className="px-6 py-4">{lesson.createdAt}</td>
        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
          <div className="flex space-x-2 justify-end">
            <Button size="sm" variant="ghost" onClick={() => openModal(lesson)}>
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              className="text-red-600"
              onClick={() => openDeleteModal(lesson)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </td>
      </tr>
    );
  };

  // Stats cards for lesson
  const lessonStats = [
    {
      icon: <Book className="h-8 w-8 text-blue-500" />,
      label: "Total Lessons",
      value: lessons.length,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Lesson Management</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage lessons</p>
        </div>
        <Button
          className="bg-[#6947A8] hover:bg-[#5a3d8c]"
          onClick={() => openModal()}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Lesson
        </Button>
      </div>
      {/* View Filters */}
      <div className="flex space-x-2">
        <Button variant="outline" onClick={() => router.push("/admin/courses")}>
          All Courses
        </Button>
        <Button variant="outline" onClick={() => router.push("/admin/modules")}>
          All Modules
        </Button>
        <Button variant="default" onClick={() => router.push("/admin/lessons")}>
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
        tableHeaders={lessonTableHeaders}
        renderRow={renderLessonRow}
        data={paginatedLessons}
        statsTitle="Lesson Stats"
        statsData={lessonStats}
        pagination={{
          currentPage,
          totalPages: totalLessonPages,
          onPageChange: setCurrentPage,
        }}
      />
      {/* Dynamic Modal */}
      <EntityModal
        open={modalOpen}
        onClose={closeModal}
        onSubmit={handleModalSubmit}
        fields={modalFields}
        title={modalTitle}
        initialValues={
          editLesson
            ? {
                id: editLesson.id,
                title: editLesson.title,
                content: editLesson.content || "",
                moduleId:
                  editLesson.moduleId ||
                  (editLesson.module ? editLesson.module.id : ""),
                orderNumber: editLesson.orderNumber?.toString() || "",
                createdAt: editLesson.createdAt,
              }
            : {}
        }
        {...(deleteLesson && {
          children: (
            <div className="py-6 text-center text-lg">
              Bạn có chắc chắn muốn xóa lesson <b>{deleteLesson.title}</b>{" "}
              không?
            </div>
          ),
        })}
      />
    </div>
  );
}
