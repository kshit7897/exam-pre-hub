"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, PenLine } from "lucide-react";
import { loadProgress, type ProgressMap } from "@/lib/storage";
import { Donut } from "@/components/Charts";
import { FadeUp } from "@/components/Motion";

export type DashUnit = { id: string; title: string; color: string; mcq: string[]; short: string[] };
export type DashSubject = { id: string; name: string; color: string; units: DashUnit[] };

type Count = { total: number; seen: number; pct: number };

// Student dashboard: how much is attempted, what to study next, and progress per subject.
export default function Dashboard({ subjects }: { subjects: DashSubject[] }) {
  const [progress, setProgress] = useState<ProgressMap | null>(null);

  useEffect(() => {
    setProgress(loadProgress());
  }, []);

  const data = useMemo(() => {
    const p = progress ?? {};
    const count = (ids: string[]): Count => {
      const seen = ids.filter((id) => p[id]?.seen).length;
      return { total: ids.length, seen, pct: ids.length ? (seen / ids.length) * 100 : 0 };
    };

    const allMcq = subjects.flatMap((s) => s.units.flatMap((u) => u.mcq));
    const allShort = subjects.flatMap((s) => s.units.flatMap((u) => u.short));
    const overall = count([...allMcq, ...allShort]);
    const attempts = [...allMcq, ...allShort].reduce((n, id) => n + (p[id]?.seen ?? 0), 0);
    const correct = [...allMcq, ...allShort].reduce((n, id) => n + (p[id]?.correct ?? 0), 0);

    const subjectRows = subjects.map((s) => {
      const mcq = count(s.units.flatMap((u) => u.mcq));
      const short = count(s.units.flatMap((u) => u.short));
      return { id: s.id, name: s.name, mcq, short, total: mcq.total + short.total, seen: mcq.seen + short.seen };
    });

    // Next step: the unit with the most questions still not attempted.
    const next = subjects
      .flatMap((s) =>
        s.units.map((u) => {
          const ids = [...u.mcq, ...u.short];
          const left = ids.filter((id) => !p[id]?.seen).length;
          return { subjectId: s.id, subjectName: s.name, unit: u, left, total: ids.length };
        }),
      )
      .filter((r) => r.left > 0)
      .sort((a, b) => b.left - a.left)[0];

    return {
      overall,
      attempts,
      accuracy: attempts ? Math.round((correct / attempts) * 100) : null,
      mcq: count(allMcq),
      short: count(allShort),
      subjectRows,
      next,
    };
  }, [subjects, progress]);

  if (progress === null) {
    return <div className="card h-72 animate-pulse" aria-label="Dashboard load ho raha hai" />;
  }

  const { overall, next, accuracy } = data;
  const started = overall.seen > 0;

  return (
    <div className="grid gap-5 lg:grid-cols-[1.1fr_1fr] lg:items-start">
      {/* Summary */}
      <FadeUp className="lg:col-span-2">
        <section className="card grid gap-6 p-6 sm:grid-cols-[auto_1fr] sm:items-center">
          <div className="mx-auto">
            <Donut percent={overall.pct} color="var(--accent)" size={164} stroke={14} center={`${Math.round(overall.pct)}%`} sub="attempted" />
          </div>
          <div className="space-y-4">
            <p className="text-sm text-[var(--muted)]">
              {started
                ? `${overall.seen} of ${overall.total} questions attempt kiye.`
                : "Abhi tak koi question attempt nahi kiya. Neeche se next step lo."}
            </p>
            <div className="grid grid-cols-3 gap-2 text-center">
              <Stat label="Attempted" value={overall.seen} />
              <Stat label="Baaki" value={overall.total - overall.seen} />
              <Stat label="Accuracy" value={accuracy === null ? "–" : `${accuracy}%`} />
            </div>
          </div>
        </section>
      </FadeUp>

      {/* Next step */}
      <FadeUp>
        <section className="card flex h-full flex-col gap-4 p-6">
          <div>
            <h2 className="font-bold">Agla step</h2>
            <p className="text-xs text-[var(--muted)]">Jis unit me sabse zyada questions baaki hain</p>
          </div>
          {next ? (
            <div className="flex flex-1 flex-col justify-between gap-4 rounded-xl bg-[var(--card-2)] p-4">
              <div>
                <div className="text-xs font-semibold uppercase tracking-wide text-[var(--muted)]">{next.subjectName}</div>
                <div className="mt-1 font-bold leading-snug">{next.unit.title}</div>
                <div className="mt-1 text-sm text-[var(--muted)]">
                  {next.left} of {next.total} questions baaki
                </div>
              </div>
              <div className="grid gap-2 sm:grid-cols-2">
                <Link href={`/${next.subjectId}/practice?unit=${next.unit.id}`} className="btn btn-primary focus-ring">
                  <PenLine size={16} aria-hidden /> Practice karo
                </Link>
                <Link href={`/${next.subjectId}/unit/${next.unit.id}`} className="btn focus-ring">
                  Notes padho <ArrowRight size={16} aria-hidden />
                </Link>
              </div>
            </div>
          ) : (
            <div className="rounded-xl bg-[var(--card-2)] p-4 text-sm text-[var(--muted)]">Sab questions attempt ho gaye. Ab mock exam do.</div>
          )}
        </section>
      </FadeUp>

      {/* MCQ vs short */}
      <FadeUp>
        <section className="card flex h-full flex-col gap-4 p-6">
          <div>
            <h2 className="font-bold">Question type</h2>
            <p className="text-xs text-[var(--muted)]">MCQ aur short answers me progress</p>
          </div>
          <div className="grid flex-1 grid-cols-2 items-center gap-4">
            <TypeDonut label="MCQ" stat={data.mcq} color="var(--accent)" />
            <TypeDonut label="Short answers" stat={data.short} color="var(--hint)" />
          </div>
        </section>
      </FadeUp>

      {/* Subject-wise stacked bars */}
      <FadeUp className="lg:col-span-2">
        <section className="card space-y-5 p-6">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 className="font-bold">Subject-wise progress</h2>
              <p className="text-xs text-[var(--muted)]">Har subject me MCQ aur short ka progress</p>
            </div>
            <div className="flex gap-3 text-xs font-semibold text-[var(--muted)]">
              <Legend color="var(--accent)" label="MCQ" />
              <Legend color="var(--hint)" label="Short" />
            </div>
          </div>
          <div className="space-y-5">
            {data.subjectRows.map((s) => (
              <Link key={s.id} href={`/${s.id}`} className="focus-ring block rounded-lg">
                <div className="mb-2 flex items-center justify-between gap-3 text-sm">
                  <span className="font-semibold">{s.name}</span>
                  <span className="text-xs font-bold text-[var(--muted)]">
                    {s.seen}/{s.total}
                  </span>
                </div>
                <StackedBar
                  mcqPct={s.mcq.total ? (s.mcq.seen / s.mcq.total) * 100 : 0}
                  shortPct={s.short.total ? (s.short.seen / s.short.total) * 100 : 0}
                  mcqWeight={s.mcq.total}
                  shortWeight={s.short.total}
                />
              </Link>
            ))}
          </div>
        </section>
      </FadeUp>
    </div>
  );
}

