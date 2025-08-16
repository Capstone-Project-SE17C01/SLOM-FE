import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { AnswerResponseDTO, NewAnswerAmount, NewAnswerProps, PostAnswerRequestDTO } from "@/types/IQa";
import { useState, useRef, useEffect } from "react";
import QuestionNewAnswer from "./question-new-answer";
import UploadImage from "./upload-image";
import { uploadImageToCloudinary } from "@/services/cloudinary/config";
import { usePostAnswerMutation, useUpdateAnswerMutation } from "../../../api/QaApi";
import { Send, X } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { cn } from "@/utils/cn";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";

export default function NewAnswer({ userInfo, setIsResponseQuestion, question, setAnswerOfQuestion, setNewAnswerAmount, newAnswerAmount, isUpdateAnswer = false, answer, setIsUpdateAnswer, setAnswer, updateQuestionAnswerCount }: Readonly<NewAnswerProps>) {
    const [newAnswer, setNewAnswer] = useState(isUpdateAnswer ? (answer?.content || "") : "");
    const [files, setFiles] = useState<File[]>([])
    const [existImages, setExistImages] = useState<string[] | undefined>(isUpdateAnswer ? answer?.images : undefined);
    const textareaRef = useRef<HTMLTextAreaElement | null>(null)
    const [postAnswerAPI] = usePostAnswerMutation();
    const [updateAnswerAPI] = useUpdateAnswerMutation();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { isDarkMode } = useTheme();

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setNewAnswer(e.target.value)
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto'   // Reset the height
            textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`
        }
    }

    const uploadImage = async (): Promise<string[]> => {
        if (!files?.length) return existImages || [];
        const promises = files.map(f =>
            uploadImageToCloudinary(f).then(res => res.url)
        );
        const urls = await Promise.all(promises);
        return [...(existImages || []), ...urls];
    }

    const postAnswer = async () => {
        if (!newAnswer.trim() && !files.length && !existImages?.length) return;
        
        setIsSubmitting(true);

        try {
            if (isUpdateAnswer && answer) {
                // Update existing answer
                const finalImages = await uploadImage();
                await updateAnswerAPI({
                    answerId: answer.answerId,
                    content: newAnswer,
                    images: finalImages
                }).unwrap();
                
                // Update the answer in the list
                setAnswerOfQuestion((prev) => 
                    prev?.map(ans => 
                        ans.answerId === answer.answerId 
                            ? { ...ans, content: newAnswer, images: finalImages }
                            : ans
                    ) || []
                );
                
                // Close popup and reset states
                setIsResponseQuestion(false);
                if (setIsUpdateAnswer && setAnswer) {
                    setIsUpdateAnswer(false);
                    setAnswer(undefined);
                }
            } else {
                // Create new answer
                const request: PostAnswerRequestDTO = {
                    creatorId: userInfo?.id,
                    content: newAnswer,
                    questionId: question?.questionId
                };

                if (files?.length || existImages?.length) {
                    const resUrls = await uploadImage();
                    request.images = resUrls;
                }

                await postAnswerAPI(request).then(
                    (res) => {
                        const incomingResult = res.data?.result;
                        if (incomingResult != null) {
                            const newItems: AnswerResponseDTO[] = [incomingResult];
                            setAnswerOfQuestion((prev) => [...(newItems), ...(prev ?? [])])
                            const lastQuestionId = newItems[0].questionId ?? ""
                            const lastAnswerAmount = newAnswerAmount?.findLast(val => val.questionId == lastQuestionId)
                            const newAnswerQuantity: NewAnswerAmount = lastAnswerAmount ?
                                {
                                    questionId: lastAnswerAmount.questionId,
                                    amount: lastAnswerAmount.amount + 1
                                } :
                                {
                                    questionId: lastQuestionId,
                                    amount: 1
                                }
                            setNewAnswerAmount((prev) => [...(prev ?? []).filter(val => val.questionId != lastQuestionId), newAnswerQuantity])
                            
                            // Update the question's answer count in allQuestion
                            if (updateQuestionAnswerCount && question?.questionId) {
                                updateQuestionAnswerCount(question.questionId, 1);
                            }
                        }
                    }
                );
                setIsResponseQuestion(false);
            }
        } catch (error) {
            console.error("Error posting/updating answer:", error);
            throw error; // Re-throw for toast.promise to handle
        } finally {
            setIsSubmitting(false);
        }
    };

    useEffect(() => {
        if (isUpdateAnswer && answer != undefined) {
            setNewAnswer(answer.content);
            setExistImages(answer.images);
        }
    }, [answer, isUpdateAnswer]); 

    return (
        <div>
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40" onClick={() => {
                setIsResponseQuestion(false);
                if (isUpdateAnswer && setIsUpdateAnswer && setAnswer) {
                    setIsUpdateAnswer(false);
                    setAnswer(undefined);
                }
            }}></div>
            
            <div className={cn(
                "fixed inset-x-0 z-50 mx-auto w-full max-w-2xl px-4 py-6 rounded-xl shadow-xl max-h-[85vh] top-[7.5vh] overflow-y-auto",
                isDarkMode ? "bg-gray-800 text-white" : "bg-white text-black"
            )}>
                <div className={cn(
                    "flex items-center justify-between pb-4 mb-4 border-b",
                    isDarkMode ? "border-gray-700" : "border-gray-200"
                )}>
                    <h2 className={cn(
                        "text-lg font-semibold",
                        isDarkMode ? "text-white" : "text-gray-900"
                    )}>
                        {isUpdateAnswer ? "Edit Answer" : "Reply to Question"}
                    </h2>
                    <button 
                        onClick={() => {
                            setIsResponseQuestion(false);
                            if (isUpdateAnswer && setIsUpdateAnswer && setAnswer) {
                                setIsUpdateAnswer(false);
                                setAnswer(undefined);
                            }
                        }}
                        className={cn(
                            "p-1.5 rounded-full transition-colors",
                            isDarkMode 
                                ? "hover:bg-gray-700 text-gray-400 hover:text-gray-200" 
                                : "hover:bg-gray-100 text-gray-500 hover:text-gray-700"
                        )}
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <div className={cn(
                    "mb-6 rounded-lg p-4",
                    isDarkMode ? "bg-gray-700" : "bg-gray-50"
                )}>
                    <QuestionNewAnswer question={question} />
                </div>

                <div className="space-y-4">
                    <div className="flex">
                        <div className="mt-1 mr-3">
                            <Avatar className="h-10 w-10">
                                <AvatarImage
                                    src={userInfo?.avatarUrl}
                                    alt={`${userInfo?.username}`}
                                />
                                <AvatarFallback>{userInfo?.username}</AvatarFallback>
                            </Avatar>
                        </div>
                        
                        <div className="flex-1">
                            <div className={cn(
                                "font-medium mb-2",
                                isDarkMode ? "text-white" : "text-gray-900"
                            )}>
                                {userInfo?.username}
                            </div>
                            <div className={cn(
                                "border rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent",
                                isDarkMode ? "border-gray-600" : "border-gray-300"
                            )}>
                                <Textarea
                                    ref={textareaRef}
                                    value={newAnswer}
                                    rows={3}
                                    onChange={handleChange}
                                    placeholder="Write your reply here..."
                                    className={cn(
                                        "w-full p-3 border-none focus:ring-0 resize-none",
                                        isDarkMode ? "bg-gray-700 text-white placeholder-gray-400" : "bg-white text-gray-800"
                                    )}
                                />
                                
                                <div className={cn(
                                    "border-t p-3",
                                    isDarkMode ? "bg-gray-700 border-gray-600" : "bg-gray-50 border-gray-200"
                                )}>
                                    <UploadImage 
                                        setFiles={setFiles} 
                                        images={existImages || []} 
                                        setExistImages={setExistImages} 
                                        existImage={existImages}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div className="flex justify-end mt-6">
                        <button 
                            className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                            onClick={() => {
                                toast.promise(
                                    postAnswer(),
                                    {
                                        loading: isUpdateAnswer ? 'Đang cập nhật câu trả lời...' : 'Đang đăng câu trả lời...',
                                        success: isUpdateAnswer ? 'Đã cập nhật câu trả lời thành công' : 'Đã đăng câu trả lời thành công',
                                        error: isUpdateAnswer ? 'Cập nhật câu trả lời thất bại' : 'Đăng câu trả lời thất bại',
                                    }
                                );
                            }}
                            disabled={isSubmitting || (!newAnswer.trim() && !files.length && !existImages?.length)}
                        >
                            <span>{isUpdateAnswer ? "Update Answer" : "Post Reply"}</span>
                            <Send className="h-4 w-4" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}