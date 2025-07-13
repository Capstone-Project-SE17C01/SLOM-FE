import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Image from "next/image";
import { QuestionNewAnswerProps } from "../types";

export default function QuestionNewAnswer({question} : QuestionNewAnswerProps) {

    return (
        question != undefined && 
        <div key={question.questionId} className="border-b py-4 px-4 w-full">
            <div className="flex w-full cursor-pointer">
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
                </div>
            </div>
        </div>
    )
}