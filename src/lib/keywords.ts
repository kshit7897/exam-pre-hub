// Simple keyword check for 1-line short answers: compares the student's text with the model answer.
const STOP = new Set([
  "that", "this", "with", "from", "into", "their", "there", "which", "what", "when", "where", "then",
  "than", "they", "them", "also", "such", "each", "only", "both", "have", "been", "being", "will",
  "would", "should", "could", "does", "done", "make", "made", "more", "most", "some", "same", "about",
  "and", "the", "for", "are", "was", "were", "has", "its", "any", "two", "one", "four", "three",
  "give", "name", "state", "write", "explain", "define", "differentiate", "between", "using",
]);

export function keywordsOf(answer: string): string[] {
  const words = answer
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length >= 3 && !STOP.has(w));
  return Array.from(new Set(words));
}

export function matchKeywords(student: string, answer: string) {
  const keys = keywordsOf(answer);
  const text = student.toLowerCase();
  const matched = keys.filter((k) => text.includes(k));
  const missing = keys.filter((k) => !text.includes(k));
  return { total: keys.length, matched, missing };
}
