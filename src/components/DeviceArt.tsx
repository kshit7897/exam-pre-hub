// Hand-drawn SVG shapes of the devices shown in the slide photos.
// Each shape is drawn in a 60 x 50 box and uses the unit colour (--c) for outlines.

const S = { fill: "var(--card-2)", stroke: "var(--c, var(--accent))", strokeWidth: 1.6 };

const ART: Record<string, React.ReactNode> = {
  keyboard: (
    <>
      <rect x="4" y="14" width="52" height="22" rx="3" {...S} />
      {[0, 1, 2].map((r) => [0, 1, 2, 3, 4, 5, 6].map((c) => <rect key={`${r}${c}`} x={8 + c * 6.5} y={18 + r * 6} width="4.5" height="3.5" rx="0.8" fill="var(--muted)" />))}
    </>
  ),
  mouse: (
    <>
      <rect x="18" y="6" width="24" height="38" rx="12" {...S} />
      <line x1="30" y1="6" x2="30" y2="22" stroke="var(--c, var(--accent))" strokeWidth="1.4" />
      <line x1="18" y1="22" x2="42" y2="22" stroke="var(--c, var(--accent))" strokeWidth="1.4" />
    </>
  ),
  scanner: (
    <>
      <rect x="6" y="14" width="48" height="26" rx="3" {...S} />
      <rect x="10" y="18" width="40" height="18" rx="1" fill="none" stroke="var(--muted)" strokeWidth="1" />
      <line x1="10" y1="27" x2="50" y2="27" stroke="var(--c, var(--accent))" strokeWidth="1.2" />
    </>
  ),
  barcode: (
    <>
      <rect x="10" y="8" width="40" height="30" rx="3" {...S} />
      {[14, 18, 22, 26, 31, 34, 38, 42].map((x, i) => <rect key={i} x={x} y={14} width={i % 2 ? 1.5 : 2.5} height={18} fill="var(--muted)" />)}
    </>
  ),
  joystick: (
    <>
      <ellipse cx="30" cy="40" rx="20" ry="6" {...S} />
      <line x1="30" y1="38" x2="30" y2="14" stroke="var(--c, var(--accent))" strokeWidth="3" />
      <circle cx="30" cy="12" r="6" {...S} />
    </>
  ),
  touchpad: (
    <>
      <rect x="8" y="12" width="44" height="28" rx="3" {...S} />
      <rect x="14" y="18" width="32" height="16" rx="2" fill="none" stroke="var(--muted)" strokeWidth="1" />
    </>
  ),
  touchpanel: (
    <>
      <rect x="8" y="6" width="44" height="30" rx="3" {...S} />
      <line x1="30" y1="36" x2="30" y2="42" stroke="var(--c, var(--accent))" strokeWidth="1.6" />
      <line x1="20" y1="42" x2="40" y2="42" stroke="var(--c, var(--accent))" strokeWidth="1.6" />
      <circle cx="36" cy="20" r="3.5" fill="var(--muted)" />
    </>
  ),
  micr: (
    <>
      <rect x="6" y="12" width="48" height="26" rx="2" {...S} />
      <line x1="10" y1="18" x2="30" y2="18" stroke="var(--muted)" strokeWidth="1" />
      <line x1="10" y1="22" x2="26" y2="22" stroke="var(--muted)" strokeWidth="1" />
      <rect x="10" y="30" width="40" height="4" fill="var(--muted)" />
    </>
  ),
  monitorCrt: (
    <>
      <rect x="8" y="5" width="44" height="32" rx="7" {...S} />
      <rect x="14" y="10" width="32" height="22" rx="10" fill="none" stroke="var(--muted)" strokeWidth="1" />
      <rect x="24" y="37" width="12" height="4" {...S} />
      <rect x="18" y="41" width="24" height="3" {...S} />
    </>
  ),
  monitorFlat: (
    <>
      <rect x="6" y="6" width="48" height="30" rx="2" {...S} />
      <rect x="10" y="10" width="40" height="22" fill="none" stroke="var(--muted)" strokeWidth="1" />
      <line x1="30" y1="36" x2="30" y2="41" stroke="var(--c, var(--accent))" strokeWidth="1.6" />
      <line x1="20" y1="42" x2="40" y2="42" stroke="var(--c, var(--accent))" strokeWidth="1.6" />
    </>
  ),
  printer: (
    <>
      <rect x="8" y="20" width="44" height="18" rx="3" {...S} />
      <rect x="16" y="8" width="28" height="13" fill="var(--card)" stroke="var(--muted)" strokeWidth="1" />
      <rect x="16" y="36" width="28" height="6" fill="var(--card)" stroke="var(--muted)" strokeWidth="1" />
    </>
  ),
  daisy: (
    <>
      <rect x="8" y="20" width="44" height="18" rx="3" {...S} />
      <circle cx="30" cy="29" r="6" fill="none" stroke="var(--c, var(--accent))" strokeWidth="1.6" />
      <line x1="30" y1="23" x2="30" y2="35" stroke="var(--muted)" strokeWidth="1" />
      <line x1="24" y1="29" x2="36" y2="29" stroke="var(--muted)" strokeWidth="1" />
    </>
  ),
  dotMatrix: (
    <>
      <rect x="8" y="16" width="44" height="22" rx="3" {...S} />
      <rect x="20" y="10" width="20" height="6" fill="var(--card)" stroke="var(--muted)" strokeWidth="1" />
      {[22, 28, 34].map((x) => <circle key={x} cx={x} cy={28} r="1.6" fill="var(--c, var(--accent))" />)}
    </>
  ),
  drum: (
    <>
      <rect x="14" y="12" width="32" height="26" {...S} />
      <ellipse cx="30" cy="12" rx="16" ry="4" {...S} />
      <ellipse cx="30" cy="38" rx="16" ry="4" {...S} />
      <line x1="14" y1="20" x2="46" y2="20" stroke="var(--muted)" strokeWidth="1" />
      <line x1="14" y1="28" x2="46" y2="28" stroke="var(--muted)" strokeWidth="1" />
    </>
  ),
  chain: (
    <>
      <circle cx="14" cy="25" r="7" {...S} />
      <circle cx="46" cy="25" r="7" {...S} />
      <line x1="14" y1="18" x2="46" y2="18" stroke="var(--c, var(--accent))" strokeWidth="1.6" />
      <line x1="14" y1="32" x2="46" y2="32" stroke="var(--c, var(--accent))" strokeWidth="1.6" />
      <rect x="24" y="26" width="12" height="5" {...S} />
    </>
  ),
  laser: (
    <>
      <rect x="6" y="18" width="48" height="20" rx="4" {...S} />
      <rect x="14" y="8" width="32" height="10" fill="var(--card)" stroke="var(--muted)" strokeWidth="1" />
      <rect x="14" y="38" width="32" height="5" fill="var(--card)" stroke="var(--muted)" strokeWidth="1" />
    </>
  ),
  inkjet: (
    <>
      <rect x="6" y="20" width="48" height="16" rx="3" {...S} />
      <rect x="12" y="12" width="36" height="6" {...S} />
      <line x1="16" y1="28" x2="44" y2="28" stroke="var(--muted)" strokeWidth="1" />
      <rect x="20" y="36" width="20" height="5" fill="var(--card)" stroke="var(--muted)" strokeWidth="1" />
    </>
  ),
  plotter: (
    <>
      <rect x="6" y="8" width="48" height="34" rx="2" {...S} />
      <line x1="10" y1="20" x2="50" y2="20" stroke="var(--muted)" strokeWidth="1" />
      <line x1="30" y1="20" x2="30" y2="36" stroke="var(--c, var(--accent))" strokeWidth="2" />
    </>
  ),
  speaker: (
    <>
      <rect x="16" y="6" width="28" height="38" rx="4" {...S} />
      <circle cx="30" cy="16" r="4" fill="none" stroke="var(--muted)" strokeWidth="1" />
      <circle cx="30" cy="32" r="8" fill="none" stroke="var(--muted)" strokeWidth="1" />
    </>
  ),
  headphone: (
    <>
      <path d="M12 30 Q12 8 30 8 Q48 8 48 30" fill="none" stroke="var(--c, var(--accent))" strokeWidth="2" />
      <rect x="8" y="28" width="10" height="16" rx="3" {...S} />
      <rect x="42" y="28" width="10" height="16" rx="3" {...S} />
    </>
  ),
  projector: (
    <>
      <rect x="8" y="18" width="36" height="16" rx="3" {...S} />
      <circle cx="46" cy="26" r="5" fill="var(--card)" stroke="var(--c, var(--accent))" strokeWidth="1.6" />
      <path d="M50 26 L58 16 M50 26 L58 36" stroke="var(--muted)" strokeWidth="1" fill="none" />
    </>
  ),
  hdd: (
    <>
      <rect x="6" y="12" width="48" height="26" rx="4" {...S} />
      <circle cx="30" cy="25" r="8" fill="none" stroke="var(--muted)" strokeWidth="1.2" />
      <circle cx="30" cy="25" r="2" fill="var(--muted)" />
    </>
  ),
  cd: (
    <>
      <circle cx="30" cy="25" r="19" {...S} />
      <circle cx="30" cy="25" r="5" fill="var(--card)" stroke="var(--muted)" strokeWidth="1" />
    </>
  ),
  sdcard: (
    <>
      <path d="M16 6 H40 L46 12 V44 H16 Z" {...S} />
      <rect x="22" y="10" width="14" height="8" fill="var(--card)" stroke="var(--muted)" strokeWidth="1" />
    </>
  ),
  pendrive: (
    <>
      <rect x="20" y="8" width="20" height="26" rx="3" {...S} />
      <rect x="25" y="34" width="10" height="10" rx="1" fill="var(--muted)" />
    </>
  ),
  floppy: (
    <>
      <rect x="10" y="8" width="40" height="36" rx="2" {...S} />
      <rect x="18" y="8" width="24" height="12" fill="var(--card)" stroke="var(--muted)" strokeWidth="1" />
      <rect x="20" y="28" width="20" height="12" fill="var(--card)" stroke="var(--muted)" strokeWidth="1" />
    </>
  ),
  ssd: (
    <>
      <rect x="6" y="16" width="48" height="18" rx="2" {...S} />
      {[12, 22, 32, 42].map((x) => <rect key={x} x={x} y={20} width="6" height="10" fill="var(--muted)" />)}
    </>
  ),
  tape: (
    <>
      <circle cx="30" cy="24" r="17" {...S} />
      <circle cx="30" cy="24" r="6" fill="var(--card)" stroke="var(--muted)" strokeWidth="1" />
      <path d="M30 41 Q40 46 50 42" fill="none" stroke="var(--muted)" strokeWidth="1.2" />
    </>
  ),
  chip: (
    <>
      <rect x="16" y="14" width="28" height="22" rx="2" {...S} />
      {[20, 26, 32, 38].map((x) => (
        <g key={x}>
          <line x1={x} y1="8" x2={x} y2="14" stroke="var(--muted)" strokeWidth="1.4" />
          <line x1={x} y1="36" x2={x} y2="42" stroke="var(--muted)" strokeWidth="1.4" />
        </g>
      ))}
    </>
  ),
  stack: (
    <>
      <rect x="10" y="30" width="40" height="7" rx="1.5" {...S} />
      <rect x="12" y="22" width="36" height="7" rx="1.5" {...S} />
      <rect x="14" y="14" width="32" height="7" rx="1.5" {...S} />
      <rect x="16" y="6" width="28" height="7" rx="1.5" {...S} />
    </>
  ),
};

export const ART_KEYS = Object.keys(ART);

// One device drawn as an SVG shape.
export default function DeviceArt({ art }: { art: string }) {
  const body = ART[art];
  if (!body) return null;
  return (
    <svg viewBox="0 0 60 50" className="h-12 w-14" role="img" aria-hidden>
      {body}
    </svg>
  );
}
