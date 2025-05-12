"use client";

import React, { useState, useMemo, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import LessonHeader from "@/components/ui/lessonHeader";
import ProgressBar from "@/components/ui/progressBar";
import VideoSquare from "@/components/ui/videoSquare";
import MeaningCard from "@/components/ui/meaningCard";
import ActionButtons from "@/components/ui/actionButtons";
import { useTranslations } from "next-intl";
import { Lesson, Quiz } from "@/features/course/types";
import QuizAction from "@/components/ui/quizAction";
import QuizInput from "@/components/ui/quizInput";
import QuizOptions from "@/components/ui/quizOptions";

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

  const fakedata_lessonList: Lesson[] = [
    {
      id: "1",
      moduleId: "1",
      title: "lesson1",
      content: "lesson1Content",
      orderNumber: 1,
      createdAt: "2021-01-01",
      learnWords: [
        {
          id: "1",
          lessonId: "1",
          word: "word1",
          meaning: "meaning1",
          videoUrl: [
            "https://www.youtube.com/watch?v=tkMg8g8vVUo",
            "https://www.youtube.com/watch?v=tkMg8g8vVUo",
          ],
        },
        {
          id: "2",
          lessonId: "1",
          word: "word2",
          meaning: "meaning2",
          videoUrl: [
            "https://www.youtube.com/watch?v=tkMg8g8vVUo",
            "https://www.youtube.com/watch?v=tkMg8g8vVUo",
          ],
        },
      ],
      userLessonProgresses: [],
      userQuizProgresses: [],
    },
  ];
  const fakedata_quizList: Quiz[] = [
    {
      id: "1",
      lessonId: "1",
      question: "question1",
      videoUrl: "https://www.youtube.com/watch?v=tkMg8g8vVUo",
      options: JSON.stringify({
        option1: { answer: "Correct", isCorrect: "true" },
        option2: { answer: "Incorrect 1", isCorrect: "false" },
        option3: { answer: "Incorrect 2", isCorrect: "false" },
        option4: { answer: "Incorrect 3", isCorrect: "false" },
      }),
      correctAnswer: "Correct",
      explanation: "explanation Correct",
      maxScore: 1,
      createdAt: "2021-01-01",
    },
    {
      id: "2",
      lessonId: "1",
      question: "question2",
      videoUrl: "https://www.youtube.com/watch?v=tkMg8g8vVUo",
      correctAnswer: "Correct",
      explanation: "explanation Correct",
      maxScore: 1,
      createdAt: "2021-01-01",
    },
  ];

  const lesson = fakedata_lessonList[0];
  const signlessonList = useMemo(
    () =>
      lesson.learnWords
        ? lesson.learnWords.flatMap((word) =>
            (word.videoUrl ?? []).map((url, idx) => ({
              id: `${word.id}_${idx}`,
              lessonId: word.lessonId,
              word: word.word,
              meaning: word.meaning,
              videoUrl: url,
            }))
          )
        : [],
    [lesson.learnWords]
  );
  const quizList = fakedata_quizList;

  const totalSigns = signlessonList.length;
  const t_learn = useTranslations("learnPage");

  // State
  const [currentIndex, setCurrentIndex] = useState(0);
  const [passedSignIds, setPassedSignIds] = useState<string[]>([]);
  const [skippedMeanings, setSkippedMeanings] = useState<string[]>([]);
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [inputAnswer, setInputAnswer] = useState("");
  const [showExplanation, setShowExplanation] = useState(false);
  const [redEffect, setRedEffect] = useState(false);

  // Filter signList theo skippedMeanings
  const filteredSignList = useMemo(
    () =>
      signlessonList.filter((sign) => !skippedMeanings.includes(sign.meaning)),
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
    setSkippedMeanings((prev) => [...prev, currentSign?.meaning || ""]);
    // Tìm index mới sau khi filter lại
    setCurrentIndex(0);
  };

  const currentIdx = fakedata_lessonList.findIndex((l) => l.id === lessonId);
  const nextLesson =
    currentIdx !== -1 ? fakedata_lessonList[currentIdx + 1] : undefined;
  const isLastLesson = currentIdx === fakedata_lessonList.length - 1;

  const handleOptionClick = (answer: string) => {
    setSelectedOption(answer);
    if (answer === currentQuiz?.correctAnswer) {
      setIsCorrect(true);
      setTimeout(() => {
        setCurrentQuizIndex((idx) => idx + 1);
        setSelectedOption(null);
        setIsCorrect(null);
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
        setIsCorrect(null);
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
        setIsCorrect(null);
        setShowExplanation(false);
        setInputAnswer("");
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [showExplanation]);

  return (
    <div className="min-h-screen bg-white">
      <LessonHeader title={lessonTitle} onClose={() => router.push(back)} />
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
              <VideoSquare videoUrl={currentQuiz?.videoUrl || ""} />
            </div>
            {/* Cột 2 */}
            <div className="col-span-5 flex flex-col items-center justify-center gap-4">
              <div className="font-bold text-lg mb-2">
                {currentQuiz?.question}
              </div>
              {currentQuiz && currentQuiz.options ? (
                <QuizOptions
                  options={JSON.parse(currentQuiz.options || "{}")}
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
                  checkLabel={t_learn("checkAnswer") || "Kiểm tra"}
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
              className="bg-yellow-400 hover:bg-yellow-300 transition text-black font-bold px-8 py-3 rounded-xl text-lg shadow"
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
            <VideoSquare videoUrl={currentSign?.videoUrl || ""} />
          </div>
          {/* Cột 2 */}
          <div className="col-span-5 flex flex-col items-center justify-center gap-4">
            <MeaningCard meaning={currentSign?.meaning || ""} />
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
