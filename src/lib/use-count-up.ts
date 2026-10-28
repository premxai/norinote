"use client";

import { useEffect, useState } from "react";
import { prefersReducedMotion } from "@/lib/use-in-view";

/** Counts from 0 to `to` once `start` is true, easing out over `ms`. */
export function useCountUp(to: number, start: boolean, ms = 1200) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!start) return;
    if (prefersReducedMotion()) { setValue(to); return; }
    let raf = 0;
    const t0 = performance.now();
    const tick = (t: number) => {
      const p = Math.min(1, (t - t0) / ms);
      setValue(Math.round(to * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [to, start, ms]);
  return value;
}
