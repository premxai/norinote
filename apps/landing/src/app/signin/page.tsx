import type { Metadata } from "next";
import Link from "next/link";
import { SunHorizon } from "@phosphor-icons/react/dist/ssr";
import { AuthShell } from "@/components/auth/auth-shell";
import { AuthForm } from "@/components/auth/auth-form";

export const metadata: Metadata = {
  title: "Sign in | Nori",
  description: "Sign in to your Nori dashboard.",
};

export default function SigninPage() {
  return (
    <AuthShell
      title="Welcome back"
      subtitle="Sign in to see what Nori found for you."
      form={<AuthForm mode="signin" />}
      switchLine={<>New to Nori? <Link href="/signup" className="font-medium text-ink underline underline-offset-4">Create an account</Link></>}
      aside={
        <>
          <p className="font-mono text-xs tracking-widest text-night-muted uppercase">While you were away</p>
          <div className="mt-6 rounded-3xl border border-night-line bg-night-card p-6">
            <p className="flex items-center gap-2 text-sm text-night-muted">
              <SunHorizon size={18} weight="duotone" className="text-kelp-bright" /> Morning brief · 08:00
            </p>
            <p className="mt-4 text-base leading-relaxed">
              Good morning. Since yesterday: 2 sent, 1 reply.
              <br />Waiting on you:
              <br />1. Frontend engineer · Kestrel Goods
              <br />Reply &lsquo;approve 1&rsquo; or &lsquo;skip 1&rsquo;.
            </p>
          </div>
          <p className="mt-6 text-sm text-night-muted">An example of the brief Nori sends each morning.</p>
        </>
      }
    />
  );
}
