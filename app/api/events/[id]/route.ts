import { NextRequest, NextResponse } from "next/server";
import { CalendarEvent } from "@/lib/warranty";
import { updateEventStatus } from "@/lib/eventStore";

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { status } = await req.json() as { status: CalendarEvent["status"] };
    if (!["pending", "scheduled", "completed"].includes(status)) {
      return NextResponse.json({ error: "invalid status" }, { status: 400 });
    }
    const updated = updateEventStatus(params.id, status);
    if (!updated) return NextResponse.json({ error: "not found" }, { status: 404 });
    return NextResponse.json(updated);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
