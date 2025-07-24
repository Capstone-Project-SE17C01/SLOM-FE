"use client"
import DetailQuestionView from "@/components/layouts/qa/detail-question-view";
import NewAnswer from "@/components/layouts/qa/new-answer";
import NewQuestion from "@/components/layouts/qa/new-question";
import NewQuestionPopup from "@/components/layouts/qa/new-question-pop-up";
import QuestionsView from "@/components/layouts/qa/questions-view";
import { RootState } from "@/middleware/store";
import { AnswerResponseDTO, NewAnswerAmount, QuestionResponseDTO, ScrollPosition } from "@/types/IQa";
import { useState } from "react";
import { useSelector } from "react-redux";

export default function QAPage() {
    const [isSpecifiedPage, setIsSpecifiedPage] = useState(false);
    const [isNewQuestion, setIsNewQuestion] = useState(false);
    const [isResponseQuestion, setIsResponseQuestion] = useState(false);
    const [detailQuestion, setDetailQuestion] = useState<QuestionResponseDTO>();
    const { userInfo } = useSelector((state: RootState) => state.auth);
    const [allQuestion, setAllQuestion] = useState<QuestionResponseDTO[] | null | undefined>([]);
    const [isLoadFull, setIsLoadFull] = useState<boolean>(false);
    const [savedScrollPosition, setSavedScrollPosition] = useState<ScrollPosition | null>(null);
    const [answersOfQuestion, setAnswerOfQuestion] = useState<AnswerResponseDTO[] | undefined | null>([]);
    const [newAnswerAmount, setNewAnswerAmount] = useState<NewAnswerAmount[]>([])

    return (
        <div className="relative">
            {isNewQuestion ? <NewQuestionPopup userInfo={userInfo} setIsNewQuestion={setIsNewQuestion} /> : <div></div>}

            {isResponseQuestion ?
                <div>
                    <NewAnswer userInfo={userInfo} setIsResponseQuestion={setIsResponseQuestion} question={detailQuestion} setAnswerOfQuestion={setAnswerOfQuestion} setNewAnswerAmount={setNewAnswerAmount} newAnswerAmount={newAnswerAmount} />
                </div> : <div></div>}

            {!isSpecifiedPage ? (
                <div>
                    <NewQuestion setIsNewQuestion={setIsNewQuestion} userInfo={userInfo} />
                    <QuestionsView setIsResponseQuestion={setIsResponseQuestion} userInfo={userInfo}
                    setIsSpecifiedPage={setIsSpecifiedPage} setDetailQuestion={setDetailQuestion}
                    allQuestion={allQuestion} setAllQuestion={setAllQuestion} isLoadFull={isLoadFull}
                    setIsLoadFull={setIsLoadFull} setSavedScrollPosition={setSavedScrollPosition} 
                    savedScrollPosition={savedScrollPosition} />
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
        </div >
    )
}
