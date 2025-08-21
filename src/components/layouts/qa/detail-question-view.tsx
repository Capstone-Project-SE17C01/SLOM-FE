import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Image from "next/image";
import AnswerDetailQuestionView from "./answer-detail-question-view";
import { AnswerRequestDTO, DetailQuestionViewProps } from "@/types/IQa";
import { useDeleteQuestionMutation, useGetAnswerMutation } from "../../../api/QaApi";
import { useEffect, useState } from "react";
import { ArrowLeft, MessageCircle, CircleEllipsis, OctagonX, SquarePen } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { cn } from "@/utils/cn";
import { useTranslations } from "next-intl";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

export default function DetailQuestionView({
  setIsResponseQuestion,
  setIsSpecifiedPage,
  question,
  answersOfQuestion,
  setAnswerOfQuestion,
  userInfo,
  setIsUpdateAnswer,
  setAnswer,
  setHasInitialLoad,
  updateQuestionAnswerCount,
  setAllQuestion,
  allQuestion,
  isAdmin,
  setIsNewQuestion,
  setIsUpdateQuestion,
  setQuestion,
}: Readonly<DetailQuestionViewProps>) {
  const [getAnswerApi] = useGetAnswerMutation();
  const [pagination, setPagination] = useState<number>(1);
  const { isDarkMode } = useTheme();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isLoadFull, setIsLoadFull] = useState<boolean>(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [deleteQuestionAPI] = useDeleteQuestionMutation();
  const t_qaPage = useTranslations("qaPage");

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (isLoadFull || !question?.questionId) return;

    setIsLoading(true);
    const getAnswerRequest: AnswerRequestDTO = {
      questionId: question.questionId,
      page: pagination,
    };

    getAnswerApi(getAnswerRequest)
      .then((res) => {
        if (pagination == 1) {
          setAnswerOfQuestion([]);
        }
        const newAnswers = res.data?.result;
        if (newAnswers && newAnswers.length > 0) {
          setAnswerOfQuestion(newAnswers);
          if (newAnswers[0].isFull) {
            setIsLoadFull(true);
          }
          setPagination(2);
        }
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Failed to fetch answers:", error);
        setIsLoading(false);
      });
  }, [question?.questionId, getAnswerApi, setAnswerOfQuestion, isLoadFull]);

  useEffect(() => {
    const handleScroll = () => {
      const isAtBottom =
        window.innerHeight + document.documentElement.scrollTop >=
        document.documentElement.offsetHeight - 100;

      if (isAtBottom && !isLoading && !isLoadFull) {
        setIsLoading(true);
        if (isLoadFull || !question?.questionId) return;

        const getAnswerRequest: AnswerRequestDTO = {
          questionId: question.questionId,
          page: pagination,
        };

        getAnswerApi(getAnswerRequest)
          .then((res) => {
            const newAnswers = res.data?.result?.filter(
              (answer) =>
                !answersOfQuestion?.some(
                  (element) => element.answerId == answer.answerId
                )
            );
            if (newAnswers && newAnswers.length > 0) {
              const updatedAnswers = [
                ...(answersOfQuestion || []),
                ...newAnswers,
              ];
              setAnswerOfQuestion(updatedAnswers);
              if (newAnswers[0].isFull) {
                setIsLoadFull(true);
              } else {
                setPagination((prevPage) => prevPage + 1);
              }
            }
            setIsLoading(false);
          })
          .catch((error) => {
            console.error("Failed to fetch answers:", error);
            setIsLoading(false);
          });
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, [
    answersOfQuestion,
    isLoadFull,
    isLoading,
    question?.questionId,
    pagination,
    getAnswerApi,
    setAnswerOfQuestion,
  ]);

  const totalAnswers = question?.answerAmount ?? 0;

  const handleBackToQuestions = () => {
    setIsSpecifiedPage(false);
    setHasInitialLoad(true);
  };

  const handleDeleteQuestion = async (
    questionId: string,
    e: React.MouseEvent
  ) => {
    e.stopPropagation(); setDeleteId(questionId);
    setShowModal(true);
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteQuestionAPI(deleteId).unwrap();
      // Update UI after successful deletion
      const updatedQuestions =
        allQuestion?.filter((q) => q.questionId !== deleteId) || [];
      setAllQuestion(updatedQuestions);
      setShowModal(false);
      setDeleteId(null);
    } catch (error) {
      console.error("Failed to delete question:", error);
    }
  };

  return (
    <div className="pb-8">
      <div
        className={cn(
          "sticky top-0 z-10 border-b px-4 py-3 flex items-center justify-between shadow-sm",
          isDarkMode
            ? "bg-gray-800 border-gray-700"
            : "bg-white border-gray-200"
        )}
      >
        <button
          className={cn(
            "flex items-center transition-colors",
            isDarkMode
              ? "text-gray-400 hover:text-gray-200"
              : "text-gray-600 hover:text-gray-900"
          )}
          onClick={handleBackToQuestions}
        >
          <ArrowLeft className="h-5 w-5 mr-1" />
          <span className="font-medium">{t_qaPage("backTo")}</span>
        </button>
        <h2 className="text-lg font-semibold">{t_qaPage("questionDetails")}</h2>
      </div>

      <div
        className={cn(
          "py-6 px-6 border-b",
          isDarkMode ? "border-gray-700" : "border-gray-200"
        )}
      >
        {question && (
          <div className="flex w-full">
            <div className="mr-4 flex-shrink-0">
              <Avatar className="h-12 w-12">
                <AvatarImage
                  src={question.author.profileImage}
                  alt={`${question.author.username}`}
                />
                <AvatarFallback>{question.author.username}</AvatarFallback>
              </Avatar>
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <div className="font-bold text-lg">
                  {question.author.username}
                </div>
                <div className="flex items-center gap-2">
                  <div
                    className={cn(
                      "text-sm",
                      isDarkMode ? "text-gray-400" : "text-gray-500"
                    )}
                  >
                    {new Date(question.createdAt).toLocaleDateString()}
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button
                        className={cn(
                          "flex items-center justify-center rounded-full overflow-hidden",
                          "h-8 w-8 focus:outline-none focus:ring-2 focus:ring-primary",
                          isDarkMode
                            ? "text-gray-400 hover:bg-gray-700 hover:text-gray-200"
                            : "text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                        )}
                      >
                        <CircleEllipsis className="h-5 w-5" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      align="end"
                      className={cn(
                        "w-48",
                        isDarkMode ? "bg-gray-800 border-gray-700" : ""
                      )}
                    >
                      {!isAdmin && (
                        <button
                          className="w-full"
                          onClick={(e) => {
                            e.stopPropagation();
                            if (
                              setIsNewQuestion &&
                              setIsUpdateQuestion &&
                              setQuestion
                            ) {
                              setIsNewQuestion(true);
                              setIsUpdateQuestion(true);
                              setQuestion(question);
                            }
                          }}
                        >
                          <DropdownMenuItem
                            className={cn(
                              "cursor-pointer",
                              isDarkMode
                                ? "text-gray-200 hover:bg-gray-700"
                                : ""
                            )}
                          >
                            <SquarePen className="mr-2 h-4 w-4" />
                            <span>Edit Question</span>
                          </DropdownMenuItem>
                        </button>
                      )}
                      <button
                        className="w-full"
                        onClick={(e) =>
                          handleDeleteQuestion(question.questionId, e)
                        }
                      >
                        <DropdownMenuItem className="cursor-pointer text-red-600 hover:text-red-700 focus:text-red-700">
                          <OctagonX className="mr-2 h-4 w-4" />
                          <span>Delete Question</span>
                        </DropdownMenuItem>
                      </button>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
              <div className="text-base mb-6">{question.content}</div>

              {question.tags && question.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-6">
                  {question.tags.map((tag, tagIndex) => (
                    <span
                      key={tagIndex}
                      className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              {question.images.length > 0 && (
                <div className="relative w-full overflow-x-auto mb-6">
                  <div className="flex space-x-4">
                    {question.images.map((image, index) => (
                      <div key={index} className="min-w-[200px] max-w-[320px]">
                        <div
                          className={cn(
                            "relative aspect-video overflow-hidden rounded-lg border",
                            isDarkMode ? "border-gray-700" : "border-gray-200"
                          )}
                        >
                          <Image
                            src={image}
                            alt={`image-${index}`}
                            fill
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                            className="object-cover"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <button
                onClick={() => setIsResponseQuestion(true)}
                className={cn(
                  "inline-flex items-center gap-2 px-4 py-2 rounded-full transition-colors",
                  isDarkMode
                    ? "bg-gray-700 hover:bg-gray-600 text-gray-200"
                    : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                )}
              >
                <MessageCircle className="h-5 w-5" />
                <span>
                  {t_qaPage("reply")} ({totalAnswers})
                </span>
              </button>
            </div>
          </div>
        )}
      </div>

      {totalAnswers > 0 && (
        <div
          className={cn(
            "border-b px-6 py-4",
            isDarkMode
              ? "bg-gray-700 border-gray-700"
              : "bg-gray-50 border-gray-200"
          )}
        >
          <h3
            className={cn(
              "font-medium",
              isDarkMode ? "text-gray-200" : "text-gray-700"
            )}
          >
            {totalAnswers} {totalAnswers === 1 ? t_qaPage("answer") : t_qaPage("answers")}
          </h3>
        </div>
      )}

      <div
        className={cn(
          "divide-y",
          isDarkMode ? "divide-gray-700" : "divide-gray-200"
        )}
      >
        {question?.questionId && (
          <AnswerDetailQuestionView
            specificThread={answersOfQuestion}
            userInfo={userInfo}
            questionOwner={question.author.username}
            setIsResponseQuestion={setIsResponseQuestion}
            setIsUpdateAnswer={setIsUpdateAnswer}
            setAnswer={setAnswer}
            onAnswerDeleted={() => {
              if (updateQuestionAnswerCount && question?.questionId) {
                updateQuestionAnswerCount(question.questionId, -1);
              }
            }}
            setAnswerOfQuestion={setAnswerOfQuestion}
            isAdmin={isAdmin || false}
          />
        )}
      </div>

      {isLoading && (
        <div className="text-center py-6">
          <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-solid border-primary border-r-transparent motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
          <p
            className={cn(
              "mt-2 text-sm",
              isDarkMode ? "text-gray-400" : "text-gray-500"
            )}
          >
            {t_qaPage("loadingAnswers")}
          </p>
        </div>
      )}

      {isLoadFull && totalAnswers > 0 && (
        <div
          className={cn(
            "text-center py-8 border-t",
            isDarkMode
              ? "text-gray-400 border-gray-700"
              : "text-gray-500 border-gray-200"
          )}
        >
          {t_qaPage("noMoreAnswers")}
        </div>
      )}

      {isLoadFull && totalAnswers === 0 && (
        <div className="text-center py-16">
          <p
            className={cn(
              "mb-2",
              isDarkMode ? "text-gray-400" : "text-gray-500"
            )}
          >
            {t_qaPage("noAnswersYet")}
          </p>
          <button
            onClick={() => setIsResponseQuestion(true)}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full transition-colors"
          >
            {t_qaPage("beTheFirstToAnswer")}
          </button>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 w-full max-w-sm">
            <h2 className="text-lg font-semibold mb-4">Delete Confirmation</h2>
            <p>{t_qaPage("areYouSureYouWantToDeleteThisQuestion")}</p>
            <div className="flex justify-end gap-2 mt-6">
              <Button
                variant="outline"
                onClick={() => {
                  setShowModal(false);
                  setDeleteId(null);
                }}
              >
                {t_qaPage("cancel")}
              </Button>
              <Button
                className="bg-red-600 hover:bg-red-700 text-white"
                onClick={handleDelete}
              >
                {t_qaPage("deleteQuestion")}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
