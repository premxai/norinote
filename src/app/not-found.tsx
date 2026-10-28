import Link from "next/link";
import { ArrowLeft } from "@phosphor-icons/react/dist/ssr";
import { Logo } from "@/components/logo";

export default function NotFound() {
  return (
    <main id="main" className="relative isolate flex min-h-screen flex-col items-center justify-center overflow-hidden bg-tone px-4 text-center sm:px-6">
      <div aria-hidden="true" className="dot-grid absolute inset-0 -z-10" />
      <Link href="/" className="rounded-xl focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-kelp">
        <Logo />
      </Link>
      <p className="mt-16 font-mono text-xs tracking-widest text-muted uppercase">404 · Page not found</p>
      <h1 className="mt-6 max-w-[680px] font-serif text-5xl leading-none tracking-tight md:text-6xl">This page took a wrong turn.</h1>
      <p className="mt-6 max-w-md text-lg text-muted">The link may be old, or the page moved. Everything Nori does is on the home page.</p>
      <Link
        href="/"
        className="mt-8 flex items-center gap-2 rounded-xl bg-ink px-3 py-2 text-base font-semibold text-paper transition duration-300 ease-base hover:-translate-y-0.5 hover:bg-[#2A2822] active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-kelp"
      >
        <ArrowLeft size={18} weight="bold" aria-hidden="true" /> Back to Nori
      </Link>
    </main>
  );
}
