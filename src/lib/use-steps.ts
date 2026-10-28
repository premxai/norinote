"use client";

import { useEffect, useState } from "react";
import { prefersReducedMotion } from "@/lib/use-in-view";

/**
 * Counts 0 → `count` one step every `interval` ms while `active`, and resets when it goes inactive,
 * so a visual replays each time it comes back into focus. Reduced motion jumps straight to the end.
 */
export function useSteps(active: boolean, count: number, interval = 400, startDelay = 200) {
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (!active) { setStep(0); return; }
    if (prefersReducedMotion()) { setStep(count); return; }
    let timer: ReturnType<typeof setTimeout>;
    const advance = (n: number) => {
      setStep(n);
      if (n < count) timer = setTimeout(() => advance(n + 1), interval);
    };
    timer = setTimeout(() => advance(1), startDelay);
    return () => clearTimeout(timer);
  }, [active, count, interval, startDelay]);

  return step;
}
