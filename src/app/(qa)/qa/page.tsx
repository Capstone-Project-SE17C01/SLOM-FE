"use client"
import { useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import NewQuestionPopup from "@/features/qa/component/new-question-pop-up";
import NewAnswer from "@/features/qa/component/new-answer";
import QuestionsView from "@/features/qa/component/questions-view";
import DetailQuestionView from "@/features/qa/component/detail-question-view";
import NewQuestion from "@/features/qa/component/new-question";
import { QuestionResponseDTO } from "@/features/qa/types";

export default function QAPage() {
    const [isSpecifiedPage, setIsSpecifiedPage] = useState(false);
    const [isNewQuestion, setIsNewQuestion] = useState(false);
    const [isResponseQuestion, setIsResponseQuestion] = useState(false);
    const [detailQuestion, setDetailQuestion] = useState<QuestionResponseDTO>();
    const [responseQuestionId, setResponseQuestionId] = useState("");
    const { userInfo } = useSelector((state: RootState) => state.auth);

    return (
        <div className="relative">
            {isNewQuestion ? <NewQuestionPopup userInfo={userInfo} setIsNewQuestion={setIsNewQuestion} /> : <div></div>}

            {isResponseQuestion ?
                <div>
                    <NewAnswer userInfo={userInfo} setIsResponseQuestion={setIsResponseQuestion} question={detailQuestion} />
                </div> : <div></div>}

            {!isSpecifiedPage ? (
                <div>
                    <NewQuestion setIsNewQuestion={setIsNewQuestion} userInfo={userInfo} />
                    <QuestionsView setIsResponseQuestion={setIsResponseQuestion} userInfo={userInfo} setIsSpecifiedPage={setIsSpecifiedPage} setResponseQuestionId={setResponseQuestionId} setDetailQuestion={setDetailQuestion} />
                </div>
            ) :
                (
                    <div>
                        <DetailQuestionView question={detailQuestion} setIsResponseQuestion={setIsResponseQuestion} setIsSpecifiedPage={setIsSpecifiedPage} setResponseQuestionId={setResponseQuestionId}  />
                    </div>
                )
            }
        </div >
    )
}
