"use client";

import { useRef } from "react";
import { Briefcase, ChartLineUp, FolderSimple, Trophy } from "@phosphor-icons/react";
import { Reveal } from "@/components/reveal";
import { useCountUp } from "@/lib/use-count-up";
import { useInView } from "@/lib/use-in-view";
import { useSteps } from "@/lib/use-steps";

const facts = [
  { icon: Briefcase, kind: "Role", text: "Frontend engineer at Kestrel Goods, 2023 to 2025" },
  { icon: FolderSimple, kind: "Project", text: "Storefront rewrite: moved product images to a CDN" },
  { icon: ChartLineUp, kind: "Result", text: "Checkout load time went from 3.8s to 1.9s" },
];

/** The weighted checks in Nori's ATS checker (packages/core/src/tailor/ats.ts). They add up to 100. */
const atsWeights = [
  { label: "Covers at least 70% of required skills", weight: 15 },
  { label: "Fits on one page", weight: 15 },
  { label: "Contact details present", weight: 10 },
  { label: "Standard section headings, in order", weight: 10 },
  { label: "Single column, no tables or images", weight: 10 },
  { label: "Bullets of 8 to 30 words", weight: 10 },
  { label: "Every bullet starts with an action verb", weight: 10 },
  { label: "Dates on every role", weight: 10 },
  { label: "No first person pronouns", weight: 5 },
  { label: "Plain, parser safe characters", weight: 5 },
];

const stats = [
  { value: 10, label: "ATS checks on every resume before it goes out" },
  { value: 3, label: "Applications you approve yourself before hands-free sending can start" },
  { value: 4, label: "Job systems searched: Greenhouse, Lever, Ashby and SmartRecruiters" },
  { value: 478, label: "Automated tests keeping the agent honest" },
];

