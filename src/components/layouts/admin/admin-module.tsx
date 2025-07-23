import { useEffect, useState, useCallback } from "react";
import { Plus, Edit, Trash2, Book } from "lucide-react";
import { Button } from "@/components/ui/button";
import TableWithStatsCard from "@/components/layouts/admin/TableWithStatsCard";
import EntityModal, {
  FieldConfig,
} from "@/components/layouts/admin/EntityModal";
import {
  useCreateModuleMutation,
  useGetListModuleMutation,
  useGetListCourseMutation,
  useUpdateModuleMutation,
  useDeleteModuleMutation,
} from "@/api/AdminApi";
import { Module, Course } from "@/types/ICourse";
import { v4 as uuidv4 } from "uuid";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function AdminModule() {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;
  const [modules, setModules] = useState<Module[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalFields, setModalFields] = useState<FieldConfig[]>([]);
  const [modalTitle, setModalTitle] = useState("");
  const [coursesSelect, setCoursesSelect] = useState<Course[]>([]);
  const [updateModule] = useUpdateModuleMutation();
  const [editModule, setEditModule] = useState<Module | null>(null);
  const [deleteModuleApi] = useDeleteModuleMutation();
  const [deleteModule, setDeleteModule] = useState<Module | null>(null);

  // Config fields cho module
  const moduleFields: FieldConfig[] = [
    { label: "Title", name: "title", type: "text", required: true },
    { label: "Description", name: "description", type: "textarea" },
    {
      label: "Course",
      name: "courseId",
      type: "select",
      required: true,
      options: coursesSelect.map((c) => ({ label: c.title, value: c.id })),
    },
    { label: "Order", name: "orderNumber", type: "number" },
  ];

  // API hooks
  const [getListCourse] = useGetListCourseMutation();
  const [getListModule] = useGetListModuleMutation();
  const [createModule] = useCreateModuleMutation();

  // Fetch courses for select
  useEffect(() => {
    const getAllCourse = async () => {
      await getListCourse()
        .unwrap()
        .then((res) => {
          setCoursesSelect(Array.isArray(res.result) ? res.result : []);
        });
    };
    getAllCourse();
  }, [getListCourse]);

  // Fetch modules
  const getAllModule = useCallback(async () => {
    await getListModule()
      .unwrap()
      .then((res) => {
        setModules(Array.isArray(res.result) ? res.result : []);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [getListModule]);

  useEffect(() => {
    getAllModule();
  }, [getAllModule]);

  // Modal logic
  const openModal = (module?: Module) => {
    if (module) {
      setEditModule(module);
      setModalFields(moduleFields);
      setModalTitle("Update Module");
      setDeleteModule(null);
    } else {
      setEditModule(null);
      setModalFields(moduleFields);
      setModalTitle("Add Module");
      setDeleteModule(null);
    }
    setModalOpen(true);
  };
  const openDeleteModal = (module: Module) => {
    setDeleteModule(module);
    setEditModule(null);
    setModalFields([]);
    setModalTitle("Delete Module");
    setModalOpen(true);
  };
  const closeModal = () => {
    setModalOpen(false);
    setEditModule(null);
    setDeleteModule(null);
  };

  const handleModalSubmit = async (values: Record<string, string>) => {
    if (deleteModule) {
      await deleteModuleApi(deleteModule.id)
        .then((res) => {
          if (res.data?.result) {
            toast.success(res.data.result);
          } else {
            toast.error(res.data?.errorMessages[0]);
          }
          getAllModule();
        })
        .catch((err) => {
          console.log(err);
        });
      setModalOpen(false);
      setDeleteModule(null);
      return;
    }
    if (editModule) {
      await updateModule({
        ...editModule,
        ...values,
        orderNumber: parseInt(values.orderNumber),
        courseId: values.courseId,
      })
        .then((res) => {
          if (res.data?.result) {
            toast.success("Update module success");
          } else {
            toast.error("Update module failed");
          }
          getAllModule();
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      await createModule({
        id: uuidv4(),
        title: values.title,
        description: values.description,
        orderNumber: parseInt(values.orderNumber),
        courseId: values.courseId,
        createdAt: new Date().toISOString(),
      })
        .then((res) => {
          if (res.data?.result) {
            toast.success("Create module success");
          } else {
            toast.error("Create module failed");
          }
          getAllModule();
        })
        .catch((err) => {
          console.log(err);
        });
    }
    setModalOpen(false);
    setEditModule(null);
    setDeleteModule(null);
  };

  // Pagination logic for modules
  const totalModulePages = Math.ceil(modules.length / itemsPerPage);
  const paginatedModules = modules.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Table header and renderRow for module
  const moduleTableHeaders = (
    <>
      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
        Module Title
      </th>
      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
        Description
      </th>
      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
        Course
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
  const renderModuleRow = (module: Module) => {
    if (!module) {
      return (
        <tr>
          <td colSpan={6} className="text-center">
            No data
          </td>
        </tr>
      );
    }
    return (
      <tr key={module.id}>
        <td className="px-6 py-4 w-1/4">
          <div className="text-sm font-medium text-gray-900 dark:text-white">
            {module.title}
          </div>
        </td>
        <td className="px-6 py-4">
          <div className="text-sm text-gray-500 dark:text-gray-400">
            {module.description}
          </div>
        </td>
        <td className="px-6 py-4">{module.course?.title}</td>
        <td className="px-6 py-4">{module.orderNumber}</td>
        <td className="px-6 py-4">{module.createdAt}</td>
        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
          <div className="flex space-x-2 justify-end">
            <Button size="sm" variant="ghost" onClick={() => openModal(module)}>
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              className="text-red-600"
              onClick={() => openDeleteModal(module)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </td>
      </tr>
    );
  };

  // Stats cards for module
  const moduleStats = [
    {
      icon: <Book className="h-8 w-8 text-blue-500" />,
      label: "Total Modules",
      value: modules.length,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Module Management</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage modules</p>
        </div>
        <Button
          className="bg-[#6947A8] hover:bg-[#5a3d8c]"
          onClick={() => openModal()}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Module
        </Button>
      </div>
      {/* View Filters */}
      <div className="flex space-x-2">
        <Button variant="outline" onClick={() => router.push("/admin/courses")}>
          All Courses
        </Button>
        <Button variant="default" onClick={() => router.push("/admin/modules")}>
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
        tableHeaders={moduleTableHeaders}
        renderRow={renderModuleRow}
        data={paginatedModules}
        statsTitle="Module Stats"
        statsData={moduleStats}
        pagination={{
          currentPage,
          totalPages: totalModulePages,
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
        initialValues={
          editModule
            ? {
                id: editModule.id,
                title: editModule.title,
                description: editModule.description || "",
                courseId:
                  editModule.courseId ||
                  (editModule.course ? editModule.course.id : ""),
                orderNumber: editModule.orderNumber?.toString() || "",
                createdAt: editModule.createdAt,
              }
            : {}
        }
        // Custom: Nếu là delete, chỉ hiện message confirm
        {...(deleteModule && {
          children: (
            <div className="py-6 text-center text-lg">
              Bạn có chắc chắn muốn xóa module <b>{deleteModule.title}</b>{" "}
              không?
            </div>
          ),
        })}
      />
    </div>
  );
}
