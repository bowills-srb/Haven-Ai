import { NextRequest, NextResponse } from "next/server";
import { CalendarEvent } from "@/lib/warranty";
import { getEvents, addEvent } from "@/lib/eventStore";

export async function GET() {
  return NextResponse.json(getEvents());
}

export async function POST(req: NextRequest) {
  try {
    const event: CalendarEvent = await req.json();
    if (!event || !event.id || !event.date) {
      return NextResponse.json({ error: "id and date required" }, { status: 400 });
    }
    addEvent(event);
    return NextResponse.json({ ok: true });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
