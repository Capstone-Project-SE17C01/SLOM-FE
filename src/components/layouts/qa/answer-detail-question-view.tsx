import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { AnswerDetailQuestionViewProps, AnswerResponseDTO } from "@/types/IQa";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { CircleEllipsis, SquarePen, OctagonX } from "lucide-react";
import { useDeleteAnswerMutation } from "@/api/QaApi";
import { cn } from "@/utils/cn";
import Image from "next/image";
import { useState } from "react";


export default function AnswerDetailQuestionView({ specificThread, userInfo, questionOwner, setIsResponseQuestion, setIsUpdateAnswer, setAnswer }: Readonly<AnswerDetailQuestionViewProps>) {
    const [fullScreenImageIndex, setFullScreenImageIndex] = useState<number>(0);
    const [theElement, setTheElement] = useState<AnswerResponseDTO | undefined>();
    const [deleteAnswer] = useDeleteAnswerMutation();

    const handleImageClick = (imgIndex: number) => {
        setFullScreenImageIndex(imgIndex);
    };

    const closeFullScreen = () => {
        setFullScreenImageIndex(0);
        setTheElement(undefined)
    };

    const goToPreviousImage = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.stopPropagation();
        if (fullScreenImageIndex > 0) {
            setFullScreenImageIndex(fullScreenImageIndex - 1);
        } else {
            if (theElement != null)
                setFullScreenImageIndex(theElement.images.length - 1);
        }
    };

    const goToNextImage = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.stopPropagation();
        if (theElement != null) {
            if (fullScreenImageIndex < theElement.images.length - 1) {
                setFullScreenImageIndex(fullScreenImageIndex + 1);
            } else {
                setFullScreenImageIndex(0);
            }
        }
    };

    const currentFullScreenImageSrc =
        fullScreenImageIndex !== null && theElement != null ? theElement.images[fullScreenImageIndex] : null;

    const canEditDelete = (answerElement: AnswerResponseDTO) => {
        const isAuthor = answerElement.author.username === userInfo?.username;
        const isAdmin = userInfo?.role === "1803f630-a383-48fb-9a95-c192eba772db";
        const isQuestionOwner = userInfo?.username === questionOwner;

        return isAuthor || isAdmin || isQuestionOwner;
    };

    const handleEditAnswer = (answer: AnswerResponseDTO) => {
        if (setAnswer && setIsUpdateAnswer && setIsResponseQuestion) {
            setAnswer(answer);
            setIsUpdateAnswer(true);
            setIsResponseQuestion(true);
        }
    };

    const handleDeleteAnswer = async (answerId: string, e: React.MouseEvent) => {
        e.stopPropagation();
        if (window.confirm("Bạn có chắc chắn muốn xóa câu trả lời này?")) {
            try {
                await deleteAnswer(answerId).unwrap();
            } catch (error) {
                console.error("Error deleting answer:", error);
            }
        }
    };

    return (
        <div>
            {(specificThread != null && specificThread != undefined) && specificThread.map((ele, index, array) => {
                return (
                    <div key={ele.answerId} className={(index === array.length - 1 ? '' : 'border-b') + ` py-4 px-4 w-full`}>
                        <div className="flex w-full">
                            <div className="mr-2">
                                <Avatar>
                                    <AvatarImage
                                        src={ele.author.profileImage}
                                        alt={`${ele.author.username}`}
                                    />
                                    <AvatarFallback>{ele.author.username}</AvatarFallback>
                                </Avatar>
                            </div>
                            <div className="w-[93%]">
                                <div className="flex justify-between items-center">
                                    <div className="font-bold">
                                        {ele.author.username}
                                    </div>
                                    {canEditDelete(ele) && (
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <button
                                                    className={cn(
                                                        "flex items-center justify-center rounded-full overflow-hidden",
                                                        "h-8 w-8 text-gray-500 hover:bg-gray-100 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary"
                                                    )}
                                                    onClick={(e) => e.stopPropagation()}
                                                >
                                                    <CircleEllipsis className="h-5 w-5" />
                                                </button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end" className="w-48">
                                                {userInfo?.role == "1803f630-a383-48fb-9a95-c192eba772db" &&
                                                    (<button className="w-full" onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleEditAnswer(ele);
                                                    }}>
                                                        <DropdownMenuItem className="cursor-pointer">
                                                            <SquarePen className="mr-2 h-4 w-4" />
                                                            <span>Edit Answer</span>
                                                        </DropdownMenuItem>
                                                    </button>)
                                                }
                                                <button
                                                    className="w-full"
                                                    onClick={(e) => handleDeleteAnswer(ele.answerId, e)}
                                                >
                                                    <DropdownMenuItem className="cursor-pointer text-red-600 hover:text-red-700 focus:text-red-700">
                                                        <OctagonX className="mr-2 h-4 w-4" />
                                                        <span>Delete Answer</span>
                                                    </DropdownMenuItem>
                                                </button>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    )}
                                </div>
                                <div>{ele.content}</div>
                                <div className="relative w-full overflow-x-auto">
                                    <div className="flex">
                                        {ele.images.map((image, imgIndex) => (
                                            <div
                                                key={imgIndex}
                                                className="min-w-[50%] px-1 cursor-pointer"
                                            >
                                                <Image
                                                    src={image}
                                                    alt={`image-${imgIndex}`}
                                                    height={0}
                                                    width={0}
                                                    sizes="50vw"
                                                    className="w-full h-[20vh] object-cover rounded-xl"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleImageClick(imgIndex);
                                                        setTheElement(ele)
                                                    }}
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                        {currentFullScreenImageSrc && (
                            <div
                                className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
                                onClick={closeFullScreen}
                            >
                                {/* Previous Button */}
                                <button
                                    className="absolute left-4 h-10 w-10 bg-white bg-opacity-25 rounded-full text-white text-center text-2xl z-50 hover:bg-opacity-50 transition-all duration-200 flex items-center justify-center"
                                    onClick={goToPreviousImage}
                                    aria-label="Previous image"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
                                    </svg>
                                </button>

                                <div className="relative w-[80%] max-h-[90%]">
                                    <Image
                                        src={currentFullScreenImageSrc}
                                        alt="Full screen"
                                        fill
                                        className="object-contain"
                                        sizes="80vw"
                                    />
                                </div>

                                {/* Next Button */}
                                <button
                                    className="absolute right-4 h-10 w-10 bg-white bg-opacity-25 rounded-full text-white text-2xl z-50 hover:bg-opacity-50 transition-all duration-200 flex items-center justify-center"
                                    onClick={goToNextImage}
                                    aria-label="Next image"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                                    </svg>
                                </button>
                            </div>
                        )}
                    </div>
                )
            })}
        </div>
    )
}