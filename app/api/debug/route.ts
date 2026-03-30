import { NextResponse } from "next/server";

export async function GET() {
  const key = process.env.ANTHROPIC_API_KEY;
  return NextResponse.json({
    set: !!key,
    length: key?.length ?? 0,
    prefix: key?.slice(0, 14) ?? "not set",
  });
}
