export type Question = {
  sysId: string;
  questionText: string;
  questionType: "multiple_choice" | "open_ended";
  possibleAnswers?: string[];
  correctAnswer?: string;
};

export type Step = {
  id: string;
  stepOrder: number;
  questions: string[];
};

export type AnswerMap = {
  [key: string]: string;
};


export type StepProps = {
  step: Step;
  questions: Question[];
  answers: AnswerMap;
  onAnswerChange: (questionId: string, value: string) => void;
};