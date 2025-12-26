"use client";

import { useEffect, useState } from "react";

type Question = {
  sysId: string;
  questionText: string;
  questionType: string;
  possibleAnswers?: string;
};

type Step = {
  id: string;
  stepOrder: number;
  questions: Array<string>;
};

type AnswerMap = {
  [key: string]: string;
};

export default function Quiz() {
  const [steps, setSteps] = useState<Array<Step>>([]);
  const [questions, setQuestions] = useState<Array<Question>>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [answers, setAnswers] = useState<AnswerMap>({});
  const [submitted, setSubmitted] = useState<boolean>(false);

  useEffect(() => {
    async function fetchData() {
      const res = await fetch(
        "https://cdn.contentful.com/spaces/aiytij8vnp0s/environments/master/entries?content_type=step&order=fields.stepOrder",
        {
          headers: {
            Authorization: "Bearer tU-Hi9LxIvOmI76fSyesAnHFn1pf3PKG5PJmvyW3-Ck",
            "Content-Type": "application/json",
          },
        }
      );

      const data = await res.json();

      const fetchedSteps: Array<Step> = data.items.map(
        (item: {
          fields: {
            id: string;
            stepOrder: number;
            questions: Array<{ sys: { id: string } }>;
          };
        }) => ({
          id: item.fields.id,
          stepOrder: item.fields.stepOrder,
          questions: item.fields.questions.map((q) => q.sys.id),
        })
      );

      const fetchedQuestions: Array<Question> = data.includes.Entry.map(
        (entry: {
          sys: { id: string };
          fields: {
            questionText: string;
            questionType: string;
            possibleAnswers?: {
              content: Array<{ content: Array<{ value: string }> }>;
            };
          };
        }) => ({
          sysId: entry.sys.id,
          questionText: entry.fields.questionText,
          questionType: entry.fields.questionType,
          possibleAnswers: entry.fields.possibleAnswers
            ? entry.fields.possibleAnswers.content[0].content[0].value
            : undefined,
        })
      );

      setSteps(fetchedSteps);
      setQuestions(fetchedQuestions);
    }

    fetchData();
  }, []);

  function getQuestionBySysId(id: string): Question | undefined {
    return questions.find((q) => q.sysId === id);
  }

  if (steps.length === 0) {
    return <div>Loading...</div>;
  }

  if (submitted) {
    return (
      <div>
        <h1>Results</h1>

        {Object.keys(answers).map((qid) => (
          <p key={qid}>
            {qid}: {answers[qid]}
          </p>
        ))}
      </div>
    );
  }

  const currentStep: Step = steps[currentStepIndex];

  function handleAnswerChange(questionId: string, value: string) {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  }

  
  function handleSubmit() {
    setSubmitted(true);
  }

  return (
    <div>
      <h2>Step {currentStep.stepOrder}</h2>

      {currentStep.questions.map((qid, index) => {
        const q = getQuestionBySysId(qid);
        if (!q) return null;

        const questionNumber: number = index + 1;

        return (
          <div key={qid}>
            <p>
              {questionNumber}. {q.questionText}
            </p>

            {q.questionType === "multiple_choice" &&
              q.possibleAnswers &&
              q.possibleAnswers.split("\n").map((opt: string) => (
                <label key={opt}>
                  <div>
                    <input
                      type="radio"
                      name={qid}
                      value={opt}
                      onChange={(e) => handleAnswerChange(qid, e.target.value)}
                    />
                    {opt}
                  </div>
                </label>
              ))}

            {q.questionType === "open_ended" && (
              <textarea
                rows={3}
                value={answers[qid] || ""}
                onChange={(e) => handleAnswerChange(qid, e.target.value)}
              />
            )}
          </div>
        );
      })}

      <div>
      

        {currentStepIndex === steps.length - 1 && (
          <button onClick={handleSubmit}>Submit</button>
        )}
      </div>
    </div>
  );
}
