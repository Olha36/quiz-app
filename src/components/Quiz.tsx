"use client";

import { useEffect, useState } from "react";
import StepComponent from "./StepComponent";
import type { Question, Step, AnswerMap } from "@/types/Quiz";
import { fetchData } from "@/lib/fetchData";
import isOpenAnswerCorrect from "@/lib/quizUtils";
import "../styles/quiz.css";

export default function Quiz() {
  const [steps, setSteps] = useState<Step[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [answers, setAnswers] = useState<AnswerMap>({});
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    fetchData(setQuestions, setSteps);
  }, []);

  function handleAnswerChange(questionId: string, value: string) {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
    setError("");
  }

  function validateCurrentStep(): boolean {
    const currentStep = steps[currentStepIndex];
    const qid = currentStep.questions[0];
    if (!answers[qid] || answers[qid].trim() === "") {
      setError("Please answer the question before continuing.");
      return false;
    }
    return true;
  }

  function handleNext() {
    if (!validateCurrentStep()) return;
    setCurrentStepIndex((prev) => Math.min(prev + 1, steps.length - 1));
  }

  function handlePrevious() {
    setCurrentStepIndex((prev) => Math.max(prev - 1, 0));
  }

  async function handleSubmit() {
    if (!validateCurrentStep()) return;

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
        return (
          userAnswer.trim().charAt(0).toUpperCase() ===
          q.correctAnswer?.trim().charAt(0).toUpperCase()
        );
      }

      if (q.questionType === "open_ended" && q.correctAnswer) {
        return isOpenAnswerCorrect(userAnswer, q.correctAnswer);
      }

      return false;
    }).length;

    const percentage = Number(
      ((correctCount / totalQuestions) * 100).toFixed(1)
    );

    // ✅ send to Algolia API
    await fetch("/api/quiz-results", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        answers,
        correctCount,
        totalQuestions,
        percentage,
      }),
    });

    setSubmitted(true);
  }

  if (steps.length === 0) return <div>Loading quiz...</div>;

  if (submitted) {
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
          You answered {correctCount} out of {totalQuestions} questions
          correctly ({percentage}%)
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
      </div>
    );
  }

  const currentStep = steps[currentStepIndex];
  const qid = currentStep.questions[0];
  const allAnswered = answers[qid]?.trim() !== "";

  return (
    <div className="quiz-container">
      <h1>Quiz</h1>
      <div className="progress-wrapper">
        <div className="progress-bar">
          <div
            className="progress-bar-fill"
            style={{
              width: `${((currentStepIndex + 1) / steps.length) * 100}%`,
            }}
          ></div>
        </div>
        <p
          style={{
            textAlign: "right",
            fontSize: "0.9rem",
            margin: "0.25rem 0 0 0",
          }}
        >
          Step {currentStepIndex + 1} of {steps.length}
        </p>
      </div>

      <StepComponent
        step={currentStep}
        questions={questions}
        answers={answers}
        onAnswerChange={handleAnswerChange}
      />

      {error && <p style={{ color: "red" }}>{error}</p>}

      <div style={{ marginTop: "1.5rem" }}>
        {currentStepIndex > 0 && (
          <button onClick={handlePrevious} style={{ marginRight: "0.5rem" }}>
            Previous
          </button>
        )}

        {currentStepIndex < steps.length - 1 && (
          <button onClick={handleNext} disabled={!allAnswered}>
            Next
          </button>
        )}

        {currentStepIndex === steps.length - 1 && (
          <button onClick={handleSubmit} disabled={!allAnswered}>
            Submit
          </button>
        )}
      </div>
    </div>
  );
}
