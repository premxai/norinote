"use client";

import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { Binoculars, CalendarCheck, EnvelopeSimple, GlobeHemisphereWest, ListChecks, SunHorizon, type Icon } from "@phosphor-icons/react";
import { Reveal } from "@/components/reveal";
import { prefersReducedMotion, useInView } from "@/lib/use-in-view";

type Round = {
  id: string;
  icon: Icon;
  name: string;
  job: string;
  cadence: string;
  body: string;
  scope: string;
  sample: { label: string; lines: string[] };
};

// Cadences come from apps/worker/src/runtime.ts and packages/core/src/agent/loop.ts defaults.
const rounds: Round[] = [
  {
    id: "boards",
    icon: Binoculars,
    name: "Board watch",
    job: "New roles on boards you follow",
    cadence: "Hourly",
    body: "Checks the Greenhouse, Lever, Ashby and SmartRecruiters boards you follow and scores every new role against your career graph.",
    scope: "Boards you follow",
    sample: { label: "Board watch · 10:00", lines: ["12 new roles on boards you follow", "3 scored above your 70% match"] },
  },
  {
    id: "web",
    icon: GlobeHemisphereWest,
    name: "Web scout",
    job: "Roles beyond your boards",
    cadence: "Every 6 hours",
    body: "Searches the open web for roles that match your titles, so a good opening at a company you haven't followed still reaches you.",
    scope: "Your titles and locations",
    sample: { label: "Web scout · 12:00", lines: ["Found UI engineer at Quarry Labs", "Matches your Frontend engineer title, scored 71%"] },
  },
  {
    id: "queue",
    icon: ListChecks,
    name: "Queue keeper",
    job: "Gates, queues and moves work forward",
    cadence: "Every 20 min",
    body: "Checks each match against your lanes and minimum match, queues up to your daily cap, tailors and fills, then stops to ask you.",
    scope: "Your lanes and daily cap",
    sample: { label: "Queue keeper · 10:20", lines: ["Queued 3 of 3 for today", "Resume ready for Frontend engineer at Kestrel Goods"] },
  },
  {
    id: "inbox",
    icon: EnvelopeSimple,
    name: "Inbox reader",
    job: "Recruiter replies and codes",
    cadence: "Every 5 min",
    body: "Reads new mail for recruiter replies, interview requests, offers, rejections and verification codes. It updates each application and drafts a reply for you to send.",
    scope: "Gmail, when you connect it",
    sample: { label: "Inbox reader · 14:05", lines: ["Interview request from Kestrel Goods", "Application moved to Interview, reply drafted"] },
  },
  {
    id: "brief",
    icon: SunHorizon,
    name: "Morning brief",
    job: "One message, once a day",
    cadence: "Daily at 8:00",
    body: "A short summary of what happened since yesterday and what is waiting on you, sent to the channel you use most.",
    scope: "Your local time",
    sample: { label: "Morning brief · 08:00", lines: ["Good morning. Since yesterday: 2 sent, 1 reply.", "Waiting on you: 1. Reply 'approve 1' or 'skip 1'."] },
  },
  {
    id: "weekly",
    icon: CalendarCheck,
    name: "Weekly recap",
    job: "How the week went",
    cadence: "Mondays at 8:00",
    body: "Every Monday, a look back at the week: what went out, who replied, and where things stand.",
    scope: "The last 7 days",
    sample: { label: "Weekly recap · Monday 08:00", lines: ["This week: 9 applications sent", "2 recruiter replies, 1 interview"] },
  },
];

const ROTATE_MS = 6000;

