import { NextResponse } from "next/server";
import { getTickets } from "@/lib/ticketStore";

export async function GET() {
  return NextResponse.json(getTickets());
}
