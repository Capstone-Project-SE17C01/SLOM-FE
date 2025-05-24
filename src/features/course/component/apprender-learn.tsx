"use client";

import React, { useState, useMemo, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import LessonHeader from "@/components/ui/lessonHeader";
import ProgressBar from "@/components/ui/progressBar";
import VideoSquare from "@/components/ui/videoSquare";
import MeaningCard from "@/components/ui/meaningCard";
import ActionButtons from "@/components/ui/actionButtons";
import { useTranslations } from "next-intl";
import { Lesson } from "@/features/course/types";
import QuizAction from "@/components/ui/quizAction";
import QuizInput from "@/components/ui/quizInput";
import QuizOptions from "@/components/ui/quizOptions";

function isUrl(str: string) {
  try {
    new URL(str);
    return true;
  } catch {
    return false;
  }
}

export default function ApprenderLearnPractice() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const back = searchParams.get("back") || "/learn";
  const lessonId = searchParams.get("lessonId");
  const lessonTitle = "ASL - " + lessonId; // hoặc lấy từ props/data
  const lessonIdParam = useSearchParams().get("lessonId") || null;
  const review = searchParams.get("review") === "true";

  //get lesson from api by lessonId
  console.log("get lesson from api by lessonId", lessonIdParam);

  const [lessons, setLessons] = useState<Lesson[]>([]);

  useEffect(() => {
    fetch("/fakedata/fakedata_lesson.json")
      .then((res) => res.json())
      .then((data) => {
        setLessons([data.result]);
      });
  }, []);

  const lesson = lessons[0];

  const signlessonList = useMemo(() => lesson?.wordList || [], [lesson]);
  const quizList = useMemo(() => {
    if (!lesson?.quizList) return [];
    return lesson.quizList.flatMap((q) => [
      { ...q, type: "MultiChoice" as const },
      { ...q, type: "AI" as const },
    ]);
  }, [lesson]);

  const totalSigns = signlessonList.length;
  const t_learn = useTranslations("learnPage");

  // State
  const [currentIndex, setCurrentIndex] = useState(0);
  const [passedSignIds, setPassedSignIds] = useState<string[]>([]);
  const [skippedMeanings, setSkippedMeanings] = useState<string[]>([]);
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean>(false);
  const [inputAnswer, setInputAnswer] = useState("");
  const [showExplanation, setShowExplanation] = useState(false);
  const [redEffect, setRedEffect] = useState(false);

  // Filter signList theo skippedMeanings
  const filteredSignList = useMemo(
    () => signlessonList.filter((sign) => !skippedMeanings.includes(sign.text)),
    [signlessonList, skippedMeanings]
  );

  const filteredLength = filteredSignList.length;
  const isComplete = currentIndex >= filteredLength;
  const currentSign = filteredSignList[currentIndex] ?? null;

  const currentQuiz = quizList[currentQuizIndex] ?? null;
  const isQuizComplete = currentQuizIndex >= quizList.length;

  // Progress
  const progress = review
    ? (currentQuizIndex / quizList.length) * 100
    : (passedSignIds.length / totalSigns) * 100;

  // Handlers
  const handleContinue = () => {
    setPassedSignIds((prev) => [...prev, currentSign?.id || ""]);
    setCurrentIndex((idx) => idx + 1);
  };

  const handleAlreadyKnow = () => {
    setSkippedMeanings((prev) => [...prev, currentSign?.text || ""]);
    // Tìm index mới sau khi filter lại
    setCurrentIndex(0);
  };

  const currentIdx = lessons.findIndex((l) => l.id === lessonId);
  const nextLesson = currentIdx !== -1 ? lessons[currentIdx + 1] : undefined;
  const isLastLesson = currentIdx === lessons.length - 1;

  const handleOptionClick = (optionId: string, isCorrect: boolean) => {
    setSelectedOption(optionId);
    if (isCorrect) {
      setIsCorrect(true);
      setTimeout(() => {
        setCurrentQuizIndex((idx) => idx + 1);
        setSelectedOption(null);
        setIsCorrect(false);
        setShowExplanation(false);
        setInputAnswer("");
      }, 800);
    } else {
      setIsCorrect(false);
    }
  };

  const handleInputCheck = () => {
    if (
      inputAnswer.trim().toLowerCase() ===
      (currentQuiz?.correctAnswer || "").trim().toLowerCase()
    ) {
      setIsCorrect(true);
      setTimeout(() => {
        setCurrentQuizIndex((idx) => idx + 1);
        setInputAnswer("");
        setIsCorrect(false);
        setShowExplanation(false);
      }, 800);
    } else {
      setIsCorrect(false);
      setRedEffect(true);
      setTimeout(() => setRedEffect(false), 1000);
    }
  };

  const handleDontKnow = () => {
    setShowExplanation(true);
    setIsCorrect(false);
  };

  useEffect(() => {
    if (showExplanation) {
      const timer = setTimeout(() => {
        setSelectedOption(null);
        setIsCorrect(false);
        setShowExplanation(false);
        setInputAnswer("");
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [showExplanation]);

  return (
    <div className="min-h-screen bg-white">
      {!lesson ? (
        <div>Loading...</div>
      ) : (
        <LessonHeader title={lessonTitle} onClose={() => router.push(back)} />
      )}
      <ProgressBar progress={isComplete ? 100 : progress} />

      {review ? (
        isQuizComplete ? (
          <div className="text-center mt-20 text-2xl font-bold flex flex-col items-center gap-6">
            {t_learn("finishedQuiz")}
            <button
              className="bg-gray-200 text-[#0a2233] font-bold px-8 py-3 rounded-xl text-lg shadow mt-6"
              onClick={() => router.push(back)}
            >
              {t_learn("backToLesson")}
            </button>
          </div>
        ) : (
          <div className="w-full max-w-4xl mx-auto grid grid-cols-12 gap-8">
            {/* Cột 1 */}
            <div className="col-span-5 flex items-center justify-center">
              {currentQuiz?.question && isUrl(currentQuiz.question) ? (
                <VideoSquare videoUrl={currentQuiz.question} />
              ) : (
                <div className="font-bold text-lg mb-2">
                  {currentQuiz?.question}
                </div>
              )}
            </div>
            {/* Cột 2 */}
            <div className="col-span-5 flex flex-col items-center justify-center gap-4">
              {currentQuiz?.type === "MultiChoice" ? (
                <QuizOptions
                  options={currentQuiz.quizOptions || []}
                  selectedOption={selectedOption}
                  isCorrect={isCorrect}
                  onSelect={handleOptionClick}
                  disabled={!!isCorrect}
                />
              ) : (
                <QuizInput
                  value={inputAnswer}
                  onChange={(e) => setInputAnswer(e.target.value)}
                  onCheck={handleInputCheck}
                  disabled={!!isCorrect}
                  redEffect={redEffect}
                  checkLabel={t_learn("checkAnswer")}
                />
              )}
            </div>
            {/* Cột 3 */}
            <div className="col-span-2 flex items-center justify-center flex-col">
              <QuizAction
                onDontKnow={handleDontKnow}
                disabled={!!isCorrect || showExplanation}
                showExplanation={showExplanation}
                explanation={currentQuiz?.explanation || ""}
                dontKnowLabel={t_learn("dontKnow") || "Tôi không biết"}
              />
            </div>
          </div>
        )
      ) : isComplete ? (
        <div className="text-center mt-20 text-2xl font-bold flex flex-col items-center gap-6">
          {t_learn("finishedLesson")}
          <div className="flex gap-4 mt-6">
            <button
              className="bg-gray-200 text-[#0a2233] font-bold px-8 py-3 rounded-xl text-lg shadow"
              onClick={() => router.push("/learn")}
            >
              {t_learn("finishLesson")}
            </button>
            <button
              className="bg-primary hover:bg-primary/80 transition text-white font-bold px-8 py-3 rounded-xl text-lg shadow"
              onClick={() => {
                if (nextLesson) {
                  router.push(
                    `/apprender/learn?lessonId=${
                      nextLesson.id
                    }&back=${encodeURIComponent("/learn")}`
                  );
                }
              }}
              disabled={isLastLesson}
            >
              {t_learn("nextLesson")}
            </button>
          </div>
        </div>
      ) : (
        <div className="w-full max-w-4xl mx-auto grid grid-cols-12 gap-8">
          {/* Cột 1 */}
          <div className="col-span-5 flex items-center justify-center">
            <VideoSquare videoUrl={currentSign?.videoSrc || ""} />
          </div>
          {/* Cột 2 */}
          <div className="col-span-5 flex flex-col items-center justify-center gap-4">
            <MeaningCard meaning={currentSign?.text || ""} />
          </div>
          {/* Cột 3 */}
          <div className="col-span-2 flex items-center justify-center flex-col">
            <ActionButtons
              onContinue={handleContinue}
              onAlreadyKnow={handleAlreadyKnow}
            />
          </div>
        </div>
      )}
    </div>
  );
}
