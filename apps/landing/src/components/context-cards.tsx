import { LinkSimple, Prohibit, PuzzlePiece } from "@phosphor-icons/react/dist/ssr";
import { Reveal } from "@/components/reveal";

/* The message texts below mirror Nori's real templates in packages/core/src/agent/notify.ts. */

function Bubble({ from, children }: { from: "nori" | "you"; children: React.ReactNode }) {
  return (
    <div className={`max-w-[90%] rounded-2xl px-3 py-2 text-sm ${from === "nori" ? "self-start bg-white" : "self-end bg-ink text-paper"}`}>
      {children}
    </div>
  );
}

const cards = [
  {
    icon: LinkSimple,
    title: "Follows the evidence",
    body: "Every rewritten bullet links to a node in your career graph, and every review message says how many changes are traced.",
    visual: (
      <Bubble from="nori">
        Resume ready for Frontend engineer at Kestrel Goods.
        <br />4 changes, ATS 92, <span className="font-medium text-kelp">all traced to your graph</span>.
      </Bubble>
    ),
  },
  {
    icon: PuzzlePiece,
    title: "Finds the gap",
    body: "Ask what a role wants that your history doesn't show. If you have it, say so in a sentence and Nori adds it to your graph.",
    visual: (
      <>
        <Bubble from="you">missing 1</Bubble>
        <Bubble from="nori">
          Missing for Frontend engineer at Kestrel Goods:
          <br />GraphQL (required)
          <br />If you have these, tell me with &ldquo;I &hellip;&rdquo; and I&apos;ll add them.
        </Bubble>
      </>
    ),
  },
  {
    icon: Prohibit,
    title: "Keeps your calls",
    body: "A role you skip never comes back, and companies on your excluded list are filtered out before Nori writes a word.",
    visual: (
      <div className="flex flex-col gap-2 text-sm">
        <div className="flex items-center justify-between gap-3 rounded-xl bg-white px-3 py-2">
          <span>Backend engineer · Porto Freight</span>
          <span className="text-xs text-faint">Skipped by you</span>
        </div>
        <div className="flex items-center justify-between gap-3 rounded-xl bg-white px-3 py-2">
          <span>Senior engineer · Halden Bank</span>
          <span className="text-xs text-faint">Excluded company</span>
        </div>
      </div>
    ),
  },
];

export function ContextCards() {
  return (
    <section aria-labelledby="context-title" className="border-b border-dashed border-line bg-paper px-4 py-24 sm:px-6">
      <div className="mx-auto max-w-7xl">
        <Reveal className="max-w-[680px]">
          <p className="font-mono text-xs tracking-widest text-muted uppercase">Your story, kept straight</p>
          <h2 id="context-title" className="mt-6 font-serif text-4xl leading-tight md:text-5xl">Knows your story. Keeps your calls.</h2>
        </Reveal>

        <div className="mt-16 grid gap-6 md:grid-cols-3">
          {cards.map(({ icon: Icon, title, body, visual }, i) => (
            <Reveal key={title} delay={i * 80} className="flex flex-col rounded-3xl border border-line bg-card p-2">
              <div aria-hidden="true" className="flex min-h-48 flex-col justify-center gap-2 rounded-2xl bg-tone p-4">{visual}</div>
              <div className="p-6">
                <h3 className="flex items-center gap-3 text-xl font-medium">
                  <Icon size={22} weight="duotone" className="text-kelp" aria-hidden="true" />
                  {title}
                </h3>
                <p className="mt-3 text-base text-muted">{body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
