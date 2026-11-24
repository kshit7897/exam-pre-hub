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
};

export type ShortQ = {
  id: string;
  topic: string;
  q: string;
  answer: string;
  marks: number;
  hint?: string;
};

export type Unit = {
  id: string;
  title: string;
  topics: Topic[];
  mcq: MCQ[];
  short: ShortQ[];
};

export type Subject = {
  id: string;
  name: string;
  subtitle: string;
  units: Unit[];
};

// A question tagged with the unit it came from (used by practice and mock exam).
export type TaggedMCQ = MCQ & { unitId: string };
export type TaggedShort = ShortQ & { unitId: string };
