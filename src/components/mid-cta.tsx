import { DemoButton } from "@/components/demo";
import { Reveal } from "@/components/reveal";

/** A short pause between the product story and the proof, repeating the page's one action. */
export function MidCta() {
  return (
    <section aria-labelledby="mid-cta-title" className="border-b border-dashed border-line bg-paper px-4 py-24 sm:px-6">
      <Reveal className="mx-auto flex max-w-[680px] flex-col items-center text-center">
        <h2 id="mid-cta-title" className="font-serif text-4xl leading-tight md:text-5xl">
          Watch Nori tailor a real application, start to finish.
        </h2>
        <p className="mt-4 text-lg text-muted">Two minutes, from finding the role to the moment it asks for your OK.</p>
        <DemoButton className="mt-8" />
      </Reveal>
    </section>
  );
}
