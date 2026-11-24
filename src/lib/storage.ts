// Per-device progress saved in the browser. Every access is wrapped in try/catch,
// so the app still works in private windows or when storage is blocked.

export type QuestionStat = { seen: number; correct: number };
export type ProgressMap = Record<string, QuestionStat>;

const KEY = "studyhub:progress:v1";

export function loadProgress(): ProgressMap {
  try {
    const raw = window.localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as ProgressMap) : {};
  } catch {
    return {};
  }
}

export function recordAnswer(questionId: string, correct: boolean) {
  try {
    const all = loadProgress();
    const cur = all[questionId] ?? { seen: 0, correct: 0 };
    all[questionId] = {
      seen: cur.seen + 1,
      correct: cur.correct + (correct ? 1 : 0),
    };
    window.localStorage.setItem(KEY, JSON.stringify(all));
  } catch {
    // storage unavailable: progress is simply not saved
  }
}

export function resetProgress() {
  try {
    window.localStorage.removeItem(KEY);
  } catch {
    // ignore
  }
}

// Shuffle helper (Fisher-Yates) returning a new array.
export function shuffle<T>(items: T[]): T[] {
  const arr = [...items];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}
