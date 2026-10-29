import Link from "next/link";
import { Logo } from "@/components/logo";
import { site } from "@/lib/site";

const columns = [
  {
    title: "Product",
    links: [
      { label: "How it works", href: "/#how-it-works" },
      { label: "Proof", href: "/#proof" },
      { label: "Pricing", href: "/#pricing" },
      { label: "FAQ", href: "/#faq" },
    ],
  },
  {
    title: "Account",
    links: [
      { label: "Create account", href: "/signup" },
      { label: "Sign in", href: "/signin" },
      { label: "GitHub", href: site.githubUrl },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy", href: "/privacy" },
      { label: "Terms", href: "/terms" },
    ],
  },
];

const linkClass =
  "rounded text-sm text-muted transition-colors duration-300 ease-base hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-kelp";

export function Footer() {
  return (
    <footer className="bg-paper px-4 pt-16 pb-12 sm:px-6">
      <div className="mx-auto grid max-w-7xl gap-12 md:grid-cols-[1.6fr_1fr_1fr_1fr]">
        <div>
          <Link href="/" className="inline-block rounded-xl focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-kelp">
            <Logo />
          </Link>
          <p className="mt-4 max-w-xs text-sm text-muted">
            A job agent that tailors every application from your real experience, and waits for your OK before it sends one.
          </p>
        </div>
        {columns.map((c) => (
          <nav key={c.title} aria-label={c.title}>
            <p className="font-mono text-xs tracking-widest text-faint uppercase">{c.title}</p>
            <ul className="mt-4 flex flex-col gap-3">
              {c.links.map((l) => (
                <li key={l.label}>
                  {l.href.startsWith("http") ? <a href={l.href} className={linkClass}>{l.label}</a> : <Link href={l.href} className={linkClass}>{l.label}</Link>}
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>
      <div className="mx-auto mt-16 flex max-w-7xl flex-wrap justify-between gap-4 border-t border-dashed border-line pt-6 text-sm text-faint">
        <p>© 2026 Nori contributors · MIT licensed</p>
        <p>Made in San Francisco at Open Source AI Week</p>
      </div>
    </footer>
  );
}
