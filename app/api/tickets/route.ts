import { NextResponse } from "next/server";
import { getTickets } from "@/lib/ticketStore";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json(getTickets());
}
