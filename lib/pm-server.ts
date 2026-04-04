// Server-only: uses fs/path. Do not import from client components.
import fs from "fs";
import path from "path";
import { PM_JOBS, PM_PHASES } from "./pm-data";

export { PM_JOBS, PM_PHASES };
export type { PMJob, PMFlag, FlagType, PhaseName } from "./pm-data";

// ── System prompt builder ──────────────────────────────────────────────────────

export function buildPMSystemPrompt(phases: Record<string, number>): string {
  const contextPath = path.join(process.cwd(), "context", "pm-context.txt");
  const baseContext = fs.readFileSync(contextPath, "utf-8");

  // Build a current-phase status block to inject
  const phaseStatus = PM_JOBS.map((job) => {
    const phaseIdx = phases[job.id];
    const phaseName =
      phaseIdx !== undefined ? PM_PHASES[phaseIdx] : "UNKNOWN — not yet set";
    const activeFlags = job.flags
      .map((f) => `  [${f.type}] ${f.text}`)
      .join("\n");
    return `${job.name.toUpperCase()} (${job.id})
  Current Phase: ${phaseName}
  Tight Access: ${job.tightAccess ? "YES" : "No"}
${activeFlags}`;
  }).join("\n\n");

  return `${baseContext}

================================================================================
LIVE PHASE STATUS (superintendent-updated — use this as ground truth)
================================================================================
${phaseStatus}

================================================================================
TODAY'S DATE: ${new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })}
================================================================================

When the superintendent asks "what's the priority today?" or similar, lead with
the jobs that have active [BLOCKER] flags, then [ORDER_NOW] items that may
delay upcoming phases, then [CUSTOMER_DECISION] items, then [RISK] items.
Cross-reference the current phase of each job — only surface flags that are
relevant to the current or imminent next phase.`;
}
