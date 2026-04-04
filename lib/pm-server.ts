// Server-only: uses fs/path. Do not import from client components.
import fs from "fs";
import path from "path";
import { PM_JOBS, PM_PHASES } from "./pm-data";
import type { PMNote } from "./notesStore";

export { PM_JOBS, PM_PHASES };
export type { PMJob, PMFlag, FlagType, PhaseName } from "./pm-data";

// ── System prompt builder ──────────────────────────────────────────────────────

export function buildPMSystemPrompt(
  phases: Record<string, number>,
  notes: PMNote[] = []
): string {
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

  // Build field log from persisted notes
  const fieldLog = notes.length
    ? notes
        .slice(0, 50) // cap at 50 most recent
        .map((n) => {
          const ts = new Date(n.createdAt).toLocaleDateString("en-US", {
            month: "short", day: "numeric", hour: "numeric", minute: "2-digit", hour12: true,
          });
          const job = n.jobId === "general" ? "GENERAL" : n.jobId.toUpperCase();
          return `  ${ts}  ${job} — ${n.fact}`;
        })
        .join("\n")
    : "  (no field updates recorded yet)";

  const memoryInstruction = `MEMORY INSTRUCTION
When the superintendent provides a factual field update — such as an inspection result,
confirmed measurement, customer decision made, milestone completed, or order placed —
respond normally AND on a new line emit exactly:
---MEMORY---{"jobId":"<job_id or general>","fact":"<concise single-sentence fact>","category":"<inspection|measurement|decision|milestone|order|note>"}
Use the job id (e.g. "boak", "crandall", "davis") or "general" for portfolio-wide updates.
Emit one line only. Never repeat it. Never emit it for questions — only for facts being stated.`;

  return `${memoryInstruction}

${baseContext}

================================================================================
LIVE PHASE STATUS (superintendent-updated — use this as ground truth)
================================================================================
${phaseStatus}

================================================================================
FIELD LOG — SUPERINTENDENT UPDATES (verified ground truth — DO NOT contradict)
================================================================================
${fieldLog}

================================================================================
TODAY'S DATE: ${new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })}
================================================================================

When the superintendent asks "what's the priority today?" or similar, lead with
the jobs that have active [BLOCKER] flags, then [ORDER_NOW] items that may
delay upcoming phases, then [CUSTOMER_DECISION] items, then [RISK] items.
Cross-reference the current phase of each job — only surface flags that are
relevant to the current or imminent next phase. Where field log entries resolve
a flag, note it as resolved.`;
}
