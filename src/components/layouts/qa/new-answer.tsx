import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { AnswerResponseDTO, NewAnswerAmount, NewAnswerProps, PostAnswerRequestDTO } from "../../../types/IQa";
import { useState, useRef } from "react";
import QuestionNewAnswer from "./question-new-answer";
import UploadImage from "./upload-image";
import { uploadImageToCloudinary } from "@/services/cloudinary/config";
import { usePostAnswerMutation } from "../../../api/QaApi";

export default function NewAnswer({ userInfo, setIsResponseQuestion, question, setAnswerOfQuestion, setNewAnswerAmount, newAnswerAmount }: Readonly<NewAnswerProps>) {
    const [newAnswer, setNewAnswer] = useState("");
    const [files, setFiles] = useState<File[]>([])
    const textareaRef = useRef<HTMLTextAreaElement | null>(null)
    const [postAnswerAPI] = usePostAnswerMutation();

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
        const request: PostAnswerRequestDTO = {
            creatorId: userInfo?.id,
            content: newAnswer,
            questionId: question?.questionId
        };
        console.log("newAnswerQuantity")

        if (!files?.length) {
            await postAnswerAPI(request).then(
                (res) => {
                    const incomingResult = res.data?.result;
                    if (incomingResult != null) {
                        const newItems: AnswerResponseDTO[] = [incomingResult];
                        setAnswerOfQuestion((prev) => [...(newItems), ...(prev ?? [])])
                        console.log(incomingResult)
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

        console.log("newAnswerQuantity")
        const resUrls = await uploadImage();
        request.images = resUrls;
        await postAnswerAPI(request).then(
            (res) => {
                const incomingResult = res.data?.result;
                if (incomingResult != null) {
                    const newItems: AnswerResponseDTO[] = [incomingResult];
                    setAnswerOfQuestion((prev) => [...(newItems), ...(prev ?? [])])
                    console.log(incomingResult)
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
    };

    return (
        <div>
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"></div>
            <div className="fixed inset-x-0 z-50 mx-auto w-[48%] px-6 py-4 bg-white rounded-lg shadow-lg max-h-[80vh] top-[10vh] overflow-y-scroll">
                <div className="pb-3 mb-1 flex w-full justify-between border-b">
                    <button onClick={() => setIsResponseQuestion(false)}>Cancel</button>
                    <div className="font-bold">New thread</div>
                    <div></div>
                </div>

                <QuestionNewAnswer question={question}></QuestionNewAnswer>

                <div className="flex mt-2 py-4 px-4">
                    <div className="mt-1 mr-2">
                        <Avatar>
                            <AvatarImage
                                src={userInfo?.avatarUrl}
                                alt={`${userInfo?.username}`}
                            />
                            <AvatarFallback>{userInfo?.username}</AvatarFallback>
                        </Avatar>
                    </div>
                    <div className="w-[90%]">
                        <div className="font-semibold text-base">{userInfo?.username}</div>
                        <textarea
                            ref={textareaRef}
                            value={newAnswer}
                            rows={2}
                            onChange={handleChange}
                            placeholder="What's new"
                            className="w-full rounded focus:outline-none ring-0 focus:ring-0 text-sm"
                        />
                        <UploadImage setFiles={setFiles} />
                    </div>
                </div>
                <div className="flex justify-end mt-4">
                    <button className="border px-3 py-1 rounded-xl mt-1" onClick={postAnswer}>Post</button>
                </div>
            </div>
        </div>
    )
}