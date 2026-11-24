import type { Diagram, DiagramStudy, MCQ, ShortQ, Subject, Unit } from "./types";
import diagramData from "@/content/aoc/diagrams.json";
import studyData from "@/content/aoc/study.json";
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
import aocSummaries from "@/content/aoc/summaries.json";
import aocHints from "@/content/aoc/hints.json";
import mathsDiagramData from "@/content/maths/diagrams.json";
import mathsStudyData from "@/content/maths/study.json";
import mathsUnit1 from "@/content/maths/unit-1.json";
import mathsUnit2 from "@/content/maths/unit-2.json";
import mathsUnit3 from "@/content/maths/unit-3.json";
import mathsExtra1 from "@/content/maths/unit-1-extra.json";
import mathsExtra2 from "@/content/maths/unit-2-extra.json";
import mathsExtra3 from "@/content/maths/unit-3-extra.json";
import mathsSummaries from "@/content/maths/summaries.json";
import mathsHints from "@/content/maths/hints.json";

type Extra = { mcq: MCQ[]; short: ShortQ[] };

// Per-subject content and importance settings. Each subject keeps its own content folder.
type SubjectConfig = {
  summaries: Record<string, string[]>;
  hints: Record<string, string>;
  diagrams: Diagram[];
  study: Record<string, DiagramStudy>;
  hotTopics: Set<string>; // topics that repeatedly appear in past papers (empty when no paper data exists)
  core: RegExp; // core concepts for this subject
  // Optional explicit importance rule (used when the subject has a topic-based tagging, e.g. maths).
  importance?: (kind: "mcq" | "short", topic: string) => 'high' | 'medium' | undefined;
};

// Estimated exam importance (no past papers for maths, and only BCA-trend heuristics for AOC):
// - short answers that ask to explain / draw / differentiate / state / write... are 'high'
// - other short answers and figure-linked MCQs are 'medium'
const EXAM_VERB = /(explain|draw|differentiate|state|write|define|compare|describe|give|list|name|design|convert|simplify|derive|prove|find|determine)/i;

