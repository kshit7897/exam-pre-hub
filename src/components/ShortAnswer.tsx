"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Check, Eye, Minus, X } from "lucide-react";
import { matchKeywords } from "@/lib/keywords";

// Student writes a one-line answer in the box.
export function AnswerInput({
  value,
  onChange,
  disabled,
  id,
}: {
  value: string;
  onChange: (v: string) => void;
  disabled?: boolean;
  id: string;
}) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="text-xs font-semibold uppercase tracking-wide text-[var(--muted)]">
        Tumhara answer (1 line)
      </label>
      <textarea
        id={id}
        rows={2}
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Yahan apna answer likho…"
        className="field"
      />
    </div>
  );
}

// After the student writes: reveal the model answer, show which key points they covered, and self-mark.
export function ShortReview({
  answer,
  student,
  mark,
  onMark,
  showMarkButtons = true,
}: {
  answer: string;
  student: string;
  mark?: number;
  onMark: (score: number) => void;
  showMarkButtons?: boolean;
}) {
  const [revealed, setRevealed] = useState(false);
  const { total, matched, missing } = matchKeywords(student, answer);
  const pct = total ? Math.round((matched.length / total) * 100) : 0;

  if (!revealed) {
    return (
      <button type="button" onClick={() => setRevealed(true)} className="btn focus-ring w-full !py-3">
        <Eye size={17} aria-hidden /> Model answer dekho
      </button>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
      <div className="rounded-xl border-l-4 border-[var(--good)] bg-[var(--good-soft)] p-4">
        <div className="mb-1 text-xs font-bold uppercase tracking-wide text-[var(--good)]">Model answer</div>
        <p className="text-[15px] leading-relaxed">{answer}</p>
      </div>

      {student.trim() && total > 0 && (
        <div className="rounded-xl bg-[var(--card-2)] p-4">
          <div className="mb-2 flex items-center justify-between text-sm">
            <span className="font-semibold">Key points jo tumne likhe</span>
            <span className="chip chip-accent">
              {matched.length}/{total}
            </span>
          </div>
          <div className="progress-track mb-3">
            <motion.div
              className="progress-fill"
              initial={{ width: 0 }}
              animate={{ width: `${pct}%` }}
              transition={{ duration: 0.5 }}
              style={{ background: "var(--good)" }}
            />
          </div>
          <div className="flex flex-wrap gap-1.5">
            {matched.map((k) => (
              <span key={k} className="chip chip-good">
                <Check size={12} aria-hidden /> {k}
              </span>
            ))}
            {missing.slice(0, 6).map((k) => (
              <span key={k} className="chip">
                {k}
              </span>
            ))}
          </div>
        </div>
      )}

      {showMarkButtons && (
        <div className="space-y-2">
          <div className="text-sm font-semibold">Khud ko marks do</div>
          <div className="grid grid-cols-3 gap-2">
            <MarkButton active={mark === 2} onClick={() => onMark(2)} tone="good" icon={<Check size={16} aria-hidden />} label="Poora sahi" sub="2 marks" />
            <MarkButton active={mark === 1} onClick={() => onMark(1)} tone="warn" icon={<Minus size={16} aria-hidden />} label="Adha" sub="1 mark" />
            <MarkButton active={mark === 0} onClick={() => onMark(0)} tone="bad" icon={<X size={16} aria-hidden />} label="Galat" sub="0 marks" />
          </div>
        </div>
      )}
    </motion.div>
  );
}

function MarkButton({
  active,
  onClick,
  tone,
  icon,
  label,
  sub,
}: {
  active: boolean;
  onClick: () => void;
  tone: "good" | "warn" | "bad";
  icon: React.ReactNode;
  label: string;
  sub: string;
}) {
  const color = tone === "good" ? "var(--good)" : tone === "warn" ? "var(--warn)" : "var(--bad)";
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className="focus-ring flex flex-col items-center gap-1 rounded-xl border-2 p-3 text-sm font-semibold transition-colors"
      style={{
        borderColor: active ? color : "var(--border)",
        background: active ? color : "var(--card)",
        color: active ? "#fff" : "var(--fg)",
      }}
    >
      <span className="flex items-center gap-1">
        {icon} {label}
      </span>
      <span className="text-[11px] font-medium opacity-80">{sub}</span>
    </button>
  );
}
