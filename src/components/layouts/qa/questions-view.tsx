import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Image from "next/image";
import { GetQuestionRequest, QuestionResponseDTO, QuestionViewProps, ScrollPosition } from "@/types/IQa";
import { useGetQuestionMutation, useDeleteQuestionMutation } from "../../../api/QaApi";
import { useEffect, useState } from "react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { CircleEllipsis, OctagonX, SquarePen } from "lucide-react";
import { cn } from "@/utils/cn";

export default function QuestionView({ setIsResponseQuestion, setIsSpecifiedPage, setDetailQuestion, userInfo,
    isCurrentUser, setIsNewQuestion, setIsUpdateQuestion, setQuestion, isAdmin }: Readonly<QuestionViewProps>) {

    const [getQuestionApi] = useGetQuestionMutation();
    const [deleteQuestionAPI] = useDeleteQuestionMutation();
    const [questionPagination, setPagination] = useState<number>(1);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [fullScreenImageIndex, setFullScreenImageIndex] = useState<number>(0);
    const [theElement, setTheElement] = useState<QuestionResponseDTO | undefined>();
    const [lastIsCurrentUser, setLastIsCurrentUser] = useState<boolean | undefined>(false);

    const [allQuestion, setAllQuestion] = useState<QuestionResponseDTO[] | null | undefined>([]);
    const [isLoadFull, setIsLoadFull] = useState<boolean>(false);
    const [savedScrollPosition, setSavedScrollPosition] = useState<ScrollPosition | null>(null);

    useEffect(() => {
        if (savedScrollPosition != null)
            window.scrollTo(savedScrollPosition.x, savedScrollPosition.y);
    })

    useEffect(() => {
        if (isCurrentUser !== lastIsCurrentUser) {
            setIsLoadFull(false);
            setAllQuestion([]);
            setPagination(1);
            setLastIsCurrentUser(isCurrentUser);
        }

        if (isLoadFull) return;
        setIsLoading(true);
        if (!isLoadFull) {
            console.log(isAdmin)
            const request: GetQuestionRequest = {
                pageNumber: questionPagination,
                userId: userInfo?.id ?? "",
                isCurrentUser: isCurrentUser,
                isAdmin: isAdmin
            }

            getQuestionApi(request).then(res => {
                const newQuestions = res.data?.result;

                if (newQuestions && newQuestions.length > 0) {
                    setAllQuestion(prevQuestions => [...(prevQuestions || []), ...newQuestions]);
                    if (newQuestions[0].isFull) {
                        setIsLoadFull(true);
                    }
                } else {
                    setIsLoadFull(true);
                }

                setIsLoading(false);
            }).catch(error => {
                console.error("Failed to fetch questions:", error);
                setIsLoading(false);
            });
        }
    }, [getQuestionApi, questionPagination, isCurrentUser, lastIsCurrentUser]);

    useEffect(() => {
        const handleScroll = () => {
            const isAtBottom = window.innerHeight + document.documentElement.scrollTop >= document.documentElement.offsetHeight - 100;
            console.log(isLoadFull)
            if (isAtBottom && !isLoading && !isLoadFull) {
                setPagination(prevPage => prevPage + 1);
            }
        };

        window.addEventListener('scroll', handleScroll);

        return () => window.removeEventListener('scroll', handleScroll);
    }, [isLoading, isLoadFull]);

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

    const handleDeleteQuestion = async (questionId: string, e: React.MouseEvent) => {
        e.stopPropagation();
        try {
            await deleteQuestionAPI(questionId);
            // Remove the deleted question from the local state
            setAllQuestion(prevQuestions =>
                prevQuestions?.filter(q => q.questionId !== questionId) || []
            );
        } catch (error) {
            console.error("Failed to delete question:", error);
        }
    };

    return (
        <div>
            {allQuestion != undefined && allQuestion.map((element, index) => {
                return (
                    <div key={`${element.questionId}-${index}`} className={(index === allQuestion.length - 1 ? "" : "border-b ") + " py-4 px-4 w-full"}>
                        <div role="button" onClick={() => {
                            setIsSpecifiedPage(true);
                            setDetailQuestion(element);
                            setSavedScrollPosition({
                                x: window.scrollX,
                                y: window.scrollY,
                            });
                        }} className="flex w-full cursor-pointer px-5" tabIndex={0}>
                            <div className="mr-2 flex justify-center flex-shrink-0">
                                <Avatar>
                                    <AvatarImage
                                        src={element.author.profileImage}
                                        alt={`${element.author.username}`}
                                    />
                                    <AvatarFallback>{element.author.username}</AvatarFallback>
                                </Avatar>
                            </div>
                            <div className="flex-1">
                                <div className="flex justify-between">
                                    <div>
                                        <div className="font-bold">
                                            {element.author.username}
                                        </div>
                                        <div>{element.content}</div>
                                    </div>
                                    <div>
                                        {userInfo?.username == element.author.username ?
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <button
                                                        className={cn(
                                                            "flex items-center justify-center rounded-full overflow-hidden",
                                                            "h-8 w-8 mx-2 focus:outline-none focus:ring-2 focus:ring-primary"
                                                        )}
                                                    >
                                                        <CircleEllipsis />
                                                    </button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <button className="w-full" onClick={(e) => {
                                                        e.stopPropagation();
                                                        if (setIsNewQuestion && setIsUpdateQuestion && setQuestion) {
                                                            setIsNewQuestion(true);
                                                            setIsUpdateQuestion(true);
                                                            setQuestion(element)
                                                        }
                                                    }}>
                                                        <DropdownMenuItem className="cursor-pointer">
                                                            <SquarePen className="mr-2 h-4 w-4" />
                                                            <span>Edit</span>
                                                        </DropdownMenuItem>
                                                    </button>
                                                    <button className="w-full hover:!bg-red-500 hover:!text-white rounded" onClick={(e) => handleDeleteQuestion(element.questionId, e)}>
                                                        <DropdownMenuItem className="cursor-pointer hover:!bg-red-500 hover:!text-white">
                                                            <OctagonX className="mr-2 h-4 w-4" />
                                                            <span>Delete</span>
                                                        </DropdownMenuItem>
                                                    </button>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                            :
                                            <></>
                                        }

                                    </div>
                                </div>
                                <div className="relative w-full overflow-x-auto">
                                    <div className="flex">
                                        {element.images.map((image, imgIndex) => (
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
                                                        setTheElement(element)
                                                    }}
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <button className="mt-1 flex hover:bg-gray-200 px-3 py-1 rounded-full" onClick={(e) => {
                                    e.stopPropagation();
                                    setIsResponseQuestion(true);
                                    setDetailQuestion(element);
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
            {currentFullScreenImageSrc && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
                    onClick={closeFullScreen}
                >
                    <button
                        className="absolute left-4 h-10 w-10 bg-white bg-opacity-25 rounded-full text-white text-center text-2xl z-50 hover:bg-opacity-50 transition-all duration-200 flex items-center justify-center"
                        onClick={goToPreviousImage}
                        aria-label="Previous image"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
                        </svg>
                    </button>

                    <Image
                        src={currentFullScreenImageSrc}
                        alt="Full screen"
                        className="max-w-[90%] max-h-[90%] object-contain"
                        width={800}
                        height={600}
                    />

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
            {isLoading && <div className="text-center p-4">Loading more...</div>}
            {isLoadFull && <div className="text-center p-4 text-gray-500">You`ve reached the end.</div>}
        </div>
    );
}