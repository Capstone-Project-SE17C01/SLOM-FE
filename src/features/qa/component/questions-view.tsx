import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Image from "next/image";
import { QuestionResponseDTO, QuestionViewProps } from "../types";
import { useGetQuestionMutation } from "../api";
import { useEffect, useState } from "react";

export default function QuestionView({ setIsResponseQuestion, setIsSpecifiedPage, setResponseQuestionId, setDetailQuestion }: Readonly<QuestionViewProps>) {
    const [getQuestionApi] = useGetQuestionMutation();
    const [allQuestion, setAllQuestion] = useState<QuestionResponseDTO[] | null | undefined>([])
    useEffect(() => {
        getQuestionApi(1).then(res => {setAllQuestion(res.data?.result); console.log(res.data?.result) });
    }, [])

    return (<div>
        {allQuestion != undefined && allQuestion.map((element, index) => {
            return (
                <div key={element.questionId} className={(index == allQuestion.length - 1 ? " " : "border-b ") + " py-4 px-4 w-full"}>
                    <div role="button" onClick={() => {
                        setIsSpecifiedPage(true) 
                        setDetailQuestion(element);
                    }} className="flex w-full cursor-pointer" tabIndex={0}>
                        <div className="mr-2">
                            <Avatar>
                                <AvatarImage
                                    src={element.author.profileImage}
                                    alt={`${element.author.username}`}
                                />
                                <AvatarFallback>{element.author.username}</AvatarFallback>
                            </Avatar>
                        </div>
                        <div className="w-[93%]">
                            <div className="font-bold">
                                {element.author.username}
                            </div>
                            <div>{element.content}</div>
                            <div className="relative w-full overflow-x-auto">
                                <div className="flex">
                                    {element.images.map((image, index) => (
                                        <div key={index} className="min-w-[45%] mr-2">
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
                            <button className="mt-1 flex hover:bg-gray-200 px-3 py-1 rounded-full" onClick={(e) => {
                                e.stopPropagation()
                                setIsResponseQuestion(true)
                                setResponseQuestionId(element.questionId);
                            }}>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 0 1-.923 1.785A5.969 5.969 0 0 0 6 21c1.282 0 2.47-.402 3.445-1.087.81.22 1.668.337 2.555.337Z" />
                                </svg>
                                {element.answerAmount}
                            </button>
                        </div>
                    </div>
                </div>
            )
        })}
    </div>)
}