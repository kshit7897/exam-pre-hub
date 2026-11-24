"use client";

import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";

// Goes back in history when possible, otherwise to the fallback page.
export default function BackButton({
  fallback,
  label,
  className = "text-[var(--muted)] hover:text-[var(--fg)]",
}: {
  fallback: string;
  label: string;
  className?: string;
}) {
  const router = useRouter();
  return (
    <button
      type="button"
      onClick={() => {
        if (window.history.length > 1) router.back();
        else router.push(fallback);
      }}
      className={`focus-ring inline-flex items-center gap-1 text-sm font-semibold ${className}`}
    >
      <ChevronLeft size={16} aria-hidden /> {label}
    </button>
  );
}
