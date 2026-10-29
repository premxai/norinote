import Link from "next/link";
import { Suspense, type ReactNode } from "react";
import { Logo } from "@/components/logo";

/** Two column auth layout: the form on paper, a dark product panel beside it on large screens. */
export function AuthShell({
  title,
  subtitle,
  form,
  switchLine,
  aside,
}: {
  title: string;
  subtitle: string;
  form: ReactNode;
  switchLine: ReactNode;
  aside: ReactNode;
}) {
  return (
    <div className="grid min-h-screen bg-paper lg:grid-cols-2">
      <a href="#main" className="sr-only z-50 rounded-xl bg-ink px-3 py-2 text-sm font-semibold text-paper focus:not-sr-only focus:fixed focus:top-4 focus:left-4">
        Skip to content
      </a>
      <div className="flex flex-col px-4 py-6 sm:px-6">
        <Link href="/" className="w-fit rounded-xl focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-kelp">
          <Logo />
        </Link>
        <main id="main" className="flex flex-1 items-center justify-center py-16">
          <div className="w-full max-w-sm">
            <h1 className="font-serif text-4xl leading-tight tracking-tight">{title}</h1>
            <p className="mt-3 text-base text-muted">{subtitle}</p>
            <div className="mt-8">
              <Suspense fallback={<div className="h-80 rounded-xl bg-tone" aria-hidden="true" />}>{form}</Suspense>
            </div>
            <p className="mt-8 text-sm text-muted">{switchLine}</p>
          </div>
        </main>
        <p className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-faint">
          <span>© 2026 Nori contributors</span>
          <Link href="/privacy" className="hover:text-ink">Privacy</Link>
          <Link href="/terms" className="hover:text-ink">Terms</Link>
        </p>
      </div>

      <aside aria-hidden="true" className="relative isolate hidden overflow-hidden bg-night p-12 text-night-ink lg:flex lg:flex-col lg:justify-center">
        <div className="dot-grid absolute inset-0 -z-10 opacity-20" />
        <div className="mx-auto w-full max-w-md">{aside}</div>
      </aside>
    </div>
  );
}
