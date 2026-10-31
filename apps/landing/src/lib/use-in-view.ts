"use client";

import { useEffect, useState, type RefObject } from "react";

/** True once the element has entered the viewport. With `once: false` it tracks visibility both ways. */
export function useInView<T extends Element>(
  ref: RefObject<T | null>,
  { once = true, rootMargin = "0px 0px -10% 0px", threshold = 0 }: { once?: boolean; rootMargin?: string; threshold?: number } = {},
) {
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          if (once) io.disconnect();
        } else if (!once) {
          setInView(false);
        }
      },
      { rootMargin, threshold },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [ref, once, rootMargin, threshold]);

  return inView;
}

export function prefersReducedMotion() {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}
