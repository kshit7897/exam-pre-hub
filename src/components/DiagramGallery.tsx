import { ImageIcon, Lightbulb } from "lucide-react";
import DeviceArt from "@/components/DeviceArt";
import VennDiagram from "@/components/VennDiagram";
import VennDiagram3 from "@/components/VennDiagram3";
import type { Diagram, DiagramStudy, MCQ, ShortQ, Topic } from "@/lib/types";

type Question = (MCQ | ShortQ) & { kind?: "mcq" | "short" };

// Slide figures grouped under their topic. Figures with study data get a redrawn version.
export default function DiagramGallery({
  diagrams,
  topics,
  color,
  mcq,
  short,
}: {
  diagrams: Diagram[];
  topics: Topic[];
  color: string;
  mcq: MCQ[];
  short: ShortQ[];
}) {
  const groups = topics
    .map((t) => ({ topic: t, items: diagrams.filter((d) => d.topic === t.id) }))
    .filter((g) => g.items.length > 0);

  if (groups.length === 0) return null;

  const all: Question[] = [...mcq.map((q) => ({ ...q, kind: "mcq" as const })), ...short.map((q) => ({ ...q, kind: "short" as const }))];

  return (
    <section id="diagrams" className="scroll-mt-28 space-y-4" style={{ ["--c" as string]: color }}>
      <div className="flex items-center gap-3">
        <span className="tile grid h-9 w-9 place-items-center rounded-lg">
          <ImageIcon size={18} aria-hidden />
        </span>
        <div>
          <h2 className="text-lg font-bold">Diagrams & figures</h2>
          <p className="text-xs text-[var(--muted)]">Har diagram ka redrawn version, context, example aur related questions.</p>
        </div>
      </div>

      {groups.map(({ topic, items }) => (
        <div key={topic.id} className="card space-y-5 p-5 sm:p-6">
          <div className="flex items-center gap-3">
            <span className="tile grid h-7 min-w-7 place-items-center rounded-md px-2 text-xs font-bold">{topic.id}</span>
            <h3 className="font-bold">{topic.title}</h3>
          </div>
          {items.map((d) => (
            <DiagramStudyCard key={d.id} d={d} questions={all} />
          ))}
        </div>
      ))}
    </section>
  );
}

