import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import fs from "fs";
import path from "path";

export const dynamic = "force-dynamic";

export async function GET() {
  const dataDir = process.env.DATA_DIR ?? process.cwd();
  const dbPath = path.join(dataDir, "haven.db");
  const dbExists = fs.existsSync(dbPath);

  let ticketCount = 0;
  let eventCount = 0;
  let dbError: string | null = null;

  try {
    const db = getDb();
    ticketCount = (db.prepare("SELECT COUNT(*) as n FROM tickets").get() as { n: number }).n;
    eventCount = (db.prepare("SELECT COUNT(*) as n FROM calendar_events").get() as { n: number }).n;
  } catch (e) {
    dbError = e instanceof Error ? e.message : String(e);
  }

  return NextResponse.json({
    status: "ok",
    dataDir,
    dbPath,
    dbExists,
    ticketCount,
    eventCount,
    dbError,
  });
}
