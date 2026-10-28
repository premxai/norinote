import type { NextConfig } from "next";
import { PHASE_DEVELOPMENT_SERVER } from "next/constants";

// The dev server writes to .next and build/start use .next-build, so running a build
// never clobbers a dev server that is already running.
export default function config(phase: string): NextConfig {
  return {
    distDir: phase === PHASE_DEVELOPMENT_SERVER ? ".next" : ".next-build",
  };
}
