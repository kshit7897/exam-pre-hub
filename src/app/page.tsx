import Link from "next/link";
import { ChevronRight, Cpu } from "lucide-react";
import { countQuestions, subjects } from "@/lib/subjects";
import { colorAt } from "@/lib/unitStyle";
import { FadeUp, Stagger, StaggerItem } from "@/components/Motion";
import Dashboard, { type DashSubject } from "@/components/Dashboard";

// Data for the dashboard charts (question ids and colours per unit).
const dash: DashSubject[] = subjects.map((s, si) => ({
  id: s.id,
  name: s.name,
  color: colorAt(si),
  units: s.units.map((u, ui) => ({
    id: u.id,
    title: u.title,
    color: colorAt(ui),
    mcq: u.mcq.map((q) => q.id),
    short: u.short.map((q) => q.id),
  })),
}));

export default function Home() {
  return (
    <div className="space-y-8">
      {/* Subjects first, so the student can start right away without scrolling. */}
      <section className="space-y-3">
        <FadeUp>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Subjects</h1>
          <p className="text-sm text-[var(--muted)]">Subject chuno, notes padho, practice aur mock do.</p>
        </FadeUp>
        <Stagger className="grid gap-3 sm:grid-cols-2">
          {subjects.map((s, i) => {
            const c = countQuestions(s);
            const color = colorAt(i);
            return (
              <StaggerItem key={s.id}>
                <Link
                  href={`/${s.id}`}
                  className="card card-link focus-ring flex h-full items-center gap-4 p-4 sm:p-5"
                  style={{ ["--c" as string]: color }}
                >
                  <div className="tile grid h-14 w-14 shrink-0 place-items-center rounded-2xl">
                    <Cpu size={26} strokeWidth={2} aria-hidden />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-lg font-bold">{s.name}</div>
                    <div className="mt-0.5 truncate text-sm text-[var(--muted)]">{s.subtitle}</div>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      <span className="chip">{s.units.length} units</span>
                      <span className="chip">{c.mcq} MCQ</span>
                      <span className="chip">{c.short} short</span>
                    </div>
                  </div>
                  <ChevronRight size={22} className="shrink-0 text-[var(--muted)]" aria-hidden />
                </Link>
              </StaggerItem>
            );
          })}
        </Stagger>
      </section>

      {/* Charts below: overall progress and weak spots. */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold">Tumhari progress</h2>
        <Dashboard subjects={dash} />
      </section>
    </div>
  );
}
