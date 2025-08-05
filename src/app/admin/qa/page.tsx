"use client"
import DetailQuestionView from "@/components/layouts/qa/detail-question-view";
import NewAnswer from "@/components/layouts/qa/new-answer";
import QuestionTypeToggle from "@/components/layouts/qa/question-type-toggle";
import QuestionsView from "@/components/layouts/qa/questions-view";
import { RootState } from "@/redux/store";
import { AnswerResponseDTO, NewAnswerAmount, QuestionResponseDTO } from "@/types/IQa";
import { useState } from "react";
import { useSelector } from "react-redux";

export default function QAPage() {
    const [isSpecifiedPage, setIsSpecifiedPage] = useState(false);
    const [isResponseQuestion, setIsResponseQuestion] = useState(false);
    const [detailQuestion, setDetailQuestion] = useState<QuestionResponseDTO>();
    const { userInfo } = useSelector((state: RootState) => state.auth);
    const [answersOfQuestion, setAnswerOfQuestion] = useState<AnswerResponseDTO[] | undefined | null>([]);
    const [newAnswerAmount, setNewAnswerAmount] = useState<NewAnswerAmount[]>([]);
    const [showCurrentUserQuestions, setShowCurrentUserQuestions] = useState<boolean>(false);

    return (
        <div className="relative max-w-6xl mx-auto px-6 py-8">
            <div className="mb-10 flex justify-center">
                <QuestionTypeToggle 
                    isCurrentUser={showCurrentUserQuestions}
                    onToggle={(isCurrentUser) => setShowCurrentUserQuestions(isCurrentUser)}
                    isAdmin={true}
                    className="shadow-lg"
                />
            </div>

            {isResponseQuestion && (
                <div className="mb-8">
                    <NewAnswer 
                        userInfo={userInfo} 
                        setIsResponseQuestion={setIsResponseQuestion} 
                        question={detailQuestion} 
                        setAnswerOfQuestion={setAnswerOfQuestion} 
                        setNewAnswerAmount={setNewAnswerAmount} 
                        newAnswerAmount={newAnswerAmount} 
                    />
                </div>
            )}

            <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
                {!isSpecifiedPage ? (
                    <div>
                        <div className="px-4 py-5 border-b border-gray-100 bg-gray-50">
                            <h2 className="text-xl font-semibold text-gray-800">
                                {showCurrentUserQuestions ? "Unanswered Questions" : "All Questions"}
                            </h2>
                        </div>
                        <QuestionsView 
                            setIsResponseQuestion={setIsResponseQuestion} 
                            userInfo={userInfo}
                            setIsSpecifiedPage={setIsSpecifiedPage} 
                            setDetailQuestion={setDetailQuestion}
                            isCurrentUser={showCurrentUserQuestions} 
                            isAdmin={true} 
                        />
                    </div>
                ) : (
                    <DetailQuestionView 
                        question={detailQuestion} 
                        setIsResponseQuestion={setIsResponseQuestion}
                        setIsSpecifiedPage={setIsSpecifiedPage} 
                        answersOfQuestion={answersOfQuestion}
                        setAnswerOfQuestion={setAnswerOfQuestion} 
                        newAnswerAmount={newAnswerAmount} 
                    />
                )}
            </div>
        </div>
    );
}
