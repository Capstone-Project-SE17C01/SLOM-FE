import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import {
  GetQuestionRequest,
  QuestionResponseDTO,
  QuestionViewProps,
} from "@/types/IQa";
import {
  useGetQuestionMutation,
  useDeleteQuestionMutation,
  useGetTagsQuery,
  useGetQuestionByTagMutation,
} from "../../../api/QaApi";
import { useEffect, useState, useCallback } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  CircleEllipsis,
  MessageSquare,
  OctagonX,
  SquarePen,
  X,
  Tag as TagIcon,
  Search,
} from "lucide-react";
import { cn } from "@/utils/cn";
import { format } from "date-fns";
import { useTheme } from "@/contexts/ThemeContext";
import { useTranslations } from "next-intl";

export default function QuestionView({
  setIsResponseQuestion,
  setIsSpecifiedPage,
  setDetailQuestion,
  userInfo,
  isCurrentUser,
  setIsNewQuestion,
  setIsUpdateQuestion,
  setQuestion,
  isAdmin,
  setAllQuestion,
  allQuestion,
  questionPagination,
  setPagination,
  setSavedScrollPosition,
  isLoadFull,
  setIsLoadFull,
  hasInitialLoad,
  setHasInitialLoad,
  lastIsCurrentUser,
  setLastIsCurrentUser,
}: Readonly<QuestionViewProps>) {
  const t_qaPage = useTranslations("qaPage");
  const [getQuestionApi] = useGetQuestionMutation();
  const [getQuestionByTagApi] = useGetQuestionByTagMutation();
  const [deleteQuestionAPI] = useDeleteQuestionMutation();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [fullScreenImageIndex, setFullScreenImageIndex] = useState<number>(0);
  const [theElement, setTheElement] = useState<
    QuestionResponseDTO | undefined
  >();
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [tagSearchQuery, setTagSearchQuery] = useState<string>("");
  const { isDarkMode } = useTheme();
  const { data: tagsData } = useGetTagsQuery();
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const availableTags = tagsData?.result || [];
  const filteredTags = tagSearchQuery
    ? availableTags.filter(
      (tag) =>
        tag.toLowerCase().includes(tagSearchQuery.toLowerCase()) &&
        !selectedTags.includes(tag)
    )
    : availableTags.filter((tag) => !selectedTags.includes(tag));

  useEffect(() => {
    if (isCurrentUser !== lastIsCurrentUser) {
      setIsLoadFull(false);
      setAllQuestion([]);
      setPagination(1);
      setLastIsCurrentUser(isCurrentUser);
    }
  }, [
    isCurrentUser,
    lastIsCurrentUser,
    setAllQuestion,
    setIsLoadFull,
    setPagination,
    setLastIsCurrentUser,
  ]);

  useEffect(() => {
    if (!hasInitialLoad) {
      setIsLoadFull(false);
      setAllQuestion([]);
      setPagination(1);
    }
  }, [
    hasInitialLoad,
    selectedTags,
    setAllQuestion,
    setIsLoadFull,
    setPagination,
  ]);

  const fetchQuestions = useCallback(async () => {
    if (isLoadFull) return;
    if (hasInitialLoad) {
      setHasInitialLoad(false);
      return;
    }

    setIsLoading(true);
    try {
      if (selectedTags.length > 0) {
        try {
          const res = await getQuestionByTagApi({
            tags: selectedTags,
            pageNumber: questionPagination,
            userId: userInfo?.id ?? "",
            isCurrentUser,
            isAdmin,
          });

          let newQuestions = res.data?.result;
          if (newQuestions && newQuestions.length > 0) {
            if (questionPagination != 1) {
              newQuestions = newQuestions.filter(question => !allQuestion?.some(q => q.questionId === question.questionId));
            }
            const updatedQuestions =
              questionPagination === 1
                ? newQuestions
                : [...(allQuestion || []), ...newQuestions];
            setAllQuestion(updatedQuestions);
            if (newQuestions[0].isFull) {
              setIsLoadFull(true);
            }
          } else {
            setIsLoadFull(true);
          }
        } catch (tagError) {
          console.error("Error fetching questions by tags:", tagError);
          setIsLoadFull(true);
        }
      } else {
        try {
          const request: GetQuestionRequest = {
            pageNumber: questionPagination,
            userId: userInfo?.id ?? "",
            isCurrentUser,
            isAdmin,
          };

          const res = await getQuestionApi(request);
          let newQuestions = res.data?.result;
          if (newQuestions && newQuestions.length > 0) {
            if (questionPagination != 1) {
              newQuestions = newQuestions.filter(question => !allQuestion?.some(q => q.questionId === question.questionId));
            }
            const updatedQuestions = questionPagination === 1 ? newQuestions : [...(allQuestion || []), ...newQuestions];
            setAllQuestion(updatedQuestions);
            if (newQuestions[0].isFull) {
              setIsLoadFull(true);
            }
          } else {
            setIsLoadFull(true);
          }
        } catch (error) {
          console.error("Error fetching all questions:", error);
          setIsLoadFull(true);
        }
      }
    } catch (error) {
      console.error("Failed to fetch questions:", error);
      setIsLoadFull(true);
    } finally {
      setIsLoading(false);
    }
  }, [getQuestionApi, getQuestionByTagApi, questionPagination, isCurrentUser, isAdmin, userInfo, isLoadFull, selectedTags, hasInitialLoad, setAllQuestion, setHasInitialLoad, setIsLoadFull]);

  useEffect(() => {
    fetchQuestions();
  }, [fetchQuestions]);

  useEffect(() => {
    const handleScroll = () => {
      const isAtBottom =
        window.innerHeight + document.documentElement.scrollTop >=
        document.documentElement.offsetHeight - 100;
      if (isAtBottom && !isLoading && !isLoadFull) {
        setPagination((prevPage) => prevPage + 1);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isLoading, isLoadFull, setPagination]);

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

  const handleTagClick = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const clearTagFilters = () => {
    setSelectedTags([]);
  };

  return (
    <div>
      <div
        className={cn(
          "mb-6 p-4 rounded-xl shadow-sm border",
          isDarkMode
            ? "bg-gray-800 border-gray-700"
            : "bg-white border-gray-200"
        )}
      >
        <div className="flex items-center justify-between mb-4">
          <h3
            className={cn(
              "text-lg font-medium flex items-center",
              isDarkMode ? "text-gray-200" : "text-gray-800"
            )}
          >
            <TagIcon className="h-5 w-5 mr-2 text-blue-600" />
            {t_qaPage("filterByTopics")}
          </h3>
          {selectedTags.length > 0 && (
            <button
              onClick={clearTagFilters}
              className={cn(
                "px-3 py-1.5 text-sm rounded-lg flex items-center",
                isDarkMode
                  ? "bg-gray-700 hover:bg-gray-600 text-gray-300"
                  : "bg-gray-100 hover:bg-gray-200 text-gray-600"
              )}
            >
              {t_qaPage("clearAllFilters")}
              <X className="h-4 w-4 ml-1" />
            </button>
          )}
        </div>

        {/* Search tags input */}
        <div className="relative mb-4">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search
              className={cn(
                "h-4 w-4",
                isDarkMode ? "text-gray-500" : "text-gray-400"
              )}
            />
          </div>
          <input
            type="text"
            placeholder={t_qaPage("searchTopics")}
            value={tagSearchQuery}
            onChange={(e) => setTagSearchQuery(e.target.value)}
            className={cn(
              "w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500",
              isDarkMode
                ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                : "bg-white border-gray-300 text-gray-800"
            )}
          />
        </div>

        {/* Selected tags section */}
        {selectedTags.length > 0 && (
          <div
            className={cn(
              "mb-4 p-2 border rounded-lg",
              isDarkMode
                ? "bg-gray-700 border-gray-600"
                : "bg-gray-50 border-gray-200"
            )}
          >
            <div className="flex items-center mb-2">
              <span
                className={cn(
                  "text-sm mr-2",
                  isDarkMode ? "text-gray-300" : "text-gray-600"
                )}
              >
                {t_qaPage("selected")}:
              </span>
              <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                {selectedTags.length}{" "}
                {selectedTags.length === 1 ? t_qaPage("topic") : t_qaPage("topics")}
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {selectedTags.map((tag, index) => (
                <div
                  key={index}
                  className="bg-blue-600 text-white px-2.5 py-1 rounded-md text-sm flex items-center gap-1.5"
                >
                  {tag}
                  <button
                    onClick={() => handleTagClick(tag)}
                    className="hover:bg-white hover:bg-opacity-20 rounded-full p-0.5"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tags list with improved UI */}
        <div className="flex flex-wrap gap-2">
          {filteredTags.length > 0 ? (
            filteredTags.map((tag, index) => (
              <button
                key={index}
                onClick={() => handleTagClick(tag)}
                className={cn(
                  "px-3 py-2 rounded-lg font-medium text-sm transition-all",
                  isDarkMode
                    ? "bg-gray-700 text-gray-200 hover:bg-gray-600"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                )}
              >
                {tag}
              </button>
            ))
          ) : tagSearchQuery ? (
            <div
              className={cn(
                "text-sm py-2",
                isDarkMode ? "text-gray-400" : "text-gray-500"
              )}
            >
              {t_qaPage("noTopicsMatchYourSearch")}
            </div>
          ) : selectedTags.length > 0 ? (
            <div
              className={cn(
                "text-sm py-2",
                isDarkMode ? "text-gray-400" : "text-gray-500"
              )}
            >
              {t_qaPage("allAvailableTopicsSelected")}
            </div>
          ) : (
            <div
              className={cn(
                "text-sm py-2",
                isDarkMode ? "text-gray-400" : "text-gray-500"
              )}
            >
              {t_qaPage("noTopicsAvailable")}
            </div>
          )}
        </div>
      </div>

      <div
        className={cn(
          "divide-y rounded-xl shadow-sm border",
          isDarkMode
            ? "divide-gray-700 bg-gray-800 border-gray-700"
            : "divide-gray-200 bg-white border-gray-200"
        )}
      >
        {allQuestion && allQuestion.length > 0
          ? allQuestion.map((element, index) => (
            <div
              key={`${element.questionId}-${index}`}
              className={cn(
                "transition-colors duration-150",
                isDarkMode ? "hover:bg-gray-700" : "hover:bg-gray-50"
              )}
            >
              <div
                role="button"
                onClick={() => {
                  if (setSavedScrollPosition) {
                    setSavedScrollPosition({
                      x: window.scrollX,
                      y: window.scrollY,
                    });
                  }

                  setIsSpecifiedPage(true);
                  setDetailQuestion(element);
                }}
                className="p-6 cursor-pointer"
                tabIndex={0}
              >
                <div className="flex items-start">
                  <div className="mr-4 flex-shrink-0">
                    <Avatar className="h-10 w-10">
                      <AvatarImage
                        src={element.author.profileImage}
                        alt={`${element.author.username}`}
                      />
                      <AvatarFallback>
                        {element.author.username}
                      </AvatarFallback>
                    </Avatar>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center">
                        <span
                          className={cn(
                            "font-medium mr-2",
                            isDarkMode ? "text-white" : "text-gray-900"
                          )}
                        >
                          {element.author.username}
                        </span>
                        <span
                          className={cn(
                            "text-sm",
                            isDarkMode ? "text-gray-400" : "text-gray-500"
                          )}
                        >
                          {format(new Date(element.createdAt), "MMM d, yyyy")}
                        </span>
                      </div>

                      {(userInfo?.username === element.author.username ||
                        isAdmin) && (
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
                                      setQuestion(element);
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
                                    <span>{t_qaPage("editQuestion")}</span>
                                  </DropdownMenuItem>
                                </button>
                              )}
                              <button
                                className="w-full"
                                onClick={(e) =>
                                  handleDeleteQuestion(element.questionId, e)
                                }
                              >
                                <DropdownMenuItem className="cursor-pointer text-red-600 hover:text-red-700 focus:text-red-700">
                                  <OctagonX className="mr-2 h-4 w-4" />
                                  <span>{t_qaPage("deleteQuestion")}</span>
                                </DropdownMenuItem>
                              </button>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        )}
                    </div>

                    <div
                      className={cn(
                        "mb-3",
                        isDarkMode ? "text-gray-200" : "text-gray-800"
                      )}
                    >
                      {element.content}
                    </div>

                    {element.tags && element.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-3">
                        {element.tags.map((tag, tagIndex) => (
                          <span
                            key={tagIndex}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleTagClick(tag);
                            }}
                            className={cn(
                              "px-2.5 py-1 rounded-md text-xs cursor-pointer transition-colors",
                              selectedTags.includes(tag)
                                ? "bg-blue-600 text-white"
                                : isDarkMode
                                  ? "bg-gray-700 text-gray-200 hover:bg-gray-600"
                                  : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                            )}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}

                    {element.images.length > 0 && (
                      <div className="relative overflow-x-auto mb-4">
                        <div className="flex space-x-3">
                          {element.images.map((image, imgIndex) => (
                            <div
                              key={imgIndex}
                              className={cn(
                                "relative min-w-[150px] max-w-[250px] aspect-video rounded-lg overflow-hidden border",
                                isDarkMode
                                  ? "border-gray-700"
                                  : "border-gray-200"
                              )}
                            >
                              <Image
                                src={image}
                                alt={`image-${imgIndex}`}
                                fill
                                sizes="(max-width: 640px) 150px, 250px"
                                className="object-cover"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleImageClick(imgIndex);
                                  setTheElement(element);
                                }}
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <button
                      className={cn(
                        "inline-flex items-center gap-1.5 text-sm transition-colors",
                        isDarkMode
                          ? "text-gray-400 hover:text-gray-200"
                          : "text-gray-600 hover:text-gray-900"
                      )}
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsResponseQuestion(true);
                        setDetailQuestion(element);
                      }}
                    >
                      <MessageSquare className="h-4 w-4" />
                      <span>
                        {element.answerAmount}{" "}
                        {element.answerAmount === 1 ? t_qaPage("reply") : t_qaPage("replies")}
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
          : !isLoading && (
            <div className="py-16 text-center">
              {selectedTags.length > 0 ? (
                <>
                  <p
                    className={cn(
                      "mb-2",
                      isDarkMode ? "text-gray-400" : "text-gray-500"
                    )}
                  >
                    {t_qaPage("noQuestionsFoundWithTheSelectedTopics")}
                  </p>
                  <button
                    onClick={clearTagFilters}
                    className="px-4 py-2 mb-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    {t_qaPage("showAllQuestions")}
                  </button>
                </>
              ) : (
                <>
                  <p
                    className={cn(
                      "mb-2",
                      isDarkMode ? "text-gray-400" : "text-gray-500"
                    )}
                  >
                    {t_qaPage("noQuestionsFound")}
                  </p>
                  {!isAdmin && (
                    <button
                      onClick={() =>
                        setIsNewQuestion && setIsNewQuestion(true)
                      }
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      {t_qaPage("askAQuestion")}
                    </button>
                  )}
                </>
              )}
            </div>
          )}

        {currentFullScreenImageSrc && (
          <div
            className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50"
            onClick={closeFullScreen}
          >
            <button
              className="absolute left-4 h-10 w-10 bg-white bg-opacity-25 rounded-full text-white z-50 hover:bg-opacity-50 transition-all duration-200 flex items-center justify-center"
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

            <div className="relative w-[85%] h-[85%]">
              <Image
                src={currentFullScreenImageSrc}
                alt="Full screen"
                fill
                sizes="85vw"
                className="object-contain"
              />
            </div>

            <button
              className="absolute right-4 h-10 w-10 bg-white bg-opacity-25 rounded-full text-white z-50 hover:bg-opacity-50 transition-all duration-200 flex items-center justify-center"
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
        )}

        {isLoading && (
          <div className="text-center py-6">
            <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-solid border-primary border-r-transparent motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
            <p
              className={cn(
                "mt-2 text-sm",
                isDarkMode ? "text-gray-400" : "text-gray-500"
              )}
            >
              {t_qaPage("loadingQuestions")}...
            </p>
          </div>
        )}

        {isLoadFull && allQuestion && allQuestion.length > 0 && (
          <div
            className={cn(
              "text-center py-8",
              isDarkMode ? "text-gray-400" : "text-gray-500"
            )}
          >
            {t_qaPage("youveReachedTheEnd")}.
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 w-full max-w-sm">
            <h2 className="text-lg font-semibold mb-4">{t_qaPage("deleteConfirmation")}</h2>
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
