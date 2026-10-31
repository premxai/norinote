"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import {
  Briefcase, Ellipsis, FileText, Inbox, MessageCircle, Network, PanelLeftClose, PanelLeftOpen, Send, Settings, SlidersHorizontal, Sun, UserRound, X,
  type LucideIcon,
} from "lucide-react";
import { cx } from "./cx";
import { Icon } from "./Icon";
import { NoriLogo, NoriMark } from "./Logo";
import { LogoutButton } from "./LogoutButton";
import { DryRunBand } from "./DryRunBand";
import { RAIL_COOKIE } from "@/lib/site";

export type ShellData = {
  applicationsCount: number;
  needsYouCount: number;
  unreadCount: number;
  appliedThisWeek: number;
  repliedThisWeek: number;
  interviewsThisWeek: number;
  hoursSaved: number;
  userName: string;
  mock: boolean;
  /** False: this server never sends; forms are filled and stop. Shown as a band on every page. */
  liveSubmit: boolean;
};

type NavItem = { href: string; label: string; icon: LucideIcon; count?: (d: ShellData) => number; attn?: boolean };
type NavGroup = { label: string; items: NavItem[] };

const NAV: NavGroup[] = [
  {
    label: "Work",
    items: [
      { href: "/dashboard", label: "Today", icon: Sun, count: (d) => d.needsYouCount, attn: true },
      { href: "/applications", label: "Applications", icon: Send },
      { href: "/jobs", label: "Jobs", icon: Briefcase },
    ],
  },
  {
    label: "Rules and evidence",
    items: [
      { href: "/agent", label: "Lanes and autopilot", icon: SlidersHorizontal },
      { href: "/graph", label: "Career graph", icon: Network },
      { href: "/resume", label: "Resumes", icon: FileText },
    ],
  },
  {
    label: "Talk",
    items: [
      { href: "/inbox", label: "Inbox", icon: Inbox, count: (d) => d.unreadCount },
      { href: "/chat", label: "Chat", icon: MessageCircle },
    ],
  },
];

const FOOT: NavItem[] = [
  { href: "/profile", label: "Profile", icon: UserRound },
  { href: "/settings", label: "Settings", icon: Settings },
];

/** Phone tab bar. Everything else lives behind "More". */
const TABS: NavItem[] = [
  { href: "/dashboard", label: "Today", icon: Sun, count: (d) => d.needsYouCount, attn: true },
  { href: "/applications", label: "Applications", icon: Send },
  { href: "/jobs", label: "Jobs", icon: Briefcase },
  { href: "/chat", label: "Chat", icon: MessageCircle },
];
const MORE: NavItem[] = [...NAV.flatMap((g) => g.items).filter((i) => !TABS.some((t) => t.href === i.href)), ...FOOT];

const isActive = (pathname: string, href: string) => pathname === href || pathname.startsWith(`${href}/`);

function Count({ n, attn }: { n: number; attn?: boolean }) {
  if (n <= 0) return null;
  return (
    <span className={cx("min-w-5 rounded-full px-1.5 text-center text-[11px] font-semibold leading-5 tnum", attn ? "bg-attn-tint text-attn-fg" : "bg-sunken text-ink-2")}>
      {n}
      <span className="sr-only">{attn ? " waiting on you" : " new"}</span>
    </span>
  );
}

