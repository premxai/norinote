"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { ArrowUpRight, X } from "lucide-react";
import type { ResumeBullet, ResumeChange, ResumeContent } from "@/lib/types";
import { Icon } from "../Icon";
import { cx } from "../cx";

/** A fact from the career graph, as a changed line cites it. */
export type NodeInfo = { label: string; type: string; quote?: string | null };

/**
 * The tailored resume as a page, with every changed line highlighted where it sits. Clicking a highlight opens a small
 * card with the line it replaced, why it changed, the facts it came from, and Keep or Revert. A reverted line shows the
 * original text, marked as reverted. Read only when `onKeep` is not given.
 */
export function ResumeMarkup({ content, changes, nodes, reverted, onKeep, disabled }: {
  content: ResumeContent;
  changes: ResumeChange[];
  nodes: Record<string, NodeInfo>;
  reverted?: Set<string>;
  onKeep?: (bulletId: string, keep: boolean) => void;
  disabled?: boolean;
}) {
  const byId = new Map(changes.map((c) => [c.bulletId, c]));
  const [open, setOpen] = useState<string | null>(null);
  const root = useRef<HTMLDivElement>(null);

  // Close the open card on Escape or a click elsewhere on the page.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(null); };
    const onDown = (e: MouseEvent) => { if (!root.current?.contains(e.target as Node)) setOpen(null); };
    window.addEventListener("keydown", onKey);
    window.addEventListener("mousedown", onDown);
    return () => { window.removeEventListener("keydown", onKey); window.removeEventListener("mousedown", onDown); };
  }, [open]);

  const placed = new Set<string>();
  const bullet = (b: ResumeBullet) => {
    const change = byId.get(b.id);
    if (!change) return <li key={b.id}>{b.text}</li>;
    placed.add(b.id);
    const isReverted = reverted?.has(b.id) ?? false;
    const isOpen = open === b.id;
    return (
      <li key={b.id} className="relative">
        {/* A span, not a button, so the highlight wraps line by line like a marker pen instead of as one box. */}
        <span
          role="button"
          tabIndex={0}
          aria-expanded={isOpen}
          aria-label={`${isReverted ? "Reverted line" : "Changed line"}. Show what it replaced.`}
          onClick={() => setOpen(isOpen ? null : b.id)}
          onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setOpen(isOpen ? null : b.id); } }}
          className={cx(
            "cursor-pointer rounded-[4px] px-1 py-px [box-decoration-break:clone] transition-colors duration-200",
            isReverted ? "bg-sunken text-ink-2 underline decoration-control decoration-dotted underline-offset-4" : "bg-accent-tint text-ink hover:bg-[#d3e9e4]",
            isOpen && "bg-[#d3e9e4] shadow-[inset_0_-2px_0_var(--accent)]",
          )}
        >
          {isReverted ? change.before : change.after}
        </span>
        {isOpen && <ChangePopover change={change} nodes={nodes} reverted={isReverted} onKeep={onKeep} disabled={disabled} onClose={() => setOpen(null)} />}
      </li>
    );
  };

  const c = content;
  const contact = [c.contact.email, c.contact.phone, c.contact.location, c.contact.linkedin, c.contact.website, c.contact.github].filter(Boolean);

  const section = (title: string, children: ReactNode) => (
    <section className="mt-5">
      <h3 className="border-b border-line pb-1 font-mono text-[10.5px] uppercase tracking-[0.14em] text-muted">{title}</h3>
      <div className="mt-2.5">{children}</div>
    </section>
  );

  const doc = (
    <article className="text-[13px] leading-[1.55] text-ink">
      <header>
        <p className="font-display text-[1.6rem] leading-tight">{c.name}</p>
        {contact.length > 0 && <p className="mt-1 text-[12px] text-muted">{contact.join("  ·  ")}</p>}
      </header>
      {c.summary && <p className="mt-4 text-ink-2">{c.summary}</p>}
      {c.experience.length > 0 && section("Experience", (
        <div className="flex flex-col gap-4">
          {c.experience.map((e, i) => (
            <div key={`${e.company}-${i}`}>
              <p className="flex flex-wrap items-baseline justify-between gap-x-4 font-semibold">
                <span>{e.title}, {e.company}</span>
                <span className="text-[12px] font-normal text-muted tnum">{[e.start, e.end].filter(Boolean).join(" to ")}</span>
              </p>
              <ul className="mt-1.5 flex list-disc flex-col gap-1.5 pl-4 marker:text-control">{e.bullets.map(bullet)}</ul>
            </div>
          ))}
        </div>
      ))}
      {(c.projects?.length ?? 0) > 0 && section("Projects", (
        <div className="flex flex-col gap-4">
          {c.projects!.map((p) => (
            <div key={p.name}>
              <p className="font-semibold">{p.name}</p>
              <ul className="mt-1.5 flex list-disc flex-col gap-1.5 pl-4 marker:text-control">{p.bullets.map(bullet)}</ul>
            </div>
          ))}
        </div>
      ))}
      {c.education.length > 0 && section("Education", (
        <div className="flex flex-col gap-1">
          {c.education.map((e, i) => (
            <p key={`${e.school}-${i}`} className="flex flex-wrap items-baseline justify-between gap-x-4">
              <span><span className="font-semibold">{e.school}</span>{e.degree || e.field ? `, ${[e.degree, e.field].filter(Boolean).join(" ")}` : ""}</span>
              <span className="text-[12px] text-muted tnum">{[e.start, e.end].filter(Boolean).join(" to ")}</span>
            </p>
          ))}
        </div>
      ))}
      {c.skills.length > 0 && section("Skills", (
        <div className="flex flex-col gap-1">
          {c.skills.map((s) => <p key={s.group}><span className="font-semibold">{s.group}:</span> {s.items.join(", ")}</p>)}
        </div>
      ))}
    </article>
  );

  // Built after the page, so `placed` knows which changes already sit on it.
  const leftovers = changes.filter((ch) => !placed.has(ch.bulletId));

  return (
    <div ref={root}>
      {doc}
      {leftovers.length > 0 && (
        <div className="mt-6 border-t border-dashed border-line pt-4">
          <p className="eyebrow">Other changes</p>
          <ul className="mt-2 flex flex-col gap-2 text-[13px]">{leftovers.map((ch) => bullet({ id: ch.bulletId, text: ch.after, nodeIds: ch.nodeIds }))}</ul>
        </div>
      )}
    </div>
  );
}

