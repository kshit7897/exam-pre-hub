import { Suspense } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BookOpen, ChevronLeft, ChevronRight, ClipboardCheck, Layers, ListChecks, PenLine } from "lucide-react";
import { getSubject, subjects, countQuestions } from "@/lib/subjects";
import { colorAt, iconAt } from "@/lib/unitStyle";
import ProgressSummary from "@/components/ProgressSummary";
import { FadeUp, Stagger, StaggerItem } from "@/components/Motion";

export function generateStaticParams() {
  return subjects.map((s) => ({ subject: s.id }));
}

export default function SubjectPage({ params }: { params: Promise<{ subject: string }> }) {
  return (
    <Suspense fallback={<p className="text-sm text-[var(--muted)]">Loading…</p>}>
      <SubjectLoader params={params} />
    </Suspense>
  );
}

async function SubjectLoader({ params }: { params: Promise<{ subject: string }> }) {
  const { subject: subjectId } = await params;
  const subject = getSubject(subjectId);
  if (!subject) notFound();

  const totals = countQuestions(subject);

  // Everything a student does for this subject, in one place.
  const options = [
    { href: "#units", title: "Notes padho", text: `${subject.units.length} units, poore notes`, icon: BookOpen, c: colorAt(0) },
    { href: `/${subject.id}/revision`, title: "Quick revision", text: "Har topic ke summary points", icon: Layers, c: colorAt(1) },
    { href: `/${subject.id}/practice`, title: "Practice", text: "MCQ, hint ke saath", icon: PenLine, c: colorAt(2) },
    { href: `/${subject.id}/practice?type=short`, title: "Short answers", text: "1 line me likho, check karo", icon: ListChecks, c: colorAt(3) },
    { href: `/${subject.id}/mock`, title: "Mock exam", text: "30 MCQ + 20 short, timer ke saath", icon: ClipboardCheck, c: colorAt(4) },
  ];

  return (
    <div className="space-y-8">
      <Link href="/" className="focus-ring inline-flex items-center gap-1 text-sm font-semibold text-[var(--muted)] hover:text-[var(--fg)]">
        <ChevronLeft size={16} aria-hidden /> Subjects
      </Link>

      <FadeUp>
        <section className="hero p-6 sm:p-10" style={{ ["--c" as string]: colorAt(0) }}>
          <div className="relative z-10">
            <p className="text-xs font-semibold uppercase tracking-widest opacity-85">Subject</p>
            <h1 className="mt-1 text-4xl font-bold sm:text-5xl">{subject.name}</h1>
            <p className="mt-2 max-w-md text-sm leading-relaxed opacity-90 sm:text-base">{subject.subtitle}</p>
            <div className="mt-6 grid max-w-md grid-cols-3 gap-2">
              <HeroStat value={subject.units.length} label="Units" />
              <HeroStat value={totals.mcq} label="MCQ" />
              <HeroStat value={totals.short} label="Short" />
            </div>
          </div>
        </section>
      </FadeUp>

      <section className="space-y-3">
        <h2 className="text-lg font-bold">Kya karna hai?</h2>
        <Stagger className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {options.map((o) => (
            <StaggerItem key={o.title}>
              <Link href={o.href} className="card card-link focus-ring flex h-full items-center gap-4 p-4" style={{ ["--c" as string]: o.c }}>
                <span className="tile grid h-12 w-12 shrink-0 place-items-center rounded-xl">
                  <o.icon size={22} aria-hidden />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block font-bold">{o.title}</span>
                  <span className="block text-sm text-[var(--muted)]">{o.text}</span>
                </span>
                <ChevronRight size={20} className="shrink-0 text-[var(--muted)]" aria-hidden />
              </Link>
            </StaggerItem>
          ))}
        </Stagger>
      </section>

      <div className="grid gap-6 lg:grid-cols-[1fr_320px] lg:items-start">
        <section id="units" className="scroll-mt-24 space-y-3">
          <h2 className="text-lg font-bold">Units</h2>
          <Stagger className="grid gap-3 sm:grid-cols-2">
            {subject.units.map((u, i) => {
              const Icon = iconAt(i);
              return (
                <StaggerItem key={u.id}>
                  <Link
                    href={`/${subject.id}/unit/${u.id}`}
                    className="card card-link focus-ring flex h-full items-start gap-4 p-5"
                    style={{ ["--c" as string]: colorAt(i) }}
                  >
                    <span className="tile grid h-12 w-12 shrink-0 place-items-center rounded-xl">
                      <Icon size={22} aria-hidden />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-xs font-semibold uppercase tracking-wide text-[var(--muted)]">Unit {i + 1}</span>
                      <span className="mt-0.5 block font-bold leading-snug">{u.title}</span>
                      <span className="mt-3 flex flex-wrap gap-1.5">
                        <span className="chip">{u.topics.length} topics</span>
                        <span className="chip chip-accent">{u.mcq.length} MCQ</span>
                        <span className="chip chip-warn">{u.short.length} short</span>
                      </span>
                    </span>
                    <ChevronRight size={20} className="mt-3 shrink-0 text-[var(--muted)]" aria-hidden />
                  </Link>
                </StaggerItem>
              );
            })}
          </Stagger>
        </section>

        <div className="lg:sticky lg:top-24">
          <ProgressSummary subjectId={subject.id} />
        </div>
      </div>
    </div>
  );
}

function HeroStat({ value, label }: { value: number; label: string }) {
  return (
    <div className="rounded-2xl bg-white/15 px-3 py-3 text-center">
      <div className="text-2xl font-bold">{value}</div>
      <div className="text-[11px] font-medium uppercase tracking-wide opacity-85">{label}</div>
    </div>
  );
}