function RailLink({ item, data, pathname, onNavigate, collapsed }: { item: NavItem; data: ShellData; pathname: string; onNavigate?: () => void; collapsed?: boolean }) {
  const active = isActive(pathname, item.href);
  const n = item.count?.(data) ?? 0;
  return (
    <li>
      <Link
        href={item.href}
        onClick={onNavigate}
        aria-current={active ? "page" : undefined}
        title={collapsed ? item.label : undefined}
        className={cx(
          "flex min-h-9 items-center rounded-control text-[13.5px] transition-colors duration-200",
          collapsed ? "relative justify-center" : "gap-3 px-3",
          active ? "bg-white font-semibold text-ink shadow-[0_1px_2px_rgb(26_25_20/0.06)] ring-1 ring-line" : "font-medium text-ink-2 hover:bg-sunken hover:text-ink",
        )}
      >
        <Icon icon={item.icon} size={17} className={active ? "text-accent" : "text-muted"} />
        {collapsed ? (
          <>
            <span className="sr-only">{item.label}{n > 0 ? `, ${n}${item.attn ? " waiting on you" : " new"}` : ""}</span>
            {n > 0 && <span aria-hidden="true" className={cx("absolute right-2 top-1.5 h-2 w-2 rounded-full ring-2 ring-surface", item.attn ? "bg-attn" : "bg-accent")} />}
          </>
        ) : (
          <>
            <span className="flex-1">{item.label}</span>
            <Count n={n} attn={item.attn} />
          </>
        )}
      </Link>
    </li>
  );
}

/** Desktop sidebar. Collapses to an icon strip; labels stay available as tooltips and to screen readers. */
function Rail({ data, pathname, collapsed, onToggle }: { data: ShellData; pathname: string; collapsed: boolean; onToggle: () => void }) {
  const toggle = (
    <button
      type="button"
      onClick={onToggle}
      aria-expanded={!collapsed}
      aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
      title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
      className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-control text-muted transition-colors duration-200 hover:bg-sunken hover:text-ink"
    >
      <Icon icon={collapsed ? PanelLeftOpen : PanelLeftClose} size={17} />
    </button>
  );
  return (
    <aside
      className={cx(
        "sticky top-0 hidden h-[100dvh] shrink-0 flex-col overflow-y-auto overflow-x-hidden whitespace-nowrap border-r border-line bg-surface px-3 py-6 transition-[width] duration-300 ease-[var(--ease)] lg:flex",
        collapsed ? "w-[72px]" : "w-[var(--rail-w)]",
      )}
    >
      {collapsed ? (
        <div className="mb-6 flex flex-col items-center gap-3">
          <Link href="/dashboard" aria-label="Nori, Today" className="inline-flex"><NoriMark size={28} /></Link>
          {toggle}
        </div>
      ) : (
        <div className="mb-8 flex items-center justify-between gap-2 pl-3">
          <Link href="/dashboard" aria-label="Nori, Today" className="inline-flex"><NoriLogo size={28} /></Link>
          {toggle}
        </div>
      )}
      <nav aria-label="Main" className={cx("flex flex-col", collapsed ? "gap-3" : "gap-6")}>
        {NAV.map((g, gi) => (
          <div key={g.label}>
            {collapsed ? gi > 0 && <div aria-hidden="true" className="mx-2 mb-3 h-px bg-line" /> : <p className="eyebrow mb-2 px-3">{g.label}</p>}
            <ul className="flex flex-col gap-0.5" aria-label={collapsed ? g.label : undefined}>
              {g.items.map((i) => <RailLink key={i.href} item={i} data={data} pathname={pathname} collapsed={collapsed} />)}
            </ul>
          </div>
        ))}
      </nav>
      <div className="mt-auto flex flex-col gap-3 pt-6">
        <ul className="flex flex-col gap-0.5">{FOOT.map((i) => <RailLink key={i.href} item={i} data={data} pathname={pathname} collapsed={collapsed} />)}</ul>
        {collapsed ? (
          <div className="flex justify-center border-t border-line pt-3"><LogoutButton iconOnly /></div>
        ) : (
          <>
            <div className="flex items-center justify-between gap-2 border-t border-line px-3 pt-3">
              <span className="min-w-0 truncate text-meta text-ink-2">{data.userName}</span>
              <LogoutButton />
            </div>
            {data.mock && <p className="px-3 text-[12px] text-muted">Demo data, nothing is real.</p>}
          </>
        )}
      </div>
    </aside>
  );
}

