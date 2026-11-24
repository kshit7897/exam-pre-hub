"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Lightbulb } from "lucide-react";

// Hint button. Tapping it reveals a clue (not the answer). Calls onOpen once.
export default function HintBox({ hint, onOpen }: { hint: string; onOpen?: () => void }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="space-y-2">
      {!open ? (
        <button
          type="button"
          onClick={() => {
            setOpen(true);
            onOpen?.();
          }}
          className="btn btn-hint focus-ring w-full !py-2.5 text-sm sm:w-auto"
        >
          <Lightbulb size={16} aria-hidden /> Hint dikhao
        </button>
      ) : null}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="flex gap-3 rounded-xl border border-[var(--hint)]/25 bg-[var(--hint-soft)] p-4 text-[15px] leading-relaxed">
              <Lightbulb size={20} className="mt-0.5 shrink-0 text-[var(--hint)]" aria-hidden />
              <div>
                <div className="mb-0.5 text-xs font-bold uppercase tracking-wide text-[var(--hint)]">Hint</div>
                {hint}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
