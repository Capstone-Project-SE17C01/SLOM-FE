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
    const [newAnswerAmount, setNewAnswerAmount] = useState<NewAnswerAmount[]>([])
    const [showCurrentUserQuestions, setShowCurrentUserQuestions] = useState<boolean>(false);
    // const [isAdmin, setIsAdmin] = useState<boolean>(false);

    return (
        <div className="relative mt-16">
            <QuestionTypeToggle isCurrentUser={showCurrentUserQuestions}
                onToggle={(isCurrentUser) => setShowCurrentUserQuestions(isCurrentUser)}
                isAdmin={true} />

            {isResponseQuestion ?
                <div>
                    <NewAnswer userInfo={userInfo} setIsResponseQuestion={setIsResponseQuestion} question={detailQuestion} setAnswerOfQuestion={setAnswerOfQuestion} setNewAnswerAmount={setNewAnswerAmount} newAnswerAmount={newAnswerAmount} />
                </div> : <div></div>}

            {!isSpecifiedPage ? (
                <div>
                    <QuestionsView setIsResponseQuestion={setIsResponseQuestion} userInfo={userInfo}
                        setIsSpecifiedPage={setIsSpecifiedPage} setDetailQuestion={setDetailQuestion}
                        isCurrentUser={showCurrentUserQuestions} isAdmin={true} />
                </div>
            ) :
                (
                    <div>
                        <DetailQuestionView question={detailQuestion} setIsResponseQuestion={setIsResponseQuestion}
                            setIsSpecifiedPage={setIsSpecifiedPage} answersOfQuestion={answersOfQuestion}
                            setAnswerOfQuestion={setAnswerOfQuestion} newAnswerAmount={newAnswerAmount} />
                    </div>
                )
            }
        </div>
    )
}
