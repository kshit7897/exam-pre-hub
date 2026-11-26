import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About · StudyHub",
};

export default function About() {
  return (
    <div className="mx-auto max-w-xl space-y-4">
      <h1 className="text-3xl font-bold tracking-tight">About</h1>
      <p className="text-[var(--muted)]">
        StudyHub is a subject-wise study app. It has unit notes, original slide pages, MCQ and short-answer
        practice, and a mock exam that follows the university pattern (30 MCQ x 1 mark + 20 short x 2 marks = 70
        marks).
      </p>
      <p>Developed by Parikshit Chauhan</p>
    </div>
  );
}
