"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

type Mode = "light" | "dark";
// New key: old saved choices (from earlier versions) are ignored, so dark is the default for everyone.
const KEY = "studyhub:theme:v3";

function apply(mode: Mode) {
  document.documentElement.setAttribute("data-theme", mode);
}

export default function ThemeToggle() {
  const [mode, setMode] = useState<Mode>("dark");

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(KEY);
      if (saved === "light") setMode("light");
    } catch {
      // storage blocked: stay on dark
    }
  }, []);

  function choose(next: Mode) {
    setMode(next);
    apply(next);
    try {
      window.localStorage.setItem(KEY, next);
    } catch {
      // ignore
    }
  }

  return (
    <div className="seg" role="group" aria-label="Theme">
      <button type="button" aria-pressed={mode === "light"} onClick={() => choose("light")} className="focus-ring">
        <Sun size={15} strokeWidth={2} aria-hidden />
        <span className="hidden sm:inline">Light</span>
      </button>
      <button type="button" aria-pressed={mode === "dark"} onClick={() => choose("dark")} className="focus-ring">
        <Moon size={15} strokeWidth={2} aria-hidden />
        <span className="hidden sm:inline">Dark</span>
      </button>
    </div>
  );
}
