"use client";

import { useEffect, useState } from "react";
import StepComponent from "./StepComponent";
import type { Question, Step, AnswerMap } from "@/types/Quiz";
import { fetchData } from "@/lib/fetchData";
import isOpenAnswerCorrect from "@/lib/quizUtils";
import "../styles/quiz.css";
import QuizResults from "./QuizResults";

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
    setCurrentStepIndex((prev) => Math.min(prev + 1, steps.length - 1));
  }

  function handlePrevious() {
    setCurrentStepIndex((prev) => Math.max(prev - 1, 0));
  }

  async function handleSubmitQuiz() {
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

  async function handleFormSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!validateCurrentStep()) return;

    if (currentStepIndex < steps.length - 1) {
      handleNext();
    } else {
      await handleSubmitQuiz();
    }
  }

  if (steps.length === 0) return <div>Loading quiz...</div>;

  if (submitted) {
    return (
      <QuizResults steps={steps} questions={questions} answers={answers} />
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
        onSubmit={handleFormSubmit}
      />

      {error && <p style={{ color: "red" }}>{error}</p>}

      <div style={{ marginTop: "1.5rem" }}>
        {currentStepIndex > 0 && (
          <button
            type="button"
            onClick={handlePrevious}
            style={{ marginRight: "0.5rem" }}
          >
            Previous
          </button>
        )}

        <button type="submit" form="quiz-step-form" disabled={!allAnswered}>
          {currentStepIndex === steps.length - 1 ? "Submit" : "Next"}
        </button>
      </div>
    </div>
  );
}
