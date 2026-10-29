export const site = {
  name: "Nori",
  dashboardUrl: "https://jobs.norinote.xyz",
  githubUrl: "https://github.com/premxai/Nori",
  /**
   * Where the auth forms post. The dashboard's /api proxy, so the session cookie lands on the dashboard's own host.
   * The API needs this site's origin in CORS_ORIGINS (see docs/deploy.md in the jobgraph repo).
   */
  apiUrl: process.env.NEXT_PUBLIC_API_URL ?? "https://jobs.norinote.xyz",
  /** Embed URL for the demo video. Empty until it is recorded; the dialog shows a holding state. */
  demoUrl: process.env.NEXT_PUBLIC_DEMO_URL ?? "",
} as const;

/** Sections in the nav, in page order. */
export const navLinks = [
  { id: "how-it-works", label: "How it works", ready: true },
  { id: "proof", label: "Proof", ready: true },
  { id: "pricing", label: "Pricing", ready: true },
  { id: "faq", label: "FAQ", ready: true },
] as const;
