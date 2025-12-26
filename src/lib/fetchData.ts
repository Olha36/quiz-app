import type { Question, Step } from "@/types/Quiz";

export async function fetchData(
  setQuestions: (questions: Question[]) => void,
  setSteps: (steps: Step[]) => void
) {
  try {
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

    const fetchedQuestions: Question[] =
      data.includes?.Entry?.map(
        (entry: {
          sys: { id: string };
          fields: {
            questionText: string;
            questionType: "multiple_choice" | "open_ended";
            possibleAnswers?: {
              content: { content: { value: string }[] }[];
            };
            correctAnswer?: string;
          };
        }) => ({
          sysId: entry.sys.id,
          questionText: entry.fields.questionText,
          questionType: entry.fields.questionType,
          possibleAnswers: entry.fields.possibleAnswers
            ? entry.fields.possibleAnswers.content
                .map((c: { content: { value: string }[] }) =>
                  c.content.map((v: { value: string }) => v.value)
                )
                .flat()
            : undefined,
          correctAnswer: entry.fields.correctAnswer,
        })
      ) || [];

    const fetchedSteps: Step[] = [];
    data.items.forEach(
      (item: {
        fields: {
          id: string;
          stepOrder: number;
          questions: { sys: { id: string } }[];
        };
      }) => {
        item.fields.questions.forEach(
          (q: { sys: { id: string } }, index: number) => {
            fetchedSteps.push({
              id: `${item.fields.id}-${index}`,
              stepOrder: item.fields.stepOrder + index * 0.01,
              questions: [q.sys.id],
            });
          }
        );
      }
    );

    setQuestions(fetchedQuestions);
    setSteps(fetchedSteps);
  } catch (err) {
    console.error("Error fetching data:", err);
  }
}
