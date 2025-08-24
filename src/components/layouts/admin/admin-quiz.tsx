"use client";

import { useEffect, useState, useCallback } from "react";
import { Plus, Edit, Trash2, Book, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import TableWithStatsCard from "@/components/layouts/admin/TableWithStatsCard";
import { useRouter } from "next/navigation";
import { useGetAllCourseMutation, useGetAllModuleByCourseIdMutation } from "@/api/CourseApi";
import {
  useGetAllQuizzesQuery,
  useCreateQuizMutation,
  useUpdateQuizMutation,
  useDeleteQuizMutation,
  useGetAllLessonsQuery,
} from "@/api/QuizApi";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog";
import { Quiz, QuizOption } from "@/types/IQuiz";
import { toast } from "sonner";
import QuizOptionsInput from "@/components/ui/QuizOptionsInput";

export default function AdminQuiz() {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
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
  const [quizOptions, setQuizOptions] = useState<QuizOption[]>([
    { id: "1", text: "", isCorrect: false },
    { id: "2", text: "", isCorrect: false },
    { id: "3", text: "", isCorrect: false },
    { id: "4", text: "", isCorrect: false },
  ]);

  const [formData, setFormData] = useState<Record<string, string>>({});

  const handleFormChange = async (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Handle course change - fetch modules for selected course
    if (field === 'courseId' && value) {
      try {
        const courseModules = await getAllModuleByCourseId(value).unwrap();
        setModulesSelect(Array.isArray(courseModules.result) ? courseModules.result : []);
        // Clear module and lesson when course changes
        setFormData(prev => ({ ...prev, moduleId: '', lessonId: '' }));
        // Clear lessons as well since module changed
        setLessonsSelect([]);
      } catch (error) {
        console.error("Error fetching modules:", error);
        setModulesSelect([]);
        setLessonsSelect([]);
      }
    } else if (field === 'courseId' && !value) {
      // If course is cleared, clear everything
      setModulesSelect([]);
      setLessonsSelect([]);
      setFormData(prev => ({ ...prev, moduleId: '', lessonId: '' }));
    }
    
    // Handle module change - filter lessons for selected module
    if (field === 'moduleId' && value) {
      // Filter lessons by selected module from all available lessons
      const filteredLessons = lessons.filter(lesson => lesson.moduleId === value);
      setLessonsSelect(filteredLessons);
      // Clear lesson when module changes
      setFormData(prev => ({ ...prev, lessonId: '' }));
    } else if (field === 'moduleId' && !value) {
      // If module is cleared, clear lessons
      setLessonsSelect([]);
      setFormData(prev => ({ ...prev, lessonId: '' }));
    }
  };

  // API hooks
  const { data: lessonsResponse, isLoading: lessonsLoading } =
    useGetAllLessonsQuery();
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
      setQuizzes(
        Array.isArray(quizzesResponse.result) ? quizzesResponse.result : []
      );
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
      
      // Populate form data for editing
      setFormData({
        question: quiz.question || "",
        explanation: quiz.explanation || "",
        maxScore: quiz.maxScore?.toString() || "0",
        courseId: quiz.lesson?.module?.courseId || "",
        moduleId: quiz.lesson?.moduleId || "",
        lessonId: quiz.lessonId || "",
      });
      
      // Use the nested data from the API response
      if (quiz.lesson?.module?.courseId) {
        try {
          // Fetch modules for the course
          const courseModules = await getAllModuleByCourseId(quiz.lesson.module.courseId).unwrap();
          const fetchedModules = Array.isArray(courseModules.result) ? courseModules.result : [];
          setModulesSelect(fetchedModules);
          
          // Filter lessons by module from all available lessons
          const filteredLessons = lessons.filter(lesson => lesson.moduleId === quiz.lesson?.moduleId);
          setLessonsSelect(filteredLessons);
          
          // Set quiz options from existing quiz
          if (quiz.quizOptions && quiz.quizOptions.length > 0) {
            setQuizOptions(quiz.quizOptions);
          }
          
        } catch (error) {
          console.error("Error fetching modules:", error);
        }
      }
    } else {
      setEditQuiz(null);
      setModalTitle("Add Quiz");
      setDeleteQuiz(null);
      
      // Reset form data for new quiz
      setFormData({
        question: "",
        explanation: "",
        maxScore: "0",
        courseId: "",
        moduleId: "",
        lessonId: "",
      });
      
      // Reset selections
      setModulesSelect([]);
      setLessonsSelect(Array.isArray(lessonsResponse?.result) ? lessonsResponse.result : []);
      
      // Reset quiz options
      setQuizOptions([
        { id: "1", text: "", isCorrect: false },
        { id: "2", text: "", isCorrect: false },
        { id: "3", text: "", isCorrect: false },
        { id: "4", text: "", isCorrect: false },
      ]);
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
    // Reset form data
    setFormData({});
    // Reset selections
    setModulesSelect([]);
    setLessonsSelect(Array.isArray(lessonsResponse?.result) ? lessonsResponse.result : []);
    // Reset quiz options
    setQuizOptions([
      { id: "1", text: "", isCorrect: false },
      { id: "2", text: "", isCorrect: false },
      { id: "3", text: "", isCorrect: false },
      { id: "4", text: "", isCorrect: false },
    ]);
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
      // Backend expects quizOptions as array of strings
      const quizOptionsStrings = quizOptions
        .filter(option => option.text && option.text.trim()) // Only include non-empty options
        .map(option => option.text.trim()); // Just the text strings
      
      // Get the correct answer from the selected option
      const correctOption = quizOptions.find(option => option.isCorrect);
      const correctAnswer = correctOption ? correctOption.text.trim() : "";
      
      if (!correctAnswer) {
        toast.error("Please select a correct answer option");
        return;
      }

      if (editQuiz) {
        await updateQuiz({
          id: editQuiz.id,
          lessonId: values.lessonId,
          question: values.question,
          correctAnswer: correctAnswer,
          explanation: values.explanation,
          maxScore: parseInt(values.maxScore) || 0,
          quizOptions: quizOptionsStrings, // Array of strings
        }).unwrap();
        toast.success("Quiz updated successfully");
      } else {
        await createQuiz({
          lessonId: values.lessonId,
          question: values.question,
          correctAnswer: correctAnswer,
          explanation: values.explanation,
          maxScore: parseInt(values.maxScore) || 0,
          quizOptions: quizOptionsStrings, // Array of strings
        }).unwrap();
        toast.success("Quiz created successfully");
      }
      closeModal();
      refetch();
    } catch (error) {
      console.error("Failed to save quiz:", error);
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
          <span>
            {lessons.find((l) => l.id === quiz.lessonId)?.title ||
              quiz.lessonId}
          </span>
        </td>
        <td className="px-6 py-4">
          <span>{quiz.maxScore || 0}</span>
        </td>
        <td className="px-6 py-4">
          <span>{new Date(quiz.createdAt).toLocaleDateString()}</span>
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
          <div className="flex space-x-2">
            <Button size="sm" variant="ghost" onClick={() => openModal(quiz)} className="px-0">
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
             {/* Custom Quiz Modal */}
       <Dialog open={modalOpen} onOpenChange={(open) => !open && closeModal()}>
         <DialogContent className="sm:max-w-4xl">
           <DialogHeader>
             <DialogTitle className="text-xl">{modalTitle}</DialogTitle>
           </DialogHeader>
           
           <div className="py-4">
             <form onSubmit={(e) => {
               e.preventDefault();
               handleModalSubmit(formData);
             }} className="space-y-6">
               <div className="grid grid-cols-2 gap-6">
                 <div className="space-y-4">
                   <div>
                     <Label htmlFor="question" className="text-sm font-medium">Question</Label>
                     <Input
                       id="question"
                       value={formData.question || ""}
                       onChange={(e) => handleFormChange("question", e.target.value)}
                       placeholder="Enter question"
                       required
                     />
                   </div>
                   
                   
                   <div>
                     <Label htmlFor="explanation" className="text-sm font-medium">Explanation</Label>
                     <Input
                       id="explanation"
                       value={formData.explanation || ""}
                       onChange={(e) => handleFormChange("explanation", e.target.value)}
                       placeholder="Enter explanation"
                     />
                   </div>
                   
                   <div>
                     <Label htmlFor="maxScore" className="text-sm font-medium">Max Score</Label>
                     <Input
                       id="maxScore"
                       type="number"
                       value={formData.maxScore || "0"}
                       onChange={(e) => handleFormChange("maxScore", e.target.value)}
                       placeholder="Enter max score"
                     />
                   </div>
                   
                   <div>
                     <Label htmlFor="courseId" className="text-sm font-medium">Course</Label>
                     <select
                       id="courseId"
                       value={formData.courseId || ""}
                       onChange={(e) => handleFormChange("courseId", e.target.value)}
                       className="w-full p-2 border border-gray-300 rounded-md dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                       required
                     >
                       <option value="">Select Course</option>
                       {coursesSelect.map((course) => (
                         <option key={course.id} value={course.id}>
                           {course.title}
                         </option>
                       ))}
                     </select>
                   </div>
                   
                   <div>
                     <Label htmlFor="moduleId" className="text-sm font-medium">Module</Label>
                     <select
                       id="moduleId"
                       value={formData.moduleId || ""}
                       onChange={(e) => handleFormChange("moduleId", e.target.value)}
                       className="w-full p-2 border border-gray-300 rounded-md dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                       required
                       disabled={!formData.courseId}
                     >
                       <option value="">Select Module</option>
                       {modulesSelect.map((module) => (
                         <option key={module.id} value={module.id}>
                           {module.title}
                         </option>
                       ))}
                     </select>
                   </div>
                   
                   <div>
                     <Label htmlFor="lessonId" className="text-sm font-medium">Lesson</Label>
                     <select
                       id="lessonId"
                       value={formData.lessonId || ""}
                       onChange={(e) => handleFormChange("lessonId", e.target.value)}
                       className="w-full p-2 border border-gray-300 rounded-md dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                       required
                       disabled={!formData.moduleId}
                     >
                       <option value="">Select Lesson</option>
                       {lessonsSelect.map((lesson) => (
                         <option key={lesson.id} value={lesson.id}>
                           {lesson.title}
                         </option>
                       ))}
                     </select>
                   </div>
                 </div>
                 
                 <div>
                   <QuizOptionsInput
                     quizOptions={quizOptions}
                     onQuizOptionsChange={setQuizOptions}
                   />
                 </div>
               </div>
               
               <DialogFooter>
                 <Button type="button" variant="outline" onClick={closeModal}>
                   Cancel
                 </Button>
                 <Button type="submit">
                   {editQuiz ? "Update Quiz" : "Create Quiz"}
                 </Button>
               </DialogFooter>
             </form>
           </div>
         </DialogContent>
       </Dialog>

      {/* Delete Confirmation Modal */}
      <Dialog open={showModal} onOpenChange={(open) => !open && setShowModal(false)}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Delete Confirmation</DialogTitle>
          </DialogHeader>
          <p>Are you sure you want to delete this quiz?</p>
          <DialogFooter className="mt-6">
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
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Video Modal */}
      <Dialog open={videoModalOpen} onOpenChange={(open) => !open && closeVideoModal()}>
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
