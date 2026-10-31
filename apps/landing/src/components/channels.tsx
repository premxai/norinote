"use client";

import { useRef } from "react";
import {
  ArrowUp,
  BatteryFull,
  CaretLeft,
  CellSignalFull,
  ChatCircleDots,
  Code,
  EnvelopeSimple,
  Monitor,
  PaperPlaneRight,
  SlackLogo,
  TelegramLogo,
  WhatsappLogo,
  WifiHigh,
} from "@phosphor-icons/react";
import { Reveal } from "@/components/reveal";
import { useInView } from "@/lib/use-in-view";
import { useSteps } from "@/lib/use-steps";

type Msg = { from: "nori" | "you"; text: React.ReactNode };

const dashboardChat: Msg[] = [
  {
    from: "nori",
    text: (
      <>
        3 roles are waiting for you:
        <br />1. Frontend engineer · Kestrel Goods
        <br />2. Platform engineer · Stripe
        <br />3. Software engineer, new grad · Larkspur Health
      </>
    ),
  },
  { from: "you", text: "Skip the Stripe one, apply to the rest" },
  { from: "nori", text: "Skipped Platform engineer at Stripe. Approved 1 and 3. Nothing else goes out without you." },
];

// Mirrors the form review template in packages/core/src/agent/notify.ts.
const phoneThread: Msg[] = [
  {
    from: "nori",
    text: (
      <>
        Application filled for Software engineer, new grad at Larkspur Health.
        <br />14 fields, 3 written by me. Nothing is sent until you say so.
        <br />Reply &lsquo;approve 3&rsquo; to submit or &lsquo;skip 3&rsquo;.
      </>
    ),
  },
  { from: "you", text: "approve 3" },
  { from: "nori", text: "Submitted. I'll tell you when Larkspur Health replies." },
];

const commands = ["approve 2", "skip 3", "missing 1", "research 2", "set daily cap 3", "set min score 75"];

const channels = [
  { icon: TelegramLogo, label: "Telegram" },
  { icon: WhatsappLogo, label: "WhatsApp" },
  { icon: SlackLogo, label: "Slack" },
  { icon: Monitor, label: "Dashboard" },
  { icon: Code, label: "Your editor, through MCP" },
  { icon: EnvelopeSimple, label: "Email, for updates" },
];

function Thread({ messages, active, tone }: { messages: Msg[]; active: boolean; tone: "card" | "phone" }) {
  const step = useSteps(active, messages.length, 900, 300);
  return (
    <div className="flex flex-col gap-3">
      {messages.map((m, i) => (
        <div
          key={i}
          className={`max-w-[85%] rounded-2xl text-sm leading-relaxed ${tone === "phone" ? "px-3 py-2" : "px-4 py-3"} transition duration-500 ease-base ${step > i ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"} ${
            m.from === "you"
              ? "self-end bg-kelp-bright text-night"
              : tone === "phone"
                ? "self-start bg-night-line text-night-ink"
                : "self-start bg-night text-night-ink"
          }`}
        >
          {m.text}
        </div>
      ))}
      <p className={`flex items-center gap-2 text-xs text-night-muted transition-opacity duration-300 ease-base ${step > 0 && step < messages.length ? "opacity-100" : "opacity-0"}`}>
        <span className="size-1.5 animate-blink rounded-full bg-kelp-bright" /> Nori is typing
      </p>
    </div>
  );
}

