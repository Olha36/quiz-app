export default function isOpenAnswerCorrect(user: string, correct: string): boolean {
  if (!user || !correct) return false;

  const normalize = (text: string) =>
    text
      .toLowerCase()
      .replace(/[^\w\s]/g, "")
      .split(/\s+/)
      .filter(Boolean);

  const userWords = normalize(user);
  const correctWords = normalize(correct);

  const important = correctWords.filter((w) => w.length > 3);

  const matched = important.filter((w) => userWords.includes(w));

  const ratio = matched.length / important.length;

  return ratio >= 0.5;
}
