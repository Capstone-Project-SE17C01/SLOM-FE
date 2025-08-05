import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { AnswerResponseDTO, NewAnswerAmount, NewAnswerProps, PostAnswerRequestDTO } from "@/types/IQa";
import { useState, useRef } from "react";
import QuestionNewAnswer from "./question-new-answer";
import UploadImage from "./upload-image";
import { uploadImageToCloudinary } from "@/services/cloudinary/config";
import { usePostAnswerMutation } from "../../../api/QaApi";
import { Send, X } from "lucide-react";

export default function NewAnswer({ userInfo, setIsResponseQuestion, question, setAnswerOfQuestion, setNewAnswerAmount, newAnswerAmount }: Readonly<NewAnswerProps>) {
    const [newAnswer, setNewAnswer] = useState("");
    const [files, setFiles] = useState<File[]>([])
    const textareaRef = useRef<HTMLTextAreaElement | null>(null)
    const [postAnswerAPI] = usePostAnswerMutation();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setNewAnswer(e.target.value)
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto'   // Reset the height
            textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`
        }
    }

    const uploadImage = async (): Promise<string[]> => {
        if (!files?.length) return [];
        const promises = files.map(f =>
            uploadImageToCloudinary(f).then(res => res.url)
        );
        const urls = await Promise.all(promises);
        return urls;
    }

    const postAnswer = async () => {
        if (!newAnswer.trim() && !files.length) return;
        
        setIsSubmitting(true);
        
        const request: PostAnswerRequestDTO = {
            creatorId: userInfo?.id,
            content: newAnswer,
            questionId: question?.questionId
        };

        try {
            if (!files?.length) {
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
                        }
                    }
                );
                setIsResponseQuestion(false);
                return;
            }

            const resUrls = await uploadImage();
            request.images = resUrls;
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
                    }
                }
            );
            setIsResponseQuestion(false);
        } catch (error) {
            console.error("Error posting answer:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div>
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40" onClick={() => setIsResponseQuestion(false)}></div>
            
            <div className="fixed inset-x-0 z-50 mx-auto w-full max-w-2xl px-4 py-6 bg-white rounded-xl shadow-xl max-h-[85vh] top-[7.5vh] overflow-y-auto">
                <div className="flex items-center justify-between pb-4 mb-4 border-b">
                    <h2 className="text-lg font-semibold text-gray-900">Reply to Question</h2>
                    <button 
                        onClick={() => setIsResponseQuestion(false)}
                        className="p-1.5 rounded-full hover:bg-gray-100 text-gray-500 hover:text-gray-700 transition-colors"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <div className="mb-6 bg-gray-50 rounded-lg p-4">
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
                            <div className="font-medium text-gray-900 mb-2">{userInfo?.username}</div>
                            <div className="border rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent">
                                <textarea
                                    ref={textareaRef}
                                    value={newAnswer}
                                    rows={3}
                                    onChange={handleChange}
                                    placeholder="Write your reply here..."
                                    className="w-full p-3 border-none focus:ring-0 text-gray-800 resize-none"
                                />
                                
                                <div className="border-t bg-gray-50 p-3">
                                    <UploadImage 
                                        setFiles={setFiles} 
                                        images={[]} 
                                        setExistImages={undefined} 
                                        existImage={undefined}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div className="flex justify-end mt-6">
                        <button 
                            className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                            onClick={postAnswer}
                            disabled={isSubmitting || (!newAnswer.trim() && !files.length)}
                        >
                            <span>Post Reply</span>
                            <Send className="h-4 w-4" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}