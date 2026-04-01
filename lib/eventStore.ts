import { CalendarEvent, SEED_EVENTS } from "./warranty";
import { getDb } from "./db";

function seedDb() {
  const db = getDb();
  const insert = db.prepare(`
    INSERT OR IGNORE INTO calendar_events
      (id, date, customer, address, equipment, issue, type, time, tech, status, ticketId)
    VALUES
      (@id, @date, @customer, @address, @equipment, @issue, @type, @time, @tech, @status, @ticketId)
  `);
  for (const e of SEED_EVENTS) {
    insert.run({ ...e, ticketId: e.ticketId ?? null });
  }
}

export function getEvents(): CalendarEvent[] {
  seedDb();
  const db = getDb();
  const rows = db.prepare("SELECT * FROM calendar_events ORDER BY date ASC").all() as CalendarEvent[];
  return rows;
}

export function addEvent(event: CalendarEvent): void {
  const db = getDb();
  db.prepare(`
    INSERT OR IGNORE INTO calendar_events
      (id, date, customer, address, equipment, issue, type, time, tech, status, ticketId)
    VALUES
      (@id, @date, @customer, @address, @equipment, @issue, @type, @time, @tech, @status, @ticketId)
  `).run({ ...event, ticketId: event.ticketId ?? null });
}

export function updateEventStatus(id: string, status: CalendarEvent["status"]): CalendarEvent | null {
  const db = getDb();
  db.prepare("UPDATE calendar_events SET status = ? WHERE id = ?").run(status, id);
  const row = db.prepare("SELECT * FROM calendar_events WHERE id = ?").get(id) as CalendarEvent | undefined;
  return row ?? null;
}
