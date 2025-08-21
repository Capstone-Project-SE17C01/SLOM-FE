"use client";

import { useEffect, useState, useCallback } from "react";
import { Plus, Edit, Trash2, Book, Play, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import TableWithStatsCard from "@/components/layouts/admin/TableWithStatsCard";
import { useRouter } from "next/navigation";
import EntityModal, {
  FieldConfig,
} from "@/components/layouts/admin/EntityModal";
import { useGetAllQuizzesQuery, useCreateQuizMutation, useUpdateQuizMutation, useDeleteQuizMutation, useGetAllLessonsQuery } from "@/api/QuizApi";
import { useGetAllCourseMutation, useGetAllModuleByCourseIdMutation } from "@/api/CourseApi";
import { Quiz } from "@/types/IQuiz";
import { toast } from "sonner";

export default function AdminQuiz() {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalFields, setModalFields] = useState<FieldConfig[]>([]);
  const [modalTitle, setModalTitle] = useState("");
  const [coursesSelect, setCoursesSelect] = useState<{ id: string; title: string }[]>([]);
  const [modulesSelect, setModulesSelect] = useState<{ id: string; title: string }[]>([]);
  const [lessonsSelect, setLessonsSelect] = useState<{ id: string; title: string }[]>([]);
  const [updateQuiz] = useUpdateQuizMutation();
  const [editQuiz, setEditQuiz] = useState<Quiz | null>(null);
  const [deleteQuizApi] = useDeleteQuizMutation();
  const [deleteQuiz, setDeleteQuiz] = useState<Quiz | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [videoModalOpen, setVideoModalOpen] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<string>("");
  const [getAllModuleByCourseId] = useGetAllModuleByCourseIdMutation();

  // Config fields for quiz
  const quizFields: FieldConfig[] = [
    { label: "Question", name: "question", type: "text", required: true },
    { label: "Correct Answer", name: "correctAnswer", type: "text", required: true },
    { label: "Explanation", name: "explanation", type: "text" },
    {
      label: "Course",
      name: "courseId",
      type: "select",
      required: true,
      options: coursesSelect.map((c) => ({ label: c.title, value: c.id })),
    },
    {
      label: "Module",
      name: "moduleId",
      type: "select",
      required: true,
      options: modulesSelect.map((m) => ({ label: m.title, value: m.id })),
    },
    {
      label: "Lesson",
      name: "lessonId",
      type: "select",
      required: true,
      options: lessonsSelect.map((l) => ({ label: l.title, value: l.id })),
    },
    { label: "Max Score", name: "maxScore", type: "number" },
  ];

  // API hooks
  const { data: lessonsResponse, isLoading: lessonsLoading } = useGetAllLessonsQuery();
  const { data: quizzesResponse, isLoading, refetch } = useGetAllQuizzesQuery();
  const [createQuiz] = useCreateQuizMutation();
  const [getAllCourse] = useGetAllCourseMutation();
  const lessons = lessonsResponse?.result || [];

  // Fetch courses for select
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await getAllCourse().unwrap();
        setCoursesSelect(Array.isArray(response.result) ? response.result : []);
      } catch (error) {
        console.error("Error fetching courses:", error);
      }
    };
    fetchCourses();
  }, [getAllCourse]);

  // Fetch lessons for select
  useEffect(() => {
    if (lessonsResponse?.result) {
      setLessonsSelect(Array.isArray(lessonsResponse.result) ? lessonsResponse.result : []);
    }
  }, [lessonsResponse]);

  const getAllQuiz = useCallback(async () => {
    if (quizzesResponse?.result) {
      console.log(quizzesResponse.result);
      setQuizzes(Array.isArray(quizzesResponse.result) ? quizzesResponse.result : []);
    }
  }, [quizzesResponse]);

  // Fetch quizzes
  useEffect(() => {
    getAllQuiz();
  }, [getAllQuiz]);

  // Modal logic
  const openModal = async (quiz?: Quiz) => {
    if (quiz) {
      setEditQuiz(quiz);
      setModalTitle("Update Quiz");
      setDeleteQuiz(null);
      
      // Use the nested data from the API response
      if (quiz.lesson?.module?.courseId) {
        try {
          // Fetch modules for the course
          const courseModules = await getAllModuleByCourseId(quiz.lesson.module.courseId).unwrap();
          const fetchedModules = Array.isArray(courseModules.result) ? courseModules.result : [];
          setModulesSelect(fetchedModules);
          
          // Update modal fields with course and module data using the fetched modules directly
          const updatedFields = quizFields.map(field => {
            if (field.name === 'courseId') {
              return { ...field, options: coursesSelect.map((c) => ({ label: c.title, value: c.id })) };
            }
            if (field.name === 'moduleId') {
              return { ...field, options: fetchedModules.map((m) => ({ label: m.title, value: m.id })) };
            }
            if (field.name === 'lessonId') {
              return { ...field, options: lessonsSelect.map((l) => ({ label: l.title, value: l.id })) };
            }
            return field;
          });
          
          setModalFields(updatedFields);
        } catch (error) {
          console.error("Error fetching modules:", error);
          setModalFields(quizFields);
        }
      } else {
        setModalFields(quizFields);
      }
    } else {
      setEditQuiz(null);
      setModalTitle("Add Quiz");
      setDeleteQuiz(null);
      setModalFields(quizFields);
    }
    setModalOpen(true);
  };

  const openDeleteModal = (quiz: Quiz) => {
    setDeleteQuiz(quiz);
    setShowModal(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditQuiz(null);
    setDeleteQuiz(null);
  };

  const openVideoModal = (videoSrc: string) => {
    setSelectedVideo(videoSrc);
    setVideoModalOpen(true);
  };

  const closeVideoModal = () => {
    setVideoModalOpen(false);
    setSelectedVideo("");
  };

  const handleDelete = async () => {
    if (!deleteQuiz) return;
    try {
      await deleteQuizApi(deleteQuiz.id).unwrap();
      toast.success("Quiz deleted successfully");
      setShowModal(false);
      setDeleteQuiz(null);
      refetch();
    } catch (error) {
      console.error("Failed to delete quiz:", error);
      toast.error("Failed to delete quiz");
    }
  };

  const handleModalSubmit = async (values: Record<string, string>) => {
    try {
      if (editQuiz) {
        await updateQuiz({
          id: editQuiz.id,
          lessonId: values.lessonId,
          question: values.question,
          correctAnswer: values.correctAnswer,
          explanation: values.explanation,
          maxScore: parseInt(values.maxScore) || 0
        }).unwrap();
        toast.success("Quiz updated successfully");
      } else {
        await createQuiz({
          lessonId: values.lessonId,
          question: values.question,
          correctAnswer: values.correctAnswer,
          explanation: values.explanation,
          maxScore: parseInt(values.maxScore) || 0
        }).unwrap();
        toast.success("Quiz created successfully");
      }
      closeModal();
      refetch();
    } catch {
      toast.error("Failed to save quiz");
    }
  };

  // Pagination
  const totalQuizPages = Math.ceil(quizzes.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedQuizzes = quizzes.slice(startIndex, startIndex + itemsPerPage);

  // Table headers
  const quizTableHeaders = [
    "Question",
    "Correct Answer",
    "Lesson",
    "Max Score",
    "Created At",
    "Actions",
  ];

  const renderQuizRow = (quiz: Quiz) => {
    if (!quiz) {
      return (
        <tr>
          <td colSpan={6} className="text-center">
            <span>No data</span>
          </td>
        </tr>
      );
    }
    return (
      <tr key={quiz.id}>
        <td className="px-6 py-4 w-1/4">
          {quiz.question ? (
            <Button
              size="sm"
              variant="outline"
              onClick={() => openVideoModal(quiz.question)}
              className="flex items-center space-x-2"
            >
              <Play className="h-4 w-4" />
              <span>Watch Video</span>
            </Button>
          ) : (
            <div className="text-sm font-medium text-gray-900 dark:text-white">
              {quiz.question}
            </div>
          )}
        </td>
        <td className="px-6 py-4">
          <span>{quiz.correctAnswer}</span>
        </td>
        <td className="px-6 py-4">
          <span>{lessons.find(l => l.id === quiz.lessonId)?.title || quiz.lessonId}</span>
        </td>
        <td className="px-6 py-4">
          <span>{quiz.maxScore || 0}</span>
        </td>
        <td className="px-6 py-4">
          <span>{new Date(quiz.createdAt).toLocaleDateString()}</span>
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
          <div className="flex space-x-2 justify-end">
            <Button size="sm" variant="ghost" onClick={() => openModal(quiz)}>
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              className="text-red-600"
              onClick={() => openDeleteModal(quiz)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </td>
      </tr>
    );
  };

  // Stats cards for quiz
  const quizStats = [
    {
      icon: <Book className="h-8 w-8 text-blue-500" />,
      label: "Total Quizzes",
      value: quizzes.length,
    },
  ];

  if (isLoading || lessonsLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Quiz Management</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage quizzes</p>
        </div>
        <Button
          className="bg-[#6947A8] hover:bg-[#5a3d8c]"
          onClick={() => openModal()}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Quiz
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
        <Button variant="outline" onClick={() => router.push("/admin/lessons")}>
          All Lessons
        </Button>
        <Button variant="default" onClick={() => router.push("/admin/quizzes")}>
          All Quizzes
        </Button>
        <Button variant="outline" onClick={() => router.push("/admin/words")}>
          All Words
        </Button>
      </div>
      {/* Table + Stats Cards */}
      <TableWithStatsCard
        tableHeaders={quizTableHeaders}
        renderRow={renderQuizRow}
        data={paginatedQuizzes}
        statsTitle="Quiz Stats"
        statsData={quizStats}
        pagination={{
          currentPage,
          totalPages: totalQuizPages,
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
          editQuiz
            ? {
                id: editQuiz.id,
                question: editQuiz.question,
                correctAnswer: editQuiz.correctAnswer,
                explanation: editQuiz.explanation || "",
                courseId: editQuiz.lesson?.module?.courseId || "",
                moduleId: editQuiz.lesson?.moduleId || "",
                lessonId: editQuiz.lessonId,
                maxScore: editQuiz.maxScore?.toString() || "0",
                createdAt: editQuiz.createdAt,
              }
            : {}
        }
      />

      {/* Delete Confirmation Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 w-full max-w-sm">
            <h2 className="text-lg font-semibold mb-4">Delete Confirmation</h2>
            <p>Are you sure you want to delete this quiz?</p>
            <div className="flex justify-end gap-2 mt-6">
              <Button
                variant="outline"
                onClick={() => {
                  setShowModal(false);
                  setDeleteQuiz(null);
                }}
              >
                Cancel
              </Button>
              <Button
                className="bg-red-600 hover:bg-red-700 text-white"
                onClick={handleDelete}
              >
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}
      
      {/* Video Modal */}
      {videoModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="relative w-4/5 h-4/5 max-w-4xl">
            <Button
              onClick={closeVideoModal}
              className="absolute -top-10 right-0 text-white hover:text-gray-300 z-10"
              variant="ghost"
              size="sm"
            >
              <X className="h-6 w-6" />
            </Button>
            <iframe
              src={selectedVideo.replace('watch?v=', 'embed/')}
              className="w-full h-full rounded-lg"
              title="Video Player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      )}
    </div>
  );
}
