"use client";

import { useEffect, useRef, useState } from "react";
import ImportanceBadge from "@/components/ImportanceBadge";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Check, Flame, Lightbulb, RotateCcw, Shuffle, Target, X } from "lucide-react";
import type { TaggedMCQ, TaggedShort } from "@/lib/types";
import { recordAnswer, shuffle } from "@/lib/storage";
import BackButton from "@/components/BackButton";
import HintBox from "@/components/HintBox";
import { AnswerInput, ShortReview } from "@/components/ShortAnswer";
import { AnimatedBar } from "@/components/Motion";
import { matchKeywords } from "@/lib/keywords";

type Props = {
  subjectId: string;
  subjectName: string;
  units: { id: string; title: string; color: string }[];
  mcq: TaggedMCQ[];
  short: TaggedShort[];
  initialUnit: string;
  initialType: string;
};

type Item = ({ kind: "mcq" } & TaggedMCQ) | ({ kind: "short" } & TaggedShort);

export default function PracticeClient({
  subjectId,
  subjectName,
  units,
  mcq,
  short,
  initialUnit,
  initialType,
}: Props) {
  const [unit, setUnit] = useState(initialUnit);
  const [type, setType] = useState(initialType);
  const [round, setRound] = useState(0);
  const [index, setIndex] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [text, setText] = useState("");
  const [score, setScore] = useState({ right: 0, total: 0, hints: 0 });
  const [seen, setSeen] = useState<string[]>([]); // questions already scored in this round
  const [requeued, setRequeued] = useState<string[]>([]); // questions sent back to the end of the round
  const [shortMark, setShortMark] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(false); // model answer shown for a short question
  const feedbackRef = useRef<HTMLDivElement>(null);

  // After self-marking a short answer, bring the result into view.
  useEffect(() => {
    if (shortMark !== null) feedbackRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [shortMark]);

  // The shuffled order is built on the client only (after mount), so server and client HTML match.
  const [queue, setQueue] = useState<Item[] | null>(null);
  useEffect(() => {
    const inUnit = (q: { unitId: string }) => unit === "all" || q.unitId === unit;
    const items: Item[] = [];
    if (type !== "short") items.push(...mcq.filter(inUnit).map((q) => ({ kind: "mcq" as const, ...q })));
    if (type !== "mcq") items.push(...short.filter(inUnit).map((q) => ({ kind: "short" as const, ...q })));
    setQueue(shuffle(items));
  }, [unit, type, round, mcq, short]);

  if (queue === null) {
    return <div className="card p-10 text-center text-sm text-[var(--muted)]">Questions load ho rahe hain…</div>;
  }

  const current = queue[index];
  const finished = queue.length > 0 && index >= queue.length;
  const pct = queue.length ? Math.round((Math.min(index, queue.length) / queue.length) * 100) : 0;
  const unitMeta = (id: string) => units.find((u) => u.id === id);
  const activeColor = current ? unitMeta(current.unitId)?.color ?? "#ea580c" : unitMeta(unit)?.color ?? "#ea580c";

  function reset(newUnit = unit, newType = type) {
    setUnit(newUnit);
    setType(newType);
    setRound((r) => r + 1);
    setIndex(0);
    setPicked(null);
    setText("");
    setScore({ right: 0, total: 0, hints: 0 });
    setSeen([]);
    setRequeued([]);
    setShortMark(null);
  }

  function next() {
    setIndex((i) => i + 1);
    setPicked(null);
    setText("");
    setShortMark(null);
    setRevealed(false);
  }

  // Put the current question at the end of this round (once), so the student sees it again.
  function requeueCurrent() {
    if (!current || requeued.includes(current.id)) return;
    setRequeued((r) => [...r, current.id]);
    setQueue((q) => (q ? [...q, current] : q));
  }

  // Score only the first attempt of a question; repeats are practice, not extra marks.
  function scoreOnce(correct: boolean) {
    if (!current || seen.includes(current.id)) return;
    setSeen((s) => [...s, current.id]);
    setScore((s) => ({ ...s, right: s.right + (correct ? 1 : 0), total: s.total + 1 }));
  }

  function pickOption(i: number) {
    if (!current || current.kind !== "mcq" || picked !== null) return;
    setPicked(i);
    const correct = i === current.answer;
    recordAnswer(current.id, correct);
    scoreOnce(correct);
    if (!correct) requeueCurrent();
  }

  function markShort(marks: number) {
    if (!current || current.kind !== "short" || shortMark !== null) return;
    const full = marks === current.marks;
    setShortMark(marks);
    recordAnswer(current.id, full);
    scoreOnce(full);
    if (!full) requeueCurrent();
  }

  // Submit a typed short answer: keyword match with the model answer, then mark it.
  function submitShort() {
    if (!current || current.kind !== "short" || !text.trim()) return;
    const kw = matchKeywords(text, current.answer);
    const pct = kw.total ? kw.matched.length / kw.total : 0;
    const mark = pct >= 0.7 ? current.marks : pct >= 0.4 ? Math.max(1, current.marks - 1) : 0;
    setRevealed(true);
    markShort(mark);
  }

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <BackButton fallback={`/${subjectId}`} label={subjectName} />
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Practice</h1>
            <p className="text-sm text-[var(--muted)]">MCQ aur 1-line short answers. Atke to hint lo.</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="space-y-1.5">
          <span className="text-xs font-semibold uppercase tracking-wide text-[var(--muted)]">Unit</span>
          <select
            value={unit}
            onChange={(e) => reset(e.target.value, type)}
            className="field !py-2.5 font-medium"
          >
            <option value="all">Saare units</option>
            {units.map((u) => (
              <option key={u.id} value={u.id}>
                {u.title}
              </option>
            ))}
          </select>
        </label>
        <label className="space-y-1.5">
          <span className="text-xs font-semibold uppercase tracking-wide text-[var(--muted)]">Question type</span>
          <select
            value={type}
            onChange={(e) => reset(unit, e.target.value)}
            className="field !py-2.5 font-medium"
          >
            <option value="both">MCQ aur short</option>
            <option value="mcq">Sirf MCQ</option>
            <option value="short">Sirf short answers</option>
          </select>
        </label>
      </div>

      {queue.length === 0 ? (
        <div className="card p-10 text-center text-[var(--muted)]">Is filter me koi question nahi hai.</div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-[1fr_300px] lg:items-start">
          {/* Main column */}
          <div className="min-w-0 space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex-1">
                <AnimatedBar percent={pct} />
              </div>
              <span className="chip whitespace-nowrap" style={{ color: activeColor }}>
                {finished ? "Done" : `${index + 1} / ${queue.length}`}
              </span>
            </div>

            <AnimatePresence mode="wait">
              {finished ? (
                <motion.div
                  key="done"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="card overflow-hidden text-center"
                >
                  <div className="hero rounded-none px-6 py-10" style={{ ["--c" as string]: activeColor }}>
                    <div className="relative z-10">
                      <div className="text-sm font-semibold uppercase tracking-widest opacity-85">Round complete</div>
                      <div className="mt-2 text-5xl font-bold">
                        {score.right}
                        <span className="text-2xl opacity-80">/{score.total}</span>
                      </div>
                      <div className="mt-2 text-sm opacity-90">{score.hints} hint use kiye{requeued.length ? ` · ${requeued.length} sawal dobara kiye` : ""}</div>
                    </div>
                  </div>
                  <div className="p-5">
                    <button type="button" onClick={() => reset()} className="btn btn-primary focus-ring w-full">
                      <Shuffle size={16} aria-hidden /> Phir se shuffle karke practice
                    </button>
                  </div>
                </motion.div>
              ) : (
                current && (
                  <motion.article
                    key={`${current.id}-${index}`}
                    initial={{ opacity: 0, x: 16 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -16 }}
                    transition={{ duration: 0.22 }}
                    className="card space-y-5 overflow-hidden p-5 sm:p-7"
                    style={{ borderTop: `4px solid ${unitMeta(current.unitId)?.color ?? "#ea580c"}` }}
                  >
                    <div className="flex flex-wrap gap-2">
                      <span className={`chip ${current.kind === "mcq" ? "chip-accent" : "chip-warn"}`}>
                        {current.kind === "mcq" ? "MCQ · 1 mark" : "Short · 2 marks"}
                      </span>
                      <span className="chip">
                        {unitMeta(current.unitId)?.title} · {current.topic}
                      </span>
                      <ImportanceBadge imp={current.imp} />
                    </div>

                    <p className="text-lg font-semibold leading-relaxed sm:text-xl">{current.q}</p>

                    <HintBox hint={current.hint ?? ""} onOpen={() => setScore((s) => ({ ...s, hints: s.hints + 1 }))} />

                    {current.kind === "mcq" && (
                      <div className="space-y-3">
                        <div className="grid gap-2.5 sm:grid-cols-2">
                          {current.options.map((opt, i) => {
                            const isCorrect = i === current.answer;
                            const isPicked = i === picked;
                            let cls = "border-[var(--border)] bg-[var(--card)] hover:border-[var(--accent)]";
                            let badge = "bg-[var(--card-2)] text-[var(--muted)]";
                            if (picked !== null && isCorrect) {
                              cls = "border-[var(--good)] bg-[var(--good-soft)]";
                              badge = "bg-[var(--good)] text-white";
                            } else if (picked !== null && isPicked) {
                              cls = "border-[var(--bad)] bg-[var(--bad-soft)]";
                              badge = "bg-[var(--bad)] text-white";
                            }
                            return (
                              <motion.button
                                key={i}
                                type="button"
                                onClick={() => pickOption(i)}
                                disabled={picked !== null}
                                whileTap={picked === null ? { scale: 0.985 } : undefined}
                                className={`focus-ring flex w-full items-start gap-3 rounded-xl border-2 p-4 text-left text-[15px] font-medium transition-colors ${cls}`}
                              >
                                <span className={`grid h-7 w-7 shrink-0 place-items-center rounded-lg text-xs font-bold ${badge}`}>
                                  {String.fromCharCode(65 + i)}
                                </span>
                                <span className="flex-1 pt-0.5">{opt}</span>
                                {picked !== null && isCorrect && <Check size={18} className="mt-0.5 shrink-0 text-[var(--good)]" aria-hidden />}
                                {picked !== null && isPicked && !isCorrect && <X size={18} className="mt-0.5 shrink-0 text-[var(--bad)]" aria-hidden />}
                              </motion.button>
                            );
                          })}
                        </div>

                        <AnimatePresence>
                          {picked !== null && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              exit={{ opacity: 0, height: 0 }}
                              className="overflow-hidden"
                            >
                              <div className={`rounded-xl p-4 text-sm leading-relaxed ${picked === current.answer ? "bg-[var(--good-soft)]" : "bg-[var(--bad-soft)]"}`}>
                                <div className="mb-1 flex items-center gap-1.5 font-bold">
                                  {picked === current.answer ? (
                                    <>
                                      <Check size={16} aria-hidden /> Sahi jawab
                                    </>
                                  ) : (
                                    <>
                                      <X size={16} aria-hidden /> Galat. Sahi answer upar green hai
                                    </>
                                  )}
                                </div>
                                <p>{current.explanation}</p>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>

                        {picked !== null && (
                          <FeedbackButtons
                            repeatDone={requeued.includes(current.id)}
                            onNext={next}
                            onRepeat={() => { requeueCurrent(); next(); }}
                            note={picked !== current.answer ? "Ye sawal round ke end mein phir aayega." : null}
                          />
                        )}
                      </div>
                    )}

                    {current.kind === "short" && (
                      <div className="space-y-4">
                        <AnswerInput id={`ans-${current.id}`} value={text} onChange={setText} disabled={shortMark !== null} />
                        {shortMark === null && (
                          <div className="grid gap-2 sm:grid-cols-2">
                            <button type="button" onClick={() => setRevealed(true)} className="btn focus-ring !py-3.5">
                              Model answer dekho
                            </button>
                            <button type="button" onClick={submitShort} disabled={!text.trim()} className="btn btn-primary focus-ring !py-3.5 disabled:opacity-50">
                              <Check size={17} aria-hidden /> Submit karo
                            </button>
                          </div>
                        )}
                        {revealed && shortMark === null && (
                          <div className="space-y-3">
                            <div className="rounded-xl bg-[var(--card-2)] p-4 text-sm leading-relaxed"><b>Model answer:</b> {current.answer}</div>
                            <FeedbackButtons repeatDone={requeued.includes(current.id)} onNext={next} onRepeat={() => { requeueCurrent(); next(); }} note={null} />
                          </div>
                        )}
                        {shortMark !== null && (() => {
                          const kw = matchKeywords(text, current.answer);
                          const pct = kw.total ? Math.round((kw.matched.length / kw.total) * 100) : 0;
                          const full = shortMark === current.marks;
                          const tone = full ? "bg-[var(--good-soft)]" : shortMark > 0 ? "bg-[var(--warn-soft)]" : "bg-[var(--bad-soft)]";
                          return (
                            <div className="space-y-3">
                              <div className={`space-y-3 rounded-xl p-4 text-sm leading-relaxed ${tone}`}>
                                <div className="flex items-center gap-1.5 font-bold">
                                  {full ? <><Check size={16} aria-hidden /> Sahi ({shortMark}/{current.marks})</> : shortMark > 0 ? <>Adha ({shortMark}/{current.marks})</> : <><X size={16} aria-hidden /> Galat (0/{current.marks})</>}
                                  <span className="font-normal">· {pct}% points match</span>
                                </div>
                                <div><b>Model answer:</b> {current.answer}</div>
                                <div className="flex flex-wrap gap-1.5">
                                  {kw.matched.map((k) => <span key={k} className="chip chip-good">{k}</span>)}
                                  {kw.missing.slice(0, 8).map((k) => <span key={k} className="chip">{k}</span>)}
                                </div>
                                <p className="text-xs text-[var(--muted)]">Ye keyword match se check hua hai. Model answer se milakar dekho.</p>
                              </div>
                              <FeedbackButtons repeatDone={requeued.includes(current.id)} onNext={next} onRepeat={() => { requeueCurrent(); next(); }} note={!full ? "Ye sawal round ke end mein phir aayega." : null} />
                            </div>
                          );
                        })()}
                      </div>
                    )}
                  </motion.article>
                )
              )}
            </AnimatePresence>
          </div>

          {/* Side panel (desktop) */}
          <aside className="space-y-4 lg:sticky lg:top-24">
            <div className="card p-5">
              <div className="flex items-center gap-4">
                <ScoreRing value={score.total ? Math.round((score.right / score.total) * 100) : 0} color={activeColor} />
                <div className="space-y-1">
                  <div className="text-sm font-semibold">Is round ka score</div>
                  <div className="text-2xl font-bold">
                    {score.right}
                    <span className="text-base text-[var(--muted)]"> / {score.total}</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="card grid grid-cols-2 gap-3 p-5">
              <Mini icon={<Lightbulb size={16} aria-hidden />} label="Hints" value={score.hints} tone="var(--hint)" />
              <Mini icon={<Target size={16} aria-hidden />} label="Bache" value={Math.max(0, queue.length - index)} tone="var(--accent)" />
            </div>
            <div className="card space-y-2 p-5 text-sm">
              <div className="flex items-center gap-2 font-semibold">
                <Flame size={16} className="text-[var(--warn)]" aria-hidden /> Tip
              </div>
              <p className="text-[var(--muted)]">
                Pehle khud socho. Atke to hint lo. Short answer ko paper par bhi likho, phir model answer se milao.
              </p>
            </div>
          </aside>
        </div>
      )}

      <div className="flex justify-center">
        <button type="button" onClick={() => reset()} className="focus-ring inline-flex items-center gap-2 text-sm font-semibold text-[var(--accent)]">
          <Shuffle size={15} aria-hidden /> Questions shuffle karo
        </button>
      </div>
    </div>
  );
}

function FeedbackButtons({ onNext, onRepeat, repeatDone, note }: { onNext: () => void; onRepeat: () => void; repeatDone: boolean; note: string | null }) {
  return (
    <div className="space-y-2">
      {note && <p className="text-xs text-[var(--muted)]">{note}</p>}
      <div className="grid gap-2 sm:grid-cols-2">
        <button type="button" onClick={onNext} className="btn btn-primary focus-ring !py-3.5">
          <Check size={17} aria-hidden /> Samajh gaya, agla <ArrowRight size={17} aria-hidden />
        </button>
        <button type="button" onClick={onRepeat} disabled={repeatDone} className="btn focus-ring !py-3.5 disabled:opacity-50">
          <RotateCcw size={16} aria-hidden /> {repeatDone ? "Round ke end mein hai" : "Dobara puchho"}
        </button>
      </div>
    </div>
  );
}

function Mini({ icon, label, value, tone }: { icon: React.ReactNode; label: string; value: number; tone: string }) {
  return (
    <div className="rounded-xl bg-[var(--card-2)] p-3">
      <div className="flex items-center gap-1.5 text-xs font-semibold text-[var(--muted)]">
        <span style={{ color: tone }}>{icon}</span> {label}
      </div>
      <div className="mt-1 text-xl font-bold">{value}</div>
    </div>
  );
}

function ScoreRing({ value, color }: { value: number; color: string }) {
  const r = 26;
  const c = 2 * Math.PI * r;
  return (
    <svg width="68" height="68" viewBox="0 0 68 68" aria-label={`${value}%`} role="img">
      <circle cx="34" cy="34" r={r} fill="none" stroke="var(--card-2)" strokeWidth="7" />
      <motion.circle
        cx="34"
        cy="34"
        r={r}
        fill="none"
        stroke={color}
        strokeWidth="7"
        strokeLinecap="round"
        strokeDasharray={c}
        transform="rotate(-90 34 34)"
        initial={{ strokeDashoffset: c }}
        animate={{ strokeDashoffset: c - (c * value) / 100 }}
        transition={{ duration: 0.6 }}
      />
      <text x="34" y="38" textAnchor="middle" fontSize="13" fontWeight="700" fill="var(--fg)">
        {value}%
      </text>
    </svg>
  );
}
