"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { prefersReducedMotion } from "@/lib/use-in-view";

/*
 * An Obsidian style graph view of the demo career graph: dots sized by how connected they are,
 * thin links, labels on the hubs, and a short force layout that settles each time it comes into focus.
 * Hovering a dot lights it and its neighbours.
 */

type Group = "person" | "role" | "project" | "skill" | "result" | "education";
type Node = { id: string; label: string; group: Group };

export const PERSON = "Wren Castellano";

const nodes: Node[] = [
  { id: "me", label: PERSON, group: "person" },
  { id: "r1", label: "Frontend engineer · Kestrel Goods", group: "role" },
  { id: "r2", label: "Engineering intern · Larkspur Health", group: "role" },
  { id: "ed", label: "BS Computer Science", group: "education" },
  { id: "p1", label: "Storefront rewrite", group: "project" },
  { id: "p2", label: "Design system", group: "project" },
  { id: "p3", label: "Patient intake form", group: "project" },
  { id: "p4", label: "Transit app, hackathon", group: "project" },
  { id: "s1", label: "React", group: "skill" },
  { id: "s2", label: "TypeScript", group: "skill" },
  { id: "s3", label: "Next.js", group: "skill" },
  { id: "s4", label: "Performance", group: "skill" },
  { id: "s5", label: "Accessibility", group: "skill" },
  { id: "s6", label: "Testing", group: "skill" },
  { id: "s7", label: "Node.js", group: "skill" },
  { id: "s8", label: "CSS", group: "skill" },
  { id: "x1", label: "Load time 3.8s to 1.9s", group: "result" },
  { id: "x2", label: "38 components, 4 teams", group: "result" },
  { id: "x3", label: "Form completion up 22%", group: "result" },
  { id: "x4", label: "1st place of 41 teams", group: "result" },
];

const links: [string, string][] = [
  ["me", "r1"], ["me", "r2"], ["me", "ed"],
  ["r1", "p1"], ["r1", "p2"], ["r2", "p3"], ["ed", "p4"],
  ["p1", "s1"], ["p1", "s3"], ["p1", "s4"], ["p1", "x1"],
  ["p2", "s1"], ["p2", "s2"], ["p2", "s5"], ["p2", "s8"], ["p2", "x2"],
  ["p3", "s1"], ["p3", "s5"], ["p3", "s6"], ["p3", "x3"],
  ["p4", "s2"], ["p4", "s7"], ["p4", "x4"],
  ["r1", "s2"], ["r2", "s6"],
];

const groupColor: Record<Group, string> = {
  person: "#EDEBE4",
  role: "#5EC2B0",
  project: "#C9C6BD",
  skill: "#E9B872",
  result: "#7FB4E8",
  education: "#A3A097",
};

export const graphLegend: { group: Group; label: string }[] = [
  { group: "role", label: "Roles" },
  { group: "project", label: "Projects" },
  { group: "skill", label: "Skills" },
  { group: "result", label: "Results" },
  { group: "education", label: "Education" },
];

const W = 400;
const H = 300;
const index = Object.fromEntries(nodes.map((n, i) => [n.id, i]));
const degree = nodes.map((n) => links.filter(([a, b]) => a === n.id || b === n.id).length);
const radius = (i: number) => (nodes[i].group === "person" ? 9 : 2.5 + degree[i] * 0.9);
const neighbours = nodes.map((n) => new Set(links.flatMap(([a, b]) => (a === n.id ? [b] : b === n.id ? [a] : []))));

type Pt = { x: number; y: number; vx: number; vy: number };

