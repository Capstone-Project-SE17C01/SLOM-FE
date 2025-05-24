"use client";
import { FaInfoCircle } from "react-icons/fa";
import SwitchTabButton from "@/components/ui/switchTabButton";
import StatCard from "@/components/ui/statCard";
import SearchInput from "@/components/ui/searchInput";
import { useTranslations } from "next-intl";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from "@/components/ui/tooltip";
import { useGetUserLessonProgressMutation } from "../api";
import { useEffect, useState } from "react";
import Spinner from "@/components/ui/spinner";
import { Lesson, UserLessonProgress } from "../types";
import LearningPathSection from "@/components/ui/learningPathSection";
import { CardReview } from "@/components/ui/cardCourse";

export default function PracticePage() {
  const t_practice = useTranslations("practicePage");

  const [getUserLessonProgress, { isLoading: isLoadingUserLessonProgress }] =
    useGetUserLessonProgressMutation();
  const [learnedLesson, setLearnedLesson] = useState<Lesson[]>([]);
  const [reviewedLesson, setReviewedLesson] = useState<Lesson[]>([]);
  const [searchValue, setSearchValue] = useState("");
  const [debounced, setDebounced] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      await getUserLessonProgress({
        userId: "1",
        lessonId: "1",
      })
        .unwrap()
        .then((res) => {
          console.log(res);
          const userLessonProgressList = res.result as UserLessonProgress[];
          //get all lesson in userLessonProgressList that completedAt is null
          const learnedLesson = userLessonProgressList
            .filter(
              (userLessonProgress) => userLessonProgress.completedAt === null
            )
            .map((userLessonProgress) => userLessonProgress.lesson);
          const reviewedLesson = userLessonProgressList
            .filter(
              (userLessonProgress) => userLessonProgress.completedAt !== null
            )
            .map((userLessonProgress) => userLessonProgress.lesson);

          setLearnedLesson(learnedLesson as Lesson[]);
          setReviewedLesson(reviewedLesson as Lesson[]);
        })
        .catch((err) => {
          console.log(err);
          const fakedata: Lesson[] = [
            {
              id: "1",
              title: "Lesson 1",
              moduleId: "1",
              orderNumber: 1,
              createdAt: "2021-01-01",
              module: {
                id: "1",
                title: "Module 1",
                courseId: "1",
                orderNumber: 1,
                createdAt: "2021-01-01",
              },
              wordList: [],
              quizList: [],
            },
            {
              id: "2",
              title: "Lesson 2",
              moduleId: "2",
              orderNumber: 2,
              createdAt: "2021-01-01",
              module: {
                id: "2",
                title: "Module 2",
                courseId: "1",
                orderNumber: 2,
                createdAt: "2021-01-01",
              },
              wordList: [],
              quizList: [],
            },
          ];
          const learnedLesson = fakedata;
          const reviewedLesson = fakedata;
          setLearnedLesson(learnedLesson);
          setReviewedLesson(reviewedLesson);
        });
    };
    fetchData();
  }, [getUserLessonProgress]);

  useEffect(() => {
    const handler = setTimeout(() => setDebounced(searchValue), 500);
    return () => clearTimeout(handler);
  }, [searchValue]);

  const filteredLearnedLessons = learnedLesson.filter((lesson) =>
    lesson.title.toLowerCase().includes(debounced.trim().toLowerCase())
  );

  const filteredReviewedLessons = reviewedLesson.filter((lesson) =>
    lesson.title.toLowerCase().includes(debounced.trim().toLowerCase())
  );

  function SectionList({
    title,
    count,
    lessons,
    emptyText,
  }: {
    title: string;
    count: number;
    lessons: Lesson[];
    emptyText: string;
  }) {
    return (
      <>
        <div className="flex items-center gap-3 mb-3 max-md:flex-col max-md:gap-2 max-md:items-start">
          <span className="text-xl font-bold">{title}</span>
          <span className="bg-primary text-white rounded-full px-3 py-1 text-sm font-bold">
            {t_practice("countSituations", { count })}
          </span>
        </div>
        {lessons.length > 0 ? (
          <LearningPathSection
            review={true}
            lessons={lessons.map((lesson) => ({
              id: lesson.id,
              title: lesson.title,
              image: "/images/logo.png", // hoặc lesson.image nếu có
            }))}
          />
        ) : (
          <div className="bg-[#f5f6f7] rounded-xl p-4 text-[#0a2233] text-base">
            {emptyText}
          </div>
        )}
      </>
    );
  }

  return (
    <TooltipProvider>
      {isLoadingUserLessonProgress ? (
        <div className="flex justify-center items-center h-40">
          <Spinner />
        </div>
      ) : (
        <div className="p-8">
          {/* Tabs + Search */}
          <div className="flex items-center justify-between mb-8 max-md:flex-col max-md:gap-4 max-md:items-start">
            <SwitchTabButton
              tabs={[
                { label: t_practice("tabLearn"), href: "/learn" },
                { label: t_practice("tabPractice"), href: "/practice" },
              ]}
            />
          </div>

          {/* 2 box lớn */}
          <div className="flex gap-8 mb-10 max-md:flex-col max-md:gap-4 max-md:items-start">
            {/* Box trái */}
            <CardReview
              title={t_practice("ready")}
              infoIcon={
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span>
                      <FaInfoCircle className="text-gray-400" />
                    </span>
                  </TooltipTrigger>
                  <TooltipContent className="max-w-xs">
                    {t_practice("readyTooltip")}
                  </TooltipContent>
                </Tooltip>
              }
              className="flex-1 bg-primary/10 min-w-[200px] max-md:w-full"
            >
              <div className="flex lg:items-center gap-4 max-md:items-start">
                <StatCard
                  value={learnedLesson.length}
                  label={t_practice("statLabelLearned")}
                />
              </div>
            </CardReview>
            {/* Box phải */}
            <CardReview
              title={t_practice("reviewed")}
              infoIcon={
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span>
                      <FaInfoCircle className="text-gray-400" />
                    </span>
                  </TooltipTrigger>
                  <TooltipContent className="max-w-xs">
                    {t_practice("readyTooltip")}
                  </TooltipContent>
                </Tooltip>
              }
              className="flex-[1.5] bg-primary/10 min-w-[200px] max-md:w-full"
            >
              <div className="flex lg:items-center gap-8 max-md:items-start">
                <StatCard
                  value={reviewedLesson.length}
                  label={t_practice("statLabelReviewed")}
                />
              </div>
            </CardReview>
          </div>

          {/* Các tình huống đã học và cần làm quiz */}
          <SearchInput
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className="mb-4"
          />
          <SectionList
            title={t_practice("learnedSituations")}
            count={filteredLearnedLessons.length}
            lessons={filteredLearnedLessons}
            emptyText={t_practice("empty")}
          />
          {/* Các tình huống đã học và cần làm quiz */}

          {/* Các tình huống đã quiz */}
          <SectionList
            title={t_practice("reviewedSituations")}
            count={filteredReviewedLessons.length}
            lessons={filteredReviewedLessons}
            emptyText={t_practice("empty")}
          />
          {/* Các tình huống đã  quiz */}
        </div>
      )}
    </TooltipProvider>
  );
}
