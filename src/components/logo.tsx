/** Three linked nodes: a small career graph. */
export function LogoMark({ className = "size-8" }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden="true">
      <rect width="32" height="32" rx="8" fill="#1A1914" />
      <path d="M11 12 L21 12 L16 21 Z" stroke="#5F5D55" strokeWidth="1.5" fill="none" strokeLinejoin="round" />
      <circle cx="11" cy="12" r="3.5" fill="#5EC2B0" />
      <circle cx="21" cy="12" r="3.5" fill="#F5F4F0" />
      <circle cx="16" cy="21" r="3.5" fill="#F5F4F0" />
    </svg>
  );
}

export function Logo() {
  return (
    <span className="flex items-center gap-2">
      <LogoMark />
      <span className="font-serif text-2xl font-medium tracking-tight">Nori</span>
    </span>
  );
}
