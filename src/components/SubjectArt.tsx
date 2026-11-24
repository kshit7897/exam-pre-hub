// Subtle background pattern for a subject card or hero. Small repeated symbols, very faint, hidden from screen readers.
// "circuit" = binary digits and logic symbols (AOC); "math" = set and matrix symbols (Maths).
export type SubjectArtKind = "circuit" | "math";

const PATTERN: Record<SubjectArtKind, { glyphs: string[]; tile: number }> = {
  circuit: { glyphs: ["1", "0", "⊕", "1", "0", "∧", "∨", "0", "1", "¬"], tile: 44 },
  math: { glyphs: ["Σ", "∪", "∩", "π", "A", "∅", "B", "⊆", "∧", "∨"], tile: 46 },
};

// tone "light" is used on a coloured hero (symbols in white); default uses the subject colour.
export default function SubjectArt({ art, tone = "accent" }: { art: SubjectArtKind; tone?: "accent" | "light" }) {
  const color = tone === "light" ? "#ffffff" : "var(--c, var(--accent))";
  const { glyphs, tile } = PATTERN[art];
  const id = `subject-art-${art}-${tone}`;
  return (
    <svg
      aria-hidden
      className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.3]"
      style={{
        color,
        maskImage: "linear-gradient(to right, transparent 72%, black 100%)",
        WebkitMaskImage: "linear-gradient(to right, transparent 72%, black 100%)",
      }}
    >
      <defs>
        <pattern id={id} width={tile * 2} height={tile * 2} patternUnits="userSpaceOnUse">
          {glyphs.map((g, i) => (
            <text
              key={i}
              x={(i % 2) * tile + 6}
              y={Math.floor(i / 2) * (tile / 2) + 22}
              fontSize={18}
              fontWeight={700}
              fill="currentColor"
              fontFamily="ui-monospace, Consolas, monospace"
            >
              {g}
            </text>
          ))}
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${id})`} />
    </svg>
  );
}