// Two-part bar: MCQ on the left, short answers on the right. Each part is filled by its own progress.
function StackedBar({ mcqPct, shortPct, mcqWeight, shortWeight }: { mcqPct: number; shortPct: number; mcqWeight: number; shortWeight: number }) {
  const total = mcqWeight + shortWeight || 1;
  const mcqSpan = (mcqWeight / total) * 100;
  return (
    <div className="flex h-3 w-full gap-1">
      <div className="progress-track relative h-full" style={{ width: `${mcqSpan}%` }}>
        <div className="absolute inset-y-0 left-0 rounded-full" style={{ width: `${mcqPct}%`, background: "var(--accent)", transition: "width 0.8s" }} />
      </div>
      <div className="progress-track relative h-full flex-1">
        <div className="absolute inset-y-0 left-0 rounded-full" style={{ width: `${shortPct}%`, background: "var(--hint)", transition: "width 0.8s" }} />
      </div>
    </div>
  );
}

function Legend({ color, label }: { color: string; label: string }) {
  return (
    <span className="flex items-center gap-1.5">
      <span className="h-2.5 w-2.5 rounded-full" style={{ background: color }} />
      {label}
    </span>
  );
}

function Stat({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="rounded-xl bg-[var(--card-2)] py-3">
      <div className="text-xl font-bold">{value}</div>
      <div className="text-[11px] font-semibold uppercase tracking-wide text-[var(--muted)]">{label}</div>
    </div>
  );
}

function TypeDonut({ label, stat, color }: { label: string; stat: Count; color: string }) {
  return (
    <div className="flex flex-col items-center gap-2">
      <Donut percent={stat.pct} color={color} size={118} stroke={11} center={`${Math.round(stat.pct)}%`} sub={`${stat.seen}/${stat.total}`} />
      <div className="text-sm font-semibold">{label}</div>
    </div>
  );
}
