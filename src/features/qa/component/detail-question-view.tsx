import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Image from "next/image";
import AnswerDetailQuestionView from "./answer-detail-question-view";
import { AnswerResponseDTO, DetailQuestionViewProps } from "../types";
import { useGetAnswerMutation } from "../api";
import { useEffect, useState } from "react";

export default function DetailQuestionView({ setIsResponseQuestion, setIsSpecifiedPage, question }: Readonly<DetailQuestionViewProps>) {
    const [getAnswerApi] = useGetAnswerMutation();
    const [answersOfQuestion, setAnswerOfQuestion] = useState<AnswerResponseDTO[] | undefined | null>([])
    useEffect(() => {
        if(question?.questionId != undefined) {
            getAnswerApi(question?.questionId).then(res => { setAnswerOfQuestion(res.data?.result) });
            console.log(answersOfQuestion)
        }
    }, [])

    return (
        <div>
            <button className="ml-4 mt-3 border rounded-full px-2 py-2 hover:bg-gray-900 hover:text-white" onClick={() => { setIsSpecifiedPage(false) }}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 15 3 9m0 0 6-6M3 9h12a6 6 0 0 1 0 12h-3" />
                </svg>
            </button>
            <div className="border-b py-4 px-4 w-full">
                {(question != null ||question != undefined) &&
                (<div className="flex w-full">
                    <div className="mr-2">
                        <Avatar>
                            <AvatarImage
                                src={question.author.profileImage}
                                alt={`${question.author.username}`}
                            />
                            <AvatarFallback>{question.author.username}</AvatarFallback>
                        </Avatar>
                    </div>
                    <div className="w-[93%]">
                        <div className="font-bold">
                            {question.author.username}
                        </div>
                        <div>{question.content}</div>
                        <div className="relative w-full overflow-x-auto">
                            <div className="flex">
                                {question.images.map((image, index) => (
                                    <div key={index} style={{}} className="min-w-[45%] mr-2">
                                        <Image
                                            src={image}
                                            alt={`image-${index}`}
                                            height={0}
                                            width={0}
                                            objectFit="contain"
                                            className="w-full mr-1 rounded-xl"
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                        <button onClick={() => { setIsResponseQuestion(true);}} className="mt-1 flex hover:bg-gray-200 px-3 py-1 rounded-full">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 0 1-.923 1.785A5.969 5.969 0 0 0 6 21c1.282 0 2.47-.402 3.445-1.087.81.22 1.668.337 2.555.337Z" />
                            </svg>
                            {question.answerAmount}
                        </button>
                    </div>
                </div>
                )}
                
            </div>
            <div>
                {question?.questionId != undefined && (
                    <AnswerDetailQuestionView specificThread={answersOfQuestion}></AnswerDetailQuestionView>)
                }
            </div>
        </div>
    )
}