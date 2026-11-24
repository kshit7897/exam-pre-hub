import { Suspense } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ClipboardCheck, PenLine } from "lucide-react";
import { getSubject, getUnit, subjects } from "@/lib/subjects";
import { colorAt, iconAt } from "@/lib/unitStyle";
import BackButton from "@/components/BackButton";
import NotesReader from "@/components/NotesReader";
import TopicNav from "@/components/TopicNav";
import { FadeUp } from "@/components/Motion";

export function generateStaticParams() {
  return subjects.flatMap((s) => s.units.map((u) => ({ subject: s.id, unit: u.id })));
}

export default function UnitPage({
  params,
}: {
  params: Promise<{ subject: string; unit: string }>;
}) {
  return (
    <Suspense fallback={<p className="text-sm text-[var(--muted)]">Loading…</p>}>
      <UnitLoader params={params} />
    </Suspense>
  );
}

async function UnitLoader({ params }: { params: Promise<{ subject: string; unit: string }> }) {
  const { subject: subjectId, unit: unitId } = await params;
  const subject = getSubject(subjectId);
  const unit = subject ? getUnit(subject, unitId) : undefined;
  if (!subject || !unit) notFound();

  const unitIndex = subject.units.findIndex((u) => u.id === unit.id);
  const color = colorAt(unitIndex);
  const Icon = iconAt(unitIndex);

  return (
    <div className="space-y-6">
      <BackButton fallback={`/${subject.id}`} label={subject.name} />

      <FadeUp>
        <section className="hero p-6 sm:p-10" style={{ ["--c" as string]: color }}>
          <div className="relative z-10 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-4">
              <span className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-white/20">
                <Icon size={28} aria-hidden />
              </span>
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest opacity-85">Unit {unitIndex + 1}</p>
                <h1 className="mt-1 text-2xl font-bold leading-tight sm:text-3xl">{unit.title}</h1>
                <div className="mt-3 flex flex-wrap gap-2 text-xs font-semibold">
                  <span className="rounded-full bg-white/20 px-3 py-1">{unit.topics.length} topics</span>
                  <span className="rounded-full bg-white/20 px-3 py-1">{unit.mcq.length} MCQ</span>
                  <span className="rounded-full bg-white/20 px-3 py-1">{unit.short.length} short</span>
                </div>
              </div>
            </div>
            <div className="grid gap-2 sm:w-64">
              <Link href={`/${subject.id}/practice?unit=${unit.id}`} className="btn focus-ring !border-0 !bg-white !text-[#141a2e]">
                <PenLine size={17} aria-hidden /> Is unit ki practice
              </Link>
              <Link href={`/${subject.id}/mock`} className="btn focus-ring !border-white/40 !bg-transparent !text-white">
                <ClipboardCheck size={17} aria-hidden /> Mock exam
              </Link>
            </div>
          </div>
        </section>
      </FadeUp>

      <div className="grid gap-6 lg:grid-cols-[230px_1fr] lg:items-start">
        <TopicNav topics={unit.topics.map((t) => ({ id: t.id, title: t.title }))} color={color} />
        <NotesReader topics={unit.topics} color={color} />
      </div>
    </div>
  );
}
