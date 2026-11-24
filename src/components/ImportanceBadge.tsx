import { Flame } from "lucide-react";

// Estimated exam importance. Heuristic only (no past papers); see lib/subjects.ts.
export default function ImportanceBadge({ imp }: { imp?: "high" | "medium" }) {
  if (!imp) return null;
  if (imp === "high") {
    return (
      <span className="chip chip-solid whitespace-nowrap text-[11px]" title="Exam mein aane ki sambhavna zyada (estimate)">
        <Flame size={12} aria-hidden /> Most important
      </span>
    );
  }
  return (
    <span className="chip whitespace-nowrap text-[11px]" title="Exam mein aa sakta hai (estimate)">
      Important
    </span>
  );
}
