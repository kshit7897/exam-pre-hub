import { Suspense } from "react";
import { notFound } from "next/navigation";
import { getSubject, subjects } from "@/lib/subjects";
import { colorAt } from "@/lib/unitStyle";
import PracticeClient from "@/components/PracticeClient";
import type { TaggedMCQ, TaggedShort } from "@/lib/types";

export function generateStaticParams() {
  return subjects.map((s) => ({ subject: s.id }));
}

export default function PracticePage({
  params,
  searchParams,
}: {
  params: Promise<{ subject: string }>;
  searchParams: Promise<{ unit?: string; type?: string }>;
}) {
  return (
    <Suspense fallback={<p className="text-sm text-[var(--muted)]">Loading practice…</p>}>
      <PracticeLoader params={params} searchParams={searchParams} />
    </Suspense>
  );
}

async function PracticeLoader({
  params,
  searchParams,
}: {
  params: Promise<{ subject: string }>;
  searchParams: Promise<{ unit?: string; type?: string }>;
}) {
  const { subject: subjectId } = await params;
  const sp = await searchParams;
  const subject = getSubject(subjectId);
  if (!subject) notFound();

  const mcq: TaggedMCQ[] = subject.units.flatMap((u) => u.mcq.map((q) => ({ ...q, unitId: u.id })));
  const short: TaggedShort[] = subject.units.flatMap((u) =>
    u.short.map((q) => ({ ...q, unitId: u.id })),
  );

  const unitOptions = subject.units.map((u, i) => ({ id: u.id, title: u.title, color: colorAt(i) }));
  const initialUnit = unitOptions.some((u) => u.id === sp.unit) ? sp.unit! : "all";
  const initialType = sp.type === "mcq" || sp.type === "short" ? sp.type : "both";

  return (
    <PracticeClient
      subjectId={subject.id}
      subjectName={subject.name}
      units={unitOptions}
      mcq={mcq}
      short={short}
      initialUnit={initialUnit}
      initialType={initialType}
    />
  );
}
