import { DemoButton } from "@/components/demo";
import { Reveal } from "@/components/reveal";

/** Closing call to action. Same button as the hero, so the page asks for one thing. */
export function FinalCta() {
  return (
    <section aria-labelledby="final-title" className="relative isolate overflow-hidden bg-tone px-4 py-24 sm:px-6">
      <div aria-hidden="true" className="dot-grid absolute inset-0 -z-10" />
      <Reveal className="mx-auto flex max-w-[680px] flex-col items-center pt-8 pb-8 text-center">
        <h2 id="final-title" className="font-serif text-5xl leading-none tracking-tight md:text-6xl">
          Send fewer applications.<br className="hidden sm:block" /> Make every one count.
        </h2>
        <p className="mt-6 max-w-xl text-lg text-muted">
          Watch Nori find a role, tailor a resume from facts you gave it, and wait for your OK.
        </p>
        <DemoButton className="mt-8" />
        <p className="mt-4 text-sm text-muted">Start free. Pro is $9 a month, cancel anytime.</p>
      </Reveal>
    </section>
  );
}
