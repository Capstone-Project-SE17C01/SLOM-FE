import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Image from "next/image";
import AnswerDetailQuestionView from "./answer-detail-question-view";
import { AnswerRequestDTO, DetailQuestionViewProps } from "@/types/IQa";
import { useGetAnswerMutation } from "../../../api/QaApi";
import { useEffect, useState } from "react";
import { ArrowLeft, MessageCircle } from "lucide-react";

export default function DetailQuestionView({ setIsResponseQuestion, setIsSpecifiedPage, question, answersOfQuestion, setAnswerOfQuestion, newAnswerAmount }: Readonly<DetailQuestionViewProps>) {
    const [getAnswerApi] = useGetAnswerMutation();
    const [pagination, setPagination] = useState<number>(1);

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isLoadFull, setIsLoadFull] = useState<boolean>(false);

    useEffect(() => {
        window.scrollTo(0, 0);
        if (isLoadFull || !question?.questionId) return;

        setIsLoading(true);
        const getAnswerRequest: AnswerRequestDTO = {
            questionId: question.questionId,
            page: pagination
        };

        getAnswerApi(getAnswerRequest).then(res => {
            const newAnswers = res.data?.result;
            if (newAnswers && newAnswers.length > 0) {
                setAnswerOfQuestion(newAnswers);
                if (newAnswers[0].isFull) {
                    setIsLoadFull(true);
                }
                setPagination(2);
            } else {
                setIsLoadFull(true);
            }
            setIsLoading(false);
        }).catch(error => {
            console.error("Failed to fetch answers:", error);
            setIsLoading(false);
        });

    }, [question?.questionId, pagination, getAnswerApi, setAnswerOfQuestion, isLoadFull]);

    useEffect(() => {
        const handleScroll = () => {
            const isAtBottom = window.innerHeight + document.documentElement.scrollTop >= document.documentElement.offsetHeight - 100;

            if (isAtBottom && !isLoading && !isLoadFull) {
                setIsLoading(true);
                if (isLoadFull || !question?.questionId) return;

                const getAnswerRequest: AnswerRequestDTO = {
                    questionId: question.questionId,
                    page: pagination
                };

                getAnswerApi(getAnswerRequest).then(res => {
                    const newAnswers = res.data?.result?.filter(answer => !answersOfQuestion?.some(element => element.answerId == answer.answerId));
                    if (newAnswers && newAnswers.length > 0) {
                        setAnswerOfQuestion(prev => [...(prev || []), ...newAnswers]);
                        if (newAnswers[0].isFull) {
                            setIsLoadFull(true);
                        } else {
                            setPagination(prevPage => prevPage + 1);
                        }
                    }
                    setIsLoading(false);
                }).catch(error => {
                    console.error("Failed to fetch answers:", error);
                    setIsLoading(false);
                });
            }
        };

        window.addEventListener('scroll', handleScroll);

        return () => window.removeEventListener('scroll', handleScroll);
    }, [answersOfQuestion, isLoadFull, isLoading, question?.questionId, pagination, getAnswerApi, setAnswerOfQuestion]);

    const totalAnswers = (question?.answerAmount ?? 0) + (newAnswerAmount ? newAnswerAmount.findLast(val => val.questionId == question?.questionId)?.amount ?? 0 : 0);

    const handleBackToQuestions = () => {
        setIsSpecifiedPage(false);
    };

    return (
        <div className="pb-8">
            <div className="sticky top-0 z-10 bg-white border-b px-4 py-3 flex items-center justify-between shadow-sm">
                <button 
                    className="flex items-center text-gray-600 hover:text-gray-900 transition-colors" 
                    onClick={handleBackToQuestions}
                >
                    <ArrowLeft className="h-5 w-5 mr-1" />
                    <span className="font-medium">Back to</span>
                </button>
                <h2 className="text-lg font-semibold">Question Details</h2>
            </div>

            <div className="py-6 px-6 border-b">
                {question && (
                    <div className="flex w-full">
                        <div className="mr-4 flex-shrink-0">
                            <Avatar className="h-12 w-12">
                                <AvatarImage
                                    src={question.author.profileImage}
                                    alt={`${question.author.username}`}
                                />
                                <AvatarFallback>{question.author.username}</AvatarFallback>
                            </Avatar>
                        </div>
                        <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                                <div className="font-bold text-lg">{question.author.username}</div>
                                <div className="text-sm text-gray-500">
                                    {new Date(question.createdAt).toLocaleDateString()}
                                </div>
                            </div>
                            <div className="text-base mb-6">{question.content}</div>
                            
                            {question.tags && question.tags.length > 0 && (
                                <div className="flex flex-wrap gap-2 mb-6">
                                    {question.tags.map((tag, tagIndex) => (
                                        <span 
                                            key={tagIndex} 
                                            className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                                        >
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            )}
                            
                            {question.images.length > 0 && (
                                <div className="relative w-full overflow-x-auto mb-6">
                                    <div className="flex space-x-4">
                                        {question.images.map((image, index) => (
                                            <div key={index} className="min-w-[200px] max-w-[320px]">
                                                <div className="relative aspect-video overflow-hidden rounded-lg border">
                                                    <Image
                                                        src={image}
                                                        alt={`image-${index}`}
                                                        fill
                                                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                                        className="object-cover"
                                                    />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                            
                            <button 
                                onClick={() => setIsResponseQuestion(true)} 
                                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors text-gray-700"
                            >
                                <MessageCircle className="h-5 w-5" />
                                <span>Reply ({totalAnswers})</span>
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {totalAnswers > 0 && (
                <div className="border-b px-6 py-4 bg-gray-50">
                    <h3 className="font-medium text-gray-700">
                        {totalAnswers} {totalAnswers === 1 ? 'Answer' : 'Answers'}
                    </h3>
                </div>
            )}

            <div className="divide-y">
                {question?.questionId && (
                    <AnswerDetailQuestionView specificThread={answersOfQuestion} />
                )}
            </div>
            
            {isLoading && (
                <div className="text-center py-6">
                    <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-solid border-primary border-r-transparent motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
                    <p className="mt-2 text-sm text-gray-500">Loading answers...</p>
                </div>
            )}
            
            {isLoadFull && totalAnswers > 0 && (
                <div className="text-center py-8 text-gray-500 border-t">No more answers.</div>
            )}

            {isLoadFull && totalAnswers === 0 && (
                <div className="text-center py-16">
                    <p className="text-gray-500 mb-2">No answers yet</p>
                    <button 
                        onClick={() => setIsResponseQuestion(true)}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full transition-colors"
                    >
                        Be the first to answer
                    </button>
                </div>
            )}
        </div>
    );
}