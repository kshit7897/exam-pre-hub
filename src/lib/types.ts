export type Topic = {
  id: string;
  title: string;
  notes: string[];
  summary: string[]; // quick revision points
};

export type MCQ = {
  id: string;
  topic: string;
  q: string;
  options: string[];
  answer: number; // index of correct option
  explanation: string;
  hint?: string;
  imp?: "high" | "medium"; // estimated exam importance
};

export type ShortQ = {
  id: string;
  topic: string;
  q: string;
  answer: string;
  marks: number;
  hint?: string;
  imp?: "high" | "medium"; // estimated exam importance
};

// Venn diagram of two sets A and B inside the universal set U. 'shade' picks the region to colour.
export type VennSpec = {
  layout?: "overlap" | "disjoint" | "subset" | "single"; // default overlap; single = only circle A
  shade: "none" | "A|B" | "A&B" | "U-A" | "A-B" | "B-A" | "A^B";
  caption?: string;
};

// Study material for a figure: a redrawn version (table, steps or SVG), context and worked example.
export type DiagramStudy = {
  context?: string;
  table?: { head: string[]; rows: string[][] };
  steps?: string[];
  walkthrough?: string[]; // step-by-step guide: how to read the figure
  svg?: {
    height?: number;
    nodes: { id: string; label: string; x: number; y: number; w: number; h: number }[];
    edges: { from: string; to: string; label?: string; dx?: number; dy?: number }[];
  };
  venn?: VennSpec; // redrawn Venn diagram (set operations)
  venn3?: { regions: Record<string, number[]>; caption?: string }; // redrawn three-set Venn: elements per region
  icons?: { art: string; label: string }[]; // device drawings for photo-only slides
  example?: { q: string; a: string };
  questions: string[]; // ids of MCQ / short questions related to this figure
};

// A figure from the course slides (block diagram, circuit, timing chart, table or picture).
export type Diagram = {
  id: string;
  unit: string;
  page: number;
  topic: string;
  title: string;
  image: string; // path under /public, original slide photo
  reading: string; // short explanation of what the figure shows
  study?: DiagramStudy;
};

export type Unit = {
  id: string;
  title: string;
  topics: Topic[];
  mcq: MCQ[];
  short: ShortQ[];
  diagrams?: Diagram[];
};

export type Subject = {
  id: string;
  name: string;
  subtitle: string;
  icon: "cpu" | "sigma"; // icon shown on the subject card and hero
  art: "circuit" | "math"; // decorative background art for the subject card and hero
  units: Unit[];
};

// A question tagged with the unit it came from (used by practice and mock exam).
export type TaggedMCQ = MCQ & { unitId: string };
export type TaggedShort = ShortQ & { unitId: string };
