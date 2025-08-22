import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { AnswerDetailQuestionViewProps, AnswerResponseDTO } from "@/types/IQa";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog";
import { CircleEllipsis, SquarePen, OctagonX } from "lucide-react";
import { useDeleteAnswerMutation } from "@/api/QaApi";
import { cn } from "@/utils/cn";
import Image from "next/image";
import { useState } from "react";
import { useTheme } from "@/contexts/ThemeContext";
import React from "react";
import { useTranslations } from "next-intl";

export default function AnswerDetailQuestionView({ specificThread, userInfo, questionOwner, setIsResponseQuestion, setIsUpdateAnswer, setAnswer, onAnswerDeleted, setAnswerOfQuestion, isAdmin }: Readonly<AnswerDetailQuestionViewProps>) {
    const [fullScreenImageIndex, setFullScreenImageIndex] = useState<number>(0);
    const [theElement, setTheElement] = useState<AnswerResponseDTO | undefined>();
    const [deleteAnswer] = useDeleteAnswerMutation();
    const [answers, setAnswers] = useState(specificThread);
    const [deleteId, setDeleteId] = useState<string | null>(null);
    const [showModal, setShowModal] = useState(false);
    const { isDarkMode } = useTheme();
    const t_qa = useTranslations("qaPage");
    React.useEffect(() => {
      setAnswers(specificThread);
    }, [specificThread]);
    const handleImageClick = (imgIndex: number) => {
        setFullScreenImageIndex(imgIndex);
    };

  const closeFullScreen = () => {
    setFullScreenImageIndex(0);
    setTheElement(undefined);
  };

  const goToPreviousImage = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    if (fullScreenImageIndex > 0) {
      setFullScreenImageIndex(fullScreenImageIndex - 1);
    } else {
      if (theElement != null)
        setFullScreenImageIndex(theElement.images.length - 1);
    }
  };

  const goToNextImage = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    if (theElement != null) {
      if (fullScreenImageIndex < theElement.images.length - 1) {
        setFullScreenImageIndex(fullScreenImageIndex + 1);
      } else {
        setFullScreenImageIndex(0);
      }
    }
  };

  const currentFullScreenImageSrc =
    fullScreenImageIndex !== null && theElement != null
      ? theElement.images[fullScreenImageIndex]
      : null;

  
    const canEditDelete = (answerElement: AnswerResponseDTO) => {
    const isAuthor = answerElement.author.username === userInfo?.username;
    const isQuestionOwner = userInfo?.username === questionOwner;

    return isAuthor || isAdmin || isQuestionOwner;
  };

  const handleEditAnswer = (answer: AnswerResponseDTO) => {
    if (setAnswer && setIsUpdateAnswer && setIsResponseQuestion) {
      setAnswer(answer);
      setIsUpdateAnswer(true);
      setIsResponseQuestion(true);
    }
  };

  const handleDeleteAnswer = async (answerId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setDeleteId(answerId);
    setShowModal(true);
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteAnswer(deleteId).unwrap();
      const updatedAnswers = answers?.filter(
        (answer) => answer.answerId !== deleteId
      );
      setAnswers(updatedAnswers);
      // Update parent component state
      if (setAnswerOfQuestion) {
        setAnswerOfQuestion(updatedAnswers);
      }
      if (onAnswerDeleted) {
        onAnswerDeleted();
      }
      setShowModal(false);
      setDeleteId(null);
    } catch (error) {
      console.error("Failed to delete answer:", error);
    }
  };

  return (
    <div>
      {answers != null &&
        answers != undefined &&
        answers.map((ele, index, array) => {
          return (
            <div
              key={ele.answerId}
              className={cn(
                "py-4 px-4 w-full",
                index === array.length - 1
                  ? ""
                  : isDarkMode
                  ? "border-b border-gray-700"
                  : "border-b border-gray-200"
              )}
            >
              <div className="flex w-full">
                <div className="mr-2">
                  <Avatar>
                    <AvatarImage
                      src={ele.author.profileImage}
                      alt={`${ele.author.username}`}
                    />
                    <AvatarFallback>{ele.author.username}</AvatarFallback>
                  </Avatar>
                </div>
                <div className="w-[93%]">
                  <div className="flex justify-between items-center">
                    <div className="font-bold">{ele.author.username}</div>
                    {canEditDelete(ele) && (
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
                            onClick={(e) => e.stopPropagation()}
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
                          {ele.author.username === userInfo?.username && (
                            <button
                              className="w-full"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEditAnswer(ele);
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
                                <span>{t_qa("editAnswer")}</span>
                              </DropdownMenuItem>
                            </button>
                          )}
                          <button
                            className="w-full"
                            onClick={(e) => handleDeleteAnswer(ele.answerId, e)}
                          >
                            <DropdownMenuItem className="cursor-pointer text-red-600 hover:text-red-700 focus:text-red-700">
                              <OctagonX className="mr-2 h-4 w-4" />
                              <span>{t_qa("deleteAnswer")}</span>
                            </DropdownMenuItem>
                          </button>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}
                  </div>
                  <div
                    className={cn(
                      isDarkMode ? "text-gray-200" : "text-gray-800"
                    )}
                  >
                    {ele.content}
                  </div>
                  <div className="relative w-full overflow-x-auto">
                    <div className="flex">
                      {ele.images.map((image, imgIndex) => (
                        <div
                          key={imgIndex}
                          className="min-w-[50%] px-1 cursor-pointer"
                        >
                          <Image
                            src={image}
                            alt={`image-${imgIndex}`}
                            height={0}
                            width={0}
                            sizes="50vw"
                            className="w-full h-[20vh] object-cover rounded-xl"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleImageClick(imgIndex);
                              setTheElement(ele);
                            }}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              {currentFullScreenImageSrc && (
                <Dialog open={!!currentFullScreenImageSrc} onOpenChange={(open) => !open && closeFullScreen()}>
                  <DialogContent className="sm:max-w-7xl w-[95vw] h-[90vh] p-0 border-0 bg-transparent shadow-none">
                    <div className="relative w-full h-full" onClick={(e) => e.stopPropagation()}>
                      {/* Previous Button */}
                      <button
                        className="absolute left-4 top-1/2 -translate-y-1/2 h-10 w-10 bg-white bg-opacity-25 rounded-full text-white text-center text-2xl z-50 hover:bg-opacity-50 transition-all duration-200 flex items-center justify-center"
                        onClick={goToPreviousImage}
                        aria-label="Previous image"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="size-6"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M15.75 19.5 8.25 12l7.5-7.5"
                          />
                        </svg>
                      </button>

                      <div className="relative w-full h-full">
                        <Image
                          src={currentFullScreenImageSrc}
                          alt="Full screen"
                          fill
                          className="object-contain"
                          sizes="95vw"
                        />
                      </div>

                      {/* Next Button */}
                      <button
                        className="absolute right-4 top-1/2 -translate-y-1/2 h-10 w-10 bg-white bg-opacity-25 rounded-full text-white text-2xl z-50 hover:bg-opacity-50 transition-all duration-200 flex items-center justify-center"
                        onClick={goToNextImage}
                        aria-label="Next image"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="size-6"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="m8.25 4.5 7.5 7.5-7.5 7.5"
                          />
                        </svg>
                      </button>
                    </div>
                  </DialogContent>
                </Dialog>
              )}
            </div>
          );
        })}

      <Dialog open={showModal} onOpenChange={(open) => !open && setShowModal(false)}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>{t_qa("deleteConfirmation")}</DialogTitle>
          </DialogHeader>
          <p>{t_qa("areYouSureYouWantToDeleteThisAnswer")}</p>
          <DialogFooter className="mt-6">
            <Button
              variant="outline"
              onClick={() => {
                setShowModal(false);
                setDeleteId(null);
              }}
            >
              {t_qa("cancel")}
            </Button>
            <Button
              className="bg-red-600 hover:bg-red-700 text-white"
              onClick={handleDelete}
            >
              {t_qa("deleteAnswer")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
