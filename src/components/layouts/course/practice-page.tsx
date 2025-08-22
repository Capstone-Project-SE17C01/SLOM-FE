"use client";
import { Search, BookOpen, Clock } from "lucide-react";
import SwitchTabButton from "@/components/ui/switchTabButton";
import { useTranslations } from "next-intl";
import {
  TooltipProvider,
} from "@/components/ui/tooltip";
import { useGetListLearnedLessonByUserIdMutation } from "../../../api/CourseApi";
import { useEffect, useState } from "react";
import Spinner from "@/components/ui/spinner";
import { Lesson } from "../../../types/ICourse";
import { CardLesson } from "@/components/ui/cardCourse";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { useRouter } from "next/navigation";
import { useDebounce } from "@/hooks/useDebounce";
import { cn } from "@/utils/cn";
import { useTheme } from "@/contexts/ThemeContext";
import { motion } from "framer-motion";

function SectionList({
  title,
  count,
  lessons,
  emptyText,
  icon,
}: {
  title: string;
  count: number;
  lessons: Lesson[];
  emptyText: string;
  icon: React.ReactNode;
}) {
  const t_practice = useTranslations("practicePage");
  const { isDarkMode } = useTheme();
  const router = useRouter();

  return (
    <motion.div 
      className="mb-10 w-full"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-primary/10 rounded-lg text-primary">
          {icon}
        </div>
        <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{title}</h3>
        <span className="bg-primary text-white rounded-full px-3 py-1 text-sm font-medium ml-2">
          {t_practice("countSituations", { count })}
        </span>
      </div>
      
      {lessons.length > 0 ? (
        <div className="overflow-x-auto pb-4 ml-11 w-full">
          <div className="flex gap-6 flex-wrap">
            {lessons.map((lesson, i) => (
              <CardLesson
                key={i}
                title={lesson.title}
                image="/images/logo.png"
                onClick={() => {
                  const route = `/apprender/learn?lessonId=${encodeURIComponent(
                    lesson.id
                  )}&lessonTitle=${encodeURIComponent(
                    lesson.title
                  )}&review=${encodeURIComponent(true)}&back=${encodeURIComponent(
                    "/practice"
                  )}`;
                  
                  router.push(route);
                }}
              />
            ))}
          </div>
        </div>
      ) : (
        <div
          className={cn(
            "ml-11 rounded-xl p-6 text-base border shadow-sm w-full",
            isDarkMode
              ? "bg-gray-800 text-gray-300 border-gray-700"
              : "bg-gray-50 text-gray-600 border-gray-200"
          )}
        >
          {emptyText}
        </div>
      )}
    </motion.div>
  );
}

function useLessons(userId?: string, courseId?: string) {
  const [learnedLesson, setLearnedLesson] = useState<Lesson[]>([]);
  const [reviewedLesson, setReviewedLesson] = useState<Lesson[]>([]);
  const [getListLearnedLessonByUserId, { isLoading }] =
    useGetListLearnedLessonByUserIdMutation();

  useEffect(() => {
    if (!userId || !courseId) return;
    getListLearnedLessonByUserId({ userId, courseId })
      .unwrap()
      .then((res) => {
        const listLearnedLesson = res.result;
        const learned = listLearnedLesson?.filter(
          (lesson) => lesson.userLessonProgress?.[0]?.completedAt === null
        ) as Lesson[];
        const learnedIds = new Set(learned?.map((lesson) => lesson.id));
        const reviewed = listLearnedLesson?.filter(
          (lesson) => !learnedIds.has(lesson.id)
        ) as Lesson[];
        setLearnedLesson(learned);
        setReviewedLesson(reviewed);
      })
      .catch((err) => {
        console.error(err);
      });
  }, [userId, courseId, getListLearnedLessonByUserId]);

  return { learnedLesson, reviewedLesson, isLoading };
}

export default function PracticePage() {
  const t_practice = useTranslations("practicePage");
  const [searchValue, setSearchValue] = useState("");
  const debounced = useDebounce(searchValue, 500);
  const router = useRouter();
  const { userInfo } = useSelector((state: RootState) => state.auth);

  const { learnedLesson, reviewedLesson, isLoading } = useLessons(
    userInfo?.id,
    userInfo?.courseId
  );

  useEffect(() => {
    if (!userInfo?.id) {
      router.push("/login");
    }
  }, [userInfo?.id, router]);

  const filterLessons = (lessons: Lesson[]) =>
    lessons.filter((lesson) =>
      lesson.title.toLowerCase().includes(debounced.trim().toLowerCase())
    );

  const filteredLearnedLessons = filterLessons(learnedLesson);
  const filteredReviewedLessons = filterLessons(reviewedLesson);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-40">
        <Spinner />
      </div>
    );
  }

  return (
    <TooltipProvider>
      <div className="p-6 md:p-8 bg-white dark:bg-gray-900">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">
            {t_practice("practiceTitle")}
          </h1>
          
          {/* Tabs + Search */}
          <div className="flex items-center justify-between mb-10 max-md:flex-col max-md:gap-6 max-md:items-start">
            <SwitchTabButton
              tabs={[
                { label: t_practice("tabLearn"), href: "/learn" },
                { label: t_practice("tabPractice"), href: "/practice" },
              ]}
            />
            
            <div className="relative">
              <input
                type="text"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                placeholder={t_practice("searchPlaceholder")}
                className="pl-12 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent w-full md:w-[280px] shadow-sm text-black dark:text-gray-100 transition-all duration-300"
              />
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
            </div>
          </div>
          
          {/* need practice */}
          <SectionList
            title={t_practice("learnedSituations")}
            count={filteredLearnedLessons.length}
            lessons={filteredLearnedLessons}
            emptyText={t_practice("empty")}
            icon={<BookOpen className="h-5 w-5" />}
          />
          
          {/* reviewed situations */}
          <SectionList
            title={t_practice("reviewedSituations")}
            count={filteredReviewedLessons.length}
            lessons={filteredReviewedLessons}
            emptyText={t_practice("empty")}
            icon={<Clock className="h-5 w-5" />}
          />
        </div>
      </div>
    </TooltipProvider>
  );
}
