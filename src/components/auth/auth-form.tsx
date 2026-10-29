"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useId, useState, type FormEvent } from "react";
import { ArrowRight, Eye, EyeSlash, WarningCircle } from "@phosphor-icons/react";
import { site } from "@/lib/site";

type Mode = "signup" | "signin";
type Errors = Partial<Record<"name" | "email" | "password" | "form", string>>;

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Only same site paths are allowed as a return destination, never another origin. */
function safeNext(next: string | null) {
  return next && next.startsWith("/") && !next.startsWith("//") ? next : null;
}

function validate(mode: Mode, v: { name: string; email: string; password: string }): Errors {
  const e: Errors = {};
  if (!v.email.trim()) e.email = "Enter your email.";
  else if (!EMAIL.test(v.email.trim())) e.email = "That email doesn't look right. Check for a typo.";
  if (!v.password) e.password = mode === "signup" ? "Choose a password." : "Enter your password.";
  else if (mode === "signup" && v.password.length < 8) e.password = "Use at least 8 characters.";
  if (mode === "signup" && v.name.length > 200) e.name = "Keep your name under 200 characters.";
  return e;
}

export function AuthForm({ mode }: { mode: Mode }) {
  const params = useSearchParams();
  const ids = { name: useId(), email: useId(), password: useId(), form: useId() };
  const [values, setValues] = useState({ name: "", email: params.get("email") ?? "", password: "" });
  const [errors, setErrors] = useState<Errors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [showPassword, setShowPassword] = useState(false);
  const [pending, setPending] = useState(false);
  const signup = mode === "signup";

  const set = (k: keyof typeof values) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const next = { ...values, [k]: e.target.value };
    setValues(next);
    if (touched[k]) setErrors((prev) => ({ ...prev, [k]: validate(mode, next)[k], form: undefined }));
  };
  const blur = (k: keyof typeof values) => () => {
    setTouched((t) => ({ ...t, [k]: true }));
    setErrors((prev) => ({ ...prev, [k]: validate(mode, values)[k] }));
  };

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    const found = validate(mode, values);
    setTouched({ name: true, email: true, password: true });
    setErrors(found);
    if (Object.keys(found).length) {
      document.getElementById(found.email ? ids.email : found.password ? ids.password : ids.name)?.focus();
      return;
    }
    setPending(true);
    try {
      const res = await fetch(`${site.apiUrl}/api/auth/${signup ? "signup" : "login"}`, {
        method: "POST",
        credentials: "include",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(signup
          ? { email: values.email.trim(), password: values.password, ...(values.name.trim() ? { name: values.name.trim() } : {}) }
          : { email: values.email.trim(), password: values.password }),
      });
      if (res.ok) {
        const plan = params.get("plan");
        const dest = signup
          ? `${site.dashboardUrl}/onboarding${plan ? `?plan=${encodeURIComponent(plan)}` : ""}`
          : `${site.dashboardUrl}${safeNext(params.get("next")) ?? "/dashboard"}`;
        window.location.assign(dest);
        return;
      }
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      if (res.status === 409) setErrors({ email: "An account with this email already exists.", form: "exists" });
      else if (res.status === 401) setErrors({ form: "Wrong email or password. Check both and try again." });
      else setErrors({ form: data.error ?? "Something went wrong on our side. Try again in a minute." });
    } catch {
      setErrors({ form: "We couldn't reach Nori. Check your connection and try again." });
    } finally {
      setPending(false);
    }
  }

  const field = "w-full rounded-xl border bg-white px-3 py-2 text-base text-ink transition-colors duration-300 ease-base placeholder:text-faint focus:outline-2 focus:outline-offset-2 focus:outline-kelp";
  const fieldState = (k: keyof Errors) => (errors[k] ? "border-amber" : "border-line hover:border-faint");

  return (
    <form noValidate onSubmit={onSubmit} aria-describedby={errors.form && errors.form !== "exists" ? ids.form : undefined} className="flex flex-col gap-6">
      {errors.form && errors.form !== "exists" && (
        <p id={ids.form} role="alert" className="flex items-start gap-3 rounded-xl border border-amber/40 bg-amber-soft p-3 text-sm text-ink">
          <WarningCircle size={18} weight="fill" className="mt-0.5 shrink-0 text-amber" aria-hidden="true" />
          {errors.form}
        </p>
      )}

      {signup && (
        <div className="flex flex-col gap-2">
          <label htmlFor={ids.name} className="text-sm font-medium">Name <span className="font-normal text-faint">(optional)</span></label>
          <input id={ids.name} name="name" autoComplete="name" value={values.name} onChange={set("name")} onBlur={blur("name")}
            aria-invalid={!!errors.name} aria-describedby={errors.name ? `${ids.name}-err` : undefined}
            className={`${field} ${fieldState("name")}`} placeholder="Wren Castellano" />
          {errors.name && <p id={`${ids.name}-err`} className="text-sm text-amber">{errors.name}</p>}
        </div>
      )}

      <div className="flex flex-col gap-2">
        <label htmlFor={ids.email} className="text-sm font-medium">Email</label>
        <input id={ids.email} name="email" type="email" inputMode="email" autoComplete="email" required value={values.email}
          onChange={set("email")} onBlur={blur("email")}
          aria-invalid={!!errors.email} aria-describedby={errors.email ? `${ids.email}-err` : undefined}
          className={`${field} ${fieldState("email")}`} placeholder="you@example.com" />
        {errors.email && (
          <p id={`${ids.email}-err`} className="text-sm text-amber">
            {errors.email}
            {errors.form === "exists" && (
              <> <Link href={`/signin?email=${encodeURIComponent(values.email.trim())}`} className="font-medium text-ink underline underline-offset-4">Sign in instead</Link></>
            )}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor={ids.password} className="text-sm font-medium">Password</label>
        <div className="relative">
          <input id={ids.password} name="password" type={showPassword ? "text" : "password"} required minLength={signup ? 8 : undefined}
            autoComplete={signup ? "new-password" : "current-password"} value={values.password}
            onChange={set("password")} onBlur={blur("password")}
            aria-invalid={!!errors.password}
            aria-describedby={errors.password ? `${ids.password}-err` : signup ? `${ids.password}-hint` : undefined}
            className={`${field} ${fieldState("password")} pr-12`} />
          <button type="button" onClick={() => setShowPassword((s) => !s)} aria-label={showPassword ? "Hide password" : "Show password"} aria-pressed={showPassword}
            className="absolute inset-y-0 right-0 flex w-12 items-center justify-center rounded-r-xl text-muted transition-colors duration-300 ease-base hover:text-ink focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-kelp">
            {showPassword ? <EyeSlash size={20} aria-hidden="true" /> : <Eye size={20} aria-hidden="true" />}
          </button>
        </div>
        {errors.password
          ? <p id={`${ids.password}-err`} className="text-sm text-amber">{errors.password}</p>
          : signup && <p id={`${ids.password}-hint`} className="text-sm text-faint">At least 8 characters.</p>}
        {!signup && (
          <a href={`${site.dashboardUrl}/forgot-password`} className="w-fit self-end rounded text-sm font-medium text-ink underline underline-offset-4 transition-colors duration-300 ease-base hover:text-kelp focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-kelp">
            Forgot password?
          </a>
        )}
      </div>

      <button type="submit" disabled={pending} aria-busy={pending}
        className="flex items-center justify-center gap-2 rounded-xl bg-ink px-3 py-2 text-base font-semibold text-paper transition duration-300 ease-base hover:bg-[#2A2822] active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-kelp disabled:cursor-not-allowed disabled:opacity-60">
        {pending ? (signup ? "Creating your account" : "Signing you in") : (signup ? "Create account" : "Sign in")}
        {pending ? <span className="size-1.5 animate-blink rounded-full bg-paper" aria-hidden="true" /> : <ArrowRight size={18} weight="bold" aria-hidden="true" />}
      </button>

      {signup && (
        <p className="text-sm text-muted">
          By creating an account you agree to the <Link href="/terms" className="text-ink underline underline-offset-4">Terms</Link> and{" "}
          <Link href="/privacy" className="text-ink underline underline-offset-4">Privacy</Link> policy.
        </p>
      )}
    </form>
  );
}