export function Shell({ data, railCollapsed = false, children }: { data: ShellData; railCollapsed?: boolean; children: ReactNode }) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(railCollapsed);
  const toggleRail = () => {
    const next = !collapsed;
    setCollapsed(next);
    document.cookie = `${RAIL_COOKIE}=${next ? "collapsed" : "open"}; path=/; max-age=31536000; samesite=lax`;
  };
  // The More sheet belongs to the page it was opened on, so moving to another page closes it without an effect.
  const [openOn, setOpenOn] = useState<string | null>(null);
  const open = openOn === pathname;
  const moreActive = !TABS.some((t) => isActive(pathname, t.href));
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <div className="flex min-h-[100dvh] flex-col">
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-control focus:bg-ink focus:px-3 focus:py-2 focus:text-on-ink">Skip to content</a>
      {!data.liveSubmit && <DryRunBand />}
      <div className="flex min-h-0 flex-1">
        <Rail data={data} pathname={pathname} collapsed={collapsed} onToggle={toggleRail} />

        <div className="flex min-w-0 flex-1 flex-col">
          {/* phone top bar */}
          <header className="sticky top-0 z-40 flex h-14 items-center justify-between border-b border-line bg-bg px-4 lg:hidden">
            <Link href="/dashboard" aria-label="Nori, Today"><NoriLogo size={26} /></Link>
            {data.needsYouCount > 0 && (
              <Link href="/dashboard" className="inline-flex h-8 items-center gap-1.5 rounded-full bg-attn-tint px-3 text-[12px] font-semibold text-attn-fg">
                {data.needsYouCount} waiting on you
              </Link>
            )}
          </header>

          <main id="main" className="mx-auto w-full max-w-[var(--content-max)] flex-1 px-4 pb-28 pt-8 sm:px-6 lg:px-12 lg:pb-20 lg:pt-12">{children}</main>
        </div>
      </div>

      {/* phone: More sheet */}
      {open && (
        <div id="more-sheet" className="fixed inset-x-0 bottom-[calc(3.75rem+env(safe-area-inset-bottom))] top-14 z-40 flex flex-col overflow-y-auto border-t border-line bg-bg px-4 py-4 lg:hidden">
          <ul className="flex flex-col gap-0.5">{MORE.map((i) => <RailLink key={i.href} item={i} data={data} pathname={pathname} onNavigate={() => setOpenOn(null)} />)}</ul>
          <div className="mt-auto flex items-center justify-between gap-2 border-t border-line px-3 pt-3">
            <span className="min-w-0 truncate text-meta text-ink-2">{data.userName}</span>
            <LogoutButton />
          </div>
        </div>
      )}

      {/* phone: tab bar */}
      <nav aria-label="Tabs" className="fixed inset-x-0 bottom-0 z-50 border-t border-line bg-bg pb-[env(safe-area-inset-bottom)] lg:hidden">
        <ul className="grid h-[3.75rem] grid-cols-5">
          {TABS.map((t) => {
            const active = !open && isActive(pathname, t.href);
            const count = t.count?.(data) ?? 0;
            return (
              <li key={t.href}>
                <Link
                  href={t.href}
                  aria-current={active ? "page" : undefined}
                  className={cx("relative flex h-full flex-col items-center justify-center gap-1 text-[11px] font-medium", active ? "text-ink" : "text-muted")}
                >
                  <span className="relative">
                    <Icon icon={t.icon} size={20} strokeWidth={active ? 2 : 1.5} />
                    {count > 0 && (
                      <span className="absolute -right-2.5 -top-1.5 min-w-4 rounded-full bg-attn px-1 text-center text-[10px] font-semibold leading-4 text-on-ink tnum">{count}</span>
                    )}
                  </span>
                  {t.label}
                </Link>
              </li>
            );
          })}
          <li>
            <button
              type="button"
              onClick={() => setOpenOn(open ? null : pathname)}
              aria-expanded={open}
              aria-controls="more-sheet"
              className={cx("flex h-full w-full flex-col items-center justify-center gap-1 text-[11px] font-medium", open || moreActive ? "text-ink" : "text-muted")}
            >
              <Icon icon={open ? X : Ellipsis} size={20} />
              More
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );
}
