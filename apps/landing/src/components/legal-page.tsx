import Link from "next/link";
import { ArrowLeft } from "@phosphor-icons/react/dist/ssr";
import { Logo } from "@/components/logo";
import { Footer } from "@/components/footer";

export type LegalSection = { heading: string; paragraphs: string[] };

export function LegalPage({ title, intro, updated, sections }: { title: string; intro: string; updated: string; sections: LegalSection[] }) {
  return (
    <>
      <a href="#main" className="sr-only z-50 rounded-xl bg-ink px-3 py-2 text-sm font-semibold text-paper focus:not-sr-only focus:fixed focus:top-4 focus:left-4">
        Skip to content
      </a>
      <header className="px-4 pt-6 sm:px-6">
        <div className="mx-auto max-w-7xl">
          <Link href="/" className="inline-block rounded-xl focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-kelp">
            <Logo />
          </Link>
        </div>
      </header>
      <main id="main" className="px-4 py-24 sm:px-6">
        <article className="mx-auto max-w-2xl">
          <p className="rounded-2xl border border-dashed border-line bg-tone p-4 text-sm text-muted">
            Draft. This page has not been reviewed by a lawyer yet.
          </p>
          <h1 className="mt-12 font-serif text-5xl leading-none tracking-tight">{title}</h1>
          <p className="mt-6 text-lg text-muted">{intro}</p>
          <p className="mt-2 font-mono text-xs tracking-widest text-faint uppercase">Last updated {updated}</p>
          {sections.map((s) => (
            <section key={s.heading} className="mt-12">
              <h2 className="font-serif text-3xl">{s.heading}</h2>
              {s.paragraphs.map((p) => <p key={p} className="mt-4 text-base text-muted">{p}</p>)}
            </section>
          ))}
          <Link
            href="/"
            className="mt-16 flex w-fit items-center gap-2 rounded-xl border border-line px-3 py-2 text-base font-semibold transition duration-300 ease-base hover:-translate-y-0.5 hover:bg-tone active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-kelp"
          >
            <ArrowLeft size={18} weight="bold" aria-hidden="true" /> Back to Nori
          </Link>
        </article>
      </main>
      <Footer />
    </>
  );
}
