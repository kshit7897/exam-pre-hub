"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Check, RotateCcw, Send, Timer, X } from "lucide-react";
import type { TaggedMCQ, TaggedShort } from "@/lib/types";
import { recordAnswer, shuffle } from "@/lib/storage";
import BackButton from "@/components/BackButton";
import HintBox from "@/components/HintBox";
import { AnswerInput, ShortReview } from "@/components/ShortAnswer";
import { FadeUp } from "@/components/Motion";
import ImportanceBadge from "@/components/ImportanceBadge";

type Props = {
  subjectId: string;
  subjectName: string;
  units: { id: string; title: string; color: string }[];
  mcq: TaggedMCQ[];
  short: TaggedShort[];
  mcqCount: number;
  shortCount: number;
  durationMinutes: number;
};

type Phase = "intro" | "exam" | "result";

function fmt(sec: number) {
  const m = Math.floor(sec / 60).toString().padStart(2, "0");
  const s = (sec % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

export default function MockExamClient({
  subjectId,
  subjectName,
  units,
  mcq,
  short,
  mcqCount,
  shortCount,
  durationMinutes,
}: Props) {
  const [phase, setPhase] = useState<Phase>("intro");
  const [paper, setPaper] = useState<{ mcq: TaggedMCQ[]; short: TaggedShort[] }>({ mcq: [], short: [] });
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [written, setWritten] = useState<Record<string, string>>({});
  const [selfMarks, setSelfMarks] = useState<Record<string, number>>({});
  const [hintsUsed, setHintsUsed] = useState<Record<string, boolean>>({});
  const [secondsLeft, setSecondsLeft] = useState(durationMinutes * 60);
  const [attempt, setAttempt] = useState(0);

  const totalMarks = paper.mcq.length + paper.short.length * 2;
  const unitMeta = (id: string) => units.find((u) => u.id === id);
  const colorOf = (id: string) => unitMeta(id)?.color ?? "#ea580c";
  const titleOf = (id: string) => unitMeta(id)?.title ?? id;

  function start() {
    setPaper({
      mcq: shuffle(mcq).slice(0, mcqCount),
      short: shuffle(short).slice(0, shortCount),
    });
    setAnswers({});
    setWritten({});
    setSelfMarks({});
    setHintsUsed({});
    setSecondsLeft(durationMinutes * 60);
    setAttempt((a) => a + 1);
    setPhase("exam");
  }

  const mcqScore = useMemo(
    () => paper.mcq.reduce((n, q) => n + (answers[q.id] === q.answer ? 1 : 0), 0),
    [paper, answers],
  );
  const shortScore = useMemo(
    () => paper.short.reduce((n, q) => n + (selfMarks[q.id] ?? 0), 0),
    [paper, selfMarks],
  );

  function submit() {
    paper.mcq.forEach((q) => {
      if (answers[q.id] !== undefined) recordAnswer(q.id, answers[q.id] === q.answer);
    });
    setPhase("result");
  }

  // Countdown; auto-submit when time is over.
  useEffect(() => {
    if (phase !== "exam") return;
    if (secondsLeft <= 0) {
      submit();
      return;
    }
    const id = window.setTimeout(() => setSecondsLeft((s) => s - 1), 1000);
    return () => window.clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, secondsLeft]);

  // Submit (manual or timer) switches to the result view. Bring the score into view.
  useEffect(() => {
    if (phase === "result") window.scrollTo({ top: 0, behavior: "smooth" });
  }, [phase]);

  // ---------- INTRO ----------
  if (phase === "intro") {
    return (
      <div className="space-y-6">
        <BackButton fallback={`/${subjectId}`} label={subjectName} />

        <FadeUp>
          <section className="hero p-6 sm:p-10" style={{ ["--c" as string]: "#ea580c" }}>
            <div className="relative z-10 max-w-xl">
              <div className="text-xs font-semibold uppercase tracking-widest opacity-85">Exam mode</div>
              <h1 className="mt-2 text-3xl font-bold sm:text-4xl">Mock exam</h1>
              <p className="mt-2 text-sm leading-relaxed opacity-90 sm:text-base">
                Exam jaisa paper, saare units se random questions. Real test ki tarah time par likho.
              </p>
              <div className="mt-6 grid grid-cols-3 gap-2 sm:max-w-md">
                <Stat value={mcqCount} label="MCQ · 1 mark" />
                <Stat value={shortCount} label="Short · 2 marks" />
                <Stat value={mcqCount + shortCount * 2} label="Total marks" />
              </div>
            </div>
          </section>
        </FadeUp>

        <section className="grid gap-3 sm:grid-cols-3">
          <RuleCard title="Time" text={`${durationMinutes} minute. Time khatam hone par paper apne-aap submit ho jayega.`} />
          <RuleCard title="MCQ" text="Submit ke baad apne-aap check hote hain. Har question ka hint le sakte ho." />
          <RuleCard title="Short answers" text="1 line me answer likho. Submit ke baad model answer se milao aur marks do." />
        </section>

        <button type="button" onClick={start} className="btn btn-primary focus-ring w-full !py-4 text-base sm:w-auto sm:px-10">
          Mock exam shuru karo
        </button>
      </div>
    );
  }

  // ---------- EXAM ----------
  if (phase === "exam") {
    const answered = Object.keys(answers).length + Object.values(written).filter((v) => v.trim()).length;
    const low = secondsLeft <= 300;
    return (
      <div className="space-y-6" key={attempt}>
        <div className="sticky top-[64px] z-20 -mx-1 flex items-center justify-between gap-3 rounded-2xl border border-[var(--border)] bg-[var(--card)]/95 p-3 shadow-sm backdrop-blur md:top-[72px]">
          <div className={`flex items-center gap-2 font-mono text-lg font-bold ${low ? "text-[var(--bad)]" : ""}`}>
            <Timer size={18} aria-hidden /> {fmt(secondsLeft)}
          </div>
          <span className="chip">
            Attempt {answered} / {paper.mcq.length + paper.short.length}
          </span>
          <button type="button" onClick={submit} className="btn btn-primary focus-ring !py-2 text-sm">
            <Send size={15} aria-hidden /> Submit
          </button>
        </div>

        <section className="space-y-3">
          <h2 className="text-lg font-bold">
            Part A · MCQ <span className="font-medium text-[var(--muted)]">(1 mark each)</span>
          </h2>
          <div className="grid gap-4 md:grid-cols-2">
            {paper.mcq.map((q, idx) => (
              <div key={q.id} className="card space-y-4 p-5" style={{ borderTop: `4px solid ${colorOf(q.unitId)}` }}>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="chip chip-accent">Q{idx + 1}</span>
                  <span className="chip">{titleOf(q.unitId)}</span>
                  <ImportanceBadge imp={q.imp} />
                </div>
                <p className="font-semibold leading-relaxed">{q.q}</p>
                <HintBox hint={q.hint ?? ""} onOpen={() => setHintsUsed((h) => ({ ...h, [q.id]: true }))} />
                <div className="space-y-2">
                  {q.options.map((opt, i) => {
                    const on = answers[q.id] === i;
                    return (
                      <label
                        key={i}
                        className={`focus-ring-within flex cursor-pointer items-start gap-3 rounded-xl border-2 p-3.5 text-[15px] transition-colors ${
                          on ? "border-[var(--accent)] bg-[var(--accent-soft)]" : "border-[var(--border)] hover:border-[var(--accent)]"
                        }`}
                      >
                        <input
                          type="radio"
                          name={q.id}
                          checked={on}
                          onChange={() => setAnswers((a) => ({ ...a, [q.id]: i }))}
                          className="mt-1 h-4 w-4 accent-[var(--accent)]"
                        />
                        <span className="flex-1">
                          <b className="mr-1.5 text-[var(--accent)]">{String.fromCharCode(65 + i)}.</b>
                          {opt}
                        </span>
                      </label>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold">
            Part B · Short answers <span className="font-medium text-[var(--muted)]">(2 marks each)</span>
          </h2>
          <div className="grid gap-4 md:grid-cols-2">
            {paper.short.map((q, idx) => (
              <div key={q.id} className="card space-y-4 p-5" style={{ borderTop: `4px solid ${colorOf(q.unitId)}` }}>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="chip chip-warn">Q{paper.mcq.length + idx + 1}</span>
                  <span className="chip">{titleOf(q.unitId)}</span>
                  <ImportanceBadge imp={q.imp} />
                </div>
                <p className="font-semibold leading-relaxed">{q.q}</p>
                <HintBox hint={q.hint ?? ""} onOpen={() => setHintsUsed((h) => ({ ...h, [q.id]: true }))} />
                <AnswerInput
                  id={`mock-${q.id}`}
                  value={written[q.id] ?? ""}
                  onChange={(v) => setWritten((w) => ({ ...w, [q.id]: v }))}
                />
              </div>
            ))}
          </div>
        </section>

        <button type="button" onClick={submit} className="btn btn-primary focus-ring w-full !py-4">
          <Send size={17} aria-hidden /> Paper submit karo
        </button>
      </div>
    );
  }

  // ---------- RESULT ----------
  const pct = totalMarks ? Math.round(((mcqScore + shortScore) / totalMarks) * 100) : 0;
  const verdict = pct >= 80 ? "Bahut achha" : pct >= 60 ? "Achha, aur practice karo" : "Revise karke phir try karo";

  return (
    <div className="space-y-6">
      <FadeUp>
        <section className="hero p-6 text-center sm:p-10" style={{ ["--c" as string]: "#ea580c" }}>
          <div className="relative z-10">
            <div className="text-xs font-semibold uppercase tracking-widest opacity-85">Tumhara score</div>
            <motion.div
              initial={{ scale: 0.7, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="mt-2 text-6xl font-bold sm:text-7xl"
            >
              {mcqScore + shortScore}
              <span className="text-2xl opacity-80">/{totalMarks}</span>
            </motion.div>
            <div className="mt-2 text-base font-medium">
              {pct}% · {verdict}
            </div>
            <div className="mx-auto mt-6 grid max-w-md grid-cols-2 gap-2 text-sm font-semibold">
              <div className="rounded-xl bg-white/15 py-3">
                MCQ {mcqScore} / {paper.mcq.length}
              </div>
              <div className="rounded-xl bg-white/15 py-3">
                Short {shortScore} / {paper.short.length * 2}
              </div>
            </div>
            <div className="mx-auto mt-6 grid max-w-md gap-2 sm:grid-cols-2">
              <button type="button" onClick={start} className="btn focus-ring !border-0 !bg-white !text-[#141a2e]">
                <RotateCcw size={16} aria-hidden /> Naya mock exam
              </button>
              <BackButton fallback={`/${subjectId}`} label="Subject par wapas" className="justify-center text-white/90 hover:text-white" />
            </div>
          </div>
        </section>
      </FadeUp>

      <section className="space-y-3">
        <h2 className="text-lg font-bold">MCQ review</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {paper.mcq.map((q, idx) => {
            const given = answers[q.id];
            const ok = given === q.answer;
            return (
              <div key={q.id} className="card space-y-3 p-5">
                <div className="flex items-center justify-between gap-2">
                  <span className="chip">Q{idx + 1}</span>
                  {given === undefined ? (
                    <span className="chip">Not answered</span>
                  ) : ok ? (
                    <span className="chip chip-good">
                      <Check size={13} aria-hidden /> Correct
                    </span>
                  ) : (
                    <span className="chip" style={{ background: "var(--bad-soft)", color: "var(--bad)" }}>
                      <X size={13} aria-hidden /> Wrong
                    </span>
                  )}
                </div>
                <p className="font-semibold">{q.q}</p>
                <p className="rounded-lg bg-[var(--good-soft)] p-3 text-sm">
                  <b>Answer: {String.fromCharCode(65 + q.answer)}. {q.options[q.answer]}</b>
                </p>
                <p className="text-sm text-[var(--muted)]">{q.explanation}</p>
              </div>
            );
          })}
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-bold">Short answer review</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {paper.short.map((q, idx) => (
            <div key={q.id} className="card space-y-4 p-5">
              <div className="flex flex-wrap items-center gap-2">
                <span className="chip chip-warn">Q{paper.mcq.length + idx + 1}</span>
                <span className="chip">{titleOf(q.unitId)}</span>
              </div>
              <p className="font-semibold">{q.q}</p>
              <ShortReview
                answer={q.answer}
                student={written[q.id] ?? ""}
                mark={selfMarks[q.id]}
                onMark={(m) => setSelfMarks((s) => ({ ...s, [q.id]: m }))}
              />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function Stat({ value, label }: { value: number; label: string }) {
  return (
    <div className="rounded-xl bg-white/15 px-3 py-3 text-center">
      <div className="text-3xl font-bold leading-none">{value}</div>
      <div className="mt-1.5 text-[10px] font-semibold uppercase leading-tight tracking-wide opacity-90 sm:text-[11px]">{label}</div>
    </div>
  );
}

function RuleCard({ title, text }: { title: string; text: string }) {
  return (
    <div className="card p-5">
      <div className="font-bold">{title}</div>
      <p className="mt-1 text-sm text-[var(--muted)]">{text}</p>
    </div>
  );
}
