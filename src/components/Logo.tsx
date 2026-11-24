import { GraduationCap } from "lucide-react";

export default function Logo() {
  return (
    <span className="flex items-center gap-2.5">
      <span className="grid h-9 w-9 place-items-center rounded-xl bg-[var(--accent)] text-[var(--accent-fg)]">
        <GraduationCap size={20} strokeWidth={2.2} aria-hidden />
      </span>
      <span className="text-[17px] font-bold tracking-tight">StudyHub</span>
    </span>
  );
}