// AOC: topics that repeatedly appear in BCA computer architecture papers (flip-flops/counters, addressing modes, DMA/I/O modes, memory).
const AOC_HOT_TOPICS = new Set(['2.5', '3.7', '3.8', '4.5', '4.7', '5.4', '5.5', '5.6']);
// AOC core concepts (my judgment, based on the syllabus and the BCA papers above).
const AOC_CORE = /\b(flip-flop|flip flop|counter|addressing mode|dma|direct memory|minterm|maxterm|k-map|karnaugh|parity|two's complement|2's complement|1's complement|sign-magnitude|shift register|decoder|multiplexer|demultiplexer|encoder|half adder|full adder|cache|ram|rom|stack|instruction format|opcode|control word|booth|bus|interrupt|programmed i\/o|memory hierarchy|de morgan|sum of products|product of sums|sop|pos)\b/i;
// Maths core concepts: set operations, logic laws and matrix operations that the syllabus builds on.
const MATHS_CORE = /\b(union|intersection|complement|difference|symmetric difference|de morgan|power set|cartesian|venn|subset|disjoint|tautology|contradiction|truth table|converse|contrapositive|implication|equivalence|conjunction|disjunction|determinant|inverse|adjoint|cofactor|minor|transpose|symmetric|identity|multiplication)\b/i;

function importanceShort(q: ShortQ, cfg: SubjectConfig): 'high' | 'medium' | undefined {
  const verb = EXAM_VERB.test(q.q);
  const hot = cfg.hotTopics.has(q.topic);
  const core = cfg.core.test(q.q);
  if ((verb && hot) || (core && (verb || hot))) return 'high';
  if (verb || hot || core) return 'medium';
  return undefined;
}
function importanceMcq(q: MCQ, cfg: SubjectConfig): 'high' | 'medium' | undefined {
  const hot = cfg.hotTopics.has(q.topic);
  const figure = /-(d|f)-/.test(q.id);
  if (cfg.core.test(q.q) && (hot || figure)) return 'high';
  return hot || figure ? 'medium' : undefined;
}

function withExtra(base: Unit, extra: Extra, cfg: SubjectConfig): Unit {
  const hintFor = (id: string, topic: string) => cfg.hints[id] ?? `Topic ${topic} ke notes ko dhyan se dekho.`;
  return {
    ...base,
    topics: base.topics.map((t) => ({ ...t, summary: cfg.summaries[t.id] ?? [] })),
    mcq: [...base.mcq, ...extra.mcq].map((q) => ({
      ...q,
      hint: hintFor(q.id, q.topic),
      imp: cfg.importance ? cfg.importance("mcq", q.topic) : importanceMcq(q, cfg),
    })),
    short: [...base.short, ...extra.short].map((q) => ({
      ...q,
      hint: hintFor(q.id, q.topic),
      imp: cfg.importance ? cfg.importance("short", q.topic) : importanceShort(q, cfg),
    })),
    diagrams: cfg.diagrams
      .filter((d) => d.unit === base.id)
      .map((d) => ({ ...d, study: cfg.study[d.id] })),
  };
}

const aocConfig: SubjectConfig = {
  summaries: aocSummaries as Record<string, string[]>,
  hints: aocHints as Record<string, string>,
  diagrams: diagramData as Diagram[],
  study: studyData as Record<string, DiagramStudy>,
  hotTopics: AOC_HOT_TOPICS,
  core: AOC_CORE,
};

const mathsConfig: SubjectConfig = {
  summaries: mathsSummaries as Record<string, string[]>,
  hints: mathsHints as Record<string, string>,
  diagrams: mathsDiagramData as Diagram[],
  study: mathsStudyData as Record<string, DiagramStudy>,
  hotTopics: new Set<string>(),
  core: MATHS_CORE,
  // Topic-based tags (my judgment; no past papers for maths):
  // calculation/law topics are 'high', so their short questions and MCQs are 'Most important';
  // supporting topics are 'medium'; pure notation/definition MCQs stay untagged.
  // Every short question gets a tag because short answers carry 2 marks.
  importance: (kind, topic) => {
    const HIGH = ["1.5", "1.6", "2.4", "2.5", "2.6", "2.7", "3.4", "3.5", "3.6", "3.7", "3.8"];
    const MEDIUM = ["1.3", "1.4", "1.7", "2.2", "2.3", "3.2", "3.3"];
    if (HIGH.includes(topic)) return "high";
    if (MEDIUM.includes(topic)) return "medium";
    return kind === "short" ? "medium" : undefined;
  },
};

// Add a new subject here: create src/content/<id>/unit-N.json files (+ summaries, hints, diagrams, study) and register it below.
const aoc: Subject = {
  id: "aoc",
  name: "AOC",
  subtitle: "Computer architecture and digital logic · 5 units",
  icon: "cpu",
  art: "circuit",
  units: [
    withExtra(unit1 as Unit, extra1 as Extra, aocConfig),
    withExtra(unit2 as Unit, extra2 as Extra, aocConfig),
    withExtra(unit3 as Unit, extra3 as Extra, aocConfig),
    withExtra(unit4 as Unit, extra4 as Extra, aocConfig),
    withExtra(unit5 as Unit, extra5 as Extra, aocConfig),
  ],
};

const maths: Subject = {
  id: "maths",
  name: "Maths",
  subtitle: "Set theory, propositional logic and matrix algebra · 3 units",
  icon: "sigma",
  art: "math",
  units: [
    withExtra(mathsUnit1 as Unit, mathsExtra1 as Extra, mathsConfig),
    withExtra(mathsUnit2 as Unit, mathsExtra2 as Extra, mathsConfig),
    withExtra(mathsUnit3 as Unit, mathsExtra3 as Extra, mathsConfig),
  ],
};

export const subjects: Subject[] = [aoc, maths];

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
