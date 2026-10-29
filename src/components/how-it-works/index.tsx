"use client";

import { useEffect, useRef, useState, type ComponentType } from "react";
import { WordReveal } from "@/components/word-reveal";
import { useInView } from "@/lib/use-in-view";
import { CareerGraphVisual, QueueVisual, ShortlistVisual, TailorVisual } from "./visuals";

type Feature = { title: string; body: string; Visual: ComponentType<{ active: boolean }> };

const features: Feature[] = [
  {
    title: "Maps your career, end to end",
    body: "Nori reads your resume and turns it into a career graph: your roles, projects, skills, results and education, and how they connect. Every line it writes later points back here.",
    Visual: CareerGraphVisual,
  },
  {
    title: "Turns job noise into a shortlist",
    body: "Nori checks the Greenhouse, Lever, Ashby and SmartRecruiters boards you follow every hour and searches the wider web every few hours. Roles outside your titles, locations or minimum match are skipped, and every skip comes with a reason.",
    Visual: ShortlistVisual,
  },
  {
    title: "Ranks what to apply to next",
    body: "Every match is scored against your history. Your daily cap decides how many get queued each day, so you never wake up to fifty applications.",
    Visual: QueueVisual,
  },
  {
    title: "Tailors the resume, then shows its work",
    body: "Nori rewrites bullets only from facts in your graph, runs 10 ATS checks, fills the form and stops. You see every change and its source before anything is sent.",
    Visual: TailorVisual,
  },
];

/** One text block. Reports when it crosses the middle of the viewport; on small screens it also shows its own visual. */
function Step({ index, feature, onActive }: { index: number; feature: Feature; onActive: (i: number) => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const centered = useInView(ref, { once: false, rootMargin: "-50% 0px -50% 0px" });
  const seen = useInView(ref, { once: false, rootMargin: "0px 0px -20% 0px" });
  const { Visual } = feature;

  useEffect(() => { if (centered) onActive(index); }, [centered, index, onActive]);

  return (
    <div ref={ref} className="flex flex-col justify-center py-12 lg:min-h-[80vh] lg:py-0">
      <p className="font-mono text-xs text-kelp-bright">{String(index + 1).padStart(2, "0")}</p>
      <h3 className="mt-4 font-serif text-3xl md:text-4xl">{feature.title}</h3>
      <p className="mt-4 max-w-md text-lg text-night-muted">{feature.body}</p>
      <div className="mt-8 lg:hidden">
        <Visual active={seen} />
      </div>
    </div>
  );
}

export function HowItWorks() {
  const [active, setActive] = useState(0);

  return (
    <section id="how-it-works" data-theme="dark" aria-labelledby="how-title" className="bg-night px-4 py-24 text-night-ink sm:px-6">
      <div className="mx-auto max-w-7xl">
        <p className="font-mono text-xs tracking-widest text-night-muted uppercase">How Nori works</p>
        <WordReveal
          id="how-title"
          text="Your resume, the job post and the application each tell part of the story. Nori reads all of it before it writes a single word."
          className="mt-6 max-w-4xl font-serif text-4xl leading-tight md:text-5xl"
        />

        <div className="mt-16 grid gap-12 lg:grid-cols-[1fr_1.15fr] lg:gap-16">
          <div>
            {features.map((f, i) => (
              <Step key={f.title} index={i} feature={f} onActive={setActive} />
            ))}
          </div>

          {/* Pinned panel on large screens: the visual for the step in the middle of the viewport. */}
          <div className="hidden lg:block">
            <div className="sticky top-24 h-[36rem]">
              {features.map(({ title, Visual }, i) => (
                <div
                  key={title}
                  className={`absolute inset-0 transition duration-500 ease-base ${active === i ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-4 opacity-0"}`}
                >
                  <Visual active={active === i} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
