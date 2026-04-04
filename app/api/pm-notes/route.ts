import { NextRequest, NextResponse } from "next/server";
import { getNotes, addNote, PMNote } from "@/lib/notesStore";

export const dynamic = "force-dynamic";

/** GET /api/pm-notes — all saved notes, newest first */
export async function GET() {
  try {
    const notes = getNotes();
    return NextResponse.json(notes);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

/** POST /api/pm-notes — body: { jobId, fact, category } */
export async function POST(req: NextRequest) {
  try {
    const { jobId, fact, category } = await req.json();

    if (!fact || typeof fact !== "string") {
      return NextResponse.json({ error: "fact is required" }, { status: 400 });
    }

    const note: PMNote = {
      id: `note-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      jobId: jobId || "general",
      fact: fact.trim(),
      category: category || "note",
      createdAt: new Date().toISOString(),
    };

    addNote(note);
    console.log(`[PM Memory] saved: [${note.jobId}] ${note.fact}`);
    return NextResponse.json({ ok: true, note });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
