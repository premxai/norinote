import type { Metadata } from "next";
import { Geist, Geist_Mono, Newsreader } from "next/font/google";
import "./globals.css";

const geist = Geist({ subsets: ["latin"], variable: "--font-geist" });
const geistMono = Geist_Mono({ subsets: ["latin"], variable: "--font-geist-mono" });
const newsreader = Newsreader({ subsets: ["latin"], style: ["normal"], variable: "--font-newsreader" });

export const metadata: Metadata = {
  title: "Nori | The job agent that tailors every application",
  description:
    "Nori finds roles that fit, writes a one page resume from your real experience, and applies only when you approve. Built for new grads and engineers.",
  openGraph: {
    title: "Nori | The job agent that tailors every application",
    description: "Nori finds roles that fit, writes a one page resume from your real experience, and applies only when you approve.",
    type: "website",
  },
  twitter: { card: "summary_large_image" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geist.variable} ${geistMono.variable} ${newsreader.variable}`}>
      <body className="min-h-screen bg-paper font-sans text-ink antialiased">{children}</body>
    </html>
  );
}
