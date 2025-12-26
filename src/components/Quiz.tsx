"use client";

import { useEffect, useState } from "react";

type Question = {
  sysId: string;
  questionText: string;
  questionType: "multiple_choice" | "open_ended";
  possibleAnswers?: string[];
  correctAnswer?: string;
};

type Step = {
  id: string;
  stepOrder: number;
  questions: string[];
};

type AnswerMap = {
  [key: string]: string;
};

type StepProps = {
  step: Step;
  questions: Question[];
  answers: AnswerMap;
  onAnswerChange: (questionId: string, value: string) => void;
};

function StepComponent({
  step,
  questions,
  answers,
  onAnswerChange,
}: StepProps) {
  const qid = step.questions[0];
  const q = questions.find((q) => q.sysId === qid);
  if (!q) return null;

  return (
    <div>
      <p style={{ fontWeight: "bold", marginBottom: "1rem" }}>
        {q.questionText}
      </p>

      {q.questionType === "multiple_choice" && q.possibleAnswers && (
        <div>
          {q.possibleAnswers.map((opt) => (
            <label
              key={opt}
              style={{ display: "block", marginBottom: "0.5rem" }}
            >
              <input
                type="radio"
                name={qid}
                value={opt}
                checked={answers[qid] === opt}
                onChange={(e) => onAnswerChange(qid, e.target.value)}
              />{" "}
              {opt}
            </label>
          ))}
        </div>
      )}

      {q.questionType === "open_ended" && (
        <textarea
          rows={3}
          style={{ width: "100%" }}
          value={answers[qid] || ""}
          onChange={(e) => onAnswerChange(qid, e.target.value)}
        />
      )}
    </div>
  );
}

export default function Quiz() {
  const [steps, setSteps] = useState<Step[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [answers, setAnswers] = useState<AnswerMap>({});
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch(
          "https://cdn.contentful.com/spaces/aiytij8vnp0s/environments/master/entries?content_type=step&order=fields.stepOrder",
          {
            headers: {
              Authorization:
                "Bearer tU-Hi9LxIvOmI76fSyesAnHFn1pf3PKG5PJmvyW3-Ck",
              "Content-Type": "application/json",
            },
          }
        );

        const data = await res.json();

        const fetchedQuestions: Question[] =
          data.includes?.Entry?.map((entry: any) => ({
            sysId: entry.sys.id,
            questionText: entry.fields.questionText,
            questionType: entry.fields.questionType,
            possibleAnswers: entry.fields.possibleAnswers
              ? entry.fields.possibleAnswers.content
                  .map((c: any) => c.content.map((v: any) => v.value))
                  .flat()
              : undefined,
            correctAnswer: entry.fields.correctAnswer,
          })) || [];

       
        const fetchedSteps: Step[] = [];
        data.items.forEach((item: any) => {
          item.fields.questions.forEach((q: any, index: number) => {
            fetchedSteps.push({
              id: `${item.fields.id}-${index}`,
              stepOrder: item.fields.stepOrder + index * 0.01, 
              questions: [q.sys.id],
            });
          });
        });

        setQuestions(fetchedQuestions);
        setSteps(fetchedSteps);
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    }

    fetchData();
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
