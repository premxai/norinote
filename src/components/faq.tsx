import { Plus } from "@phosphor-icons/react/dist/ssr";
import { Reveal } from "@/components/reveal";

type Item = { q: string; a: string; list?: string[] };

// Answers are checked against the Nori codebase; keep them in sync when defaults change.
const faqs: Item[] = [
  {
    q: "I've applied to dozens of jobs and heard nothing back. Why would this be different?",
    a: "Mass applying sends the same resume everywhere. Nori sends fewer applications, each one rewritten for the role and checked against the skills it asks for. Nobody can honestly promise interviews. What Nori promises is that every application is aimed and fitted.",
  },
  {
    q: "How does Nori decide which roles to go after?",
    a: "You set your lanes: titles, locations, remote and a minimum match, 70% by default. Nori checks the boards you follow every 15 minutes and searches the wider web every 6 hours, then skips anything below your bar and tells you why.",
  },
  {
    q: "Will Nori make things up on my resume?",
    a: "No. Every rewritten line links back to a fact in your career graph, and each review message tells you how many changes are traced. If a role asks for a skill you don't have, Nori shows you the gap instead of covering it up.",
  },
  {
    q: "Is this just another spam bot?",
    a: "No. Nothing is queued on its own until you set a daily cap, every application is tailored to its role, and each one waits for your OK.",
  },
  {
    q: "Will ATS software reject the resume?",
    a: "Every resume is scored out of 100 before it's sent, across 10 checks:",
    list: [
      "Covers at least 70% of the required skills",
      "Fits on one page",
      "Contact details present",
      "Standard section headings, in order",
      "Single column, with no tables or images",
      "Bullets of 8 to 30 words",
      "Every bullet starts with an action verb",
      "Dates on every role",
      "No first person pronouns",
      "Plain, parser safe characters",
    ],
  },
  {
    q: "Does Nori ever submit an application without asking me?",
    a: "Not by default. Review before submit is on from the start, so every filled application waits for you. You can turn it off in settings if you ever want Nori to send on its own, and it stays on until you do.",
  },
  {
    q: "What does Nori read in my email?",
    a: "Only if you connect Gmail. Every 5 minutes it looks at up to 50 recent messages from the last 3 days to find recruiter replies, interview requests, offers, rejections and verification codes. It updates the matching application and drafts any reply for you to send yourself.",
  },
  {
    q: "Can I take my data with me?",
    a: "Yes. You can export your career graph as JSON at any time, on every plan.",
  },
];

export function Faq() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.list ? `${f.a} ${f.list.join("; ")}.` : f.a },
    })),
  };

  return (
    <section id="faq" aria-labelledby="faq-title" className="border-b border-dashed border-line bg-paper px-4 py-24 sm:px-6">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[1fr_1.6fr]">
        <Reveal>
          <p className="font-mono text-xs tracking-widest text-muted uppercase">FAQ</p>
          <h2 id="faq-title" className="mt-6 font-serif text-4xl leading-tight md:text-5xl">Before you trust a job agent.</h2>
          <p className="mt-6 max-w-sm text-lg text-muted">The questions people ask first, answered plainly.</p>
        </Reveal>

        <Reveal delay={80} className="flex flex-col">
          {faqs.map((f) => (
            <details key={f.q} className="group border-b border-dashed border-line first:border-t">
              <summary className="flex cursor-pointer list-none items-start justify-between gap-6 rounded-lg py-6 text-lg font-medium transition-colors duration-300 ease-base hover:text-kelp focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-kelp [&::-webkit-details-marker]:hidden">
                {f.q}
                <Plus size={20} weight="bold" aria-hidden="true" className="mt-1 shrink-0 text-kelp transition-transform duration-500 ease-base group-open:rotate-45" />
              </summary>
              <div className="pb-6 text-base text-muted">
                <p>{f.a}</p>
                {f.list && (
                  <ul className="mt-3 flex list-disc flex-col gap-1 pl-6 marker:text-faint">
                    {f.list.map((li) => <li key={li}>{li}</li>)}
                  </ul>
                )}
              </div>
            </details>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
