import React, { useState } from "react";
import LessonHeader from "@/components/ui/lessonHeader";
import ProgressBar from "@/components/ui/progressBar";
import VideoSquare from "@/components/ui/videoSquare";
import QuizAction from "@/components/ui/quizAction";
import QuizOptions from "@/components/ui/quizOptions";
import QuizAI from "@/components/ui/quizAI";
import { Quiz } from "../../../types/ICourse";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useMarkLessonAsCompletedMutation } from "../../../api/CourseApi";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import Spinner from "@/components/ui/spinner";
export default function QuizPractice({
  quizList,
  lessonTitle,
  back,
  lessonId,
  t_learn,
}: {
  quizList: Quiz[];
  lessonTitle: string;
  back: string;
  lessonId: string;
  t_learn: ReturnType<typeof useTranslations>;
}) {
  const expandedQuizList = React.useMemo(
    () =>
      quizList.flatMap((quiz) => [
        { ...quiz, quizType: "MultiChoice" as const },
        { ...quiz, quizType: "DetectByAI" as const },
      ]),
    [quizList]
  );

  const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const router = useRouter();
  const userInfo = useSelector((state: RootState) => state.auth.userInfo);
  const [markLessonAsCompleted, { isLoading: isLoadingMarkLessonAsCompleted }] =
    useMarkLessonAsCompletedMutation();
  const [canContinue, setCanContinue] = useState(false);

  const currentQuiz = expandedQuizList[currentQuizIndex] ?? null;
  const isQuizComplete = currentQuizIndex >= expandedQuizList.length;
  const progress = (currentQuizIndex / expandedQuizList.length) * 100;

  const handleOptionClick = (optionId: string, isCorrect: boolean) => {
    setSelectedOption(optionId);
    if (isCorrect) {
      setIsCorrect(true);
      setCanContinue(true);
      if (canContinue) {
        setTimeout(() => {
          handleContinue();
        }, 10000);
      }
    } else {
      setIsCorrect(false);
      setCanContinue(false);
    }
  };

  const handleInputCheck = (correct: boolean) => {
    if (correct) {
      setIsCorrect(correct);
      setCanContinue(true);
      if (canContinue) {
        setCurrentQuizIndex((idx) => idx + 1);
        setIsCorrect(false);
        setShowExplanation(false);
      }
    } else {
      setIsCorrect(false);
    }
  };

  const handleDontKnow = () => {
    setShowExplanation(true);
    setIsCorrect(false);
  };

  const handleContinue = () => {
    setCurrentQuizIndex((idx) => idx + 1);
    setSelectedOption(null);
    setIsCorrect(false);
    setCanContinue(false);
    setShowExplanation(false);
  };

  const handleFinish = async () => {
    if (userInfo?.id) {
      await markLessonAsCompleted({
        userId: userInfo.id,
        lessonId: lessonId,
      })
        .unwrap()
        .catch((error) => {
          console.error(error.data?.errorMessages[0]);
        });
    }
    router.push(back);
  };

  React.useEffect(() => {
    if (showExplanation) {
      const timer = setTimeout(() => {
        setSelectedOption(null);
        setIsCorrect(false);
        setShowExplanation(false);
      }, 1200);
      return () => clearTimeout(timer);
    }
  }, [showExplanation]);

  if (isLoadingMarkLessonAsCompleted) {
    return <Spinner />;
  }

  return (
    <div className="min-h-screen bg-white">
      <LessonHeader title={lessonTitle} onClose={() => router.push(back)} />
      <ProgressBar
        className="mt-2 max-w-5xl"
        progress={isQuizComplete ? 100 : progress}
      />

      {isQuizComplete ? (
        <div className="text-center mt-20 text-2xl font-bold flex flex-col items-center gap-6">
          {t_learn("finishedQuiz")}
          <button
            className="bg-gray-200 text-[#0a2233] font-bold px-8 py-3 rounded-xl text-lg shadow mt-6"
            onClick={handleFinish}
          >
            {t_learn("finishQuiz")}
          </button>
        </div>
      ) : (
        <>
          <div className="w-full max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-8 px-2">
            <div className="w-full md:col-span-6 flex items-center justify-center mb-4 md:mb-0">
              {currentQuiz?.question &&
              currentQuiz.question.startsWith("http") ? (
                <VideoSquare videoUrl={currentQuiz.question} />
              ) : (
                <div className="font-bold text-lg mb-2 text-center">
                  {currentQuiz?.question}
                </div>
              )}
            </div>
            <div className="w-full md:col-span-6 flex flex-col items-center h-full justify-center gap-4 mb-4 md:mb-0">
              {currentQuiz?.quizType === "MultiChoice" ? (
                <QuizOptions
                  options={currentQuiz.quizOptions || []}
                  selectedOption={selectedOption}
                  isCorrect={isCorrect}
                  onSelect={handleOptionClick}
                  disabled={!!isCorrect}
                />
              ) : (
                <QuizAI
                  userId={userInfo?.id}
                  onResult={(correct, aiAnswer) => {
                    if (aiAnswer) {
                      handleInputCheck(correct);
                    }
                  }}
                  disabled={!!isCorrect}
                  signAnswer={currentQuiz?.correctAnswer}
                />
              )}
            </div>
          </div>
          <div className="flex justify-center mt-4">
            <div className="flex gap-4">
              <QuizAction
                onContinue={handleContinue}
                onDontKnow={handleDontKnow}
                canContinue={canContinue}
                disabled={!!isCorrect || showExplanation}
                showExplanation={showExplanation}
                explanation={currentQuiz?.explanation || ""}
                t_learn={t_learn}
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
}
