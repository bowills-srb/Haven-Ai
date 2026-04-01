"use client";

import { useState, useEffect, useCallback } from "react";
import { CalendarEvent, formatServiceNumber } from "@/lib/warranty";

export default function CalendarPage() {
  const today = new Date().toISOString().split("T")[0];
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [viewMonth, setViewMonth] = useState<{ year: number; month: number }>(() => {
    const d = new Date();
    return { year: d.getFullYear(), month: d.getMonth() };
  });
  const [selected, setSelected] = useState<string>(today);

  const fetchEvents = useCallback(async () => {
    try {
      const res = await fetch("/api/events");
      if (res.ok) {
        const data = await res.json();
        setEvents(data);
        setLastUpdated(new Date());
      }
    } finally {
      setLoading(false);
    }
  }, []);

  const cycleStatus = async (id: string, current: CalendarEvent["status"]) => {
    const next: CalendarEvent["status"] = current === "pending" ? "scheduled" : current === "scheduled" ? "completed" : "pending";
    const res = await fetch(`/api/events/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status: next }) });
    if (res.ok) {
      const updated: CalendarEvent = await res.json();
      setEvents((prev) => prev.map((e) => e.id === id ? updated : e));
    }
  };

  useEffect(() => {
    fetchEvents();
    const interval = setInterval(fetchEvents, 15000);
    return () => clearInterval(interval);
  }, [fetchEvents]);

  const { year, month } = viewMonth;
  const firstDow = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const monthLabel = new Date(year, month, 1)
    .toLocaleDateString("en-US", { month: "long", year: "numeric" })
    .toUpperCase();

  const byDate: Record<string, CalendarEvent[]> = {};
  events.forEach((e) => { (byDate[e.date] = byDate[e.date] || []).push(e); });

  const cells: (number | null)[] = [];
  for (let i = 0; i < firstDow; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  while (cells.length % 7) cells.push(null);

  const selEvents = (byDate[selected] || []).slice().sort((a, b) => {
    const o: Record<string, number> = { completed: 0, scheduled: 1, pending: 2 };
    return o[a.status] - o[b.status];
  });

  const navBtn = (label: string, onClick: () => void) => (
    <button
      onClick={onClick}
      style={{ background: "none", border: "1px solid #142030", color: "#2d4a60", borderRadius: 6, padding: "5px 14px", cursor: "pointer", fontSize: 16, lineHeight: 1 }}
    >
      {label}
    </button>
  );

  const fmtTime = (d: Date) =>
    d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true });

  return (
    <div style={{ minHeight: "100vh", background: "#07101a", fontFamily: "'Barlow',sans-serif", display: "flex", flexDirection: "column" }}>

      {/* ── header ── */}
      <div style={{ background: "#050c14", borderBottom: "1px solid #0f1d29", padding: "14px 28px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 34, height: 34, borderRadius: 9, background: "linear-gradient(135deg,#00e5c4,#0076ff)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: 13, color: "#fff", fontFamily: "'Barlow Condensed',sans-serif" }}>
            BH
          </div>
          <div>
            <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 800, fontSize: 17, color: "#00e5c4", letterSpacing: ".07em" }}>
              BLUE HAVEN · SERVICE CALENDAR
            </div>
            <div style={{ fontSize: 10, color: "#1e3040", fontFamily: "'DM Mono',monospace", letterSpacing: ".1em" }}>
              LIVE · AUTO-REFRESHES EVERY 15 SECONDS
            </div>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          {lastUpdated && (
            <span style={{ fontSize: 10, color: "#1e3040", fontFamily: "'DM Mono',monospace", letterSpacing: ".08em" }}>
              SYNCED {fmtTime(lastUpdated)}
            </span>
          )}
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#00e5c4", animation: "blink 2s ease infinite" }} />
            <span style={{ fontSize: 10, color: "#00e5c4", fontFamily: "'DM Mono',monospace", letterSpacing: ".1em" }}>LIVE</span>
          </div>
          <a
            href="/"
            style={{ fontSize: 10, color: "#2d4a60", fontFamily: "'DM Mono',monospace", letterSpacing: ".1em", textDecoration: "none", border: "1px solid #142030", borderRadius: 6, padding: "5px 12px" }}
          >
            ← WARRANTY AGENT
          </a>
        </div>
      </div>

      {/* ── body ── */}
      <div style={{ flex: 1, display: "flex", gap: 0, maxWidth: 1200, margin: "0 auto", width: "100%", padding: "28px 28px" }}>

        {/* ── left: calendar grid ── */}
        <div style={{ flex: "0 0 520px", paddingRight: 36 }}>

          {/* legend */}
          <div style={{ display: "flex", gap: 16, marginBottom: 20 }}>
            {[
              { color: "#00e5c4", label: "Builder Warranty — Blue Haven" },
              { color: "#ff8c42", label: "Manufacturer — Sasser Electric" },
            ].map((x) => (
              <div key={x.label} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: x.color, flexShrink: 0 }} />
                <span style={{ fontSize: 10, color: "#2d4a60", fontFamily: "'DM Mono',monospace", letterSpacing: ".06em" }}>{x.label}</span>
              </div>
            ))}
          </div>

          {/* month nav */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            {navBtn("‹", () => setViewMonth(({ year, month }) => month === 0 ? { year: year - 1, month: 11 } : { year, month: month - 1 }))}
            <span style={{ fontFamily: "'DM Mono',monospace", fontSize: 13, color: "#00e5c4", letterSpacing: ".12em" }}>{monthLabel}</span>
            {navBtn("›", () => setViewMonth(({ year, month }) => month === 11 ? { year: year + 1, month: 0 } : { year, month: month + 1 }))}
          </div>

          {/* day headers */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", marginBottom: 4 }}>
            {["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map((d) => (
              <div key={d} style={{ textAlign: "center", fontSize: 10, color: "#1e3040", fontFamily: "'DM Mono',monospace", padding: "3px 0", letterSpacing: ".06em" }}>{d}</div>
            ))}
          </div>

          {/* grid */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 3 }}>
            {cells.map((day, i) => {
              if (!day) return <div key={i} style={{ height: 56 }} />;
              const ds = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
              const ev = byDate[ds] || [];
              const isToday = ds === today;
              const isSel = ds === selected;
              const bCount = ev.filter((e) => e.type === "builder").length;
              const mCount = ev.filter((e) => e.type === "manufacturer").length;
              return (
                <div
                  key={i}
                  onClick={() => setSelected(ds)}
                  style={{ height: 56, borderRadius: 8, cursor: "pointer", background: isSel ? "#00e5c418" : isToday ? "#ffffff08" : "transparent", border: `1px solid ${isSel ? "#00e5c440" : isToday ? "#00e5c425" : "#0f1d2900"}`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 4, transition: "background .1s" }}
                >
                  <span style={{ fontSize: 13, color: isToday ? "#00e5c4" : isSel ? "#dbe8f5" : "#5a8aaa", fontWeight: isToday ? 700 : 400 }}>{day}</span>
                  {ev.length > 0 && (
                    <div style={{ display: "flex", gap: 3 }}>
                      {bCount > 0 && <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#00e5c4" }} />}
                      {mCount > 0 && <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#ff8c42" }} />}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* stats */}
          <div style={{ display: "flex", gap: 8, marginTop: 20 }}>
            {[
              { label: "Total", val: events.length, color: "#5a8aaa" },
              { label: "Upcoming", val: events.filter((e) => e.status !== "completed").length, color: "#ff8c42" },
              { label: "Completed", val: events.filter((e) => e.status === "completed").length, color: "#00e5c4" },
            ].map((s) => (
              <div key={s.label} style={{ flex: 1, background: "#0a1520", borderRadius: 10, padding: "10px 0", textAlign: "center" }}>
                <div style={{ fontSize: 24, fontWeight: 700, color: s.color, fontFamily: "'DM Mono',monospace" }}>{s.val}</div>
                <div style={{ fontSize: 9, color: "#1e3040", fontFamily: "'DM Mono',monospace", textTransform: "uppercase", letterSpacing: ".1em", marginTop: 2 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ── right: day detail ── */}
        <div style={{ flex: 1, borderLeft: "1px solid #0f1d29", paddingLeft: 36 }}>
          <div style={{ marginBottom: 20 }}>
            <div style={{ fontSize: 11, color: "#1e3040", fontFamily: "'DM Mono',monospace", textTransform: "uppercase", letterSpacing: ".12em", marginBottom: 4 }}>
              {selected === today
                ? "Today"
                : new Date(selected + "T12:00:00").toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })}
            </div>
            <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: 28, fontWeight: 800, color: "#dbe8f5", letterSpacing: ".02em" }}>
              {selEvents.length === 0 ? "No Appointments" : `${selEvents.length} Appointment${selEvents.length !== 1 ? "s" : ""}`}
            </div>
          </div>

          {loading ? (
            <div style={{ fontSize: 11, color: "#00e5c4", fontFamily: "'DM Mono',monospace", letterSpacing: ".1em", padding: "40px 0" }}>
              LOADING...
            </div>
          ) : selEvents.length === 0 ? (
            <div style={{ background: "#0a1520", border: "1px dashed #142030", borderRadius: 14, padding: "44px 20px", textAlign: "center" }}>
              <div style={{ fontSize: 30, opacity: 0.15, marginBottom: 10 }}>📅</div>
              <div style={{ fontFamily: "'DM Mono',monospace", fontSize: 11, color: "#1e3040", lineHeight: 2 }}>
                No appointments scheduled for this day.
              </div>
            </div>
          ) : (
            selEvents.map((e) => {
              const color = e.type === "builder" ? "#00e5c4" : "#ff8c42";
              const statusIcon = e.status === "completed" ? "✓" : e.status === "scheduled" ? "◎" : "●";
              const statusColor = e.status === "completed" ? "#00e5c4" : e.status === "scheduled" ? "#ff8c42" : "#5a8aaa";
              return (
                <div
                  key={e.id}
                  style={{ background: "#0a1520", borderLeft: `4px solid ${color}`, borderRadius: 12, padding: "16px 20px", marginBottom: 10 }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                    <div style={{ fontSize: 16, fontWeight: 700, color: "#c8dce8" }}>{e.customer}</div>
                    <button
                      onClick={() => cycleStatus(e.id, e.status)}
                      style={{ fontSize: 10, color: statusColor, fontFamily: "'DM Mono',monospace", letterSpacing: ".08em", background: statusColor + "18", border: `1px solid ${statusColor}40`, borderRadius: 20, padding: "3px 10px", cursor: "pointer" }}
                    >
                      {statusIcon} {e.status.toUpperCase()}
                    </button>
                  </div>
                  <div style={{ fontSize: 12, color: "#5a8aaa", marginBottom: 4 }}>{e.equipment}</div>
                  <div style={{ fontSize: 13, color: "#2d4a60", marginBottom: 10, lineHeight: 1.5 }}>{e.issue}</div>
                  <div style={{ fontSize: 11, color: "#1e3040" }}>{e.address}</div>
                  <div style={{ display: "flex", gap: 16, marginTop: 12 }}>
                    <span style={{ fontSize: 10, color: "#1e3040", fontFamily: "'DM Mono',monospace" }}>🕐 {e.time}</span>
                    <span style={{ fontSize: 10, color, fontFamily: "'DM Mono',monospace" }}>{e.type === "builder" ? "🏊 Blue Haven" : "⚡ Sasser Electric"}</span>
                    <span style={{ fontSize: 10, color: "#1e3040", fontFamily: "'DM Mono',monospace" }}>{e.tech}</span>
                  </div>
                  {e.ticketId && (
                    <div style={{ marginTop: 10, fontSize: 9, color: "#142030", fontFamily: "'DM Mono',monospace", letterSpacing: ".1em" }}>
                      {formatServiceNumber(e.ticketId)}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
