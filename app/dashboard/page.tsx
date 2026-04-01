"use client";

import { useState, useEffect, useCallback } from "react";
import { CalendarEvent, WarrantyTicket, formatServiceNumber } from "@/lib/warranty";

function fmtDate(s: string) {
  try { return new Date(s + "T12:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }); }
  catch { return s; }
}

function fmtTime(d: Date) {
  return d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true });
}

const NAV = [
  { label: "WARRANTY AGENT", href: "/" },
  { label: "DASHBOARD", href: "/dashboard" },
  { label: "CALENDAR", href: "/calendar" },
];

function Header({ lastUpdated }: { lastUpdated: Date | null }) {
  return (
    <div style={{ background: "#050c14", borderBottom: "1px solid #0f1d29", padding: "14px 28px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <div style={{ width: 34, height: 34, borderRadius: 9, background: "linear-gradient(135deg,#00e5c4,#0076ff)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: 13, color: "#fff", fontFamily: "'Barlow Condensed',sans-serif" }}>BH</div>
        <div>
          <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 800, fontSize: 17, color: "#00e5c4", letterSpacing: ".07em" }}>BLUE HAVEN · OPERATIONS DASHBOARD</div>
          <div style={{ fontSize: 10, color: "#1e3040", fontFamily: "'DM Mono',monospace", letterSpacing: ".1em" }}>HAVEN AI · LIVE DISPATCH OVERVIEW</div>
        </div>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
        {lastUpdated && <span style={{ fontSize: 10, color: "#1e3040", fontFamily: "'DM Mono',monospace" }}>SYNCED {fmtTime(lastUpdated)}</span>}
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#00e5c4", animation: "blink 2s ease infinite" }} />
          <span style={{ fontSize: 10, color: "#00e5c4", fontFamily: "'DM Mono',monospace", letterSpacing: ".1em" }}>LIVE</span>
        </div>
        <div style={{ display: "flex", gap: 4 }}>
          {NAV.map((n) => (
            <a key={n.href} href={n.href} style={{ fontSize: 10, color: n.href === "/dashboard" ? "#00e5c4" : "#2d4a60", fontFamily: "'DM Mono',monospace", letterSpacing: ".1em", textDecoration: "none", border: `1px solid ${n.href === "/dashboard" ? "#00e5c440" : "#142030"}`, borderRadius: 6, padding: "5px 12px" }}>{n.label}</a>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const today = new Date().toISOString().split("T")[0];
  const [tickets, setTickets] = useState<WarrantyTicket[]>([]);
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const refresh = useCallback(async () => {
    const [tRes, eRes] = await Promise.all([fetch("/api/tickets"), fetch("/api/events")]);
    if (tRes.ok) setTickets(await tRes.json());
    if (eRes.ok) setEvents(await eRes.json());
    setLastUpdated(new Date());
  }, []);

  useEffect(() => {
    refresh();
    const id = setInterval(refresh, 15000);
    return () => clearInterval(id);
  }, [refresh]);

  // ── derived stats ──
  const total = tickets.length;
  const builder = tickets.filter((t) => t.route === "builder").length;
  const manufacturer = tickets.filter((t) => t.route === "manufacturer").length;
  const pct = (n: number) => (total ? Math.round((n / total) * 100) : 0);
  const avgDays = total ? Math.round(tickets.reduce((s, t) => s + t.daysSinceStart, 0) / total) : 0;

  const todayEvents = events.filter((e) => e.date === today);
  const upcomingEvents = events.filter((e) => e.date > today && e.status !== "completed");
  const completedEvents = events.filter((e) => e.status === "completed");

  // mini calendar
  const now = new Date();
  const [viewMonth, setViewMonth] = useState({ year: now.getFullYear(), month: now.getMonth() });
  const [selDate, setSelDate] = useState(today);
  const { year, month } = viewMonth;
  const firstDow = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const monthLabel = new Date(year, month, 1).toLocaleDateString("en-US", { month: "long", year: "numeric" }).toUpperCase();
  const byDate: Record<string, CalendarEvent[]> = {};
  events.forEach((e) => { (byDate[e.date] = byDate[e.date] || []).push(e); });
  const cells: (number | null)[] = [];
  for (let i = 0; i < firstDow; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  while (cells.length % 7) cells.push(null);
  const selEvents = (byDate[selDate] || []).sort((a, b) => {
    const o: Record<string, number> = { completed: 0, scheduled: 1, pending: 2 };
    return o[a.status] - o[b.status];
  });

  const statCard = (label: string, val: string | number, color: string, sub?: string) => (
    <div style={{ background: "#0a1520", borderRadius: 12, padding: "16px 20px", flex: 1 }}>
      <div style={{ fontSize: 32, fontWeight: 700, color, fontFamily: "'DM Mono',monospace", lineHeight: 1 }}>{val}</div>
      <div style={{ fontSize: 9, color: "#1e3040", fontFamily: "'DM Mono',monospace", textTransform: "uppercase", letterSpacing: ".1em", marginTop: 6 }}>{label}</div>
      {sub && <div style={{ fontSize: 10, color: "#2d4a60", fontFamily: "'DM Mono',monospace", marginTop: 3 }}>{sub}</div>}
    </div>
  );

  const bar = (label: string, count: number, color: string) => (
    <div style={{ marginBottom: 12 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
        <span style={{ fontSize: 11, color: "#5a8aaa" }}>{label}</span>
        <span style={{ fontSize: 11, color, fontFamily: "'DM Mono',monospace" }}>{count} · {pct(count)}%</span>
      </div>
      <div style={{ height: 7, background: "#07101a", borderRadius: 4, overflow: "hidden" }}>
        <div style={{ height: "100%", width: `${pct(count)}%`, background: color, borderRadius: 4, transition: "width .5s ease" }} />
      </div>
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", background: "#07101a", fontFamily: "'Barlow',sans-serif", display: "flex", flexDirection: "column" }}>
      <Header lastUpdated={lastUpdated} />

      <div style={{ flex: 1, padding: "24px 28px", maxWidth: 1300, margin: "0 auto", width: "100%" }}>

        {/* ── KPI row ── */}
        <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
          {statCard("Total Tickets", total, "#dbe8f5")}
          {statCard("Today's Appointments", todayEvents.length, "#00e5c4", todayEvents.length === 0 ? "None scheduled" : `${todayEvents.filter(e=>e.status==="completed").length} completed`)}
          {statCard("Upcoming", upcomingEvents.length, "#ff8c42", "Next 30 days")}
          {statCard("Avg Pool Age", total ? `${avgDays}d` : "—", "#5a8aaa", total ? (avgDays <= 60 ? "Builder window" : "Past window") : "No data")}
          {statCard("Completed", completedEvents.length, "#00e5c4", `of ${events.length} total`)}
        </div>

        {/* ── middle: routing + recent tickets ── */}
        <div style={{ display: "flex", gap: 16, marginBottom: 20 }}>

          {/* routing panel */}
          <div style={{ flex: "0 0 280px", background: "#0a1520", borderRadius: 14, padding: "18px 20px" }}>
            <div style={{ fontSize: 9, color: "#1e3040", fontFamily: "'DM Mono',monospace", textTransform: "uppercase", letterSpacing: ".12em", marginBottom: 16 }}>Routing Split</div>
            {bar("🏊 Builder · Blue Haven", builder, "#00e5c4")}
            {bar("⚡ Manufacturer · Sasser", manufacturer, "#ff8c42")}
            {total === 0 && <div style={{ fontSize: 11, color: "#142030", fontFamily: "'DM Mono',monospace", textAlign: "center", padding: "12px 0" }}>No tickets yet</div>}

            <div style={{ borderTop: "1px solid #0f1d29", marginTop: 20, paddingTop: 16 }}>
              <div style={{ fontSize: 9, color: "#1e3040", fontFamily: "'DM Mono',monospace", textTransform: "uppercase", letterSpacing: ".12em", marginBottom: 12 }}>Dispatch Routes</div>
              {[
                { label: "Builder ≤60d", color: "#00e5c4", icon: "🏊", val: "Blue Haven" },
                { label: "Manufacturer >60d", color: "#ff8c42", icon: "⚡", val: "Sasser Electric" },
              ].map((r) => (
                <div key={r.label} style={{ borderLeft: `3px solid ${r.color}`, paddingLeft: 10, marginBottom: 10 }}>
                  <div style={{ fontSize: 9, color: "#1e3040", fontFamily: "'DM Mono',monospace", letterSpacing: ".08em" }}>{r.label}</div>
                  <div style={{ fontSize: 12, fontWeight: 600, color: "#c8dce8" }}>{r.icon} {r.val}</div>
                </div>
              ))}
            </div>
          </div>

          {/* recent tickets */}
          <div style={{ flex: 1, background: "#0a1520", borderRadius: 14, padding: "18px 20px", minWidth: 0 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <div style={{ fontSize: 9, color: "#1e3040", fontFamily: "'DM Mono',monospace", textTransform: "uppercase", letterSpacing: ".12em" }}>Recent Tickets</div>
              <a href="/" style={{ fontSize: 9, color: "#2d4a60", fontFamily: "'DM Mono',monospace", textDecoration: "none", letterSpacing: ".08em" }}>+ New Ticket →</a>
            </div>
            {tickets.length === 0 ? (
              <div style={{ textAlign: "center", padding: "32px 0", color: "#142030", fontFamily: "'DM Mono',monospace", fontSize: 11 }}>No tickets yet — start a warranty conversation</div>
            ) : (
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr>
                      {["Service #", "Customer", "Equipment", "Issue", "Route", "Date", "Status"].map((h) => (
                        <th key={h} style={{ fontSize: 9, color: "#1e3040", fontFamily: "'DM Mono',monospace", textTransform: "uppercase", letterSpacing: ".08em", padding: "0 10px 10px 0", textAlign: "left", whiteSpace: "nowrap" }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {tickets.map((t) => {
                      const color = t.route === "builder" ? "#00e5c4" : "#ff8c42";
                      const dispatched = t.actionStatus?.emailSent;
                      return (
                        <tr key={t.id} style={{ borderTop: "1px solid #0f1d29" }}>
                          <td style={{ padding: "10px 10px 10px 0", fontSize: 10, color: "#5a8aaa", fontFamily: "'DM Mono',monospace", whiteSpace: "nowrap" }}>{formatServiceNumber(t.id)}</td>
                          <td style={{ padding: "10px 10px 10px 0", fontSize: 12, color: "#c8dce8", whiteSpace: "nowrap" }}>{t.customerName}</td>
                          <td style={{ padding: "10px 10px 10px 0", fontSize: 11, color: "#2d4a60", whiteSpace: "nowrap" }}>{t.equipment}</td>
                          <td style={{ padding: "10px 10px 10px 0", fontSize: 11, color: "#2d4a60", maxWidth: 180, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{t.issueDescription}</td>
                          <td style={{ padding: "10px 10px 10px 0", whiteSpace: "nowrap" }}>
                            <span style={{ fontSize: 9, color, background: color + "18", padding: "2px 8px", borderRadius: 20, fontFamily: "'DM Mono',monospace" }}>{t.route === "builder" ? "Builder" : "Manufacturer"}</span>
                          </td>
                          <td style={{ padding: "10px 10px 10px 0", fontSize: 10, color: "#2d4a60", whiteSpace: "nowrap" }}>{fmtDate(t.serviceDate)}</td>
                          <td style={{ padding: "10px 0 10px 0", whiteSpace: "nowrap" }}>
                            <span style={{ fontSize: 9, color: dispatched ? "#00e5c4" : "#ff6b6b", fontFamily: "'DM Mono',monospace" }}>{dispatched ? "✓ Dispatched" : "✗ Failed"}</span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* ── bottom: mini calendar + today's appointments ── */}
        <div style={{ display: "flex", gap: 16 }}>

          {/* mini calendar */}
          <div style={{ flex: "0 0 340px", background: "#0a1520", borderRadius: 14, padding: "18px 20px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
              <button onClick={() => setViewMonth(({ year, month }) => month === 0 ? { year: year - 1, month: 11 } : { year, month: month - 1 })} style={{ background: "none", border: "1px solid #142030", color: "#2d4a60", borderRadius: 6, padding: "3px 10px", cursor: "pointer", fontSize: 14 }}>‹</button>
              <span style={{ fontFamily: "'DM Mono',monospace", fontSize: 11, color: "#00e5c4", letterSpacing: ".1em" }}>{monthLabel}</span>
              <button onClick={() => setViewMonth(({ year, month }) => month === 11 ? { year: year + 1, month: 0 } : { year, month: month + 1 })} style={{ background: "none", border: "1px solid #142030", color: "#2d4a60", borderRadius: 6, padding: "3px 10px", cursor: "pointer", fontSize: 14 }}>›</button>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", marginBottom: 3 }}>
              {["Su","Mo","Tu","We","Th","Fr","Sa"].map((d) => (
                <div key={d} style={{ textAlign: "center", fontSize: 9, color: "#1e3040", fontFamily: "'DM Mono',monospace", padding: "2px 0" }}>{d}</div>
              ))}
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 2 }}>
              {cells.map((day, i) => {
                if (!day) return <div key={i} style={{ height: 34 }} />;
                const ds = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
                const ev = byDate[ds] || [];
                const isToday = ds === today;
                const isSel = ds === selDate;
                const bCount = ev.filter((e) => e.type === "builder").length;
                const mCount = ev.filter((e) => e.type === "manufacturer").length;
                return (
                  <div key={i} onClick={() => setSelDate(ds)} style={{ height: 34, borderRadius: 6, cursor: "pointer", background: isSel ? "#00e5c415" : isToday ? "#ffffff08" : "transparent", border: `1px solid ${isSel ? "#00e5c440" : isToday ? "#00e5c420" : "transparent"}`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 2 }}>
                    <span style={{ fontSize: 11, color: isToday ? "#00e5c4" : isSel ? "#dbe8f5" : "#5a8aaa", fontWeight: isToday ? 700 : 400 }}>{day}</span>
                    {ev.length > 0 && (
                      <div style={{ display: "flex", gap: 2 }}>
                        {bCount > 0 && <div style={{ width: 4, height: 4, borderRadius: "50%", background: "#00e5c4" }} />}
                        {mCount > 0 && <div style={{ width: 4, height: 4, borderRadius: "50%", background: "#ff8c42" }} />}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            <div style={{ marginTop: 12, borderTop: "1px solid #0f1d29", paddingTop: 10 }}>
              <a href="/calendar" style={{ fontSize: 9, color: "#2d4a60", fontFamily: "'DM Mono',monospace", textDecoration: "none", letterSpacing: ".08em" }}>OPEN FULL CALENDAR →</a>
            </div>
          </div>

          {/* selected day detail */}
          <div style={{ flex: 1, background: "#0a1520", borderRadius: 14, padding: "18px 20px", minWidth: 0 }}>
            <div style={{ fontSize: 9, color: "#1e3040", fontFamily: "'DM Mono',monospace", textTransform: "uppercase", letterSpacing: ".12em", marginBottom: 4 }}>
              {selDate === today ? "Today" : new Date(selDate + "T12:00:00").toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
            </div>
            <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: 24, fontWeight: 800, color: "#dbe8f5", marginBottom: 14 }}>
              {selEvents.length === 0 ? "No Appointments" : `${selEvents.length} Appointment${selEvents.length !== 1 ? "s" : ""}`}
            </div>
            {selEvents.length === 0 ? (
              <div style={{ color: "#142030", fontFamily: "'DM Mono',monospace", fontSize: 11, textAlign: "center", padding: "24px 0" }}>Nothing scheduled — click a date on the calendar</div>
            ) : (
              selEvents.map((e) => {
                const color = e.type === "builder" ? "#00e5c4" : "#ff8c42";
                const statusColor = e.status === "completed" ? "#00e5c4" : e.status === "scheduled" ? "#ff8c42" : "#5a8aaa";
                return (
                  <div key={e.id} style={{ borderLeft: `3px solid ${color}`, background: "#07101a", borderRadius: 10, padding: "12px 16px", marginBottom: 8, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: "#c8dce8", marginBottom: 3 }}>{e.customer}</div>
                      <div style={{ fontSize: 11, color: "#5a8aaa" }}>{e.equipment} · {e.issue}</div>
                      <div style={{ fontSize: 10, color: "#1e3040", fontFamily: "'DM Mono',monospace", marginTop: 4 }}>🕐 {e.time} · {e.tech}</div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontSize: 9, color, fontFamily: "'DM Mono',monospace", marginBottom: 4 }}>{e.type === "builder" ? "🏊 Blue Haven" : "⚡ Sasser"}</div>
                      <div style={{ fontSize: 9, color: statusColor, fontFamily: "'DM Mono',monospace" }}>● {e.status}</div>
                      {e.ticketId && <div style={{ fontSize: 8, color: "#142030", fontFamily: "'DM Mono',monospace", marginTop: 3 }}>{formatServiceNumber(e.ticketId)}</div>}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
