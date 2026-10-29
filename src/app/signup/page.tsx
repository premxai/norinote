import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle } from "@phosphor-icons/react/dist/ssr";
import { AuthShell } from "@/components/auth/auth-shell";
import { AuthForm } from "@/components/auth/auth-form";

export const metadata: Metadata = {
  title: "Create your account | Nori",
  description: "Create a Nori account and start finding roles that fit your real experience.",
};

const steps = [
  { title: "Upload your resume", body: "Nori turns it into a career graph of your roles, projects, skills and results." },
  { title: "Set your lanes", body: "Titles, locations, remote, a minimum match and a daily cap." },
  { title: "Approve what goes out", body: "Every application waits for your OK in the dashboard or your chat app." },
];

export default function SignupPage() {
  return (
    <AuthShell
      title="Create your account"
      subtitle="Start free. No card needed."
      form={<AuthForm mode="signup" />}
      switchLine={<>Already have an account? <Link href="/signin" className="font-medium text-ink underline underline-offset-4">Sign in</Link></>}
      aside={
        <>
          <p className="font-mono text-xs tracking-widest text-night-muted uppercase">What happens next</p>
          <p className="mt-6 font-serif text-4xl leading-tight">Three steps, then Nori does the searching.</p>
          <ol className="mt-10 flex flex-col gap-6">
            {steps.map((s, i) => (
              <li key={s.title} className="flex gap-4">
                <span className="flex size-8 shrink-0 items-center justify-center rounded-full border border-night-line font-mono text-xs text-kelp-bright">{String(i + 1).padStart(2, "0")}</span>
                <span>
                  <span className="block text-base font-medium">{s.title}</span>
                  <span className="mt-1 block text-sm text-night-muted">{s.body}</span>
                </span>
              </li>
            ))}
          </ol>
          <p className="mt-10 flex items-center gap-2 text-sm text-night-muted">
            <CheckCircle size={18} weight="duotone" className="text-kelp-bright" />
            Nothing is sent without your OK.
          </p>
        </>
      }
    />
  );
}
