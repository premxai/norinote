"use client";

import Link from "next/link";
import { useEffect } from "react";
import { ArrowClockwise, ArrowLeft } from "@phosphor-icons/react";
import { Logo } from "@/components/logo";

/** Shown when a page throws while rendering. Offers a retry and a way home. */
export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => { console.error(error); }, [error]);

  return (
    <main id="main" className="relative isolate flex min-h-screen flex-col items-center justify-center overflow-hidden bg-tone px-4 text-center sm:px-6">
      <div aria-hidden="true" className="dot-grid absolute inset-0 -z-10" />
      <Link href="/" className="rounded-xl focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-kelp">
        <Logo />
      </Link>
      <p className="mt-16 font-mono text-xs tracking-widest text-muted uppercase">Something broke</p>
      <h1 className="mt-6 max-w-[680px] font-serif text-5xl leading-none tracking-tight md:text-6xl">This page didn&apos;t load.</h1>
      <p className="mt-6 max-w-md text-lg text-muted">
        That one is on us. Try again, and if it keeps happening, head back to the home page.
      </p>
      {error.digest && <p className="mt-4 font-mono text-xs text-faint">Error reference {error.digest}</p>}
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <button
          type="button"
          onClick={reset}
          className="flex items-center gap-2 rounded-xl bg-ink px-3 py-2 text-base font-semibold text-paper transition duration-300 ease-base hover:-translate-y-0.5 hover:bg-[#2A2822] active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-kelp"
        >
          <ArrowClockwise size={18} weight="bold" aria-hidden="true" /> Try again
        </button>
        <Link
          href="/"
          className="flex items-center gap-2 rounded-xl border border-line px-3 py-2 text-base font-semibold transition duration-300 ease-base hover:-translate-y-0.5 hover:bg-paper active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-kelp"
        >
          <ArrowLeft size={18} weight="bold" aria-hidden="true" /> Back to Nori
        </Link>
      </div>
    </main>
  );
}
