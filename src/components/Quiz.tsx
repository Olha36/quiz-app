"use client";

import { useEffect, useState } from "react";
import StepComponent from "./StepComponent";
import type { Question, Step, AnswerMap } from "@/types/Quiz";
import { fetchData } from "@/lib/fetchData";

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

  function handleSubmit() {
    if (!validateCurrentStep()) return;
    setSubmitted(true);
  }

  if (steps.length === 0) return <div>Loading quiz...</div>;

  if (submitted) {
    const totalQuestions = questions.length;
    const correctCount = questions.filter(
      (q) => q.correctAnswer && answers[q.sysId] === q.correctAnswer
    ).length;
    const percentage = ((correctCount / totalQuestions) * 100).toFixed(1);

    return (
      <div>
        <h1>Quiz Results</h1>
        <p>
          You answered {correctCount} out of {totalQuestions} questions
          correctly ({percentage}%)
        </p>

        <ul>
          {questions.map((q) => (
            <li key={q.sysId} style={{ marginBottom: "1rem" }}>
              <strong>{q.questionText}</strong>
              <br />
              Your answer: {answers[q.sysId] || "No answer"}
              {q.correctAnswer && (
                <>
                  <br />
                  Correct answer: {q.correctAnswer}
                </>
              )}
            </li>
          ))}
        </ul>
      </div>
    );
  }

  const currentStep = steps[currentStepIndex];
  const qid = currentStep.questions[0];
  const allAnswered = answers[qid]?.trim() !== "";

  return (
    <div style={{ maxWidth: "600px", margin: "2rem auto" }}>
      <h1>Quiz</h1>
      <p>
        Step {currentStepIndex + 1} of {steps.length}
      </p>

      <StepComponent
        step={currentStep}
        questions={questions}
        answers={answers}
        onAnswerChange={handleAnswerChange}
      />

      {error && <p style={{ color: "red" }}>{error}</p>}

      <div style={{ marginTop: "1rem" }}>
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
