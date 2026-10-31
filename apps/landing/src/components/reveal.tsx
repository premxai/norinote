"use client";

import { useRef, type ElementType, type ComponentPropsWithoutRef } from "react";
import { useInView } from "@/lib/use-in-view";

type RevealProps<T extends ElementType> = {
  as?: T;
  delay?: number;
} & ComponentPropsWithoutRef<T>;

/** Rises 32px and fades in the first time it scrolls into view. */
export function Reveal<T extends ElementType = "div">({ as, delay = 0, className = "", style, ...rest }: RevealProps<T>) {
  const Tag = (as ?? "div") as ElementType;
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref);
  return (
    <Tag
      ref={ref}
      className={`reveal ${inView ? "in" : ""} ${className}`}
      style={{ transitionDelay: `${delay}ms`, ...style }}
      {...rest}
    />
  );
}
