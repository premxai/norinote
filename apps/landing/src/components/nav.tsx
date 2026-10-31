"use client";

import { useEffect, useState } from "react";
import { Logo } from "@/components/logo";
import Link from "next/link";
import { navLinks } from "@/lib/site";

const linkBase =
  "rounded-full px-3 py-2 text-sm transition-colors duration-300 ease-base focus-visible:outline-2 focus-visible:outline-kelp";

export function Nav() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [current, setCurrent] = useState<string | null>(null);
  useEffect(() => {
    const sections = navLinks.filter((l) => l.ready).map((l) => document.getElementById(l.id)).filter(Boolean) as HTMLElement[];
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) setCurrent(e.target.id); }),
      { rootMargin: "-45% 0px -50% 0px" },
    );
    sections.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, []);

  // Switch to the dark style while a dark section sits under the nav (the top 8% of the viewport).
  const [onDark, setOnDark] = useState(false);
  useEffect(() => {
    const dark = new Set<Element>();
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => (e.isIntersecting ? dark.add(e.target) : dark.delete(e.target)));
        setOnDark(dark.size > 0);
      },
      { rootMargin: "0px 0px -92% 0px" },
    );
    document.querySelectorAll('[data-theme="dark"]').forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, []);

  // The open mobile menu is a light panel, so the nav goes back to its light style over it.
  const dark = onDark && !menuOpen;

  // Once the page moves, logo and links merge into one frosted bar so content never shows through around them.
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  const bar = scrolled && !menuOpen;
  const surface = dark ? "border-night-line bg-night-card/80" : "border-line bg-card/80";

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setMenuOpen(false); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <>
      <a href="#main" className="sr-only z-50 rounded-xl bg-ink px-3 py-2 text-sm font-semibold text-paper focus:not-sr-only focus:fixed focus:top-4 focus:left-4">
        Skip to content
      </a>

      <header className="fixed inset-x-0 top-4 z-40 px-4 sm:px-6">
        <div
          className={`mx-auto flex max-w-7xl items-center justify-between gap-4 rounded-full border transition-colors duration-300 ease-base py-1 pr-1 pl-2 ${bar ? `${surface} shadow-sm backdrop-blur-xl` : "border-transparent"}`}
        >
          <a
            href="#top"
            aria-current="page"
            className={`rounded-full transition duration-300 ease-base hover:opacity-70 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-kelp ${dark ? "text-night-ink" : "text-ink"}`}
          >
            <Logo />
          </a>

          <nav
            aria-label="Main"
            className={`flex items-center gap-1 rounded-full border p-1 transition-colors duration-300 ease-base ${bar ? "border-transparent" : `${surface} backdrop-blur-xl`}`}
          >
            <ul className="hidden items-center gap-1 md:flex">
              {navLinks.map((l) => (
                <li key={l.id}>
                  {l.ready ? (
                    <a
                      href={`#${l.id}`}
                      aria-current={current === l.id ? "true" : undefined}
                      className={`${linkBase} ${onDark
                        ? "text-night-muted hover:text-night-ink aria-[current=true]:bg-night-line aria-[current=true]:text-night-ink"
                        : "text-muted hover:text-ink aria-[current=true]:bg-tone aria-[current=true]:text-ink"}`}
                    >
                      {l.label}
                    </a>
                  ) : (
                    <span aria-disabled="true" className={`${linkBase} block cursor-not-allowed ${dark ? "text-night-muted/40" : "text-faint/60"}`}>{l.label}</span>
                  )}
                </li>
              ))}
            </ul>
            <Link
              href="/signin"
              className={`${linkBase} hidden md:block ${dark ? "text-night-muted hover:text-night-ink" : "text-muted hover:text-ink"}`}
            >
              Sign in
            </Link>
            <Link
              href="/signup"
              className={`rounded-full px-3 py-2 text-sm font-semibold transition duration-300 ease-base hover:-translate-y-0.5 active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-kelp ${dark ? "bg-night-ink text-night hover:bg-white" : "bg-ink text-paper hover:bg-[#2A2822]"}`}
            >
              Get started
            </Link>
            <button
              type="button"
              onClick={() => setMenuOpen((o) => !o)}
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              className={`flex size-10 flex-col items-center justify-center gap-2 rounded-full transition-colors duration-300 ease-base focus-visible:outline-2 focus-visible:outline-kelp md:hidden ${dark ? "hover:bg-night-line" : "hover:bg-tone"}`}
            >
              <span className={`block h-0.5 w-4 rounded-full transition-transform duration-500 ease-base ${dark ? "bg-night-ink" : "bg-ink"} ${menuOpen ? "translate-y-1 rotate-45" : ""}`} />
              <span className={`block h-0.5 w-4 rounded-full transition-transform duration-500 ease-base ${dark ? "bg-night-ink" : "bg-ink"} ${menuOpen ? "-translate-y-1 -rotate-45" : ""}`} />
            </button>
          </nav>
        </div>
      </header>

      <div id="mobile-menu" data-open={menuOpen || undefined} className="mobile-menu fixed inset-0 z-30 bg-paper/95 px-6 pt-24 backdrop-blur-2xl md:hidden">
        <ul className="flex flex-col gap-2">
          {navLinks.map((l, i) => (
            <li key={l.id} style={{ transitionDelay: `${Math.min(i * 60, 400)}ms` }}>
              {l.ready ? (
                <a href={`#${l.id}`} onClick={() => setMenuOpen(false)} className="block rounded-xl py-3 font-serif text-4xl focus-visible:outline-2 focus-visible:outline-kelp">
                  {l.label}
                </a>
              ) : (
                <span aria-disabled="true" className="block py-3 font-serif text-4xl text-faint/60">{l.label}</span>
              )}
            </li>
          ))}
          <li style={{ transitionDelay: `${Math.min(navLinks.length * 60, 400)}ms` }} className="mt-6 flex flex-col gap-3">
            <Link href="/signup" onClick={() => setMenuOpen(false)} className="flex items-center justify-center rounded-xl bg-ink px-3 py-2 text-base font-semibold text-paper focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-kelp">
              Get started
            </Link>
            <Link href="/signin" onClick={() => setMenuOpen(false)} className="flex items-center justify-center rounded-xl border border-line px-3 py-2 text-base font-semibold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-kelp">
              Sign in
            </Link>
          </li>
        </ul>
      </div>
    </>
  );
}
