"use client";

import { useEffect, useState, useCallback } from "react";
import { Plus, Edit, Trash2, Book, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import TableWithStatsCard from "@/components/layouts/admin/TableWithStatsCard";
import { useRouter } from "next/navigation";
import EntityModal, {
  FieldConfig,
} from "@/components/layouts/admin/EntityModal";
import {
  useGetAllWordsQuery,
  useCreateWordMutation,
  useUpdateWordMutation,
  useDeleteWordMutation,
} from "@/api/WordApi";
import { Word } from "@/types/IWord";
import { toast } from "sonner";
import { useGetAllLessonsQuery } from "@/api/QuizApi";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { useGetAllCourseMutation, useGetAllModuleByCourseIdMutation } from "@/api/CourseApi";

export default function AdminWord() {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [words, setWords] = useState<Word[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalFields, setModalFields] = useState<FieldConfig[]>([]);
  const [modalTitle, setModalTitle] = useState("");
  const [lessonsSelect, setLessonsSelect] = useState<
    { id: string; title: string }[]
  >([]);
  const [updateWord] = useUpdateWordMutation();
  const [editWord, setEditWord] = useState<Word | null>(null);
  const [deleteWordApi] = useDeleteWordMutation();
  const [deleteWord, setDeleteWord] = useState<Word | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [videoModalOpen, setVideoModalOpen] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<string>("");
  const [getAllCourse] = useGetAllCourseMutation();
  const [getAllModuleByCourseId] = useGetAllModuleByCourseIdMutation();
  const [coursesSelect, setCoursesSelect] = useState<{ id: string; title: string }[]>([]);
  const [modulesSelect, setModulesSelect] = useState<{ id: string; title: string }[]>([]);

  // Config fields for word
  const wordFields: FieldConfig[] = [
    { label: "Text", name: "text", type: "text", required: true },
    { label: "Video Source", name: "videoSrc", type: "text" },
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
  ];

  // API hooks
  const { data: lessonsResponse, isLoading: lessonsLoading } =
    useGetAllLessonsQuery();
  const { data: wordsResponse, isLoading, refetch } = useGetAllWordsQuery();
  const [createWord] = useCreateWordMutation();
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
      setLessonsSelect(
        Array.isArray(lessonsResponse.result) ? lessonsResponse.result : []
      );
    }
  }, [lessonsResponse]);

  const getAllWord = useCallback(async () => {
    if (wordsResponse?.result) {
      setWords(Array.isArray(wordsResponse.result) ? wordsResponse.result : []);
    }
  }, [wordsResponse]);

  // Fetch words
  useEffect(() => {
    getAllWord();
  }, [getAllWord]);

  // Modal logic
  const openModal = async (word?: Word) => {
    if (word) {
      setEditWord(word);
      setModalTitle("Update Word");
      setDeleteWord(null);
      
      // Use the nested data from the API response
      if (word.lesson?.module?.courseId) {
        try {
          // Fetch modules for the course
          const courseModules = await getAllModuleByCourseId(word.lesson.module.courseId).unwrap();
          const fetchedModules = Array.isArray(courseModules.result) ? courseModules.result : [];
          setModulesSelect(fetchedModules);
          
          // Update modal fields with course and module data using the fetched modules directly
          const updatedFields = wordFields.map(field => {
            if (field.name === 'courseId') {
              return { ...field, options: coursesSelect.map((c) => ({ label: c.title, value: c.id })) };
            }
            if (field.name === 'moduleId') {
              return { ...field, options: fetchedModules.map((m) => ({ label: m.title, value: m.id })) };
            }
            return field;
          });
          
          setModalFields(updatedFields);
        } catch (error) {
          console.error("Error fetching modules:", error);
          setModalFields(wordFields);
        }
      } else {
        setModalFields(wordFields);
      }
    } else {
      setEditWord(null);
      setModalTitle("Add Word");
      setDeleteWord(null);
      setModalFields(wordFields);
    }
    setModalOpen(true);
  };
  const openDeleteModal = (word: Word) => {
    setDeleteWord(word);
    setShowModal(true);
  };
  const closeModal = () => {
    setModalOpen(false);
    setEditWord(null);
    setDeleteWord(null);
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
    if (!deleteWord) return;
    try {
      await deleteWordApi(deleteWord.id).unwrap();
      toast.success("Word deleted successfully");
      setShowModal(false);
      setDeleteWord(null);
      refetch();
    } catch (error) {
      console.error("Failed to delete word:", error);
      toast.error("Failed to delete word");
    }
  };

  const handleModalSubmit = async (values: Record<string, string>) => {
    try {
      if (editWord) {
        await updateWord({
          id: editWord.id,
          lessonId: values.lessonId,
          text: values.text,
          videoSrc: values.videoSrc,
        }).unwrap();
        toast.success("Word updated successfully");
      } else {
        await createWord({
          lessonId: values.lessonId,
          text: values.text,
          videoSrc: values.videoSrc,
        }).unwrap();
        toast.success("Word created successfully");
      }
      closeModal();
      refetch();
    } catch {
      toast.error("Failed to save word");
    }
  };

  // Pagination
  const totalWordPages = Math.ceil(words.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedWords = words.slice(startIndex, startIndex + itemsPerPage);

  // Table headers
  const wordTableHeaders = [
    "Text",
    "Video Source",
    "Lesson",
    "Created At",
    "Actions",
  ];

  const renderWordRow = (word: Word) => {
    if (!word) {
      return (
        <tr>
          <td colSpan={5} className="text-center">
            <span>No data</span>
          </td>
        </tr>
      );
    }
    return (
      <tr key={word.id}>
        <td className="px-6 py-4 w-1/4">
          <div className="text-sm font-medium text-gray-900 dark:text-white">
            {word.text}
          </div>
        </td>
        <td className="px-6 py-4">
          {word.videoSrc ? (
            <Button
              size="sm"
              variant="outline"
              onClick={() => openVideoModal(word.videoSrc!)}
              className="flex items-center space-x-2"
            >
              <Play className="h-4 w-4" />
              <span>Watch Video</span>
            </Button>
          ) : (
            <span className="text-gray-500">No video</span>
          )}
        </td>
        <td className="px-6 py-4">
          <span>
            {lessons.find((l) => l.id === word.lessonId)?.title ||
              word.lessonId}
          </span>
        </td>
        <td className="px-6 py-4">
          <span>{new Date().toLocaleDateString()}</span>
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
          <div className="flex space-x-2 justify-end">
            <Button size="sm" variant="ghost" onClick={() => openModal(word)}>
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              className="text-red-600"
              onClick={() => openDeleteModal(word)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </td>
      </tr>
    );
  };

  // Stats cards for word
  const wordStats = [
    {
      icon: <Book className="h-8 w-8 text-blue-500" />,
      label: "Total Words",
      value: words.length,
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
          <h1 className="text-3xl font-bold">Word Management</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage words</p>
        </div>
        <Button
          className="bg-[#6947A8] hover:bg-[#5a3d8c]"
          onClick={() => openModal()}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Word
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
        <Button variant="outline" onClick={() => router.push("/admin/quizzes")}>
          All Quizzes
        </Button>
        <Button variant="default" onClick={() => router.push("/admin/words")}>
          All Words
        </Button>
      </div>
      {/* Table + Stats Cards */}
      <TableWithStatsCard
        tableHeaders={wordTableHeaders}
        renderRow={renderWordRow}
        data={paginatedWords}
        statsTitle="Word Stats"
        statsData={wordStats}
        pagination={{
          currentPage,
          totalPages: totalWordPages,
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
          editWord
            ? {
                id: editWord.id,
                text: editWord.text || "",
                videoSrc: editWord.videoSrc || "",
                courseId: editWord.lesson?.module?.courseId || "",
                moduleId: editWord.lesson?.moduleId || "",
                lessonId: editWord.lessonId || "",
              }
            : {}
        }
      />

      {/* Delete Confirmation Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 w-full max-w-sm">
            <h2 className="text-lg font-semibold mb-4">Delete Confirmation</h2>
            <p>Are you sure you want to delete this word?</p>
            <div className="flex justify-end gap-2 mt-6">
              <Button
                variant="outline"
                onClick={() => {
                  setShowModal(false);
                  setDeleteWord(null);
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
      <Dialog
        open={videoModalOpen}
        onOpenChange={(open) => !open && closeVideoModal()}
      >
        <DialogContent className="sm:max-w-4xl w-[90vw] h-[80vh] p-0 border-0">
          <div className="relative w-full h-full">
            <iframe
              src={selectedVideo.replace("watch?v=", "embed/")}
              className="w-full h-full rounded-lg"
              title="Video Player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
