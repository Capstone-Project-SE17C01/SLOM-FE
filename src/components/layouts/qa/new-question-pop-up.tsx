import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
} from "@headlessui/react";
import {
  NewQuestionPopupProps,
  PostQuestionRequestDTO,
  QuestionResponseDTO,
  UpdateQuestionRequestDTO,
} from "../../../types/IQa";
import { useEffect, useState, useRef } from "react";
import { uploadImageToCloudinary } from "@/services/cloudinary/config";
import {
  usePostQuestionMutation,
  useUpdateQuestionMutation,
  useGetTagsQuery,
} from "../../../api/QaApi";
import UploadImage from "./upload-image";
import {
  OpenRouterService,
  TagGenerationRequest,
} from "@/services/openrouter/config";
import { X, Tag, Loader2, Plus } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { cn } from "@/utils/cn";
import { toast } from "sonner";
import { useTranslations } from "next-intl";

// You should replace this with your actual OpenRouter API key
const OPENROUTER_API_KEY = process.env.NEXT_PUBLIC_OPENROUTER_API_KEY || "";
const openRouterService = new OpenRouterService(OPENROUTER_API_KEY);

export default function NewQuestionPopup({
  userInfo,
  setIsNewQuestion,
  isUpdateQuestion,
  question,
  setIsUpdateQuestion,
  setQuestion,
  setAllQuestion,
}: Readonly<NewQuestionPopupProps>) {
  const [newQuestion, setNewQuestion] = useState<string | undefined>("");
  const t_qaPage = useTranslations("qaPage");
  const [privacy, setPrivacy] = useState(
    t_qaPage("allCanViewAndAnswerYourQuestion")
  );
  const [files, setFiles] = useState<File[]>([]);
  const [postQuestionAPI] = usePostQuestionMutation();
  const [updateQuestionAPI] = useUpdateQuestionMutation();
  const [existImages, setExistImages] = useState<string[]>();
  const [tags, setTags] = useState<string[]>([]);
  const [customTag, setCustomTag] = useState("");
  const [isGeneratingTags, setIsGeneratingTags] = useState(false);
  const [showTagDropdown, setShowTagDropdown] = useState(false);
  const tagInputRef = useRef<HTMLInputElement>(null);
  const { isDarkMode } = useTheme();
  // Get existing tags from API
  const { data: tagsData } = useGetTagsQuery();
  const existingTags = tagsData?.result || [];

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNewQuestion(e.target.value);
  };

  const uploadImage = async (): Promise<string[]> => {
    if (!files?.length) return [];
    const promises = files.map((f) =>
      uploadImageToCloudinary(f).then((res) => res.url)
    );
    const urls = await Promise.all(promises);
    return urls;
  };

  const generateTags = async () => {
    if (!newQuestion || newQuestion.trim().length < 10) {
      return;
    }

    setIsGeneratingTags(true);
    try {
      const request: TagGenerationRequest = {
        content: newQuestion,
        maxTags: 5,
      };

      const generatedTags = await openRouterService.generateTags(request);
      setTags(generatedTags);
    } catch (error) {
      console.error("Error generating tags:", error);
    } finally {
      setIsGeneratingTags(false);
    }
  };

  const handleAddCustomTag = () => {
    if (customTag && !tags.includes(customTag)) {
      setTags([...tags, customTag]);
      setCustomTag("");
      setShowTagDropdown(false);
      if (tagInputRef.current) {
        tagInputRef.current.focus();
      }
    }
  };

  const handleExistingTagClick = (tag: string) => {
    if (!tags.includes(tag)) {
      setTags([...tags, tag]);
    }
    setShowTagDropdown(false);
    setCustomTag("");
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const postQuestion = async () => {
    const request: PostQuestionRequestDTO = {
      creatorId: userInfo?.id,
      content: newQuestion,
      privacy: privacy,
      tags: tags.length > 0 ? tags : undefined,
    };

    if (!files?.length) {
      const res = await postQuestionAPI(request).unwrap();
      setAllQuestion((prev) => [
        res.result as QuestionResponseDTO,
        ...((prev as QuestionResponseDTO[]) || []),
      ]);
    } else {
      const resUrls = await uploadImage();
      request.images = resUrls;
      const res = await postQuestionAPI(request).unwrap();
      setAllQuestion((prev) => [
        res.result as QuestionResponseDTO,
        ...((prev as QuestionResponseDTO[]) || []),
      ]);
    }

    setIsNewQuestion(false);
  };

  const updateQuestion = async (allImages: string[] | undefined) => {
    if (!question) return;

    const request: UpdateQuestionRequestDTO = {
      questionId: question.questionId,
      content: newQuestion ?? question.content,
      privacy: privacy,
      tags: tags.length > 0 ? tags : undefined,
    };

    if (!files?.length) {
      request.images = allImages;
      await updateQuestionAPI(request).unwrap();

      setAllQuestion(
        (prev) =>
          prev?.map((q) =>
            q.questionId === question.questionId
              ? {
                  ...q,
                  content: newQuestion ?? question.content,
                  privacy: privacy,
                  tags: tags.length > 0 ? tags : undefined,
                  images: allImages || [],
                }
              : q
          ) || []
      );
    } else {
      const resUrls = await uploadImage();
      request.images = [...(allImages || []), ...resUrls];
      await updateQuestionAPI(request).unwrap();

      // Update the question in the list in real-time
      setAllQuestion(
        (prev) =>
          prev?.map((q) =>
            q.questionId === question.questionId
              ? {
                  ...q,
                  content: newQuestion ?? question.content,
                  privacy: privacy,
                  tags: tags.length > 0 ? tags : undefined,
                  images: [...(allImages || []), ...resUrls],
                }
              : q
          ) || []
      );
    }

    // Close popup and reset states
    setIsNewQuestion(false);
    if (setIsUpdateQuestion && setQuestion) {
      setIsUpdateQuestion(false);
      setQuestion(undefined);
    }
  };

  useEffect(() => {
    if (isUpdateQuestion && question != undefined) {
      setNewQuestion(question.content);
      setExistImages(question.images);
      setTags(question.tags || []);
    }
  }, [question, isUpdateQuestion]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && customTag) {
      e.preventDefault();
      handleAddCustomTag();
    }
  };

  // Filter suggestions based on input
  const filteredTags = customTag
    ? existingTags.filter(
        (tag) =>
          tag.toLowerCase().includes(customTag.toLowerCase()) &&
          !tags.includes(tag)
      )
    : existingTags.filter((tag) => !tags.includes(tag));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div
        className={cn(
          "w-full max-w-2xl rounded-xl shadow-2xl overflow-hidden",
          isDarkMode ? "bg-gray-800 text-white" : "bg-white text-gray-800"
        )}
      >
        {/* Header */}
        <div
          className={cn(
            "px-6 py-4 border-b flex justify-between items-center",
            isDarkMode ? "border-gray-700" : "border-gray-200"
          )}
        >
          <h2 className="text-xl font-semibold">
            {isUpdateQuestion ? t_qaPage("editQuestion") : t_qaPage("newQuestion")}
          </h2>
          <button
            onClick={() => {
              setIsNewQuestion(false);
              setIsUpdateQuestion(false);
              setQuestion(undefined);
            }}
            className={cn(
              "transition-colors",
              isDarkMode
                ? "text-gray-400 hover:text-gray-200"
                : "text-gray-500 hover:text-gray-800"
            )}
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="flex items-start space-x-4">
            <Avatar className="h-10 w-10">
              <AvatarImage
                src={userInfo?.avatarUrl}
                alt={`${userInfo?.username}`}
              />
              <AvatarFallback>{userInfo?.username?.charAt(0)}</AvatarFallback>
            </Avatar>

            <div className="flex-1 space-y-4">
              <div className="font-medium">{userInfo?.username}</div>

              <textarea
                onChange={handleChange}
                placeholder={t_qaPage("whatWouldYouLikeToAsk")}
                className={cn(
                  "w-full min-h-[120px] p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none",
                  isDarkMode
                    ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                    : "bg-white border-gray-300 text-gray-800"
                )}
                value={newQuestion}
                onBlur={() => {
                  if (
                    newQuestion &&
                    newQuestion.length > 10 &&
                    tags.length === 0
                  ) {
                    generateTags();
                  }
                }}
              />

              {/* Tags Section */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <label
                    className={cn(
                      "text-sm font-medium flex items-center",
                      isDarkMode ? "text-gray-300" : "text-gray-700"
                    )}
                  >
                    <Tag className="h-4 w-4 mr-1.5 text-blue-600" />
                    {t_qaPage("topics")}
                  </label>
                  <button
                    type="button"
                    onClick={generateTags}
                    className="text-xs text-blue-600 hover:text-blue-800 flex items-center bg-blue-50 px-2.5 py-1 rounded-md transition-colors"
                    disabled={
                      isGeneratingTags ||
                      !newQuestion ||
                      newQuestion.length < 10
                    }
                  >
                    {isGeneratingTags ? (
                      <>
                        <Loader2 className="h-3.5 w-3.5 mr-1 animate-spin" />
                        {t_qaPage("generating")}...
                      </>
                    ) : (
                      <>{t_qaPage("autoGenerateTopics")}</>
                    )}
                  </button>
                </div>

                <div className="relative">
                  <div className="flex gap-2 items-center">
                    <div className="relative flex-1">
                      <input
                        ref={tagInputRef}
                        type="text"
                        value={customTag}
                        onChange={(e) => {
                          setCustomTag(e.target.value);
                          setShowTagDropdown(true);
                        }}
                        onFocus={() => setShowTagDropdown(true)}
                        onBlur={() => {
                          // Delay hiding dropdown to allow for clicks
                          setTimeout(() => setShowTagDropdown(false), 150);
                        }}
                        onKeyDown={handleKeyDown}
                        placeholder={t_qaPage("enterOrSelectTopics")}
                        className={cn(
                          "w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500",
                          isDarkMode
                            ? "bg-gray-700 border-gray-600 text-white"
                            : "bg-white border-gray-300 text-gray-800"
                        )}
                      />
                      {showTagDropdown && filteredTags.length > 0 && (
                        <div
                          className={cn(
                            "absolute z-20 mt-1 w-full border rounded-lg shadow-lg max-h-60 overflow-auto",
                            isDarkMode
                              ? "bg-gray-800 border-gray-700"
                              : "bg-white border-gray-200"
                          )}
                        >
                          <div
                            className={cn(
                              "p-2 text-xs border-b",
                              isDarkMode
                                ? "text-gray-400 border-gray-700 bg-gray-700"
                                : "text-gray-500 border-gray-200 bg-gray-50"
                            )}
                          >
                            {t_qaPage(
                              "selectFromExistingTopicsOrCreateNewOnes"
                            )}
                          </div>
                          {filteredTags.map((tag, index) => (
                            <div
                              key={index}
                              className={cn(
                                "px-3 py-2 cursor-pointer flex items-center",
                                isDarkMode
                                  ? "hover:bg-gray-700 text-gray-200"
                                  : "hover:bg-blue-50 text-gray-800"
                              )}
                              onClick={() => handleExistingTagClick(tag)}
                            >
                              <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                              {tag}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={handleAddCustomTag}
                      disabled={!customTag}
                      className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-300 flex items-center"
                    >
                      <Plus className="h-5 w-5" />
                    </button>
                  </div>
                </div>

                <div
                  className={cn(
                    "flex flex-wrap gap-2 mb-2 min-h-[40px] p-2 rounded-lg border",
                    isDarkMode
                      ? "bg-gray-700 border-gray-600"
                      : "bg-gray-50 border-gray-200"
                  )}
                >
                  {tags.length > 0 ? (
                    tags.map((tag, index) => (
                      <div
                        key={index}
                        className={cn(
                          "border px-2.5 py-1.5 rounded-md text-sm flex items-center gap-2 group",
                          isDarkMode
                            ? "bg-gray-800 border-gray-600 text-gray-200"
                            : "bg-white border-gray-300 shadow-sm text-gray-800"
                        )}
                      >
                        {tag}
                        <button
                          type="button"
                          onClick={() => removeTag(tag)}
                          className={cn(
                            "rounded-full p-0.5",
                            isDarkMode
                              ? "text-gray-400 hover:text-red-400 group-hover:bg-gray-700"
                              : "text-gray-400 hover:text-red-600 group-hover:bg-gray-100"
                          )}
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    ))
                  ) : (
                    <div
                      className={cn(
                        "text-sm flex items-center justify-center w-full h-full",
                        isDarkMode ? "text-gray-400" : "text-gray-400"
                      )}
                    >
                      {t_qaPage("noTopicsSelected")}
                    </div>
                  )}
                </div>
                <p
                  className={cn(
                    "text-xs",
                    isDarkMode ? "text-gray-400" : "text-gray-500"
                  )}
                >
                  {t_qaPage(
                    "topicsHelpOthersFindYourQuestionAndConnectWithRelevantContent"
                  )}
                </p>
              </div>

              <UploadImage
                setFiles={setFiles}
                images={question != undefined ? question.images : []}
                setExistImages={setExistImages}
                existImage={existImages}
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div
          className={cn(
            "px-6 py-4 border-t flex justify-between items-center",
            isDarkMode
              ? "bg-gray-700 border-gray-700"
              : "bg-gray-50 border-gray-200"
          )}
        >
          <div className="relative z-50">
            <Listbox value={privacy} onChange={setPrivacy}>
              <div className="relative">
                <ListboxButton
                  className={cn(
                    "px-4 py-2 text-sm border rounded-lg flex items-center min-w-[280px] hover:bg-opacity-80 transition-colors",
                    isDarkMode
                      ? "bg-gray-800 border-gray-600 text-gray-200"
                      : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
                  )}
                >
                  <span className="block truncate pr-8">{privacy}</span>
                  <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                    <svg
                      className={cn(
                        "h-4 w-4",
                        isDarkMode ? "text-gray-400" : "text-gray-400"
                      )}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </span>
                </ListboxButton>
                <div className="relative mt-2">
                  <ListboxOptions
                    className={cn(
                      "absolute bottom-2 w-full border rounded-lg shadow-lg overflow-hidden",
                      isDarkMode
                        ? "bg-gray-800 border-gray-700"
                        : "bg-white border-gray-200"
                    )}
                  >
                    <div className="py-1">
                      <ListboxOption
                        value={t_qaPage("allCanViewAndAnswerYourQuestion")}
                        className={cn(
                          "px-4 py-2.5 text-sm cursor-pointer hover:bg-blue-50 hover:text-blue-700 transition-colors ui-selected:bg-blue-50 ui-selected:text-blue-700 flex items-center justify-between",
                          isDarkMode ? "text-gray-200" : "text-gray-700"
                        )}
                      >
                        <span>
                          {t_qaPage("allCanViewAndAnswerYourQuestion")}
                        </span>
                        <svg
                          className="h-4 w-4 text-blue-600 opacity-0 ui-selected:opacity-100"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      </ListboxOption>
                      <ListboxOption
                        value={t_qaPage("onlyAdminCanViewAndAnswer")}
                        className={cn(
                          "px-4 py-2.5 text-sm cursor-pointer hover:bg-blue-50 hover:text-blue-700 transition-colors ui-selected:bg-blue-50 ui-selected:text-blue-700 flex items-center justify-between",
                          isDarkMode ? "text-gray-200" : "text-gray-700"
                        )}
                      >
                        <span>{t_qaPage("onlyAdminCanViewAndAnswer")}</span>
                        <svg
                          className="h-4 w-4 text-blue-600 opacity-0 ui-selected:opacity-100"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      </ListboxOption>
                    </div>
                  </ListboxOptions>
                </div>
              </div>
            </Listbox>
          </div>

          <button
            className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-300 disabled:cursor-not-allowed"
            onClick={async () => {
              if (isUpdateQuestion) {
                toast.promise(updateQuestion(existImages), {
                  loading: "Đang cập nhật câu hỏi...",
                  success: "Đã cập nhật câu hỏi thành công",
                  error: "Cập nhật câu hỏi thất bại",
                });
              } else {
                toast.promise(postQuestion(), {
                  loading: "Đang đăng câu hỏi...",
                  success: "Đã đăng câu hỏi thành công",
                  error: "Đăng câu hỏi thất bại",
                });
              }
            }}
            disabled={!newQuestion?.trim()}
          >
            {isUpdateQuestion
              ? t_qaPage("updateQuestion")
              : t_qaPage("postQuestion")}
          </button>
        </div>
      </div>
    </div>
  );
}
