import { Suspense } from "react";
import { notFound } from "next/navigation";
import { getSubject, subjects } from "@/lib/subjects";
import { colorAt } from "@/lib/unitStyle";
import MockExamClient from "@/components/MockExamClient";
import type { TaggedMCQ, TaggedShort } from "@/lib/types";

export function generateStaticParams() {
  return subjects.map((s) => ({ subject: s.id }));
}

export default function MockPage({ params }: { params: Promise<{ subject: string }> }) {
  return (
    <Suspense fallback={<p className="text-sm text-[var(--muted)]">Loading…</p>}>
      <MockLoader params={params} />
    </Suspense>
  );
}

async function MockLoader({ params }: { params: Promise<{ subject: string }> }) {
  const { subject: subjectId } = await params;
  const subject = getSubject(subjectId);
  if (!subject) notFound();

  const mcq: TaggedMCQ[] = subject.units.flatMap((u) => u.mcq.map((q) => ({ ...q, unitId: u.id })));
  const short: TaggedShort[] = subject.units.flatMap((u) =>
    u.short.map((q) => ({ ...q, unitId: u.id })),
  );

  return (
    <MockExamClient
      subjectId={subject.id}
      subjectName={subject.name}
      units={subject.units.map((u, i) => ({ id: u.id, title: u.title, color: colorAt(i) }))}
      mcq={mcq}
      short={short}
      mcqCount={30}
      shortCount={20}
      durationMinutes={60}
    />
  );
}
