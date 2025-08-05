"use client"
import DetailQuestionView from "@/components/layouts/qa/detail-question-view";
import NewAnswer from "@/components/layouts/qa/new-answer";
import NewQuestion from "@/components/layouts/qa/new-question";
import NewQuestionPopup from "@/components/layouts/qa/new-question-pop-up";
import QuestionTypeToggle from "@/components/layouts/qa/question-type-toggle";
import QuestionsView from "@/components/layouts/qa/questions-view";
import { RootState } from "@/redux/store";
import { AnswerResponseDTO, NewAnswerAmount, QuestionResponseDTO } from "@/types/IQa";
import { useState } from "react";
import { useSelector } from "react-redux";

export default function QAPage() {
    const [isSpecifiedPage, setIsSpecifiedPage] = useState(false);
    const [isNewQuestion, setIsNewQuestion] = useState(false);
    const [isResponseQuestion, setIsResponseQuestion] = useState(false);
    const [detailQuestion, setDetailQuestion] = useState<QuestionResponseDTO>();
    const { userInfo } = useSelector((state: RootState) => state.auth);
    const [answersOfQuestion, setAnswerOfQuestion] = useState<AnswerResponseDTO[] | undefined | null>([]);
    const [newAnswerAmount, setNewAnswerAmount] = useState<NewAnswerAmount[]>([]);
    const [isUpdateQuestion, setIsUpdateQuestion] = useState<boolean>(false);
    const [question, setQuestion] = useState<QuestionResponseDTO | undefined>();
    const [showCurrentUserQuestions, setShowCurrentUserQuestions] = useState<boolean>(false);

    return (
        <>
            <div className="mb-6">
                <h1 className="text-2xl font-bold mb-2">Community Q&A</h1>
                <p className="text-gray-600 mb-6">
                    Ask questions, get answers, and share knowledge with the community
                </p>
                
                <QuestionTypeToggle 
                    isCurrentUser={showCurrentUserQuestions}
                    onToggle={(isCurrentUser) => setShowCurrentUserQuestions(isCurrentUser)}
                />
            </div>

            {isNewQuestion && (
                <NewQuestionPopup 
                    userInfo={userInfo} 
                    setIsNewQuestion={setIsNewQuestion} 
                    isUpdateQuestion={isUpdateQuestion} 
                    question={question} 
                    setIsUpdateQuestion={setIsUpdateQuestion} 
                    setQuestion={setQuestion}
                />
            )}

            {isResponseQuestion && (
                <NewAnswer 
                    userInfo={userInfo} 
                    setIsResponseQuestion={setIsResponseQuestion} 
                    question={detailQuestion} 
                    setAnswerOfQuestion={setAnswerOfQuestion} 
                    setNewAnswerAmount={setNewAnswerAmount} 
                    newAnswerAmount={newAnswerAmount}
                />
            )}

            {!isSpecifiedPage ? (
                <>
                    <NewQuestion setIsNewQuestion={setIsNewQuestion} userInfo={userInfo} />
                    <QuestionsView 
                        setIsResponseQuestion={setIsResponseQuestion} 
                        userInfo={userInfo}
                        setIsSpecifiedPage={setIsSpecifiedPage} 
                        setDetailQuestion={setDetailQuestion}
                        isCurrentUser={showCurrentUserQuestions} 
                        setIsNewQuestion={setIsNewQuestion} 
                        setIsUpdateQuestion={setIsUpdateQuestion} 
                        setQuestion={setQuestion}
                    />
                </>
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
        </>
    );
}
