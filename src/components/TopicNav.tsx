"use client";

// Topic list for a unit. Tapping a topic scrolls smoothly to it and pulses its card.
export default function TopicNav({ topics, color }: { topics: { id: string; title: string }[]; color: string }) {
  function goTo(id: string) {
    const el = document.getElementById(`topic-${id}`);
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "start" });
    el.classList.remove("topic-flash");
    // Restart the highlight animation even if the same topic is tapped twice.
    void el.offsetWidth;
    el.classList.add("topic-flash");
    window.setTimeout(() => el.classList.remove("topic-flash"), 1200);
  }

  return (
    <nav aria-label="Topics" className="no-scrollbar -mx-1 flex gap-2 overflow-x-auto px-1 pb-1 lg:sticky lg:top-24 lg:mx-0 lg:flex-col lg:overflow-visible lg:px-0">
      {topics.map((t) => (
        <button
          key={t.id}
          type="button"
          onClick={() => goTo(t.id)}
          className="chip focus-ring shrink-0 cursor-pointer !rounded-xl !px-3 !py-2 !text-left !text-[13px] transition-transform hover:translate-x-0.5 hover:text-[var(--fg)]"
        >
          <span className="font-bold" style={{ color }}>
            {t.id}
          </span>
          <span className="truncate">{t.title}</span>
        </button>
      ))}
    </nav>
  );
}
