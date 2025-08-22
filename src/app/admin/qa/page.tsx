"use client";
import DetailQuestionView from "@/components/layouts/qa/detail-question-view";
import NewAnswer from "@/components/layouts/qa/new-answer";
import QuestionTypeToggle from "@/components/layouts/qa/question-type-toggle";
import QuestionsView from "@/components/layouts/qa/questions-view";
import { RootState } from "@/redux/store";
import {
  AnswerResponseDTO,
  NewAnswerAmount,
  QuestionResponseDTO,
} from "@/types/IQa";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useTheme } from "@/contexts/ThemeContext";
import { cn } from "@/utils/cn";
import { useTranslations } from "next-intl";

export default function QAPage() {
  const t_qaPage = useTranslations("qaPage");
  const [isSpecifiedPage, setIsSpecifiedPage] = useState(false);
  const [isResponseQuestion, setIsResponseQuestion] = useState(false);
  const [detailQuestion, setDetailQuestion] = useState<QuestionResponseDTO>();
  const { userInfo } = useSelector((state: RootState) => state.auth);
  const [answersOfQuestion, setAnswerOfQuestion] = useState<
    AnswerResponseDTO[] | undefined | null
  >([]);
  const [newAnswerAmount, setNewAnswerAmount] = useState<NewAnswerAmount[]>([]);
  const [showCurrentUserQuestions, setShowCurrentUserQuestions] =
    useState<boolean>(false);
  const [isUpdateAnswer, setIsUpdateAnswer] = useState<boolean>(false);
  const [answer, setAnswer] = useState<AnswerResponseDTO>();
  const { isDarkMode } = useTheme();
  const [allQuestion, setAllQuestion] = useState<
    QuestionResponseDTO[] | null | undefined
  >();
  const [questionPagination, setPagination] = useState<number>(1);
  const [isLoadFull, setIsLoadFull] = useState<boolean>(false);
  const [hasInitialLoad, setHasInitialLoad] = useState<boolean>(false);
  const [savedScrollPosition, setSavedScrollPosition] = useState<{
    x: number;
    y: number;
  }>({ x: 0, y: 0 });
  const [lastIsCurrentUser, setLastIsCurrentUser] = useState<
    boolean | undefined
  >(false);
  const updateQuestionAnswerCount = (
    questionId: string,
    increment: number = 1
  ) => {
    setAllQuestion(
      (prev) =>
        prev?.map((question) =>
          question.questionId === questionId
            ? {
                ...question,
                answerAmount: (question.answerAmount || 0) + increment,
              }
            : question
        ) || []
    );

    // Also update detailQuestion if it's the same question
    setDetailQuestion((prev) =>
      prev?.questionId === questionId
        ? { ...prev, answerAmount: (prev.answerAmount || 0) + increment }
        : prev
    );
  };

  useEffect(() => {
    if (
      !isSpecifiedPage &&
      (savedScrollPosition.x !== 0 || savedScrollPosition.y !== 0)
    ) {
      window.scrollTo(savedScrollPosition.x, savedScrollPosition.y);
    }
  }, [isSpecifiedPage, savedScrollPosition]);

  return (
    <div className="relative max-w-6xl mx-auto px-6 py-8">
      {!isSpecifiedPage && (
        <div className="mb-10 flex justify-center">
          <QuestionTypeToggle
            isCurrentUser={showCurrentUserQuestions}
            onToggle={(isCurrentUser) =>
              setShowCurrentUserQuestions(isCurrentUser)
            }
            isAdmin={true}
            className="shadow-lg"
          />
        </div>
      )}

      {isResponseQuestion && (
        <div className="mb-8">
          <NewAnswer
            userInfo={userInfo}
            setIsResponseQuestion={setIsResponseQuestion}
            question={detailQuestion}
            setAnswerOfQuestion={setAnswerOfQuestion}
            setNewAnswerAmount={setNewAnswerAmount}
            newAnswerAmount={newAnswerAmount}
            isUpdateAnswer={isUpdateAnswer}
            answer={answer}
            setIsUpdateAnswer={setIsUpdateAnswer}
            setAnswer={setAnswer}
            updateQuestionAnswerCount={updateQuestionAnswerCount}
            setAllQuestion={setAllQuestion}
            allQuestion={allQuestion}
            isAdmin={true}
          />
        </div>
      )}

      <div
        className={cn(
          "rounded-xl shadow-lg overflow-hidden border border-gray-100",
          isDarkMode
            ? "bg-gray-800 border-gray-700"
            : "bg-white border-gray-200"
        )}
      >
        {!isSpecifiedPage ? (
          <div>
            <div
              className={cn(
                "px-4 py-5 border-b border-gray-100",
                isDarkMode
                  ? "bg-gray-800 border-gray-700"
                  : "bg-gray-50 border-gray-200"
              )}
            >
              <h2
                className={cn(
                  "text-xl font-semibold",
                  isDarkMode ? "text-white" : "text-gray-800"
                )}
              >
                {showCurrentUserQuestions
                  ? t_qaPage("unansweredQuestions")
                  : t_qaPage("allQuestions")}
              </h2>
            </div>
            <QuestionsView
              setIsResponseQuestion={setIsResponseQuestion}
              userInfo={userInfo}
              setIsSpecifiedPage={setIsSpecifiedPage}
              setDetailQuestion={setDetailQuestion}
              isCurrentUser={showCurrentUserQuestions}
              setAllQuestion={setAllQuestion}
              allQuestion={allQuestion}
              questionPagination={questionPagination}
              setPagination={setPagination}
              isLoadFull={isLoadFull}
              setIsLoadFull={setIsLoadFull}
              hasInitialLoad={hasInitialLoad}
              setHasInitialLoad={setHasInitialLoad}
              setSavedScrollPosition={setSavedScrollPosition}
              isAdmin={true}
              lastIsCurrentUser={lastIsCurrentUser}
              setLastIsCurrentUser={setLastIsCurrentUser}
            />
          </div>
        ) : (
          <DetailQuestionView
            question={detailQuestion}
            setIsResponseQuestion={setIsResponseQuestion}
            setIsSpecifiedPage={setIsSpecifiedPage}
            answersOfQuestion={answersOfQuestion}
            setAnswerOfQuestion={setAnswerOfQuestion}
            userInfo={userInfo}
            setIsUpdateAnswer={setIsUpdateAnswer}
            setAnswer={setAnswer}
            setHasInitialLoad={setHasInitialLoad}
            setAllQuestion={setAllQuestion}
            allQuestion={allQuestion}
            isAdmin={true}
          />
        )}
      </div>
    </div>
  );
}
