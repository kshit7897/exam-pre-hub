"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Layers, BookText } from "lucide-react";
import type { Topic } from "@/lib/types";

type Mode = "full" | "quick";

// Switch between full notes and the short revision points for each topic.
export default function NotesReader({ topics, color }: { topics: Topic[]; color: string }) {
  const [mode, setMode] = useState<Mode>("full");

  return (
    <div className="min-w-0 space-y-4" style={{ ["--c" as string]: color }}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="seg" role="tablist" aria-label="Reading mode">
          <button role="tab" aria-selected={mode === "full"} aria-pressed={mode === "full"} onClick={() => setMode("full")} className="focus-ring">
            <BookText size={15} aria-hidden /> Full notes
          </button>
          <button role="tab" aria-selected={mode === "quick"} aria-pressed={mode === "quick"} onClick={() => setMode("quick")} className="focus-ring">
            <Layers size={15} aria-hidden /> Quick revision
          </button>
        </div>
        <p className="text-xs text-[var(--muted)]">
          {mode === "full" ? "Pehle poora samjho, phir revision karo." : "Exam se pehle sirf yahi padho."}
        </p>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={mode}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.2 }}
          className="space-y-4"
        >
          {topics.map((t) => (
            <article key={t.id} id={`topic-${t.id}`} className="card scroll-mt-28 p-5 sm:p-6">
              <div className="mb-4 flex items-center gap-3">
                <span className="tile grid h-9 min-w-9 place-items-center rounded-lg px-2 text-xs font-bold">{t.id}</span>
                <h2 className="text-base font-bold leading-snug sm:text-lg">{t.title}</h2>
              </div>

              {mode === "full" ? (
                <>
                  <ul className="note-body space-y-2.5">
                    {t.notes.map((n, i) => (
                      <li key={i} className="flex gap-3">
                        <span aria-hidden className="mt-[0.75em] h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--c)]" />
                        <span>{n}</span>
                      </li>
                    ))}
                  </ul>
                  {t.summary.length > 0 && (
                    <div className="tint mt-5 rounded-xl p-4">
                      <div className="mb-2 text-xs font-bold uppercase tracking-wide">Summary</div>
                      <ul className="space-y-1.5 text-sm text-[var(--fg)]">
                        {t.summary.map((s, i) => (
                          <li key={i} className="flex gap-2">
                            <Check size={15} className="mt-0.5 shrink-0" aria-hidden /> <span>{s}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </>
              ) : (
                <ol className="space-y-2.5">
                  {t.summary.map((s, i) => (
                    <li key={i} className="flex gap-3 rounded-xl bg-[var(--card-2)] p-3.5 text-[15px] leading-relaxed">
                      <span className="tile grid h-6 w-6 shrink-0 place-items-center rounded-md text-xs font-bold">{i + 1}</span>
                      <span>{s}</span>
                    </li>
                  ))}
                </ol>
              )}
            </article>
          ))}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
