import Database from "better-sqlite3";
import path from "path";
import fs from "fs";

export interface PMNote {
  id: string;
  jobId: string;   // job id (e.g. "boak") or "general"
  fact: string;    // the concise persisted fact
  category: string; // inspection | measurement | decision | milestone | order | note
  createdAt: string; // ISO string
}

function getDb() {
  const dataDir = process.env.DATA_DIR || path.join(process.cwd(), ".data");
  if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
  const dbPath = path.join(dataDir, "haven.db");
  const db = new Database(dbPath);
  db.pragma("journal_mode = WAL");

  db.exec(`
    CREATE TABLE IF NOT EXISTS pm_notes (
      id         TEXT PRIMARY KEY,
      job_id     TEXT NOT NULL,
      fact       TEXT NOT NULL,
      category   TEXT NOT NULL DEFAULT 'note',
      created_at TEXT NOT NULL
    )
  `);

  return db;
}

/** Returns all saved notes, newest first */
export function getNotes(): PMNote[] {
  const db = getDb();
  const rows = db
    .prepare("SELECT id, job_id, fact, category, created_at FROM pm_notes ORDER BY created_at DESC")
    .all() as { id: string; job_id: string; fact: string; category: string; created_at: string }[];
  db.close();
  return rows.map((r) => ({
    id: r.id,
    jobId: r.job_id,
    fact: r.fact,
    category: r.category,
    createdAt: r.created_at,
  }));
}

/** Inserts a note. Uses INSERT OR REPLACE so duplicate IDs are idempotent. */
export function addNote(note: PMNote): void {
  const db = getDb();
  db.prepare(`
    INSERT OR REPLACE INTO pm_notes (id, job_id, fact, category, created_at)
    VALUES (?, ?, ?, ?, ?)
  `).run(note.id, note.jobId, note.fact, note.category, note.createdAt);
  db.close();
}
