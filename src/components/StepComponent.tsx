import type { StepProps } from "@/types/Quiz";

export default function StepComponent({
  step,
  questions,
  answers,
  onAnswerChange,
}: StepProps) {
  const stepQuestion = step.questions[0];
  const q = questions.find((q) => q.sysId === stepQuestion);
  if (!q) return null;

  return (
    <div>
      <p className="question-text">{q.questionText}</p>

      {q.questionType === "multiple_choice" && q.possibleAnswers && (
        <div>
          {q.possibleAnswers.map((opt) => (
            <label key={opt} className="mc-option">
              <input
                type="radio"
                name={stepQuestion}
                value={opt}
                checked={answers[stepQuestion] === opt}
                onChange={(e) => onAnswerChange(stepQuestion, e.target.value)}
              />{" "}
              {opt}
            </label>
          ))}
        </div>
      )}

      {q.questionType === "open_ended" && (
        <textarea
          rows={3}
          value={answers[stepQuestion] || ""}
          onChange={(e) => onAnswerChange(stepQuestion, e.target.value)}
        />
      )}
    </div>
  );
}
