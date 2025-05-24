"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Spinner from "@/components/ui/spinner";
import { useTranslations } from "next-intl";
import { Quiz, Word } from "@/features/course/types";
import {
  useGetListWordByLessonIdMutation,
  useGetListQuizByLessonIdMutation,
  useAddNewUserProgressMutation,
} from "@/features/course/api";
import WordPractice from "./WordPractice";
import { RootState } from "@/redux/store";
import QuizPractice from "./QuizPractice";
import { useSelector } from "react-redux";
export default function ApprenderLearnPractice() {
  const searchParams = useSearchParams();
  const back = searchParams.get("back") || "/learn";
  const lessonId = decodeURIComponent(searchParams.get("lessonId") || "");
  const lessonTitle = decodeURIComponent(searchParams.get("lessonTitle") || "");
  const isReview =
    decodeURIComponent(searchParams.get("review") || "false") === "true";
  const t_learn = useTranslations("learnPage");
  const [listWords, setListWords] = useState<Word[]>([]);
  const [listQuizzes, setListQuizzes] = useState<Quiz[]>([]);

  const [getListWordByLessonId, { isLoading: isLoadingWord }] =
    useGetListWordByLessonIdMutation();
  const [getListQuizByLessonId, { isLoading: isLoadingQuiz }] =
    useGetListQuizByLessonIdMutation();
  const [addNewUserProgress, { isLoading: isLoadingAddNewUserProgress }] =
    useAddNewUserProgressMutation();
  const [IsErrorAddNewUserProgress, setIsErrorAddNewUserProgress] =
    useState(false);

  const userInfo = useSelector((state: RootState) => state.auth.userInfo);
  useEffect(() => {
    const fetchAddNewUserProgress = async () => {
      if (userInfo) {
        await addNewUserProgress({
          userId: userInfo.id || "",
          lessonId: lessonId,
        })
          .then((res) => {
            console.log(res.data?.result);
          })
          .catch((error) => {
            setIsErrorAddNewUserProgress(true);
            console.log(error.data?.errorMessages[0]);
          });
      }
    };
    fetchAddNewUserProgress();
  }, [userInfo, lessonId, addNewUserProgress]);

  useEffect(() => {
    if (lessonId && !IsErrorAddNewUserProgress) {
      if (isReview) {
        const fetchQuiz = async () => {
          await getListQuizByLessonId(lessonId)
            .unwrap()
            .then((res) => setListQuizzes(res.result || []))
            .catch((error) => {
              const errorMessage = Array.isArray(error.data?.errorMessages)
                ? error.data.errorMessages[0]
                : "Failed to fetch quiz";
              console.log(errorMessage);
            });
        };
        fetchQuiz();
      } else {
        const fetchWord = async () => {
          await getListWordByLessonId(lessonId)
            .unwrap()
            .then((res) => {
              setListWords(res.result || []);
            })
            .catch((error) => {
              const errorMessage = Array.isArray(error.data?.errorMessages)
                ? error.data.errorMessages[0]
                : "Failed to fetch word";
              console.log(errorMessage);
            });
        };
        fetchWord();
      }
    }
  }, [
    lessonId,
    isReview,
    getListWordByLessonId,
    getListQuizByLessonId,
    IsErrorAddNewUserProgress,
  ]);

  if (isLoadingWord || isLoadingQuiz || isLoadingAddNewUserProgress)
    return <Spinner />;

  if (isReview) {
    return (
      <QuizPractice
        quizList={listQuizzes}
        lessonTitle={lessonTitle}
        back={back}
        lessonId={lessonId}
        t_learn={t_learn}
      />
    );
  }
  return (
    <WordPractice
      wordList={listWords}
      lessonTitle={lessonTitle}
      back={back}
      lessonId={lessonId}
      t_learn={t_learn}
    />
  );
}
