"use client";

import { useEffect, useRef, useState } from "react";
import {
  ArrowUp,
  Bell,
  Briefcase,
  CaretUpDown,
  CheckCircle,
  FileText,
  Graph,
  LinkSimple,
  MagnifyingGlass,
  PaperPlaneTilt,
  SquaresFour,
  Tray,
} from "@phosphor-icons/react";
import { LogoMark } from "@/components/logo";
import { useCountUp } from "@/lib/use-count-up";
import { prefersReducedMotion, useInView } from "@/lib/use-in-view";

const sidebar = [
  { icon: SquaresFour, label: "Overview", count: null, active: true },
  { icon: Briefcase, label: "Matches", count: 13 },
  { icon: PaperPlaneTilt, label: "Applications", count: 5 },
  { icon: FileText, label: "Resumes", count: 9 },
  { icon: Tray, label: "Inbox", count: 2 },
  { icon: Graph, label: "Career graph", count: null },
];

const stats = [
  { label: "Roles found", value: 46, note: "Across 4 job systems", bars: [3, 5, 4, 6, 5, 8, 7, 9, 6, 8, 10, 9] },
  { label: "Skipped for you", value: 33, note: "Each one with a reason", bars: [6, 7, 5, 8, 6, 7, 9, 7, 8, 6, 7, 8] },
  { label: "Resumes tailored", value: 9, note: "10 of 10 ATS checks", bars: [1, 2, 1, 3, 2, 2, 3, 4, 3, 4, 5, 4] },
  { label: "Waiting for you", value: 3, note: "Nothing sent without your OK", bars: [0, 1, 1, 0, 2, 1, 1, 2, 1, 2, 3, 3], highlight: true },
];

const timeline = [
  { time: "07:00", title: "Board watch ran", detail: "Boards you follow on Greenhouse, Lever, Ashby and SmartRecruiters" },
  { time: "07:02", title: "46 new roles found", detail: "13 fit your titles, locations and remote setting" },
  { time: "07:03", title: "87% match at Kestrel Goods", detail: "Strong on React and design systems. Gap: GraphQL" },
  { time: "07:05", title: "Resume tailored", detail: "4 bullets rewritten, each linked to a fact you gave" },
  { time: "07:06", title: "10 of 10 ATS checks passed", detail: "One page, single column, dates on every role" },
];

function Stat({ label, value, note, bars, highlight, start }: (typeof stats)[number] & { start: boolean }) {
  const n = useCountUp(value, start);
  const max = Math.max(...bars, 1);
  return (
    <div className={`rounded-xl border bg-white p-4 ${highlight ? "border-amber/40" : "border-line"}`}>
      <p className="text-sm text-muted">{label}</p>
      <div className="mt-2 flex items-end justify-between gap-3">
        <p className={`text-3xl font-medium tabular-nums tracking-tight ${highlight ? "text-amber" : ""}`}>{n}</p>
        <svg viewBox="0 0 60 24" className="h-6 w-16" aria-hidden="true">
          {bars.map((b, i) => (
            <rect key={i} x={i * 5} y={24 - (b / max) * 22} width="3" height={(b / max) * 22 || 1} rx="1" className={highlight ? "fill-amber/50" : "fill-kelp/40"} />
          ))}
        </svg>
      </div>
      <p className="mt-2 text-xs text-faint">{note}</p>
    </div>
  );
}

