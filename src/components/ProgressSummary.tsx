"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { RotateCcw, Trophy } from "lucide-react";
import { getSubject } from "@/lib/subjects";
import { colorAt } from "@/lib/unitStyle";
import { loadProgress, resetProgress, type ProgressMap } from "@/lib/storage";
import { AnimatedBar } from "@/components/Motion";

export default function ProgressSummary({ subjectId }: { subjectId: string }) {
  const [progress, setProgress] = useState<ProgressMap>({});
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setProgress(loadProgress());
    setReady(true);
  }, []);

  const subject = getSubject(subjectId);
  if (!subject || !ready) return null;

  const allMcq = subject.units.flatMap((u) => u.mcq);
  const allShort = subject.units.flatMap((u) => u.short);
  const attemptedMcq = allMcq.filter((q) => progress[q.id]?.seen).length;
  const correctMcq = allMcq.filter((q) => (progress[q.id]?.correct ?? 0) > 0).length;
  const attemptedShort = allShort.filter((q) => progress[q.id]?.seen).length;
  const totalQ = allMcq.length + allShort.length;
  const donePct = totalQ ? Math.round(((attemptedMcq + attemptedShort) / totalQ) * 100) : 0;

  return (
    <section className="card space-y-5 p-5 sm:p-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 font-bold">
            <Trophy size={18} className="text-[var(--warn)]" aria-hidden /> Tumhari progress
          </div>
          <div className="text-xs text-[var(--muted)]">Is device par save hoti hai</div>
        </div>
        <div className="text-3xl font-bold text-[var(--accent)]">{donePct}%</div>
      </div>

      <AnimatedBar percent={donePct} />

      <div className="grid grid-cols-3 gap-2 text-center">
        <Mini value={`${attemptedMcq}/${allMcq.length}`} label="MCQ" />
        <Mini value={String(correctMcq)} label="Sahi" />
        <Mini value={`${attemptedShort}/${allShort.length}`} label="Short" />
      </div>

      <div className="space-y-3">
        <div className="text-xs font-semibold uppercase tracking-wide text-[var(--muted)]">Unit-wise</div>
        {subject.units.map((u, i) => {
          const qs = [...u.mcq, ...u.short];
          const done = qs.filter((q) => progress[q.id]?.seen).length;
          const pct = qs.length ? Math.round((done / qs.length) * 100) : 0;
          return (
            <Link key={u.id} href={`/${subject.id}/unit/${u.id}`} className="focus-ring block rounded-lg p-1 hover:bg-[var(--card-2)]">
              <div className="mb-1.5 flex items-center justify-between text-xs">
                <span className="truncate font-semibold">{u.title}</span>
                <span className="font-bold" style={{ color: colorAt(i) }}>
                  {pct}%
                </span>
              </div>
              <div className="progress-track">
                <div className="progress-fill" style={{ width: `${pct}%`, background: colorAt(i) }} />
              </div>
            </Link>
          );
        })}
      </div>

      <div className="flex items-center justify-between border-t border-[var(--border)] pt-4 text-sm">
        <Link href={`/${subjectId}/practice`} className="focus-ring font-semibold text-[var(--accent)]">
          Practice jaari rakho
        </Link>
        <button
          type="button"
          onClick={() => {
            resetProgress();
            setProgress({});
          }}
          className="focus-ring inline-flex items-center gap-1 text-xs font-semibold text-[var(--bad)]"
        >
          <RotateCcw size={13} aria-hidden /> Reset
        </button>
      </div>
    </section>
  );
}

function Mini({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-xl bg-[var(--card-2)] py-2.5">
      <div className="font-bold">{value}</div>
      <div className="text-[10px] font-semibold uppercase tracking-wide text-[var(--muted)]">{label}</div>
    </div>
  );
}
