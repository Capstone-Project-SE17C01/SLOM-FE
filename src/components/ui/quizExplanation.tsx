import React from "react";

export default function QuizExplanation({
  explanation,
}: {
  explanation: string;
}) {
  return <div className="text-green-600 font-bold mt-4">{explanation}</div>;
}
