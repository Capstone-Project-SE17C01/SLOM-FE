import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { AnswerDetailQuestionViewProps } from "../types";
import Image from "next/image";


export default function AnswerDetailQuestionView({ specificThread }: Readonly<AnswerDetailQuestionViewProps>) {
    return (
        <div>
            {specificThread.comments.map((ele, index, array) => {
                return (
                    <div key={ele.comment_id} className={(index === array.length - 1 ? '' : 'border-b') + ` py-4 px-4 w-full`}>
                        <div className="flex w-full">
                            <div className="mr-2">
                                <Avatar>
                                    <AvatarImage
                                        src={ele.author.profile_image}
                                        alt={`${ele.author.username}`}
                                    />
                                    <AvatarFallback>{ele.author.username}</AvatarFallback>
                                </Avatar>
                            </div>
                            <div className="w-[93%]">
                                <div className="font-bold">
                                    {ele.author.username}
                                </div>
                                <div>{ele.content}</div>
                                <div className="relative w-full overflow-x-auto">
                                    <div className="flex">
                                        {ele.images.map((image, index) => (
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
                            </div>
                        </div>
                    </div>
                )
            })}
        </div>
    )
}