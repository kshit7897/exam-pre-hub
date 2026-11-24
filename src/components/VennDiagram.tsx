import type { ReactNode } from "react";
import type { VennSpec } from "@/lib/types";

// Redrawn two-set Venn diagram. The shaded region is drawn with clip paths and masks,
// so every operation (union, intersection, complement, difference, symmetric difference) is exact.
export default function VennDiagram({ id, venn }: { id: string; venn: VennSpec }) {
  const layout = venn.layout ?? "overlap";
  const W = 420;
  const H = 200;
  // Circle geometry for each layout (universal set rectangle is always the same).
  const single = layout === "single"; // only circle A (e.g. complement of one set)
  const geo =
    single
      ? { A: { cx: 210, cy: 100, r: 74 }, B: { cx: 210, cy: 100, r: 0 } }
      : layout === "disjoint"
        ? { A: { cx: 120, cy: 100, r: 62 }, B: { cx: 300, cy: 100, r: 62 } }
        : layout === "subset"
          ? { A: { cx: 190, cy: 102, r: 42 }, B: { cx: 210, cy: 100, r: 84 } }
          : { A: { cx: 160, cy: 100, r: 66 }, B: { cx: 260, cy: 100, r: 66 } };

  const k = (s: string) => `${id}-${s}`;
  const { A, B } = geo;
  const fill = "var(--accent)";
  const shadeOpacity = 0.45;
  const shaded = (name: string, node: ReactNode) => (
    <g key={name} fill={fill} fillOpacity={shadeOpacity}>
      {node}
    </g>
  );

  let shade: ReactNode = null;
  switch (venn.shade) {
    case "A|B":
      shade = shaded("union", (<><circle cx={A.cx} cy={A.cy} r={A.r} /><circle cx={B.cx} cy={B.cy} r={B.r} /></>));
      break;
    case "A&B":
      shade = (
        <g fill={fill} fillOpacity={shadeOpacity}>
          <circle cx={B.cx} cy={B.cy} r={B.r} clipPath={`url(#${k("clipA")})`} />
        </g>
      );
      break;
    case "U-A":
      shade = (
        <g fill={fill} fillOpacity={shadeOpacity} mask={`url(#${k("maskUA")})`}>
          <rect x={10} y={10} width={W - 20} height={H - 20} />
        </g>
      );
      break;
    case "A-B":
      shade = (
        <g fill={fill} fillOpacity={shadeOpacity} mask={`url(#${k("maskAB")})`}>
          <circle cx={A.cx} cy={A.cy} r={A.r} />
        </g>
      );
      break;
    case "B-A":
      shade = (
        <g fill={fill} fillOpacity={shadeOpacity} mask={`url(#${k("maskBA")})`}>
          <circle cx={B.cx} cy={B.cy} r={B.r} />
        </g>
      );
      break;
    case "A^B":
      shade = (
        <g fill={fill} fillOpacity={shadeOpacity}>
          <g mask={`url(#${k("maskAB")})`}><circle cx={A.cx} cy={A.cy} r={A.r} /></g>
          <g mask={`url(#${k("maskBA")})`}><circle cx={B.cx} cy={B.cy} r={B.r} /></g>
        </g>
      );
      break;
    default:
      shade = null;
  }

  return (
    <figure className="overflow-x-auto rounded-lg bg-[var(--card)] p-2">
      <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto block h-auto w-full max-w-[520px]" role="img" aria-label="Venn diagram">
        <defs>
          <clipPath id={k("clipA")}>
            <circle cx={A.cx} cy={A.cy} r={A.r} />
          </clipPath>
          {/* U - A: white everywhere except inside A */}
          <mask id={k("maskUA")}>
            <rect x={0} y={0} width={W} height={H} fill="white" />
            <circle cx={A.cx} cy={A.cy} r={A.r} fill="black" />
          </mask>
          {/* A - B: inside A, but not inside B */}
          <mask id={k("maskAB")}>
            <rect x={0} y={0} width={W} height={H} fill="black" />
            <circle cx={A.cx} cy={A.cy} r={A.r} fill="white" />
            <circle cx={B.cx} cy={B.cy} r={B.r} fill="black" />
          </mask>
          {/* B - A: inside B, but not inside A */}
          <mask id={k("maskBA")}>
            <rect x={0} y={0} width={W} height={H} fill="black" />
            <circle cx={B.cx} cy={B.cy} r={B.r} fill="white" />
            <circle cx={A.cx} cy={A.cy} r={A.r} fill="black" />
          </mask>
        </defs>

        <rect x={10} y={10} width={W - 20} height={H - 20} fill="none" stroke="var(--muted)" strokeWidth={1.6} />
        <text x={W - 22} y={28} textAnchor="end" fontSize={13} fontWeight={700} fill="var(--fg)">U</text>

        {shade}

        <circle cx={A.cx} cy={A.cy} r={A.r} fill="none" stroke="var(--c, var(--accent))" strokeWidth={2} />
        {!single && <circle cx={B.cx} cy={B.cy} r={B.r} fill="none" stroke="var(--c, var(--accent))" strokeWidth={2} />}
        <text x={A.cx - A.r * 0.55} y={A.cy - A.r * 0.55} textAnchor="middle" fontSize={15} fontWeight={700} fill="var(--fg)">A</text>
        {!single && <text x={B.cx + B.r * 0.55} y={B.cy - B.r * 0.55} textAnchor="middle" fontSize={15} fontWeight={700} fill="var(--fg)">B</text>}
      </svg>
      {venn.caption && <figcaption className="mt-2 text-center text-xs text-[var(--muted)]">{venn.caption}</figcaption>}
    </figure>
  );
}