export function Channels() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { rootMargin: "0px 0px -25% 0px" });

  return (
    <section id="channels" data-theme="dark" aria-labelledby="channels-title" className="bg-night px-4 py-24 text-night-ink sm:px-6">
      <div className="mx-auto max-w-7xl">
        <Reveal className="grid gap-8 lg:grid-cols-2 lg:items-end">
          <div>
            <p className="font-mono text-xs tracking-widest text-night-muted uppercase">Talk to it</p>
            <h2 id="channels-title" className="mt-6 font-serif text-4xl leading-tight md:text-5xl">
              Steer it in plain words,<br className="hidden sm:block" /> wherever you already are.
            </h2>
          </div>
          <p className="max-w-lg text-lg text-night-muted">
            Tell Nori what to do the way you would tell a friend. It understands requests like the one below, and anything it can&apos;t answer from your profile comes back to you as a question.
          </p>
        </Reveal>

        <p className="sr-only">
          Example: Nori lists three roles waiting for you. You reply &ldquo;Skip the Stripe one, apply to the rest&rdquo;, and Nori skips that role and approves the other two.
          On Telegram, Nori says an application is filled and asks you to reply &lsquo;approve 3&rsquo; to submit it.
        </p>
        <div ref={ref} aria-hidden="true" className="mt-16 grid items-center gap-12 lg:grid-cols-[1fr_auto] lg:gap-16">
          {/* Dashboard chat */}
          <div className="flex flex-col rounded-3xl border border-night-line bg-night-card p-6">
            <div className="flex items-center justify-between gap-4">
              <p className="flex items-center gap-2 text-base font-medium"><ChatCircleDots size={20} weight="duotone" className="text-kelp-bright" />Chat with Nori</p>
              <p className="font-mono text-xs text-night-muted">dashboard</p>
            </div>
            <div className="mt-6 flex-1">
              <Thread messages={dashboardChat} active={inView} tone="card" />
            </div>
            <div className="mt-6 flex items-center gap-3 rounded-xl border border-night-line bg-night py-2 pr-2 pl-4 text-sm text-night-muted">
              <span className="flex-1">Ask anything or tell Nori what to do</span>
              <span className="flex size-8 items-center justify-center rounded-lg bg-night-ink text-night"><ArrowUp size={16} weight="bold" /></span>
            </div>
          </div>

          {/* Phone thread: a phone shaped frame at 9:19.5 with notch, status bar and home indicator. */}
          <div className="relative mx-auto aspect-[9/19.5] w-72 shrink-0 rounded-4xl border border-night-line bg-night-card p-2 shadow-[0_32px_64px_-24px_rgb(0_0_0/0.6)]">
            <span className="absolute top-24 -left-px h-8 w-0.5 rounded-full bg-night-line" />
            <span className="absolute top-36 -left-px h-12 w-0.5 rounded-full bg-night-line" />
            <span className="absolute top-32 -right-px h-16 w-0.5 rounded-full bg-night-line" />
            <div className="relative flex h-full flex-col overflow-hidden rounded-3xl bg-night">
              <span className="absolute top-2 left-1/2 h-6 w-20 -translate-x-1/2 rounded-full bg-black" />
              <div className="flex items-center justify-between px-6 pt-3 text-xs font-medium text-night-ink">
                <span>9:41</span>
                <span className="flex items-center gap-1">
                  <CellSignalFull size={14} weight="fill" />
                  <WifiHigh size={14} weight="bold" />
                  <BatteryFull size={16} weight="fill" />
                </span>
              </div>
              <div className="mt-4 flex items-center gap-3 border-b border-night-line px-3 pb-3">
                <CaretLeft size={18} className="text-kelp-bright" />
                <span className="flex size-8 items-center justify-center rounded-full bg-kelp-bright/15 text-kelp-bright"><TelegramLogo size={16} weight="fill" /></span>
                <span>
                  <span className="block text-sm font-medium">Nori</span>
                  <span className="block text-xs text-night-muted">bot</span>
                </span>
              </div>
              <div className="flex-1 overflow-hidden px-3 pt-4">
                <Thread messages={phoneThread} active={inView} tone="phone" />
              </div>
              <div className="px-3 pb-2">
                <div className="flex items-center gap-2 rounded-full bg-night-line py-2 pr-3 pl-4 text-sm text-night-muted">
                  <span className="flex-1">Message</span>
                  <PaperPlaneRight size={16} weight="fill" className="text-kelp-bright" />
                </div>
                <span className="mx-auto mt-3 block h-1 w-24 rounded-full bg-night-ink/40" />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 grid gap-8 lg:grid-cols-2">
          <Reveal>
            <p className="font-mono text-xs tracking-widest text-night-muted uppercase">Or use short commands</p>
            <ul className="mt-4 flex flex-wrap gap-2">
              {commands.map((c) => (
                <li key={c} className="rounded-lg border border-night-line px-3 py-1 font-mono text-sm text-night-ink">{c}</li>
              ))}
            </ul>
          </Reveal>
          <Reveal delay={80}>
            <p className="font-mono text-xs tracking-widest text-night-muted uppercase">Works in</p>
            <ul className="mt-4 flex flex-wrap gap-x-6 gap-y-3">
              {channels.map(({ icon: Icon, label }) => (
                <li key={label} className="flex items-center gap-2 text-sm text-night-ink">
                  <Icon size={18} weight="duotone" className="text-kelp-bright" aria-hidden="true" />{label}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
