import { Suspense } from "react";
import { notFound } from "next/navigation";
import { getSubject, getUnit, subjects } from "@/lib/subjects";
import MockExamClient from "@/components/MockExamClient";
import type { TaggedMCQ, TaggedShort } from "@/lib/types";

export function generateStaticParams() {
  return subjects.flatMap((s) => s.units.map((u) => ({ subject: s.id, unit: u.id })));
}

export default function UnitMockPage({
  params,
}: {
  params: Promise<{ subject: string; unit: string }>;
}) {
  return (
    <Suspense fallback={<p className="text-sm text-[var(--muted)]">Loading…</p>}>
      <UnitMockLoader params={params} />
    </Suspense>
  );
}

// One unit's paper: 20 MCQ (1 mark) + 10 short (2 marks), 30 minutes.
// Smaller units get whatever they have.
async function UnitMockLoader({ params }: { params: Promise<{ subject: string; unit: string }> }) {
  const { subject: subjectId, unit: unitId } = await params;
  const subject = getSubject(subjectId);
  const unit = subject ? getUnit(subject, unitId) : undefined;
  if (!subject || !unit) notFound();

  const mcq: TaggedMCQ[] = unit.mcq.map((q) => ({ ...q, unitId: unit.id }));
  const short: TaggedShort[] = unit.short.map((q) => ({ ...q, unitId: unit.id }));
  const mcqCount = Math.min(20, mcq.length);
  const shortCount = Math.min(10, short.length);

  return (
    <MockExamClient
      subjectId={subject.id}
      subjectName={subject.name}
      units={[{ id: unit.id, title: unit.title, color: "#ea580c" }]}
      mcq={mcq}
      short={short}
      mcqCount={mcqCount}
      shortCount={shortCount}
      durationMinutes={30}
      title={`${unit.title} · Mock test`}
      scopeText={`Sirf is unit (${unit.title}) ke questions. ${mcqCount} MCQ aur ${shortCount} short, 30 minute mein likho.`}
    />
  );
}
