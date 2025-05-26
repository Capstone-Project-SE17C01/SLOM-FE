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
import { useGetListLearnedLessonByUserIdMutation } from "../api";
import { useEffect, useState } from "react";
import Spinner from "@/components/ui/spinner";
import { Lesson } from "../types";
import LearningPathSection from "@/components/ui/learningPathSection";
import { CardReview } from "@/components/ui/cardCourse";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { useRouter } from "next/navigation";
import { useDebounce } from "@/hooks/useDebounce";

function SectionList({
  title,
  count,
  lessons,
  emptyText,
  t_learn,
}: {
  title: string;
  count: number;
  lessons: Lesson[];
  emptyText: string;
  t_learn: ReturnType<typeof useTranslations>;
}) {
  const t_practice = useTranslations("practicePage");
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
          isReview={true}
          lessons={lessons.map((lesson) => ({
            id: lesson.id,
            title: t_learn("lessonsTitle." + lesson.title),
            image: "/images/logo.png",
          }))}
        />
      ) : (
        <div className="bg-[#f5f6f7] my-4 rounded-xl p-4 text-[#0a2233] text-base">
          {emptyText}
        </div>
      )}
    </>
  );
}

function useLessons(userId?: string) {
  const [learnedLesson, setLearnedLesson] = useState<Lesson[]>([]);
  const [reviewedLesson, setReviewedLesson] = useState<Lesson[]>([]);
  const [getListLearnedLessonByUserId, { isLoading }] =
    useGetListLearnedLessonByUserIdMutation();

  useEffect(() => {
    if (!userId) return;
    getListLearnedLessonByUserId(userId)
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
  }, [userId, getListLearnedLessonByUserId]);

  return { learnedLesson, reviewedLesson, isLoading };
}

export default function PracticePage() {
  const t_practice = useTranslations("practicePage");
  const t_learn = useTranslations("learnPage");
  const [searchValue, setSearchValue] = useState("");
  const debounced = useDebounce(searchValue, 500);
  const router = useRouter();
  const { userInfo } = useSelector((state: RootState) => state.auth);

  const { learnedLesson, reviewedLesson, isLoading } = useLessons(userInfo?.id);

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

        {/* 2 large box */}
        <div className="flex gap-8 mb-10 max-md:flex-col max-md:gap-4 max-md:items-start">
          {/* Box left */}
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
          {/* Box right */}
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

        {/* need practice */}
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
          t_learn={t_learn}
        />
        {/* reviewed situations */}
        <SectionList
          title={t_practice("reviewedSituations")}
          count={filteredReviewedLessons.length}
          lessons={filteredReviewedLessons}
          emptyText={t_practice("empty")}
          t_learn={t_learn}
        />
      </div>
    </TooltipProvider>
  );
}
