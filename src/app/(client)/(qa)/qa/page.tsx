"use client";
import DetailQuestionView from "@/components/layouts/qa/detail-question-view";
import NewAnswer from "@/components/layouts/qa/new-answer";
import NewQuestion from "@/components/layouts/qa/new-question";
import NewQuestionPopup from "@/components/layouts/qa/new-question-pop-up";
import QuestionTypeToggle from "@/components/layouts/qa/question-type-toggle";
import QuestionsView from "@/components/layouts/qa/questions-view";
import { RootState } from "@/redux/store";
import {
  AnswerResponseDTO,
  NewAnswerAmount,
  QuestionResponseDTO,
} from "@/types/IQa";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useTranslations } from "next-intl";

export default function QAPage() {
  const t_qaPage = useTranslations("qaPage");
  const [isSpecifiedPage, setIsSpecifiedPage] = useState(false);
  const [isNewQuestion, setIsNewQuestion] = useState(false);
  const [isResponseQuestion, setIsResponseQuestion] = useState(false);
  const [detailQuestion, setDetailQuestion] = useState<QuestionResponseDTO>();
  const { userInfo } = useSelector((state: RootState) => state.auth);
  const [answersOfQuestion, setAnswerOfQuestion] = useState<
    AnswerResponseDTO[] | undefined | null
  >([]);
  const [newAnswerAmount, setNewAnswerAmount] = useState<NewAnswerAmount[]>([]);
  const [isUpdateQuestion, setIsUpdateQuestion] = useState<boolean>(false);
  const [question, setQuestion] = useState<QuestionResponseDTO | undefined>();
  const [showCurrentUserQuestions, setShowCurrentUserQuestions] =
    useState<boolean>(false);
  const [isUpdateAnswer, setIsUpdateAnswer] = useState<boolean>(false);
  const [answer, setAnswer] = useState<AnswerResponseDTO | undefined>();
  const [allQuestion, setAllQuestion] = useState<
    QuestionResponseDTO[] | null | undefined
  >();
  const [savedScrollPosition, setSavedScrollPosition] = useState<{
    x: number;
    y: number;
  }>({ x: 0, y: 0 });
  const [questionPagination, setPagination] = useState<number>(1);
  const [isLoadFull, setIsLoadFull] = useState<boolean>(false);
  const [hasInitialLoad, setHasInitialLoad] = useState<boolean>(false);
  const [lastIsCurrentUser, setLastIsCurrentUser] = useState<
    boolean | undefined
  >(false);

  // Function to update question's answer count in both allQuestion and detailQuestion
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
    <>
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">{t_qaPage("communityQ&A")}</h1>
        <p className="text-gray-600 mb-6">
          {t_qaPage("askQuestionsGetAnswersShareKnowledge")}
        </p>
        {!isSpecifiedPage ? (
          <QuestionTypeToggle
            isCurrentUser={showCurrentUserQuestions}
            onToggle={(isCurrentUser) =>
              setShowCurrentUserQuestions(isCurrentUser)
            }
          />
        ) : (
          <></>
        )}
      </div>

      {isNewQuestion && (
        <NewQuestionPopup
          userInfo={userInfo}
          setIsNewQuestion={setIsNewQuestion}
          isUpdateQuestion={isUpdateQuestion}
          question={question}
          setIsUpdateQuestion={setIsUpdateQuestion}
          setQuestion={setQuestion}
          setAllQuestion={setAllQuestion}
          setDetailQuestion={setDetailQuestion}
        />
      )}

      {(isResponseQuestion || isUpdateAnswer) && (
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
        />
      )}

      {!isSpecifiedPage ? (
        <>
          <NewQuestion
            setIsNewQuestion={setIsNewQuestion}
            userInfo={userInfo}
          />
          <QuestionsView
            setIsResponseQuestion={setIsResponseQuestion}
            userInfo={userInfo}
            setIsSpecifiedPage={setIsSpecifiedPage}
            setDetailQuestion={setDetailQuestion}
            isCurrentUser={showCurrentUserQuestions}
            setIsNewQuestion={setIsNewQuestion}
            setIsUpdateQuestion={setIsUpdateQuestion}
            setQuestion={setQuestion}
            setAllQuestion={setAllQuestion}
            allQuestion={allQuestion}
            setSavedScrollPosition={setSavedScrollPosition}
            questionPagination={questionPagination}
            setPagination={setPagination}
            isLoadFull={isLoadFull}
            setIsLoadFull={setIsLoadFull}
            hasInitialLoad={hasInitialLoad}
            setHasInitialLoad={setHasInitialLoad}
            lastIsCurrentUser={lastIsCurrentUser}
            setLastIsCurrentUser={setLastIsCurrentUser}
          />
        </>
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
          updateQuestionAnswerCount={updateQuestionAnswerCount}
          setAllQuestion={setAllQuestion}
          allQuestion={allQuestion}
          setIsNewQuestion={setIsNewQuestion}
          setIsUpdateQuestion={setIsUpdateQuestion}
          setQuestion={setQuestion}
        />
      )}
    </>
  );
}
