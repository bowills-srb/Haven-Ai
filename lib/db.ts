import Database from "better-sqlite3";
import path from "path";

const DB_PATH = path.join(process.cwd(), "haven.db");

let _db: Database.Database | null = null;

export function getDb(): Database.Database {
  if (!_db) {
    _db = new Database(DB_PATH);
    _db.pragma("journal_mode = WAL");
    _db.exec(`
      CREATE TABLE IF NOT EXISTS calendar_events (
        id       TEXT PRIMARY KEY,
        date     TEXT NOT NULL,
        customer TEXT NOT NULL,
        address  TEXT NOT NULL,
        equipment TEXT NOT NULL,
        issue    TEXT NOT NULL,
        type     TEXT NOT NULL,
        time     TEXT NOT NULL,
        tech     TEXT NOT NULL,
        status   TEXT NOT NULL DEFAULT 'pending',
        ticketId TEXT
      );
      CREATE TABLE IF NOT EXISTS tickets (
        id   TEXT PRIMARY KEY,
        data TEXT NOT NULL
      );
    `);
  }
  return _db;
}