/** The card a highlighted line opens: the old line, the reason, the sources, and Keep or Revert. */
function ChangePopover({ change, nodes, reverted, onKeep, disabled, onClose }: {
  change: ResumeChange;
  nodes: Record<string, NodeInfo>;
  reverted: boolean;
  onKeep?: (bulletId: string, keep: boolean) => void;
  disabled?: boolean;
  onClose: () => void;
}) {
  const sources = change.nodeIds.map((id) => ({ id, ...(nodes[id] ?? { label: id, type: "fact" }) }));
  return (
    <div
      role="dialog"
      aria-label="What this line replaced"
      className="absolute left-0 top-full z-20 mt-2 w-full max-w-[26rem] rounded-card border border-line bg-surface p-4 text-[13px] shadow-[0_24px_48px_-24px_rgb(26_25_20/0.3)]"
    >
      <div className="flex items-start justify-between gap-3">
        <p className="eyebrow">{reverted ? "Reverted to your original" : "Changed from"}</p>
        <button type="button" onClick={onClose} aria-label="Close" className="-m-1 rounded-md p-1 text-muted hover:bg-sunken hover:text-ink">
          <Icon icon={X} size={14} />
        </button>
      </div>
      <p className={cx("mt-2", reverted ? "text-ink" : "text-muted line-through decoration-control")}>{change.before || "Not on your original resume"}</p>
      {reverted && <p className="mt-2 text-muted"><span className="eyebrow mr-2">Suggested</span>{change.after}</p>}
      {change.reason && <p className="mt-3 text-ink-2">{change.reason}</p>}
      <div className="mt-3 flex flex-col gap-1.5 border-t border-line pt-3">
        <p className="eyebrow">From your graph</p>
        {sources.length > 0 ? sources.map((s) => (
          <div key={s.id}>
            <p className="flex flex-wrap items-baseline gap-x-2">
              <span className="text-muted capitalize">{s.type}</span>
              <Link href={`/graph?node=${encodeURIComponent(s.id)}`} className="inline-flex items-center gap-1 font-medium text-accent underline-offset-4 hover:underline">
                {s.label} <Icon icon={ArrowUpRight} size={12} />
              </Link>
            </p>
            {s.quote && <p className="mt-0.5 border-l-2 border-line pl-2 text-[12px] text-muted">&ldquo;{s.quote}&rdquo;</p>}
          </div>
        )) : <p className="text-muted">This line reorders or trims what was already on your resume.</p>}
      </div>
      {onKeep && (
        <div role="group" aria-label="This change" className="mt-4 flex gap-2">
          <button
            type="button"
            aria-pressed={!reverted}
            disabled={disabled}
            onClick={() => onKeep(change.bulletId, true)}
            className={cx("h-8 flex-1 rounded-control text-[12px] font-semibold disabled:opacity-45", !reverted ? "bg-ink text-on-ink" : "border border-control bg-surface text-ink hover:bg-sunken")}
          >
            Keep the new line
          </button>
          <button
            type="button"
            aria-pressed={reverted}
            disabled={disabled}
            onClick={() => onKeep(change.bulletId, false)}
            className={cx("h-8 flex-1 rounded-control text-[12px] font-semibold disabled:opacity-45", reverted ? "bg-ink text-on-ink" : "border border-control bg-surface text-ink hover:bg-sunken")}
          >
            Use my original
          </button>
        </div>
      )}
    </div>
  );
}
