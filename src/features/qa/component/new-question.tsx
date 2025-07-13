import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { NewQuestionProps } from "../types";

export default function NewQuestion({ userInfo, setIsNewQuestion }: Readonly<NewQuestionProps>) {
    return (
        <div className="border-b py-4 px-4 w-full flex">
            <div className="mr-2">
                <Avatar>
                    <AvatarImage
                        src={userInfo?.avatarUrl}
                        alt={`${userInfo?.username}`}
                    />
                    <AvatarFallback>{userInfo?.username}</AvatarFallback>
                </Avatar>
            </div>
            <button className="w-[80%] cursor-text text-slate-500" onClick={() => setIsNewQuestion(true)}>
                <div className="text-left">{"What's you question"}</div>
            </button>
            <button className="font-semibold px-5 py-2 border rounded-xl" onClick={() => setIsNewQuestion(true)}>
                Post
            </button>
        </div>)
}