/** Small seeded generator so the starting scatter, and the settled layout, are the same on every load. */
function seeded(seed: number) {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function scatter(): Pt[] {
  const rand = seeded(7);
  return nodes.map(() => {
    const a = rand() * Math.PI * 2;
    const r = 20 + rand() * 120;
    return { x: W / 2 + Math.cos(a) * r, y: H / 2 + Math.sin(a) * r * 0.75, vx: 0, vy: 0 };
  });
}

/** One step of a plain force layout: repulsion between all dots, springs on links, a pull to the centre. */
function step(pts: Pt[], alpha: number) {
  for (let i = 0; i < pts.length; i++) {
    for (let j = i + 1; j < pts.length; j++) {
      const dx = pts[j].x - pts[i].x;
      const dy = pts[j].y - pts[i].y;
      const d2 = Math.max(dx * dx + dy * dy, 36);
      const f = (1500 * alpha) / d2;
      pts[i].vx -= dx * f * 0.05; pts[i].vy -= dy * f * 0.05;
      pts[j].vx += dx * f * 0.05; pts[j].vy += dy * f * 0.05;
    }
  }
  for (const [a, b] of links) {
    const p = pts[index[a]];
    const q = pts[index[b]];
    const dx = q.x - p.x;
    const dy = q.y - p.y;
    const d = Math.sqrt(dx * dx + dy * dy) || 1;
    const k = ((d - 52) / d) * 0.06 * alpha;
    p.vx += dx * k; p.vy += dy * k;
    q.vx -= dx * k; q.vy -= dy * k;
  }
  for (const p of pts) {
    p.vx += (W / 2 - p.x) * 0.006 * alpha;
    p.vy += (H / 2 - p.y) * 0.01 * alpha;
    p.vx *= 0.6; p.vy *= 0.6;
    p.x = Math.min(W - 16, Math.max(16, p.x + p.vx));
    p.y = Math.min(H - 16, Math.max(16, p.y + p.vy));
  }
}

function settled(): Pt[] {
  const pts = scatter();
  for (let i = 0; i < 400; i++) step(pts, 1 - i / 400);
  return pts;
}

export function CareerGraph({ active }: { active: boolean }) {
  // Laid out in the browser only: server and client floats differ in the last digits and would not hydrate.
  const final = useMemo(() => (typeof window === "undefined" ? null : settled()), []);
  const [pts, setPts] = useState<Pt[] | null>(null);
  const [hovered, setHovered] = useState<number | null>(null);
  const [size, setSize] = useState({ w: W, h: H });
  const boxRef = useRef<HTMLDivElement>(null);

  // Fit the 400 by 300 layout into whatever box the panel gives us, keeping dots round.
  useEffect(() => {
    const el = boxRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => setSize({ w: e.contentRect.width, h: e.contentRect.height }));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Each time the panel comes into focus, scatter the dots and let the layout settle for about a second.
  useEffect(() => {
    if (!final) return;
    if (!active || prefersReducedMotion()) { setPts(final); return; }
    const live = scatter();
    let frame = 0;
    let raf = 0;
    const tick = () => {
      const alpha = Math.max(0, 1 - frame / 70);
      for (let i = 0; i < 4; i++) step(live, alpha);
      setPts(live.map((p) => ({ ...p })));
      frame++;
      if (alpha > 0) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [active, final]);

  const s = Math.min(size.w / W, size.h / H);
  const ox = (size.w - W * s) / 2;
  const oy = (size.h - H * s) / 2;
  const at = (p: Pt) => ({ x: ox + p.x * s, y: oy + p.y * s });

  if (!pts) return <div ref={boxRef} className="absolute inset-x-0 top-0 bottom-12 sm:bottom-8" />;

  const lit = (i: number) => hovered === null || hovered === i || neighbours[hovered].has(nodes[i].id);

  // Default labels: the person first, then the busiest dots, skipping any label that would overlap one already placed.
  const placed: { l: number; r: number; t: number; b: number }[] = [];
  const defaultLabels = new Set<number>();
  [...nodes.keys()]
    .filter((i) => nodes[i].group === "person" || degree[i] >= 4)
    .sort((a, b) => (nodes[b].group === "person" ? 1 : 0) - (nodes[a].group === "person" ? 1 : 0) || degree[b] - degree[a])
    .forEach((i) => {
      const p = at(pts[i]);
      const w = nodes[i].label.length * 6.5;
      const top = p.y + radius(i) * Math.max(s, 0.8) + 4;
      const box = { l: p.x - w / 2 - 4, r: p.x + w / 2 + 4, t: top - 2, b: top + 18 };
      const hitsDot = pts.some((q, j) => {
        if (j === i) return false;
        const c = at(q);
        return c.x > box.l && c.x < box.r && c.y > box.t && c.y < box.b;
      });
      if ((hitsDot && nodes[i].group !== "person") || placed.some((o) => box.l < o.r && box.r > o.l && box.t < o.b && box.b > o.t)) return;
      placed.push(box);
      defaultLabels.add(i);
    });
  const showLabel = (i: number) => (hovered === null ? defaultLabels.has(i) : lit(i));

  return (
    <div ref={boxRef} className="absolute inset-x-0 top-0 bottom-12 sm:bottom-8">
      <svg width={size.w} height={size.h} className="absolute inset-0 overflow-visible">
        {links.map(([a, b]) => {
          const p = at(pts[index[a]]);
          const q = at(pts[index[b]]);
          const on = hovered !== null && (index[a] === hovered || index[b] === hovered);
          return (
            <line
              key={`${a}-${b}`}
              x1={p.x} y1={p.y} x2={q.x} y2={q.y}
              stroke={on ? "#5EC2B0" : "#3A3933"}
              strokeWidth={on ? 1.5 : 1}
              className="transition-[stroke] duration-300 ease-base"
            />
          );
        })}
        {nodes.map((n, i) => {
          const p = at(pts[i]);
          return (
            <g
              key={n.id}
              onPointerEnter={() => setHovered(i)}
              onPointerLeave={() => setHovered(null)}
              className={`cursor-pointer transition-opacity duration-300 ease-base ${lit(i) ? "opacity-100" : "opacity-20"}`}
            >
              <circle cx={p.x} cy={p.y} r={Math.max(12, radius(i) * s)} fill="transparent" />
              <circle cx={p.x} cy={p.y} r={radius(i) * Math.max(s, 0.8)} fill={groupColor[n.group]} />
            </g>
          );
        })}
      </svg>
      {nodes.map((n, i) => {
        const p = at(pts[i]);
        return (
          <span
            key={n.id}
            style={{ left: p.x, top: p.y + radius(i) * Math.max(s, 0.8) + 4 }}
            className={`pointer-events-none absolute -translate-x-1/2 whitespace-nowrap text-xs transition-opacity duration-300 ease-base ${
              n.group === "person" ? "font-medium text-night-ink" : "text-night-muted"
            } ${showLabel(i) ? "opacity-100" : "opacity-0"}`}
          >
            {n.label}
          </span>
        );
      })}
    </div>
  );
}

export { groupColor, nodes as graphNodes };