function DiagramStudyCard({ d, questions }: { d: Diagram; questions: Question[] }) {
  const s = d.study;
  const related = s ? s.questions.map((id) => questions.find((q) => q.id === id)).filter((q): q is Question => Boolean(q)) : [];

  return (
    <article className="space-y-4 rounded-xl bg-[var(--card-2)] p-4 sm:p-5">
      <header className="flex items-start justify-between gap-3">
        <h4 className="text-base font-bold leading-snug">{d.title}</h4>
        <span className="chip shrink-0 text-[11px]">Slide {d.page}</span>
      </header>

      <p className="text-[15px] leading-relaxed">{d.reading}</p>

      {s?.context && <Context study={s} />}

      {s?.walkthrough && (
        <div className="space-y-2">
          <div className="text-xs font-bold uppercase tracking-wide text-[var(--muted)]">Diagram kaise padhein (step by step)</div>
          <ol className="space-y-2">
            {s.walkthrough.map((w, i) => (
              <li key={i} className="flex gap-3 text-sm leading-relaxed">
                <span className="tile grid h-6 w-6 shrink-0 place-items-center rounded-md text-xs font-bold">{i + 1}</span>
                <span>{w}</span>
              </li>
            ))}
          </ol>
        </div>
      )}

      {s?.svg && <BlockSvg id={d.id} svg={s.svg} />}

      {s?.venn && <VennDiagram id={d.id} venn={s.venn} />}

      {s?.venn3 && <VennDiagram3 id={d.id} venn={s.venn3} />}

      {s?.icons && <IconGrid items={s.icons} />}

      {s?.table && (
        <div className="-mx-1 overflow-x-auto">
          <table className="min-w-full border-collapse text-sm">
            <thead>
              <tr>
                {s.table.head.map((h, i) => (
                  <th key={i} className="border border-[var(--border)] bg-[var(--card)] px-3 py-2 text-left font-semibold">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {s.table.rows.map((r, i) => (
                <tr key={i}>
                  {r.map((c, j) => (
                    <td key={j} className="border border-[var(--border)] bg-[var(--card)] px-3 py-2">
                      {c}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {s?.steps && (
        <ol className="space-y-2">
          {s.steps.map((st, i) => (
            <li key={i} className="flex gap-3 rounded-lg bg-[var(--card)] p-3 text-sm leading-relaxed">
              <span className="tile grid h-6 w-6 shrink-0 place-items-center rounded-md text-xs font-bold">{i + 1}</span>
              <span>{st}</span>
            </li>
          ))}
        </ol>
      )}

      {s?.example && (
        <div className="rounded-lg border border-[var(--hint)]/25 bg-[var(--hint-soft)] p-4 text-sm leading-relaxed">
          <div className="mb-1 flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-[var(--hint)]">
            <Lightbulb size={14} aria-hidden /> Worked example
          </div>
          <p>
            <b>Q:</b> {s.example.q}
          </p>
          <p className="mt-1">
            <b>A:</b> {s.example.a}
          </p>
        </div>
      )}

      {related.length > 0 && (
        <div className="space-y-2">
          <div className="text-xs font-bold uppercase tracking-wide text-[var(--muted)]">Is diagram ke related questions</div>
          {related.map((q) => (
            <details key={q.id} className="group rounded-lg bg-[var(--card)] p-3 text-sm">
              <summary className="cursor-pointer font-semibold">
                <span className="mr-2 text-[var(--muted)]">{q.kind === "mcq" ? "MCQ" : `Short · ${(q as ShortQ).marks} marks`}</span>
                {q.q}
              </summary>
              {q.kind === "mcq" ? (
                <div className="mt-3 space-y-1.5">
                  {(q as MCQ).options.map((o, i) => (
                    <div
                      key={i}
                      className={`rounded-md px-3 py-1.5 ${i === (q as MCQ).answer ? "bg-[var(--good-soft)] font-semibold" : "bg-[var(--card-2)]"}`}
                    >
                      {String.fromCharCode(65 + i)}. {o}
                    </div>
                  ))}
                  <p className="pt-1 text-[var(--muted)]">{(q as MCQ).explanation}</p>
                </div>
              ) : (
                <p className="mt-3 rounded-md bg-[var(--good-soft)] p-3">{(q as ShortQ).answer}</p>
              )}
            </details>
          ))}
        </div>
      )}

      <details open={!s?.walkthrough && !s?.icons} className="rounded-lg bg-[var(--card)] p-3 text-sm">
        <summary className="cursor-pointer font-semibold">Original slide photo dekho</summary>
        <a href={d.image} target="_blank" rel="noopener noreferrer" className="focus-ring mt-3 block overflow-hidden rounded-lg">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={d.image} alt={d.title} loading="lazy" className="block h-auto w-full bg-white" />
        </a>
      </details>
    </article>
  );
}

function Context({ study }: { study: DiagramStudy }) {
  return (
    <div className="rounded-lg bg-[var(--card)] p-4 text-sm leading-relaxed">
      <div className="mb-1 text-xs font-bold uppercase tracking-wide text-[var(--muted)]">Context</div>
      {study.context}
    </div>
  );
}

// Splits a long label into lines of at most ~16 characters.
function wrap(label: string): string[] {
  const words = label.split(" ");
  const lines: string[] = [];
  let cur = "";
  for (const w of words) {
    if ((cur + " " + w).trim().length > 16 && cur) {
      lines.push(cur);
      cur = w;
    } else {
      cur = (cur + " " + w).trim();
    }
  }
  if (cur) lines.push(cur);
  return lines;
}

// Redrawn block diagram. Nodes are boxes; edges are arrows drawn from centre to centre (behind the boxes).
function BlockSvg({ id, svg }: { id: string; svg: NonNullable<DiagramStudy["svg"]> }) {
  const byId = new Map(svg.nodes.map((n) => [n.id, n]));
  const marker = `arrow-${id}`;
  return (
    <div className="overflow-x-auto rounded-lg bg-[var(--card)] p-2">
      <svg viewBox={`0 0 420 ${svg.height ?? 220}`} className="mx-auto block h-auto w-full max-w-[520px]" role="img" aria-label="Block diagram">
        <defs>
          <marker id={marker} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--muted)" />
          </marker>
        </defs>
        {svg.edges.map((e, i) => {
          const a = byId.get(e.from);
          const b = byId.get(e.to);
          if (!a || !b) return null;
          const cax = a.x + a.w / 2 + (e.dx ?? 0);
          const cay = a.y + a.h / 2 + (e.dy ?? 0);
          const cbx = b.x + b.w / 2 + (e.dx ?? 0);
          const cby = b.y + b.h / 2 + (e.dy ?? 0);
          // Stop the arrow at the box borders so the arrowhead is visible.
          const len = Math.hypot(cbx - cax, cby - cay) || 1;
          const ux = (cbx - cax) / len;
          const uy = (cby - cay) / len;
          const exit = (w: number, h: number) =>
            Math.min(Math.abs(ux) > 1e-6 ? w / 2 / Math.abs(ux) : Infinity, Math.abs(uy) > 1e-6 ? h / 2 / Math.abs(uy) : Infinity);
          const ta = exit(a.w, a.h) + 2;
          const tb = exit(b.w, b.h) + 4;
          const ax = cax + ux * ta;
          const ay = cay + uy * ta;
          const bx = cbx - ux * tb;
          const by = cby - uy * tb;
          return (
            <g key={i}>
              <line x1={ax} y1={ay} x2={bx} y2={by} stroke="var(--muted)" strokeWidth={1.6} markerEnd={`url(#${marker})`} />
              {e.label && (
                <text x={(ax + bx) / 2} y={(ay + by) / 2 - 6} textAnchor="middle" fontSize={11} fill="var(--muted)">
                  {e.label}
                </text>
              )}
            </g>
          );
        })}
        {svg.nodes.map((n) => {
          const lines = wrap(n.label);
          const top = n.y + n.h / 2 - ((lines.length - 1) * 14) / 2;
          return (
            <g key={n.id}>
              <rect x={n.x} y={n.y} width={n.w} height={n.h} rx={8} fill="var(--card-2)" stroke="var(--c, var(--accent))" strokeWidth={1.6} />
              {lines.map((ln, k) => (
                <text key={k} x={n.x + n.w / 2} y={top + k * 14 + 4} textAnchor="middle" fontSize={12} fontWeight={600} fill="var(--fg)">
                  {ln}
                </text>
              ))}
            </g>
          );
        })}
      </svg>
    </div>
  );
}

// Photo-only slides: each device drawn as a labelled SVG shape.
function IconGrid({ items }: { items: { art: string; label: string }[] }) {
  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
      {items.map((it, i) => (
        <div key={i} className="flex flex-col items-center gap-2 rounded-lg bg-[var(--card)] p-3 text-center">
          <DeviceArt art={it.art} />
          <span className="text-xs font-semibold leading-snug">{it.label}</span>
        </div>
      ))}
    </div>
  );
}
