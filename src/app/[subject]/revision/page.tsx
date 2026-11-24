import { notFound } from "next/navigation";
import { Suspense } from "react";
import { Check } from "lucide-react";
import { getSubject, subjects } from "@/lib/subjects";
import { colorAt } from "@/lib/unitStyle";
import BackButton from "@/components/BackButton";

export function generateStaticParams() {
  return subjects.map((s) => ({ subject: s.id }));
}

export default function RevisionPage({ params }: { params: Promise<{ subject: string }> }) {
  return (
    <Suspense fallback={<p className="text-sm text-[var(--muted)]">Loading…</p>}>
      <RevisionLoader params={params} />
    </Suspense>
  );
}

// Quick revision: all topic summaries of a subject on one page, unit by unit.
async function RevisionLoader({ params }: { params: Promise<{ subject: string }> }) {
  const { subject: subjectId } = await params;
  const subject = getSubject(subjectId);
  if (!subject) notFound();

  return (
    <div className="space-y-6">
      <BackButton fallback={`/${subject.id}`} label={subject.name} />
      <section className="space-y-1">
        <h1 className="text-3xl font-bold tracking-tight">Quick revision</h1>
        <p className="text-sm text-[var(--muted)]">Exam se pehle yahi padho. Har topic ke main points.</p>
      </section>

      <div className="space-y-4">
        {subject.units.map((u, ui) => (
          <details key={u.id} open={ui === 0} className="card group overflow-hidden" style={{ ["--c" as string]: colorAt(ui) }}>
            <summary className="focus-ring flex cursor-pointer list-none items-center justify-between gap-3 p-5">
              <span className="flex items-center gap-3">
                <span className="tile grid h-9 w-9 place-items-center rounded-lg text-sm font-bold">{ui + 1}</span>
                <span className="font-bold">{u.title}</span>
              </span>
              <span className="chip">{u.topics.length} topics</span>
            </summary>
            <div className="space-y-4 border-t border-[var(--border)] p-5">
              {u.topics.map((t) => (
                <div key={t.id} className="space-y-2">
                  <h3 className="flex items-center gap-2 font-semibold">
                    <span className="text-[var(--c)]">{t.id}</span> {t.title}
                  </h3>
                  <ul className="space-y-1.5 text-[15px] leading-relaxed">
                    {t.summary.map((s, i) => (
                      <li key={i} className="flex gap-2">
                        <Check size={16} className="mt-1 shrink-0 text-[var(--accent)]" aria-hidden />
                        <span>{s}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </details>
        ))}
      </div>
    </div>
  );
}
