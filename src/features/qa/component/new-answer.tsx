import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { NewAnswerProps } from "../types";
import { useState, useRef } from "react";
import QuestionNewAnswer from "./question-new-answer";

export default function NewAnswer({ userInfo, setIsResponseQuestion }: Readonly<NewAnswerProps>) {
    const [newQuestion, setNewQuestion] = useState("");
    const textareaRef = useRef<HTMLTextAreaElement | null>(null)
    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setNewQuestion(e.target.value)
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto'   // Reset the height
            textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px` // Adjust height based on scroll height
        }
    }

    return (
        <div>
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"></div>
            <div className="fixed inset-x-0 z-50 mx-auto w-[48%] px-6 py-4 bg-white rounded-lg shadow-lg max-h-[80vh] top-[10vh] overflow-y-scroll">
                <div className="pb-3 mb-1 flex w-full justify-between border-b">
                    <button onClick={() => setIsResponseQuestion(false)}>Cancel</button>
                    <div className="font-bold">New thread</div>
                    <div></div>
                </div>

                <QuestionNewAnswer></QuestionNewAnswer>

                <div className="flex mt-2">
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
                            value={newQuestion}
                            rows={2}
                            onChange={handleChange}
                            placeholder="What's new"
                            className="w-full rounded focus:outline-none ring-0 focus:ring-0 text-sm"
                        />
                    </div>
                </div>
                <div className="flex justify-end mt-4">
                    <button className="border px-3 py-1 rounded-xl mt-1">Post</button>
                </div>
            </div>
        </div>
    )
}