import type { MCQ, ShortQ, Subject, Unit } from "./types";
import unit1 from "@/content/aoc/unit-1.json";
import unit2 from "@/content/aoc/unit-2.json";
import unit3 from "@/content/aoc/unit-3.json";
import unit4 from "@/content/aoc/unit-4.json";
import unit5 from "@/content/aoc/unit-5.json";
import extra1 from "@/content/aoc/unit-1-extra.json";
import extra2 from "@/content/aoc/unit-2-extra.json";
import extra3 from "@/content/aoc/unit-3-extra.json";
import extra4 from "@/content/aoc/unit-4-extra.json";
import extra5 from "@/content/aoc/unit-5-extra.json";
import summaries from "@/content/aoc/summaries.json";
import hints from "@/content/aoc/hints.json";

type Extra = { mcq: MCQ[]; short: ShortQ[] };

const hintMap = hints as Record<string, string>;
function hintFor(id: string, topic: string) {
  return hintMap[id] ?? `Topic ${topic} ke notes ko dhyan se dekho.`;
}

// Merge a unit's base file with its "extra" file (more questions for the same topics).
function withExtra(base: Unit, extra: Extra): Unit {
  return {
    ...base,
    topics: base.topics.map((t) => ({ ...t, summary: (summaries as Record<string, string[]>)[t.id] ?? [] })),
    mcq: [...base.mcq, ...extra.mcq].map((q) => ({ ...q, hint: hintFor(q.id, q.topic) })),
    short: [...base.short, ...extra.short].map((q) => ({ ...q, hint: hintFor(q.id, q.topic) })),
  };
}

// Add a new subject here: create src/content/<id>/unit-N.json files and register them below.
const aoc: Subject = {
  id: "aoc",
  name: "AOC",
  subtitle: "Computer architecture and digital logic · 5 units",
  units: [
    withExtra(unit1 as Unit, extra1 as Extra),
    withExtra(unit2 as Unit, extra2 as Extra),
    withExtra(unit3 as Unit, extra3 as Extra),
    withExtra(unit4 as Unit, extra4 as Extra),
    withExtra(unit5 as Unit, extra5 as Extra),
  ],
};

export const subjects: Subject[] = [aoc];

export function getSubject(id: string): Subject | undefined {
  return subjects.find((s) => s.id === id);
}

export function getUnit(subject: Subject, unitId: string): Unit | undefined {
  return subject.units.find((u) => u.id === unitId);
}

export function countQuestions(subject: Subject) {
  return {
    mcq: subject.units.reduce((n, u) => n + u.mcq.length, 0),
    short: subject.units.reduce((n, u) => n + u.short.length, 0),
  };
}
