import Database from "better-sqlite3";
import path from "path";
import fs from "fs";
import { PM_JOBS } from "./pm-data";

function getDb() {
  const dataDir = process.env.DATA_DIR || path.join(process.cwd(), ".data");
  if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
  const dbPath = path.join(dataDir, "haven.db");
  const db = new Database(dbPath);
  db.pragma("journal_mode = WAL");

  db.exec(`
    CREATE TABLE IF NOT EXISTS job_phases (
      job_id    TEXT PRIMARY KEY,
      phase_idx INTEGER NOT NULL DEFAULT 0,
      updated_at TEXT NOT NULL
    )
  `);

  return db;
}

/** Returns a map of jobId → phase index (0-based into PM_PHASES array) */
export function getPhases(): Record<string, number> {
  const db = getDb();
  const rows = db.prepare("SELECT job_id, phase_idx FROM job_phases").all() as {
    job_id: string;
    phase_idx: number;
  }[];
  db.close();

  const result: Record<string, number> = {};
  // Default all jobs to phase 0
  for (const job of PM_JOBS) result[job.id] = 0;
  // Override with saved values
  for (const row of rows) result[row.job_id] = row.phase_idx;
  return result;
}

/** Sets the phase for a single job */
export function setPhase(jobId: string, phaseIdx: number): void {
  const db = getDb();
  db.prepare(`
    INSERT INTO job_phases (job_id, phase_idx, updated_at)
    VALUES (?, ?, ?)
    ON CONFLICT(job_id) DO UPDATE SET phase_idx = excluded.phase_idx, updated_at = excluded.updated_at
  `).run(jobId, phaseIdx, new Date().toISOString());
  db.close();
}
