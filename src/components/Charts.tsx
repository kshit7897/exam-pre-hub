"use client";

import { motion } from "framer-motion";

// Donut chart with a centre label. Pure SVG.
export function Donut({
  percent,
  color,
  size = 160,
  stroke = 14,
  center,
  sub,
}: {
  percent: number;
  color: string;
  size?: number;
  stroke?: number;
  center: string;
  sub?: string;
}) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const p = Math.max(0, Math.min(100, percent));
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} role="img" aria-label={`${center} ${sub ?? ""}`}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--card-2)" strokeWidth={stroke} />
      <motion.circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke={color}
        strokeWidth={stroke}
        strokeLinecap="round"
        strokeDasharray={c}
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
        initial={{ strokeDashoffset: c }}
        animate={{ strokeDashoffset: c - (c * p) / 100 }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
      />
      <text x="50%" y={sub ? "47%" : "50%"} textAnchor="middle" dominantBaseline="middle" fontSize={size / 4.4} fontWeight="700" fill="var(--fg)">
        {center}
      </text>
      {sub && (
        <text x="50%" y="66%" textAnchor="middle" fontSize={size / 11} fontWeight="600" fill="var(--muted)">
          {sub}
        </text>
      )}
    </svg>
  );
}

// Horizontal bar: label, value, and an animated bar.
export function HBar({ label, percent, color, value }: { label: string; percent: number; color: string; value: string }) {
  const p = Math.max(0, Math.min(100, percent));
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between gap-3 text-sm">
        <span className="min-w-0 truncate font-semibold">{label}</span>
        <span className="shrink-0 text-xs font-bold text-[var(--muted)]">{value}</span>
      </div>
      <div className="progress-track">
        <motion.div
          className="h-full rounded-full"
          style={{ background: color }}
          initial={{ width: 0 }}
          animate={{ width: `${p}%` }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        />
      </div>
    </div>
  );
}