export function DailyRounds() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const inView = useInView(ref, { once: false, rootMargin: "-20% 0px -20% 0px" });
  const rotating = inView && !paused && !prefersReducedMotion();

  // Advance to the next round on a timer while the section is on screen and nobody is interacting.
  useEffect(() => {
    if (!rotating) return;
    const id = setTimeout(() => setActive((a) => (a + 1) % rounds.length), ROTATE_MS);
    return () => clearTimeout(id);
  }, [rotating, active]);

  const onKey = (e: KeyboardEvent<HTMLButtonElement>, i: number) => {
    const next = e.key === "ArrowDown" || e.key === "ArrowRight" ? 1 : e.key === "ArrowUp" || e.key === "ArrowLeft" ? -1 : 0;
    if (!next) return;
    e.preventDefault();
    const n = (i + next + rounds.length) % rounds.length;
    setActive(n);
    tabRefs.current[n]?.focus();
  };

  const r = rounds[active];

  return (
    <section aria-labelledby="rounds-title" className="relative isolate overflow-hidden border-b border-dashed border-line bg-tone px-4 py-24 sm:px-6">
      <div aria-hidden="true" className="dot-grid absolute inset-0 -z-10 opacity-60" />
      <div className="mx-auto max-w-7xl">
        <Reveal className="grid gap-8 lg:grid-cols-2 lg:items-end">
          <div>
            <p className="font-mono text-xs tracking-widest text-muted uppercase">In the background</p>
            <h2 id="rounds-title" className="mt-6 font-serif text-4xl leading-tight md:text-5xl">
              Busy in the background.<br className="hidden sm:block" /> Never behind your back.
            </h2>
          </div>
          <p className="max-w-lg text-lg text-muted">
            Nori runs a handful of small jobs on a schedule. They find, sort and read, so the only things that reach you are the ones that need a decision.
          </p>
        </Reveal>

        <div
          ref={ref}
          className="mt-16 grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)]"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onFocus={() => setPaused(true)}
          onBlur={() => setPaused(false)}
        >
          <div role="tablist" aria-label="Background jobs" aria-orientation="vertical" className="flex flex-col gap-2">
            {rounds.map((round, i) => {
              const selected = i === active;
              const Icon = round.icon;
              return (
                <button
                  key={round.id}
                  ref={(el) => { tabRefs.current[i] = el; }}
                  role="tab"
                  id={`round-tab-${round.id}`}
                  aria-selected={selected}
                  aria-controls="round-panel"
                  tabIndex={selected ? 0 : -1}
                  onClick={() => setActive(i)}
                  onKeyDown={(e) => onKey(e, i)}
                  className={`flex items-center gap-4 rounded-2xl border px-4 py-3 text-left transition duration-300 ease-base focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-kelp ${selected ? "border-line bg-card shadow-sm" : "border-transparent hover:bg-card/60"}`}
                >
                  <span className={`flex size-10 shrink-0 items-center justify-center rounded-xl transition-colors duration-300 ease-base ${selected ? "bg-kelp-soft text-kelp" : "bg-card/70 text-muted"}`}>
                    <Icon size={20} weight="duotone" aria-hidden="true" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-base font-medium">{round.name}</span>
                    <span className="block truncate text-sm text-muted">{round.job}</span>
                  </span>
                  <span className="shrink-0 rounded-full bg-paper px-2 py-0.5 font-mono text-xs text-muted">{round.cadence}</span>
                </button>
              );
            })}
          </div>

          <div
            id="round-panel"
            role="tabpanel"
            aria-labelledby={`round-tab-${r.id}`}
            className="flex flex-col rounded-3xl border border-line bg-card p-6 sm:p-8"
          >
            <div key={r.id} className="flex flex-1 animate-rise flex-col">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <p className="flex items-center gap-3 font-serif text-3xl">
                  <r.icon size={28} weight="duotone" className="text-kelp" aria-hidden="true" />
                  {r.name}
                </p>
                <span className="rounded-full bg-kelp-soft px-3 py-1 font-mono text-xs text-kelp">{r.cadence}</span>
              </div>
              <p className="mt-6 max-w-xl text-lg text-muted">{r.body}</p>

              <div className="mt-8 rounded-2xl border border-line bg-white p-4" aria-label="Example output">
                <p className="font-mono text-xs text-faint">{r.sample.label}</p>
                <ul className="mt-3 flex flex-col gap-2">
                  {r.sample.lines.map((line) => (
                    <li key={line} className="flex items-start gap-3 text-sm">
                      <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-kelp" aria-hidden="true" />
                      {line}
                    </li>
                  ))}
                </ul>
              </div>

              <dl className="mt-auto grid grid-cols-2 gap-4 pt-8 text-sm">
                <div>
                  <dt className="font-mono text-xs tracking-widest text-faint uppercase">Looks at</dt>
                  <dd className="mt-1">{r.scope}</dd>
                </div>
                <div>
                  <dt className="font-mono text-xs tracking-widest text-faint uppercase">Runs</dt>
                  <dd className="mt-1">{r.cadence}</dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
