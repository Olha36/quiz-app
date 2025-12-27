import type { Question, AnswerMap, Step } from "@/types/Quiz";
import isOpenAnswerCorrect from "@/lib/quizUtils";

import ResultsChart from "./ResultsChart";

type Props = {
  steps: Step[];
  questions: Question[];
  answers: AnswerMap;
};

export default function QuizResults({ steps, questions, answers }: Props) {
  const orderedQuestions: Question[] = steps
    .map((step) => {
      const qid = step.questions[0];
      return questions.find((q) => q.sysId === qid);
    })
    .filter(Boolean) as Question[];

  const totalQuestions = orderedQuestions.length;

  const correctCount = orderedQuestions.filter((q) => {
    const userAnswer = answers[q.sysId]?.trim();
    if (!userAnswer) return false;

    if (q.questionType === "multiple_choice") {
      const u = userAnswer.trim().charAt(0).toUpperCase();
      const c = q.correctAnswer?.trim().charAt(0).toUpperCase();
      return u === c;
    }

    if (q.questionType === "open_ended" && q.correctAnswer) {
      return isOpenAnswerCorrect(userAnswer, q.correctAnswer);
    }

    return false;
  }).length;

  const percentage = ((correctCount / totalQuestions) * 100).toFixed(1);

  return (
    <div className="results-container">
      <h1>Quiz Results</h1>
      <p className="summary">
        You answered {correctCount} out of {totalQuestions} questions correctly
        ({percentage}%)
      </p>

      <ul className="results-list">
        {orderedQuestions.map((q, index) => {
          const userAnswer = answers[q.sysId] || "No answer";
          const isCorrect =
            q.questionType === "multiple_choice"
              ? userAnswer.trim().charAt(0).toUpperCase() ===
                q.correctAnswer?.trim().charAt(0).toUpperCase()
              : q.correctAnswer
              ? isOpenAnswerCorrect(userAnswer, q.correctAnswer)
              : false;

          return (
            <li
              key={q.sysId}
              className={`result-item ${isCorrect ? "correct" : "incorrect"}`}
            >
              <strong>
                {index + 1}. {q.questionText}
              </strong>

              <span className="user-answer">
                Your answer: {userAnswer}{" "}
                <span className="status">{isCorrect ? "✅" : "❌"}</span>
              </span>

              {q.correctAnswer && (
                <span className="correct-answer">
                  Correct answer: {q.correctAnswer}
                </span>
              )}
              {q.explanation && (
                <span className="explanation">
                  Explanation: {q.explanation}
                </span>
              )}
            </li>
          );
        })}
      </ul>

      <ResultsChart
        correctCount={correctCount}
        totalQuestions={totalQuestions}
      />
    </div>
  );
}
