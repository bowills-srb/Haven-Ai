import { WarrantyTicket } from "./warranty";
import { getDb } from "./db";

export function saveTicket(ticket: WarrantyTicket): void {
  const db = getDb();
  db.prepare("INSERT OR REPLACE INTO tickets (id, data) VALUES (?, ?)").run(
    ticket.id,
    JSON.stringify(ticket)
  );
}

export function getTickets(): WarrantyTicket[] {
  const db = getDb();
  const rows = db.prepare("SELECT data FROM tickets ORDER BY rowid DESC").all() as { data: string }[];
  return rows.map((r) => JSON.parse(r.data) as WarrantyTicket);
}

export function updateTicketStatus(id: string, status: string): WarrantyTicket | null {
  const db = getDb();
  const row = db.prepare("SELECT data FROM tickets WHERE id = ?").get(id) as { data: string } | undefined;
  if (!row) return null;
  const ticket: WarrantyTicket = JSON.parse(row.data);
  const updated = { ...ticket, actionStatus: { emailSent: ticket.actionStatus?.emailSent ?? false, eventCreated: ticket.actionStatus?.eventCreated ?? false, error: ticket.actionStatus?.error, status } };
  db.prepare("UPDATE tickets SET data = ? WHERE id = ?").run(JSON.stringify(updated), id);
  return updated;
}
