import { CheckCircle, ShieldCheck } from "@phosphor-icons/react/dist/ssr";
import { DemoButton } from "@/components/demo";
import { DashboardMock } from "@/components/dashboard-mock";

export function Hero() {
  return (
    <section id="top" aria-labelledby="hero-title" className="relative isolate overflow-hidden bg-tone">
      <div aria-hidden="true" className="dot-grid absolute inset-0 -z-10" />

      <div className="mx-auto max-w-7xl px-4 pt-24 sm:px-6">
        <div className="mx-auto flex max-w-[680px] flex-col items-center pt-16 text-center">
          <p className="animate-rise font-mono text-xs tracking-widest text-muted uppercase">For new grads and software engineers</p>

          <h1
            id="hero-title"
            className="mt-6 animate-rise bg-linear-to-r from-[#000000] to-[#666666] bg-clip-text pb-2 font-serif text-5xl leading-none tracking-tight text-transparent [animation-delay:80ms] md:text-6xl"
          >
            Get interview callbacks<br className="hidden sm:block" /> without mass applying
          </h1>

          <p className="mt-6 max-w-xl animate-rise text-lg text-muted [animation-delay:160ms]">
            Nori finds roles that fit you, rewrites a one page resume using only facts from your history, and fills the application. Nothing gets sent until you say yes.
          </p>

          <div className="mt-8 animate-rise [animation-delay:240ms]">
            <DemoButton id="hero-cta" />
          </div>

          <ul className="mt-6 flex animate-rise flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-muted [animation-delay:320ms]">
            <li className="flex items-center gap-2"><CheckCircle size={18} weight="duotone" className="text-kelp" aria-hidden="true" />Every resume passes 10 ATS checks</li>
            <li className="flex items-center gap-2"><ShieldCheck size={18} weight="duotone" className="text-kelp" aria-hidden="true" />You decide what gets sent</li>
          </ul>
        </div>

        <div className="mt-16 animate-rise pb-24 [animation-delay:420ms]">
          <DashboardMock />
        </div>
      </div>
    </section>
  );
}