function TracedLine() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { rootMargin: "0px 0px -25% 0px" });
  const step = useSteps(inView, facts.length + 1, 350, 400);

  return (
    <div ref={ref} className="flex h-full flex-col rounded-3xl border border-line bg-card p-6 sm:p-8">
      <div className="flex items-center justify-between gap-4">
        <p className="font-mono text-xs tracking-widest text-faint uppercase">A tailored line</p>
        <span className="rounded-full bg-tone px-3 py-1 text-xs text-muted">Example</span>
      </div>

      <div className="mt-6 rounded-2xl border border-line bg-white p-6">
        <p className="font-serif text-2xl">Wren Castellano</p>
        <p className="text-sm text-muted">Frontend engineer · Oakland, CA</p>
        <p className="mt-6 flex flex-wrap items-baseline justify-between gap-x-4 text-sm font-semibold">
          Frontend engineer, Kestrel Goods <span className="font-mono text-xs font-normal text-faint">2023 to 2025</span>
        </p>
        <ul className="mt-3 flex list-disc flex-col gap-2 pl-4 text-sm text-muted marker:text-faint">
          <li>Built a shared library of 38 interface components used by 4 product teams</li>
          <li>
            <mark className={`rounded px-1 text-ink transition-colors duration-500 ease-base ${step >= 1 ? "bg-kelp-soft" : "bg-transparent"}`}>
              Cut checkout load time from 3.8s to 1.9s by moving product images to a CDN
            </mark>
          </li>
          <li>Shipped guest checkout, which grew to 41% of all orders within a quarter</li>
        </ul>
      </div>

      <p className="mt-6 flex items-center gap-3 font-mono text-xs tracking-widest text-kelp uppercase">
        <span className="h-px flex-1 border-t border-dashed border-kelp/40" aria-hidden="true" />
        Traces to
        <span className="h-px flex-1 border-t border-dashed border-kelp/40" aria-hidden="true" />
      </p>

      <ul className="mt-4 flex flex-col gap-2">
        {facts.map(({ icon: Icon, kind, text }, i) => (
          <li
            key={kind}
            className={`flex items-start gap-4 rounded-xl border border-line bg-white p-3 transition duration-500 ease-base ${step > i + 1 ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"}`}
          >
            <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-kelp-soft text-kelp" aria-hidden="true">
              <Icon size={18} weight="duotone" />
            </span>
            <span>
              <span className="block text-xs font-medium text-kelp">{kind}</span>
              <span className="block text-sm">{text}</span>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function AtsScore() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { rootMargin: "0px 0px -25% 0px" });
  const score = useCountUp(100, inView, 1400);
  const max = Math.max(...atsWeights.map((w) => w.weight));

  return (
    <div ref={ref} className="flex h-full flex-col rounded-3xl border border-line bg-card p-6 sm:p-8">
      <p className="font-mono text-xs tracking-widest text-faint uppercase">ATS readiness</p>
      <p className="mt-6 flex items-baseline gap-2">
        <span className="font-serif text-6xl tabular-nums">{score}</span>
        <span className="text-base text-muted">out of 100, scored before anything is sent</span>
      </p>

      <ul className="mt-8 flex flex-col gap-3">
        {atsWeights.map((w, i) => (
          <li key={w.label} className="grid grid-cols-[1fr_96px_24px] items-center gap-4 text-sm">
            <span className="text-muted">{w.label}</span>
            <span className="h-1.5 rounded-full bg-line" aria-hidden="true">
              <span
                className="block h-full origin-left rounded-full bg-kelp transition-transform duration-700 ease-base"
                style={{ transform: `scaleX(${inView ? w.weight / max : 0})`, transitionDelay: `${i * 60}ms` }}
              />
            </span>
            <span className="text-right font-mono text-xs text-faint">{w.weight}</span>
          </li>
        ))}
      </ul>

      <p className="mt-auto pt-6 text-xs text-faint">Weights taken straight from Nori&apos;s ATS checker.</p>
    </div>
  );
}

function Stat({ value, label, start, delay }: { value: number; label: string; start: boolean; delay: number }) {
  const n = useCountUp(value, start, 1200 + delay);
  return (
    <div className="flex flex-col-reverse justify-end gap-2 border-t border-dashed border-line pt-6">
      <dt className="text-sm text-muted">{label}</dt>
      <dd className="font-serif text-6xl tabular-nums">{n}</dd>
    </div>
  );
}

export function Proof() {
  const statsRef = useRef<HTMLDListElement>(null);
  const statsInView = useInView(statsRef);

  return (
    <section id="proof" aria-labelledby="proof-title" className="border-b border-dashed border-line bg-paper px-4 py-24 sm:px-6">
      <div className="mx-auto max-w-7xl">
        <Reveal className="max-w-[680px]">
          <p className="font-mono text-xs tracking-widest text-muted uppercase">The receipts</p>
          <h2 id="proof-title" className="mt-6 font-serif text-4xl leading-tight md:text-5xl">
            Don&apos;t take our word for it.<br className="hidden sm:block" /> Check the receipts.
          </h2>
          <p className="mt-6 text-lg text-muted">
            Every bullet Nori writes carries a link to the fact behind it, and every resume is scored before it&apos;s sent. You can open both before you approve.
          </p>
        </Reveal>

        <div className="mt-16 grid gap-6 lg:grid-cols-2">
          <Reveal className="h-full"><TracedLine /></Reveal>
          <Reveal delay={120} className="h-full"><AtsScore /></Reveal>
        </div>

        <dl ref={statsRef} className="mt-16 grid grid-cols-2 gap-x-6 gap-y-12 md:grid-cols-4">
          {stats.map((s, i) => <Stat key={s.label} {...s} start={statsInView} delay={i * 150} />)}
        </dl>

        <p className="mt-12 flex flex-wrap items-center gap-3 text-sm text-muted">
          <span className="flex items-center gap-2 rounded-full border border-line bg-card px-3 py-1 text-xs font-medium text-ink">
            <Trophy size={14} weight="duotone" className="text-kelp" aria-hidden="true" />Hackathon build
          </span>
          Made at the Cline × Composio × Parallel hackathon, San Francisco, October 2026
        </p>
      </div>
    </section>
  );
}
