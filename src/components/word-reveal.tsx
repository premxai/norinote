"use client";

import { useEffect, useRef, useState } from "react";
import { prefersReducedMotion } from "@/lib/use-in-view";

/**
 * Large statement whose words go from muted to full in reading order as the line's center
 * moves from 90% to 50% of the viewport height. One rAF per frame at most; lit words stay lit.
 */
export function WordReveal({ text, id, className = "" }: { text: string; id?: string; className?: string }) {
  const ref = useRef<HTMLHeadingElement>(null);
  const words = text.split(" ");
  const [lit, setLit] = useState(0);

  useEffect(() => {
    if (prefersReducedMotion()) { setLit(words.length); return; }
    let queued = false;
    let max = 0;
    const update = () => {
      queued = false;
      const el = ref.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const p = Math.min(1, Math.max(0, (vh * 0.9 - (r.top + r.height / 2)) / (vh * 0.4)));
      max = Math.max(max, Math.round(p * words.length));
      setLit(max);
      if (max === words.length) window.removeEventListener("scroll", onScroll);
    };
    const onScroll = () => { if (!queued) { queued = true; requestAnimationFrame(update); } };
    window.addEventListener("scroll", onScroll, { passive: true });
    update();
    return () => window.removeEventListener("scroll", onScroll);
  }, [words.length]);

  return (
    <h2 ref={ref} id={id} aria-label={text} className={className}>
      {words.map((w, i) => (
        <span key={i} aria-hidden="true" className={`transition-opacity duration-500 ease-base ${i < lit ? "opacity-100" : "opacity-25"}`}>
          {w}{i < words.length - 1 ? " " : ""}
        </span>
      ))}
    </h2>
  );
}
