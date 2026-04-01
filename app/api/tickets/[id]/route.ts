import { NextRequest, NextResponse } from "next/server";
import { updateTicketStatus } from "@/lib/ticketStore";

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { status } = await req.json() as { status: string };
    const updated = updateTicketStatus(params.id, status);
    if (!updated) return NextResponse.json({ error: "not found" }, { status: 404 });
    return NextResponse.json(updated);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