export function DashboardMock() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { rootMargin: "0px 0px -15% 0px" });
  const [steps, setSteps] = useState(0);

  // Timeline entries arrive one after another once the mock is on screen.
  useEffect(() => {
    if (!inView) return;
    if (prefersReducedMotion()) { setSteps(timeline.length + 1); return; }
    const id = setInterval(() => setSteps((s) => (s > timeline.length ? s : s + 1)), 380);
    return () => clearInterval(id);
  }, [inView]);

  const shown = (i: number) => (steps > i ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2");

  return (
    <div
      ref={ref}
      role="img"
      aria-label="Preview of the Nori dashboard. Today's search found 46 roles, skipped 33 with reasons, tailored 9 resumes, and 3 applications are waiting for your approval."
      className="rounded-3xl border border-line bg-card/80 p-2 shadow-[0_32px_64px_-32px_rgb(26_25_20/0.25)] backdrop-blur"
    >
      <div aria-hidden="true" className="grid overflow-hidden rounded-2xl border border-line bg-paper text-left lg:grid-cols-[232px_1fr]">
        {/* Sidebar */}
        <aside className="hidden flex-col gap-6 border-r border-line bg-card p-4 lg:flex">
          <div className="flex items-center gap-3 rounded-xl p-2">
            <LogoMark className="size-8 shrink-0" />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold">Wren Castellano</p>
              <p className="truncate font-mono text-xs text-faint">oakland, ca</p>
            </div>
            <CaretUpDown size={16} className="text-faint" />
          </div>
          <ul className="flex flex-col gap-1 text-sm">
            {sidebar.map(({ icon: Icon, label, count, active }) => (
              <li key={label} className={`flex items-center gap-3 rounded-lg px-3 py-2 ${active ? "bg-white font-medium shadow-sm" : "text-muted"}`}>
                <Icon size={18} weight={active ? "duotone" : "regular"} />
                <span className="flex-1">{label}</span>
                {count !== null && <span className="font-mono text-xs text-faint">{count}</span>}
              </li>
            ))}
          </ul>
          <div className="mt-auto rounded-xl border border-line p-3">
            <p className="text-xs font-medium">Morning brief</p>
            <p className="mt-1 font-mono text-xs text-faint">08:00 · every day</p>
          </div>
        </aside>

        {/* Main */}
        <div className="min-w-0 p-4 sm:p-6">
          <div className="flex items-center gap-3">
            <div className="flex min-w-0 flex-1 items-center gap-3 rounded-xl border border-line bg-white py-2 pr-2 pl-3">
              <MagnifyingGlass size={18} className="shrink-0 text-faint" />
              <span className="flex-1 truncate text-sm">Which roles fit me this week?</span>
              <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-ink text-paper"><ArrowUp size={16} weight="bold" /></span>
            </div>
            <span className="hidden items-center gap-2 rounded-full bg-kelp-soft px-3 py-1 text-xs font-medium text-kelp sm:flex">
              <span className="size-2 animate-blink rounded-full bg-kelp" /> Live
            </span>
            <Bell size={20} className="hidden shrink-0 text-muted sm:block" />
          </div>

          <div className="mt-8 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="font-mono text-xs tracking-widest text-faint uppercase">Thursday, 29 October</p>
              <p className="mt-2 font-serif text-3xl">Today&apos;s search is done.</p>
            </div>
            <div className="flex flex-wrap gap-x-6 gap-y-1 text-sm text-muted">
              <span className="flex items-center gap-2"><span className="size-2 rounded-full bg-amber" />3 waiting for your OK</span>
              <span className="flex items-center gap-2"><span className="size-2 rounded-full bg-kelp" />2 recruiter replies this week</span>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3 xl:grid-cols-4">
            {stats.map((s) => <Stat key={s.label} {...s} start={inView} />)}
          </div>

          <div className="mt-3 grid gap-3 lg:grid-cols-[1.5fr_1fr]">
            {/* Application timeline */}
            <div className="rounded-xl border border-line bg-white p-4 sm:p-6">
              <div className="flex flex-wrap items-center gap-3">
                <span className="rounded-md bg-tone px-2 py-0.5 font-mono text-xs text-muted">APP-14</span>
                <p className="order-last basis-full text-sm font-semibold sm:order-none sm:flex-1 sm:basis-auto">Frontend engineer at Kestrel Goods</p>
                <span className="ml-auto rounded-full bg-amber-soft px-2 py-0.5 text-xs font-medium text-amber sm:ml-0">Waiting for you</span>
              </div>
              <ol className="relative mt-6 flex flex-col gap-4 before:absolute before:top-2 before:bottom-2 before:left-[3px] before:w-px before:bg-line">
                {timeline.map((t, i) => (
                  <li key={t.time} className={`relative grid grid-cols-[8px_48px_1fr] items-start gap-3 transition duration-500 ease-base ${shown(i)}`}>
                    <span className="mt-1.5 size-2 rounded-full bg-kelp" />
                    <span className="font-mono text-xs text-faint">{t.time}</span>
                    <span>
                      <span className="block text-sm font-medium">{t.title}</span>
                      <span className="block text-xs text-muted">{t.detail}</span>
                    </span>
                  </li>
                ))}
                <li className={`relative grid grid-cols-[8px_48px_1fr] items-start gap-3 transition duration-500 ease-base ${shown(timeline.length)}`}>
                  <span className="mt-1.5 size-2 animate-blink rounded-full bg-amber" />
                  <span className="font-mono text-xs text-amber">now</span>
                  <span className="flex flex-wrap items-center justify-between gap-3">
                    <span>
                      <span className="block text-sm font-medium">Form filled, waiting for you</span>
                      <span className="block text-xs text-muted">Review the changes before anything is sent</span>
                    </span>
                    <span className="flex gap-2">
                      <span className="rounded-lg border border-line px-3 py-1 text-xs font-medium text-muted">Skip</span>
                      <span className="rounded-lg bg-ink px-3 py-1 text-xs font-medium text-paper">Approve</span>
                    </span>
                  </span>
                </li>
              </ol>
            </div>

            {/* Tailored line */}
            <div className="flex flex-col rounded-xl border border-line bg-white p-4 sm:p-6">
              <p className="font-mono text-xs tracking-widest text-faint uppercase">Tailored line</p>
              <div className="mt-4 rounded-lg bg-tone p-3">
                <p className="text-xs text-faint">Before</p>
                <p className="mt-1 text-sm text-muted line-through decoration-faint/60">Worked on checkout performance improvements</p>
              </div>
              <div className="mt-2 rounded-lg bg-kelp-soft p-3">
                <p className="text-xs text-kelp">After</p>
                <p className="mt-1 text-sm font-medium">Cut checkout load time from 3.8s to 1.9s by moving product images to a CDN</p>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                <span className="flex items-center gap-1 rounded-full border border-line px-2 py-0.5 text-xs text-muted"><LinkSimple size={12} /> Project: Storefront rewrite</span>
                <span className="flex items-center gap-1 rounded-full border border-line px-2 py-0.5 text-xs text-muted"><LinkSimple size={12} /> Result: 3.8s to 1.9s</span>
              </div>
              <p className="mt-auto flex items-center gap-2 pt-4 text-xs text-kelp">
                <CheckCircle size={16} weight="fill" /> Every word traces to Wren&apos;s career graph
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
