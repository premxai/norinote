import { ArrowUpRight, CheckCircle } from "@phosphor-icons/react/dist/ssr";
import { Reveal } from "@/components/reveal";
import { site } from "@/lib/site";

// Placeholder tiers: names, limits and the $19 price are not final. Pro at $9 is the agreed price.
const plans = [
  {
    name: "Starter",
    price: "$0",
    unit: "forever",
    blurb: "Try Nori on a few roles you care about.",
    features: [
      "5 tailored applications a month",
      "Board watch on up to 3 companies",
      "Approve from the dashboard or Telegram",
      "Export your career graph any time",
    ],
    cta: "Start free",
    featured: false,
  },
  {
    name: "Pro",
    price: "$9",
    unit: "a month",
    blurb: "For a steady search alongside a job or school.",
    features: [
      "Up to 3 tailored applications a day",
      "Board watch and web scout on every role you track",
      "Inbox reader and morning brief",
      "Approve from Telegram, WhatsApp, Slack or the dashboard",
    ],
    cta: "Start Pro",
    featured: true,
  },
  {
    name: "Sprint",
    price: "$19",
    unit: "a month",
    blurb: "For a full time search where speed matters.",
    features: [
      "Up to 10 tailored applications a day",
      "Company research on every role before you apply",
      "Weekly recap with what's working",
      "Everything in Pro",
    ],
    cta: "Start Sprint",
    featured: false,
  },
];

export function Pricing() {
  return (
    <section id="pricing" aria-labelledby="pricing-title" className="border-b border-dashed border-line bg-paper px-4 py-24 sm:px-6">
      <div className="mx-auto max-w-7xl">
        <Reveal className="mx-auto max-w-[680px] text-center">
          <p className="font-mono text-xs tracking-widest text-muted uppercase">Pricing</p>
          <h2 id="pricing-title" className="mt-6 font-serif text-4xl leading-tight md:text-5xl">Pick the pace of your search.</h2>
          <p className="mt-6 text-lg text-muted">Every plan uses the same agent and the same rules. Nothing goes out without your OK, and you can cancel anytime.</p>
        </Reveal>

        <div className="mt-16 grid gap-6 lg:grid-cols-3">
          {plans.map((p, i) => (
            <Reveal
              key={p.name}
              delay={i * 100}
              className={`flex flex-col rounded-3xl border bg-card p-8 ${p.featured ? "border-ink shadow-[0_24px_48px_-32px_rgb(26_25_20/0.35)]" : "border-line"}`}
            >
              <div className="flex items-center justify-between gap-4">
                <h3 className="text-xl font-medium">{p.name}</h3>
                {p.featured && <span className="rounded-full bg-kelp-soft px-3 py-1 text-xs font-medium text-kelp">Most popular</span>}
              </div>
              <p className="mt-6 flex items-baseline gap-2">
                <span className="font-serif text-6xl">{p.price}</span>
                <span className="text-base text-muted">{p.unit}</span>
              </p>
              <p className="mt-2 text-base text-muted">{p.blurb}</p>
              <ul className="mt-8 flex flex-col gap-3 text-base">
                {p.features.map((f) => (
                  <li key={f} className="flex gap-3">
                    <CheckCircle size={20} weight="duotone" className="mt-0.5 shrink-0 text-kelp" aria-hidden="true" />
                    {f}
                  </li>
                ))}
              </ul>
              <div className="mt-auto pt-8">
              <a
                href={site.dashboardUrl}
                className={`flex items-center justify-center gap-2 rounded-xl px-3 py-2 text-base font-semibold transition duration-300 ease-base hover:-translate-y-0.5 active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-kelp ${p.featured ? "bg-ink text-paper hover:bg-[#2A2822]" : "border border-line hover:bg-tone"}`}
              >
                {p.cta}
                <ArrowUpRight size={18} weight="bold" aria-hidden="true" />
              </a>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
