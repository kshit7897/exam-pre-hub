import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft, HelpCircle } from "lucide-react";
import { getSubject, subjects } from "@/lib/subjects";
import { confirmItems } from "@/content/confirm";
import { FadeUp } from "@/components/Motion";

export function generateStaticParams() {
  return subjects.map((s) => ({ subject: s.id }));
}

export default async function ConfirmPage({ params }: { params: Promise<{ subject: string }> }) {
  const { subject: subjectId } = await params;
  const subject = getSubject(subjectId);
  if (!subject) notFound();
  const items = confirmItems[subject.id] ?? [];

  return (
    <div className="space-y-6">
      <Link href={`/${subject.id}`} className="focus-ring inline-flex items-center gap-1 text-sm font-semibold text-[var(--muted)] hover:text-[var(--fg)]">
        <ChevronLeft size={16} aria-hidden /> {subject.name}
      </Link>

      <FadeUp>
        <div className="space-y-2">
          <h1 className="flex items-center gap-2 text-3xl font-bold tracking-tight sm:text-4xl">
            <HelpCircle size={28} aria-hidden /> Teacher se confirm
          </h1>
          <p className="text-sm text-[var(--muted)]">
            Ye points slides mein unclear hain. Teacher se pooch kar exam ka sahi jawab batao, phir content update kar diya jayega.
          </p>
        </div>
      </FadeUp>

      {items.length === 0 ? (
        <div className="card p-5 text-sm text-[var(--muted)]">{subject.name} mein abhi koi point confirm karna baaki nahi hai.</div>
      ) : (
        <ol className="space-y-4">
          {items.map((it, i) => (
            <li key={it.id} className="card space-y-3 p-5">
              <div className="flex flex-wrap items-center gap-2">
                <span className="chip">{i + 1}</span>
                <span className="chip">{it.topic}</span>
              </div>
              <h2 className="text-lg font-bold">{it.title}</h2>
              <dl className="grid gap-2 text-sm sm:grid-cols-[120px_1fr]">
                <dt className="font-semibold text-[var(--muted)]">Source</dt>
                <dd>{it.source}</dd>
                <dt className="font-semibold text-[var(--muted)]">Slide kya kehta hai</dt>
                <dd>{it.slideSays}</dd>
                <dt className="font-semibold text-[var(--muted)]">App abhi kya use karta hai</dt>
                <dd>{it.appUses}</dd>
              </dl>
              <p className="rounded-lg bg-[var(--card-2)] p-3 text-sm">
                <b>Teacher se poochho:</b> {it.question}
              </p>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}
