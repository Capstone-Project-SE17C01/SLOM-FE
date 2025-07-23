import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Image from "next/image";
import { QuestionResponseDTO, QuestionViewProps } from "../types";
import { useGetQuestionMutation } from "../api";
import { useEffect, useState } from "react";

export default function QuestionView({ setIsResponseQuestion, setIsSpecifiedPage, setDetailQuestion }: Readonly<QuestionViewProps>) {
    const [getQuestionApi] = useGetQuestionMutation();
    const [questionPagination, setPagination] = useState<number>(1);
    const [allQuestion, setAllQuestion] = useState<QuestionResponseDTO[] | null | undefined>([]);
    
    // State to prevent multiple fetches and to know when all data is loaded
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isLoadFull, setIsLoadFull] = useState<boolean>(false);

    // Effect for fetching data when pagination changes
    useEffect(() => {
        // Don't fetch if all questions are already loaded
        if (isLoadFull) return;

        setIsLoading(true);
        getQuestionApi(questionPagination).then(res => {
            const newQuestions = res.data?.result;
            
            if (newQuestions && newQuestions.length > 0) {
                // Append the newly fetched questions to the existing list
                setAllQuestion(prevQuestions => [...(prevQuestions || []), ...newQuestions]);
            } else {
                // If the API returns no questions, we've reached the end
                setIsLoadFull(true);
            }

            setIsLoading(false);
        }).catch(error => {
            console.error("Failed to fetch questions:", error);
            setIsLoading(false);
        });
    }, [getQuestionApi, questionPagination]); // Dependency array ensures this runs when page number changes

    // Effect for handling the scroll event, similar to your example
    useEffect(() => {
        const handleScroll = () => {
            // Check if user has scrolled to the bottom of the page
            // The '- 100' provides a buffer, so the load triggers slightly before the absolute bottom
            const isAtBottom = window.innerHeight + document.documentElement.scrollTop >= document.documentElement.offsetHeight - 100;

            // If at the bottom, not currently loading, and not all data is loaded yet, fetch the next page
            if (isAtBottom && !isLoading && !isLoadFull) {
                setPagination(prevPage => prevPage + 1);
            }
        };

        // Add the scroll event listener to the window
        window.addEventListener('scroll', handleScroll);

        // Cleanup: Remove the event listener when the component unmounts
        return () => window.removeEventListener('scroll', handleScroll);
    }, [isLoading, isLoadFull]); // Dependencies ensure the listener has the latest state values


    return (
        <div>
            {allQuestion != undefined && allQuestion.map((element, index) => {
                return (
                    <div key={`${element.questionId}-${index}`} className={(index === allQuestion.length - 1 ? "" : "border-b ") + " py-4 px-4 w-full"}>
                        <div role="button" onClick={() => {
                            setIsSpecifiedPage(true);
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
                                        {element.images.map((image, imgIndex) => (
                                            <div key={imgIndex} className="min-w-[45%] mr-2">
                                                <Image
                                                    src={image}
                                                    alt={`image-${imgIndex}`}
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
                                    e.stopPropagation();
                                    setIsResponseQuestion(true);
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
            {/* Optional: Show a loading indicator to the user */}
            {isLoading && <div className="text-center p-4">Loading more...</div>}
            {/* Optional: Show a message when all questions have been loaded */}
            {isLoadFull && <div className="text-center p-4 text-gray-500">You`ve reached the end.</div>}
        </div>
    );
}