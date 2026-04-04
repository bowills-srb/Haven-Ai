import { NextRequest, NextResponse } from "next/server";
import { getPhases, setPhase } from "@/lib/jobStore";
import { PM_JOBS } from "@/lib/pm-data";

export const dynamic = "force-dynamic";

/** GET /api/jobs — returns { [jobId]: phaseIdx } */
export async function GET() {
  try {
    const phases = getPhases();
    return NextResponse.json(phases);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

/** POST /api/jobs — body: { jobId: string, phaseIdx: number } */
export async function POST(req: NextRequest) {
  try {
    const { jobId, phaseIdx } = await req.json();

    if (!jobId || typeof phaseIdx !== "number") {
      return NextResponse.json({ error: "jobId and phaseIdx required" }, { status: 400 });
    }

    const validJob = PM_JOBS.find((j) => j.id === jobId);
    if (!validJob) {
      return NextResponse.json({ error: `Unknown job: ${jobId}` }, { status: 400 });
    }

    if (phaseIdx < 0 || phaseIdx > 13) {
      return NextResponse.json({ error: "phaseIdx must be 0–13" }, { status: 400 });
    }

    setPhase(jobId, phaseIdx);
    return NextResponse.json({ ok: true, jobId, phaseIdx });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
