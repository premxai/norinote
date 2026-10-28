"use client";

import { CheckCircle, Circle, LinkSimple, SortDescending, Sparkle } from "@phosphor-icons/react";
import { useSteps } from "@/lib/use-steps";
import { CareerGraph, PERSON, graphLegend, graphNodes, groupColor } from "./career-graph";

/* Shared frame for every feature visual: a dark card with a header and a status line. */
function Panel({ title, meta, status, children }: { title: string; meta: string; status: React.ReactNode; children: React.ReactNode }) {
  return (
    <div aria-hidden="true" className="flex h-full flex-col rounded-3xl border border-night-line bg-night-card p-6 text-night-ink">
      <div className="flex items-baseline justify-between gap-4">
        <p className="text-base font-medium">{title}</p>
        <p className="font-mono text-xs text-night-muted">{meta}</p>
      </div>
      <div className="relative mt-6 min-h-72 flex-1">{children}</div>
      <div className="mt-6 flex items-center gap-2 rounded-xl border border-night-line px-4 py-3 text-sm text-night-muted">{status}</div>
    </div>
  );
}

const show = (on: boolean) => (on ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2");

/* ---------- 1. Career graph ---------- */

export function CareerGraphVisual({ active }: { active: boolean }) {
  const step = useSteps(active, 2, 1100, 200);
  return (
    <Panel
      title="Career graph"
      meta={PERSON}
      status={step >= 2
        ? <><CheckCircle size={16} weight="fill" className="text-kelp-bright" />Graph ready · {graphNodes.length - 1} facts linked</>
        : <><Sparkle size={16} className="animate-blink text-kelp-bright" />{step === 0 ? "Reading your resume" : "Linking your facts"}</>}
    >
      <CareerGraph active={active} />
      <ul className="pointer-events-none absolute bottom-0 left-0 flex flex-wrap gap-x-4 gap-y-1 text-xs text-night-muted">
        {graphLegend.map((g) => (
          <li key={g.group} className="flex items-center gap-1.5">
            <span className="size-2 rounded-full" style={{ background: groupColor[g.group] }} />
            {g.label}
          </li>
        ))}
      </ul>
    </Panel>
  );
}

/* ---------- 2. Shortlist ---------- */

const roles = [
  { role: "Frontend engineer", company: "Kestrel Goods", match: true, tag: "87% match" },
  { role: "Senior staff engineer", company: "Halden Bank", match: false, tag: "Title outside your lanes" },
  { role: "Software engineer, new grad", company: "Larkspur Health", match: true, tag: "81% match" },
  { role: "Backend engineer", company: "Porto Freight", match: false, tag: "Onsite in Austin, you chose remote" },
  { role: "React developer", company: "Tidewater Labs", match: true, tag: "74% match" },
  { role: "Mobile engineer", company: "Brightline Media", match: false, tag: "52% match, below your 70%" },
];

export function ShortlistVisual({ active }: { active: boolean }) {
  const step = useSteps(active, roles.length + 1, 300);
  return (
    <Panel
      title="Today's roles"
      meta="46 found · 4 job systems"
      status={step > roles.length
        ? <><CheckCircle size={16} weight="fill" className="text-kelp-bright" />13 matched · 33 skipped, each with a reason</>
        : <><Sparkle size={16} className="animate-blink text-kelp-bright" />Sorting through today&apos;s roles</>}
    >
      <ul className="flex flex-col gap-2">
        {roles.map((r, i) => (
          <li
            key={r.company}
            className={`flex flex-col items-start gap-2 rounded-xl border px-4 py-3 transition duration-500 ease-base sm:flex-row sm:items-center sm:justify-between sm:gap-4 ${r.match ? "border-night-line bg-night" : "border-transparent"} ${show(step > i)}`}
          >
            <span className={`min-w-0 ${r.match ? "" : "opacity-50"}`}>
              <span className="block truncate text-sm font-medium">{r.role}</span>
              <span className="block text-xs text-night-muted">{r.company}</span>
            </span>
            <span className={`shrink-0 rounded-full px-2 py-0.5 text-xs ${r.match ? "bg-kelp-bright/15 text-kelp-bright" : "text-night-muted"}`}>
              {r.match ? r.tag : `Skipped: ${r.tag}`}
            </span>
          </li>
        ))}
      </ul>
    </Panel>
  );
}

/* ---------- 3. Ranked queue ---------- */

const queue = [
  { role: "React developer", company: "Tidewater Labs", score: 74 },
  { role: "Frontend engineer", company: "Kestrel Goods", score: 87 },
  { role: "UI engineer", company: "Quarry Labs", score: 71 },
  { role: "Software engineer, new grad", company: "Larkspur Health", score: 81 },
];
const ranked = [...queue].sort((a, b) => b.score - a.score);
const CAP = 3;
const ROW = 76; // row height plus gap, in px

export function QueueVisual({ active }: { active: boolean }) {
  const step = useSteps(active, 2, 900, 500);
  const sorted = step >= 1;
  return (
    <Panel
      title="Your queue"
      meta={`Daily cap ${CAP}`}
      status={sorted
        ? <><SortDescending size={16} className="text-kelp-bright" />Sorted by match. The top {CAP} get tailored today.</>
        : <><Sparkle size={16} className="animate-blink text-kelp-bright" />Ranking today&apos;s matches</>}
    >
      <div className="flex h-full flex-col justify-center">
      <ol className="relative" style={{ height: queue.length * ROW }}>
        {queue.map((q) => {
          const rank = sorted ? ranked.indexOf(q) : queue.indexOf(q);
          const today = sorted && rank < CAP;
          return (
            <li
              key={q.company}
              style={{ transform: `translateY(${rank * ROW}px)` }}
              className={`absolute inset-x-0 top-0 flex h-16 items-center gap-4 rounded-xl border px-4 transition duration-700 ease-base ${today ? "border-kelp-bright/40 bg-night" : "border-night-line"}`}
            >
              <span className="w-6 font-mono text-xs text-night-muted">{String(rank + 1).padStart(2, "0")}</span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-medium">{q.role}</span>
                <span className="block text-xs text-night-muted">{q.company}</span>
              </span>
              <span className="hidden w-24 sm:block">
                <span className="block h-1.5 rounded-full bg-night-line">
                  <span className="block h-full origin-left rounded-full bg-kelp-bright" style={{ transform: `scaleX(${q.score / 100})` }} />
                </span>
              </span>
              <span className="w-10 text-right font-mono text-xs">{q.score}%</span>
              <span className={`w-24 text-right text-xs transition-opacity duration-500 ease-base ${sorted ? "opacity-100" : "opacity-0"} ${today ? "text-kelp-bright" : "text-night-muted"}`}>
                {today ? "Tailor today" : "Tomorrow"}
              </span>
            </li>
          );
        })}
      </ol>
      </div>
    </Panel>
  );
}

/* ---------- 4. Tailor and show the work ---------- */

const diff = [
  { before: "Worked on checkout performance improvements", after: "Cut checkout load time from 3.8s to 1.9s by moving product images to a CDN", source: "Project: Storefront rewrite" },
  { before: "Helped build reusable UI components", after: "Built a library of 38 interface components used by 4 product teams", source: "Project: Design system" },
];
const checks = ["Contact details", "Standard headings", "Single column", "Bullet length", "Action verbs", "Dates on roles", "70% of skills", "One page", "No pronouns", "Plain characters"];

export function TailorVisual({ active }: { active: boolean }) {
  const step = useSteps(active, diff.length + checks.length + 1, 160, 300);
  const checked = Math.max(0, step - diff.length);
  const done = step > diff.length + checks.length;
  return (
    <Panel
      title="Frontend engineer at Kestrel Goods"
      meta="APP-14"
      status={done
        ? <span className="flex w-full flex-wrap items-center justify-between gap-3"><span className="flex items-center gap-2"><span className="size-2 animate-blink rounded-full bg-amber-light" />Form filled, waiting for your OK</span><span className="rounded-lg bg-night-ink px-3 py-1 text-xs font-medium text-night">Approve</span></span>
        : <><Sparkle size={16} className="animate-blink text-kelp-bright" />Rewriting from your career graph</>}
    >
      <div className="flex flex-col gap-3">
        {diff.map((d, i) => (
          <div key={d.source} className={`rounded-xl border border-night-line p-3 font-mono text-xs transition duration-500 ease-base ${show(step > i)}`}>
            <p className="flex gap-2 text-night-muted"><span className="text-[#E08A7B]">−</span><span className="line-through decoration-night-muted/50">{d.before}</span></p>
            <p className="mt-1 flex gap-2 text-night-ink"><span className="text-kelp-bright">+</span><span>{d.after}</span></p>
            <p className="mt-2 flex items-center gap-1 font-sans text-night-muted"><LinkSimple size={12} />{d.source}</p>
          </div>
        ))}
      </div>
      <p className="mt-6 text-xs text-night-muted">ATS checks · {checked > checks.length ? checks.length : Math.min(checked, checks.length)} of {checks.length}</p>
      <ul className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
        {checks.map((c, i) => (
          <li key={c} className="flex items-center gap-2">
            {checked > i
              ? <CheckCircle size={14} weight="fill" className="shrink-0 text-kelp-bright" />
              : <Circle size={14} className="shrink-0 text-night-line" />}
            <span className={checked > i ? "text-night-ink" : "text-night-muted"}>{c}</span>
          </li>
        ))}
      </ul>
    </Panel>
  );
}
