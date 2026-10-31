"use client";

import { createContext, useCallback, useContext, useEffect, useRef, type ReactNode } from "react";
import { GithubLogo, PlayCircle, VideoCamera, X } from "@phosphor-icons/react";
import { site } from "@/lib/site";

const DemoContext = createContext<() => void>(() => {});

/** Owns the demo dialog so any button on the page can open it. */
export function DemoProvider({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDialogElement>(null);
  const open = useCallback(() => ref.current?.showModal(), []);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    const onClick = (e: MouseEvent) => { if (e.target === dialog) dialog.close(); };
    dialog.addEventListener("click", onClick);
    return () => dialog.removeEventListener("click", onClick);
  }, []);

  return (
    <DemoContext.Provider value={open}>
      {children}
      <dialog ref={ref} aria-labelledby="demo-title" className="m-auto w-full max-w-2xl bg-transparent p-4 font-sans text-ink open:animate-rise">
        <div className="relative rounded-3xl border border-line bg-card p-8">
          <button
            type="button"
            onClick={() => ref.current?.close()}
            aria-label="Close"
            className="absolute top-4 right-4 flex size-10 items-center justify-center rounded-full text-muted transition-colors duration-300 ease-base hover:bg-tone hover:text-ink focus-visible:outline-2 focus-visible:outline-kelp"
          >
            <X size={20} />
          </button>
          {site.demoUrl ? (
            <div className="aspect-video overflow-hidden rounded-2xl bg-night">
              <iframe className="size-full" src={site.demoUrl} title="Nori demo" allow="autoplay; fullscreen" allowFullScreen />
            </div>
          ) : (
            <div className="flex flex-col items-center py-6 text-center">
              <span className="flex size-16 items-center justify-center rounded-2xl bg-kelp-soft text-kelp">
                <VideoCamera size={32} weight="duotone" aria-hidden="true" />
              </span>
              <h2 id="demo-title" className="mt-6 font-serif text-3xl">The demo is being recorded</h2>
              <p className="mt-3 max-w-md text-base text-muted">
                It walks through Nori finding a role, tailoring the resume and waiting for your OK. Until it&apos;s ready, the full code is on GitHub.
              </p>
              <a
                href={site.githubUrl}
                className="mt-8 flex items-center gap-2 rounded-xl bg-ink px-3 py-2 text-base font-semibold text-paper transition duration-300 ease-base hover:-translate-y-0.5 active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-kelp"
              >
                <GithubLogo size={20} weight="duotone" aria-hidden="true" /> Read the code
              </a>
            </div>
          )}
        </div>
      </dialog>
    </DemoContext.Provider>
  );
}

export function DemoButton({
  id,
  size = "base",
  tone = "light",
  className = "",
}: { id?: string; size?: "base" | "sm"; tone?: "light" | "dark"; className?: string }) {
  const open = useContext(DemoContext);
  const sizing = size === "sm" ? "rounded-full px-3 py-2 text-sm" : "rounded-xl px-3 py-2 text-base";
  const colors = tone === "dark" ? "bg-night-ink text-night hover:bg-white" : "bg-ink text-paper hover:bg-[#2A2822]";
  return (
    <button
      id={id}
      type="button"
      onClick={open}
      className={`flex w-fit items-center gap-2 font-semibold transition duration-300 ease-base hover:-translate-y-0.5 active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-kelp ${colors} ${sizing} ${className}`}
    >
      <PlayCircle size={size === "sm" ? 18 : 20} weight="fill" aria-hidden="true" />
      {size === "sm" ? "Watch demo" : "Watch the 2 minute demo"}
    </button>
  );
}
