"use client";

/**
 * Last resort when the root layout itself fails, so globals.css and fonts may be missing.
 * Kept to inline styles in the site's colours.
 */
export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, minHeight: "100vh", display: "grid", placeItems: "center", background: "#F5F4F0", color: "#1A1914", fontFamily: "Georgia, serif", textAlign: "center", padding: 24 }}>
        <main>
          <h1 style={{ fontSize: 48, lineHeight: 1, margin: 0 }}>Nori hit a snag.</h1>
          <p style={{ fontFamily: "system-ui, sans-serif", fontSize: 18, color: "#5F5D55", marginTop: 24 }}>Reload the page to try again.</p>
          <button
            type="button"
            onClick={reset}
            style={{ marginTop: 32, fontFamily: "system-ui, sans-serif", fontSize: 16, fontWeight: 600, padding: "8px 12px", borderRadius: 12, border: 0, background: "#1A1914", color: "#F5F4F0", cursor: "pointer" }}
          >
            Try again
          </button>
        </main>
      </body>
    </html>
  );
}
