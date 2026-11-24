// Redrawn three-set Venn diagram (A, B, C inside U). Each region shows the elements that belong to it.
// Region keys: A, B, C (only that set), AB, AC, BC (exactly those two), ABC (all three), none (outside all sets).
export default function VennDiagram3({ id, venn }: { id: string; venn: { regions: Record<string, number[]>; caption?: string } }) {
  const W = 420;
  const H = 250;
  const circles = {
    A: { cx: 150, cy: 95, r: 70 },
    B: { cx: 270, cy: 95, r: 70 },
    C: { cx: 210, cy: 160, r: 70 },
  };
  // Label anchor for each region (chosen inside the matching area of the drawing).
  const pos: Record<string, { x: number; y: number }> = {
    A: { x: 100, y: 92 },
    B: { x: 320, y: 92 },
    C: { x: 210, y: 215 },
    AB: { x: 210, y: 62 },
    AC: { x: 170, y: 160 },
    BC: { x: 250, y: 160 },
    ABC: { x: 210, y: 120 },
    none: { x: 40, y: 32 },
  };
  const lines = (nums: number[]) => {
    const out: string[] = [];
    for (let i = 0; i < nums.length; i += 2) out.push(nums.slice(i, i + 2).join(", "));
    return out;
  };
  return (
    <figure className="overflow-x-auto rounded-lg bg-[var(--card)] p-2">
      <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto block h-auto w-full max-w-[520px]" role="img" aria-label="Three-set Venn diagram">
        <rect x={8} y={8} width={W - 16} height={H - 16} fill="none" stroke="var(--muted)" strokeWidth={1.6} />
        <text x={W - 18} y={26} textAnchor="end" fontSize={13} fontWeight={700} fill="var(--fg)">U</text>
        {(["A", "B", "C"] as const).map((k) => (
          <circle key={`${id}-c${k}`} cx={circles[k].cx} cy={circles[k].cy} r={circles[k].r} fill="var(--accent)" fillOpacity={0.12} stroke="var(--c, var(--accent))" strokeWidth={2} />
        ))}
        <text x={circles.A.cx - 52} y={circles.A.cy - 56} fontSize={14} fontWeight={700} fill="var(--fg)">A</text>
        <text x={circles.B.cx + 44} y={circles.B.cy - 56} fontSize={14} fontWeight={700} fill="var(--fg)">B</text>
        <text x={circles.C.cx + 48} y={circles.C.cy + 56} fontSize={14} fontWeight={700} fill="var(--fg)">C</text>
        {Object.entries(venn.regions).map(([key, nums]) => {
          const p = pos[key];
          if (!p || nums.length === 0) return null;
          const ls = lines(nums);
          const top = p.y - ((ls.length - 1) * 15) / 2;
          return (
            <g key={`${id}-${key}`}>
              {ls.map((ln, i) => (
                <text key={i} x={p.x} y={top + i * 15 + 5} textAnchor="middle" fontSize={13} fontWeight={700} fill="var(--fg)" stroke="var(--card)" strokeWidth={3} paintOrder="stroke">
                  {ln}
                </text>
              ))}
            </g>
          );
        })}
      </svg>
      {venn.caption && <figcaption className="mt-2 text-center text-xs text-[var(--muted)]">{venn.caption}</figcaption>}
    </figure>
  );
}
