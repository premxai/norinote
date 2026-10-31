/**
 * The marketing site lives on its own domain (the nori-landing repo, https://norinote.xyz); this app is the dashboard.
 * "Home" links and signed-out visits to `/` go there.
 */
/**
 * Remembers the desktop sidebar's width. A cookie, so the server renders it at the right size and nothing jumps on load.
 * Lives here, not in the client Shell, because a server component cannot read a plain value from a "use client" file.
 */
export const RAIL_COOKIE = "nori_rail";

export const LANDING_URL = (process.env.NEXT_PUBLIC_LANDING_URL?.trim() || "https://norinote.xyz").replace(/\/+$/, "");
