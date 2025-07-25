import React, { useState, useMemo } from "react";
import LessonHeader from "@/components/ui/lessonHeader";
import ProgressBar from "@/components/ui/progressBar";
import VideoSquare from "@/components/ui/videoSquare";
import MeaningCard from "@/components/ui/meaningCard";
import ActionButtons from "@/components/ui/actionButtons";
import { Word } from "../../../types/ICourse";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useMarkLessonAsLearnedMutation } from "../../../api/CourseApi";
import { RootState } from "@/redux/store";
import { useSelector } from "react-redux";
import Spinner from "@/components/ui/spinner";
export default function WordPractice({
  wordList,
  lessonTitle,
  back,
  lessonId,
  t_learn,
}: {
  wordList: Word[];
  lessonTitle: string;
  back: string;
  lessonId: string;
  t_learn: ReturnType<typeof useTranslations>;
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [passedSignIds, setPassedSignIds] = useState<string[]>([]);
  const [skippedMeanings, setSkippedMeanings] = useState<string[]>([]);
  const [markLessonAsLearned, { isLoading: isLoadingMarkLessonAsLearned }] =
    useMarkLessonAsLearnedMutation();
  const router = useRouter();
  const userInfo = useSelector((state: RootState) => state.auth.userInfo);

  const filteredSignList = useMemo(
    () => wordList.filter((sign) => !skippedMeanings.includes(sign.text)),
    [wordList, skippedMeanings]
  );
  const filteredLength = filteredSignList.length;
  const isComplete = currentIndex >= filteredLength;
  const currentSign = filteredSignList[currentIndex] ?? null;
  const totalSigns = wordList.length;
  const progress = (passedSignIds.length / totalSigns) * 100;

  const handleContinue = () => {
    setPassedSignIds((prev) => [...prev, currentSign?.id || ""]);
    setCurrentIndex((idx) => idx + 1);
  };
  const handleAlreadyKnow = () => {
    setSkippedMeanings((prev) => [...prev, currentSign?.text || ""]);
    setCurrentIndex(0);
  };

  const handleFinish = async () => {
    if (userInfo?.id) {
      await markLessonAsLearned({
        userId: userInfo.id,
        lessonId: lessonId,
      })
        .unwrap()
        .then((res) => {
          console.error(res.result);
        })
        .catch((error) => {
          console.error(error.data?.errorMessages[0]);
        });
    }
    router.push(back);
  };

  if (isLoadingMarkLessonAsLearned) {
    return <Spinner />;
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <LessonHeader title={lessonTitle} onClose={() => router.push(back)} />
      <ProgressBar progress={isComplete ? 100 : progress} />
      {isComplete ? (
        <div className="text-center mt-20 text-2xl font-bold flex flex-col items-center gap-6">
          {t_learn("finishedLesson")}
          <button
            className="bg-gray-200 dark:bg-gray-700 text-[#0a2233] dark:text-gray-100 font-bold px-8 py-3 rounded-xl text-lg shadow mt-6"
            onClick={handleFinish}
          >
            {t_learn("finishLesson")}
          </button>
        </div>
      ) : (
        <div className="w-full max-w-4xl mx-auto flex flex-col gap-8">
          <div className="grid grid-cols-2 gap-8">
            <div className="flex items-center justify-center">
              <VideoSquare videoUrl={currentSign?.videoSrc || ""} />
            </div>
            <div className="flex flex-col items-center justify-center gap-4 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
              <MeaningCard meaning={currentSign?.text || ""} />
            </div>
          </div>
          <div className="flex justify-center">
            <div className="flex gap-4">
              <ActionButtons
                onContinue={handleContinue}
                onAlreadyKnow={handleAlreadyKnow}
                t_learn={t_learn}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
