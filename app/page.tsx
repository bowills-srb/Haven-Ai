"use client";

import { useState, useRef, useEffect, KeyboardEvent } from "react";
import { POOL_DB, MANUFACTURERS, SASSER, DISPATCH_EMAIL, parseTicket, WarrantyTicket } from "@/lib/warranty";

// ── helpers ──────────────────────────────────────────────────────────────────

function fmt(d: Date) {
  return d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true });
}

function fmtDate(s: string) {
  try {
    return new Date(s + "T12:00:00").toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  } catch {
    return s;
  }
}

// ── types ─────────────────────────────────────────────────────────────────────

interface ChatMessage {
  id: number | string;
  role: "user" | "assistant";
  text: string;
}

interface ApiMessage {
  role: "user" | "assistant";
  content: string;
}

// ── Bubble component ──────────────────────────────────────────────────────────

function Bubble({ msg }: { msg: ChatMessage }) {
  const isUser = msg.role === "user";
  return (
    <div
      style={{
        display: "flex",
        justifyContent: isUser ? "flex-end" : "flex-start",
        marginBottom: 6,
        paddingLeft: isUser ? 44 : 0,
        paddingRight: isUser ? 0 : 44,
        animation: "pop .2s ease both",
      }}
    >
      <div
        style={{
          background: isUser ? "#007AFF" : "#e9e9eb",
          color: isUser ? "#fff" : "#000",
          borderRadius: isUser ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
          padding: "10px 14px",
          fontSize: 15,
          lineHeight: 1.5,
          fontFamily: "-apple-system,BlinkMacSystemFont,sans-serif",
          whiteSpace: "pre-wrap",
          wordBreak: "break-word",
        }}
      >
        {msg.text}
      </div>
    </div>
  );
}

// ── TicketCard component ──────────────────────────────────────────────────────

function TicketCard({ t }: { t: WarrantyTicket }) {
  const builder = t.route === "builder";
  const color = builder ? "#00c49a" : "#ff8c42";

  const rows: [string, string][] = [
    ["Customer", t.customerName + (t.customerPhone ? " · " + t.customerPhone : "")],
    ["Address", t.customerAddress],
    ["Equipment", t.equipment + " (" + t.brand + ")"],
    ["Issue", t.issueDescription],
    ["Warranty", t.warrantyType],
    ["Service Date", fmtDate(t.serviceDate)],
  ];

  return (
    <div
      style={{
        background: "#fff",
        borderRadius: 14,
        overflow: "hidden",
        border: "2px solid " + color + "50",
        marginBottom: 14,
        animation: "pop .4s ease both",
      }}
    >
      {/* header */}
      <div
        style={{
          background: color,
          padding: "12px 18px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
        }}
      >
        <div>
          <div
            style={{
              fontSize: 10,
              color: builder ? "#003d2e" : "#3d1a00",
              fontFamily: "monospace",
              letterSpacing: ".12em",
              textTransform: "uppercase",
            }}
          >
            {builder ? "⚡ Builder Warranty" : "🔧 Manufacturer Warranty"}
          </div>
          <div
            style={{
              fontSize: 22,
              fontWeight: 800,
              color: builder ? "#001a12" : "#1a0800",
              fontFamily: "monospace",
            }}
          >
            {t.id}
          </div>
        </div>
        <div
          style={{
            textAlign: "right",
            fontSize: 11,
            color: builder ? "#003d2e" : "#3d1a00",
            fontFamily: "monospace",
          }}
        >
          {fmt(new Date(t.createdAt))}
        </div>
      </div>

      {/* body */}
      <div style={{ padding: "14px 18px" }}>
        <div
          style={{
            background: builder ? "#f0fff8" : "#fff8f0",
            border: "1px solid " + color + "30",
            borderRadius: 8,
            padding: "10px 12px",
            marginBottom: 12,
            fontSize: 13,
            lineHeight: 1.6,
            color: "#333",
          }}
        >
          Pool started <strong>{t.startDate}</strong> ·{" "}
          <strong style={{ color: builder ? "#007a55" : "#b85500" }}>
            {t.daysSinceStart} days ago
          </strong>
          <br />
          {builder
            ? "Within 60-day builder window → Blue Haven handles"
            : `${t.daysSinceStart - 60} days past window → Sasser Electric`}
        </div>

        {rows.map(([label, value]) => (
          <div
            key={label}
            style={{
              display: "flex",
              gap: 10,
              marginBottom: 7,
              paddingBottom: 7,
              borderBottom: "1px solid #f0f0f0",
            }}
          >
            <span
              style={{
                fontSize: 10,
                fontFamily: "monospace",
                color: "#aaa",
                textTransform: "uppercase",
                letterSpacing: ".08em",
                width: 86,
                flexShrink: 0,
                paddingTop: 2,
              }}
            >
              {label}
            </span>
            <span style={{ fontSize: 13, color: "#222" }}>{value}</span>
          </div>
        ))}

        {/* assigned tech */}
        <div
          style={{
            background: builder ? "#f0fff8" : "#fff8f0",
            borderRadius: 10,
            padding: "10px 14px",
            marginTop: 8,
            display: "flex",
            gap: 10,
            alignItems: "center",
          }}
        >
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: "50%",
              background: color + "22",
              border: "2px solid " + color,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 16,
              flexShrink: 0,
            }}
          >
            {builder ? "🏊" : "⚡"}
          </div>
          <div>
            <div
              style={{
                fontSize: 10,
                fontFamily: "monospace",
                color: "#aaa",
                textTransform: "uppercase",
                letterSpacing: ".08em",
              }}
            >
              Assigned To
            </div>
            <div style={{ fontSize: 14, fontWeight: 700, color: "#111" }}>{t.techAssigned}</div>
            <div style={{ fontSize: 12, color: "#666", fontFamily: "monospace" }}>{t.techPhone}</div>
          </div>
        </div>

        {/* dispatch status */}
        <div
          style={{
            marginTop: 12,
            background: "#0a1520",
            borderRadius: 10,
            padding: "10px 14px",
          }}
        >
          {t.dispatching ? (
            <div
              style={{
                fontSize: 11,
                color: "#00e5c4",
                fontFamily: "monospace",
                animation: "blink 1.5s ease infinite",
              }}
            >
              ⟳ Sending email + creating calendar event...
            </div>
          ) : t.actionStatus ? (
            <div>
              <div
                style={{
                  fontSize: 10,
                  color: "#1e3040",
                  fontFamily: "monospace",
                  textTransform: "uppercase",
                  letterSpacing: ".1em",
                  marginBottom: 6,
                }}
              >
                Dispatch Actions
              </div>
              <div
                style={{
                  fontSize: 12,
                  fontFamily: "monospace",
                  color: t.actionStatus.emailSent ? "#00e5c4" : "#ff6b6b",
                  marginBottom: 3,
                }}
              >
                {t.actionStatus.emailSent ? "✓" : "✗"} Email → {DISPATCH_EMAIL}
              </div>
              <div
                style={{
                  fontSize: 12,
                  fontFamily: "monospace",
                  color: t.actionStatus.eventCreated ? "#00e5c4" : "#ff6b6b",
                }}
              >
                {t.actionStatus.eventCreated ? "✓" : "✗"} Calendar → {fmtDate(t.serviceDate)} 9–11 AM
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

// ── Main App ──────────────────────────────────────────────────────────────────

const INIT_MSG: ChatMessage = {
  id: "i0",
  role: "assistant",
  text: "Hi! You've reached Blue Haven Pools warranty support. I'm Haven, your AI service agent. What's the service address for your pool?",
};

export default function App() {
  const [msgs, setMsgs] = useState<ChatMessage[]>([INIT_MSG]);
  const [hist, setHist] = useState<ApiMessage[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [tickets, setTickets] = useState<WarrantyTicket[]>([]);
  const [tab, setTab] = useState<"customers" | "tickets">("customers");

  const endRef = useRef<HTMLDivElement>(null);
  const inRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [msgs, busy]);

  const send = async (text: string) => {
    if (!text.trim() || busy) return;

    const userMsg: ChatMessage = { id: Date.now(), role: "user", text: text.trim() };
    setMsgs((p) => [...p, userMsg]);
    setInput("");
    setBusy(true);

    const newHist: ApiMessage[] = [...hist, { role: "user", content: text.trim() }];

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newHist.slice(-8) }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "API error");

      const responseText: string =
        data.text || "Sorry, I couldn't process that. Please try again.";
      const { clean, ticket } = parseTicket(responseText);

      setMsgs((p) => [...p, { id: Date.now() + 1, role: "assistant", text: clean }]);
      setHist([...newHist, { role: "assistant", content: clean }]);

      if (ticket) {
        const newTicket: WarrantyTicket = { ...ticket, dispatching: true };
        setTickets((p) => [newTicket, ...p]);
        setTab("tickets");

        try {
          const dispatchRes = await fetch("/api/dispatch", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(ticket),
          });
          const actionStatus = await dispatchRes.json();
          setTickets((p) =>
            p.map((t) =>
              t.id === newTicket.id ? { ...t, dispatching: false, actionStatus } : t
            )
          );
        } catch (err) {
          const errMsg = err instanceof Error ? err.message : "Dispatch failed";
          setTickets((p) =>
            p.map((t) =>
              t.id === newTicket.id
                ? {
                    ...t,
                    dispatching: false,
                    actionStatus: { emailSent: false, eventCreated: false, error: errMsg },
                  }
                : t
            )
          );
        }
      }
    } catch (e) {
      const errMsg = e instanceof Error ? e.message : "Unknown error";
      setMsgs((p) => [
        ...p,
        { id: Date.now() + 1, role: "assistant", text: "⚠️ " + errMsg },
      ]);
    } finally {
      setBusy(false);
      setTimeout(() => inRef.current?.focus(), 80);
    }
  };

  const reset = () => {
    setMsgs([INIT_MSG]);
    setHist([]);
    setInput("");
  };

  return (
    <>
      <div
        style={{
          minHeight: "100vh",
          background: "#07101a",
          fontFamily: "'Barlow',sans-serif",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* ── top bar ── */}
        <div
          style={{
            background: "#050c14",
            borderBottom: "1px solid #0f1d29",
            padding: "14px 24px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div
              style={{
                width: 34,
                height: 34,
                borderRadius: 9,
                background: "linear-gradient(135deg,#00e5c4,#0076ff)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: 900,
                fontSize: 13,
                color: "#fff",
                fontFamily: "'Barlow Condensed',sans-serif",
              }}
            >
              BH
            </div>
            <div>
              <div
                style={{
                  fontFamily: "'Barlow Condensed',sans-serif",
                  fontWeight: 800,
                  fontSize: 17,
                  color: "#00e5c4",
                  letterSpacing: ".07em",
                }}
              >
                BLUE HAVEN · WARRANTY AGENT
              </div>
              <div
                style={{
                  fontSize: 10,
                  color: "#1e3040",
                  fontFamily: "'DM Mono',monospace",
                  letterSpacing: ".1em",
                }}
              >
                HAVEN AI · GMAIL + GCAL LIVE DISPATCH
              </div>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <div
              style={{
                width: 7,
                height: 7,
                borderRadius: "50%",
                background: "#00e5c4",
                animation: "blink 2s ease infinite",
              }}
            />
            <span
              style={{
                fontSize: 10,
                color: "#00e5c4",
                fontFamily: "'DM Mono',monospace",
                letterSpacing: ".1em",
              }}
            >
              LIVE
            </span>
          </div>
        </div>

        {/* ── main layout ── */}
        <div
          style={{
            flex: 1,
            display: "flex",
            gap: 24,
            padding: "24px",
            maxWidth: 1080,
            margin: "0 auto",
            width: "100%",
            alignItems: "flex-start",
          }}
        >
          {/* ── phone mockup ── */}
          <div
            style={{
              flexShrink: 0,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 12,
            }}
          >
            <div
              style={{
                width: 330,
                background: "#161616",
                borderRadius: 44,
                padding: "10px 5px",
                boxShadow: "0 20px 60px rgba(0,0,0,.7),inset 0 0 0 1px #262626",
              }}
            >
              {/* notch */}
              <div style={{ display: "flex", justifyContent: "center", marginBottom: 5 }}>
                <div style={{ width: 108, height: 24, background: "#0e0e0e", borderRadius: 16 }} />
              </div>

              {/* screen */}
              <div
                style={{
                  background: "#f2f2f7",
                  borderRadius: 34,
                  overflow: "hidden",
                  height: 600,
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                {/* status bar */}
                <div
                  style={{
                    background: "#f2f2f7",
                    padding: "10px 18px 0",
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <span
                    style={{ fontSize: 13, fontWeight: 700, fontFamily: "-apple-system,sans-serif" }}
                  >
                    9:41
                  </span>
                  <span style={{ fontSize: 12 }}>📶🔋</span>
                </div>

                {/* contact header */}
                <div
                  style={{ padding: "6px 0 10px", textAlign: "center", borderBottom: "1px solid #ddd" }}
                >
                  <div
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: "50%",
                      background: "linear-gradient(135deg,#00e5c4,#0076ff)",
                      margin: "0 auto 4px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 20,
                    }}
                  >
                    🏊
                  </div>
                  <div style={{ fontSize: 14, fontWeight: 700, fontFamily: "-apple-system,sans-serif" }}>
                    Blue Haven Pools
                  </div>
                  <div style={{ fontSize: 11, color: "#8e8e93" }}>Warranty Support · Haven AI</div>
                </div>

                {/* messages */}
                <div
                  style={{ flex: 1, overflowY: "auto", padding: "10px 8px", background: "#fff" }}
                >
                  {msgs.map((m) => (
                    <Bubble key={m.id} msg={m} />
                  ))}
                  {busy && (
                    <div style={{ display: "flex", paddingLeft: 4, marginBottom: 6 }}>
                      <div
                        style={{
                          background: "#e9e9eb",
                          borderRadius: "18px 18px 18px 4px",
                          padding: "10px 14px",
                          display: "flex",
                          gap: 4,
                        }}
                      >
                        {[0, 0.2, 0.4].map((delay, i) => (
                          <div
                            key={i}
                            style={{
                              width: 7,
                              height: 7,
                              borderRadius: "50%",
                              background: "#8e8e93",
                              animation: `blink 1.2s ${delay}s ease infinite`,
                            }}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                  <div ref={endRef} />
                </div>

                {/* input bar */}
                <div
                  style={{
                    background: "#f2f2f7",
                    padding: "6px 8px",
                    borderTop: "1px solid #ddd",
                    display: "flex",
                    gap: 6,
                    alignItems: "center",
                  }}
                >
                  <input
                    ref={inRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e: KeyboardEvent<HTMLInputElement>) => {
                      if (e.key === "Enter" && !busy) send(input);
                    }}
                    placeholder="iMessage"
                    style={{
                      flex: 1,
                      background: "#fff",
                      border: "1px solid #ccc",
                      borderRadius: 20,
                      padding: "8px 14px",
                      fontSize: 15,
                      fontFamily: "-apple-system,sans-serif",
                      outline: "none",
                    }}
                  />
                  <button
                    onClick={() => send(input)}
                    disabled={!input.trim() || busy}
                    style={{
                      width: 30,
                      height: 30,
                      borderRadius: "50%",
                      background: input.trim() && !busy ? "#007AFF" : "#c7c7cc",
                      border: "none",
                      cursor: input.trim() && !busy ? "pointer" : "default",
                      color: "#fff",
                      fontSize: 14,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      transition: "background .15s",
                    }}
                  >
                    ↑
                  </button>
                </div>
              </div>

              {/* home indicator */}
              <div style={{ display: "flex", justifyContent: "center", marginTop: 7 }}>
                <div style={{ width: 88, height: 4, background: "#2a2a2a", borderRadius: 2 }} />
              </div>
            </div>

            <button
              onClick={reset}
              style={{
                background: "none",
                border: "1px solid #142030",
                borderRadius: 8,
                padding: "7px 18px",
                fontFamily: "'DM Mono',monospace",
                fontSize: 10,
                color: "#2d4a60",
                cursor: "pointer",
                letterSpacing: ".12em",
                textTransform: "uppercase",
              }}
            >
              ↺ New Conversation
            </button>
          </div>

          {/* ── dispatch panel ── */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ marginBottom: 16 }}>
              <h2
                style={{
                  fontFamily: "'Barlow Condensed',sans-serif",
                  fontSize: 26,
                  fontWeight: 800,
                  color: "#dbe8f5",
                  letterSpacing: ".02em",
                }}
              >
                DISPATCH PANEL
              </h2>
              <p
                style={{
                  fontSize: 10,
                  color: "#1e3040",
                  fontFamily: "'DM Mono',monospace",
                  marginTop: 2,
                }}
              >
                Tickets auto-dispatch to email + calendar when Haven finalizes routing
              </p>
            </div>

            {/* routing legend */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 9, marginBottom: 14 }}>
              {[
                { color: "#00e5c4", icon: "🏊", title: "Builder Warranty", sub: "≤60 days · Blue Haven" },
                { color: "#ff8c42", icon: "⚡", title: "Manufacturer", sub: ">60 days · Sasser Electric" },
              ].map((x) => (
                <div
                  key={x.title}
                  style={{
                    background: "#0a1520",
                    border: "1px solid " + x.color + "22",
                    borderLeft: "3px solid " + x.color,
                    borderRadius: 10,
                    padding: "9px 13px",
                    display: "flex",
                    alignItems: "center",
                    gap: 9,
                  }}
                >
                  <span style={{ fontSize: 18 }}>{x.icon}</span>
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 600, color: "#c8dce8" }}>{x.title}</div>
                    <div
                      style={{ fontSize: 10, color: "#1e3040", fontFamily: "'DM Mono',monospace" }}
                    >
                      {x.sub}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* dispatch target */}
            <div
              style={{
                background: "#0a1520",
                border: "1px solid #00e5c418",
                borderRadius: 10,
                padding: "10px 14px",
                marginBottom: 16,
              }}
            >
              <div
                style={{
                  fontSize: 10,
                  color: "#1e3040",
                  fontFamily: "'DM Mono',monospace",
                  textTransform: "uppercase",
                  letterSpacing: ".1em",
                  marginBottom: 6,
                }}
              >
                Auto-Dispatch To
              </div>
              <div
                style={{ fontSize: 12, color: "#00e5c4", fontFamily: "'DM Mono',monospace", marginBottom: 3 }}
              >
                ✉️ {DISPATCH_EMAIL}
              </div>
              <div style={{ fontSize: 12, color: "#00e5c4", fontFamily: "'DM Mono',monospace" }}>
                📅 Google Calendar · 9–11 AM next business day
              </div>
            </div>

            {/* tabs */}
            <div style={{ display: "flex", borderBottom: "1px solid #0f1d29", marginBottom: 14 }}>
              {(
                [
                  ["tickets", `Tickets${tickets.length ? ` (${tickets.length})` : ""}`],
                  ["customers", "Demo Customers"],
                ] as [string, string][]
              ).map(([id, label]) => (
                <button
                  key={id}
                  onClick={() => setTab(id as "customers" | "tickets")}
                  style={{
                    background: "none",
                    border: "none",
                    borderBottom: "2px solid " + (tab === id ? "#00e5c4" : "transparent"),
                    marginBottom: -1,
                    cursor: "pointer",
                    fontFamily: "'DM Mono',monospace",
                    fontSize: 10,
                    letterSpacing: ".12em",
                    textTransform: "uppercase",
                    padding: "7px 14px",
                    color: tab === id ? "#00e5c4" : "#1e3040",
                    transition: "all .15s",
                  }}
                >
                  {label}
                </button>
              ))}
            </div>

            {/* tickets tab */}
            {tab === "tickets" && (
              <div>
                {!tickets.length ? (
                  <div
                    style={{
                      background: "#0a1520",
                      border: "1px dashed #142030",
                      borderRadius: 14,
                      padding: "44px 20px",
                      textAlign: "center",
                    }}
                  >
                    <div style={{ fontSize: 30, opacity: 0.2, marginBottom: 10 }}>🎫</div>
                    <div
                      style={{
                        fontFamily: "'DM Mono',monospace",
                        fontSize: 11,
                        color: "#1e3040",
                        lineHeight: 2,
                      }}
                    >
                      No tickets yet.
                      <br />
                      Complete a warranty conversation to auto-dispatch email + calendar.
                    </div>
                  </div>
                ) : (
                  tickets.map((t) => <TicketCard key={t.id} t={t} />)
                )}
              </div>
            )}

            {/* customers tab */}
            {tab === "customers" && (
              <div>
                <p
                  style={{
                    fontSize: 11,
                    color: "#1e3040",
                    fontFamily: "'DM Mono',monospace",
                    marginBottom: 12,
                    lineHeight: 1.8,
                  }}
                >
                  Click a customer to pre-fill their address in the chat.
                </p>

                {POOL_DB.map((p) => {
                  const builder = p.daysAgo <= 60;
                  const color = builder ? "#00e5c4" : "#ff8c42";
                  return (
                    <button
                      key={p.address}
                      onClick={() => {
                        setInput("My address is " + p.address);
                        inRef.current?.focus();
                      }}
                      style={{
                        display: "block",
                        width: "100%",
                        background: "#0d1520",
                        border: "1px solid " + color + "20",
                        borderLeft: "3px solid " + color,
                        borderRadius: 8,
                        padding: "10px 12px",
                        cursor: "pointer",
                        textAlign: "left",
                        marginBottom: 7,
                        transition: "background .1s",
                      }}
                      onMouseEnter={(e) =>
                        ((e.currentTarget as HTMLButtonElement).style.background = "#111d2a")
                      }
                      onMouseLeave={(e) =>
                        ((e.currentTarget as HTMLButtonElement).style.background = "#0d1520")
                      }
                    >
                      <div
                        style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}
                      >
                        <span style={{ fontSize: 13, fontWeight: 600, color: "#c8dce8" }}>
                          {p.customer}
                        </span>
                        <span
                          style={{
                            fontSize: 10,
                            fontFamily: "monospace",
                            color,
                            background: color + "18",
                            padding: "2px 8px",
                            borderRadius: 20,
                          }}
                        >
                          {p.daysAgo}d · {builder ? "Builder" : "Manufacturer"}
                        </span>
                      </div>
                      <div
                        style={{
                          fontSize: 11,
                          color: "#2d4a60",
                          fontFamily: "monospace",
                          marginTop: 3,
                        }}
                      >
                        {p.address} · {p.phone}
                      </div>
                      <div
                        style={{
                          fontSize: 10,
                          color: "#1e3040",
                          fontFamily: "monospace",
                          marginTop: 2,
                        }}
                      >
                        {Object.values(p.equipment).slice(0, 2).join(" · ")}
                      </div>
                    </button>
                  );
                })}

                {/* routing contacts */}
                <div
                  style={{
                    marginTop: 16,
                    background: "#0a1520",
                    border: "1px solid #0f1d29",
                    borderRadius: 12,
                    padding: "14px 16px",
                  }}
                >
                  <div
                    style={{
                      fontSize: 10,
                      fontFamily: "'DM Mono',monospace",
                      color: "#1e3040",
                      textTransform: "uppercase",
                      letterSpacing: ".1em",
                      marginBottom: 10,
                    }}
                  >
                    Routing Contacts
                  </div>
                  <div style={{ fontSize: 12, fontWeight: 600, color: "#ff8c42", marginBottom: 2 }}>
                    {SASSER.name}
                  </div>
                  <div
                    style={{ fontSize: 11, color: "#2d4a60", fontFamily: "monospace", marginBottom: 12 }}
                  >
                    {SASSER.phone} · {SASSER.email}
                  </div>
                  {Object.entries(MANUFACTURERS).map(([brand, phone]) => (
                    <div
                      key={brand}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        paddingBottom: 5,
                        marginBottom: 5,
                        borderBottom: "1px solid #0f1d29",
                      }}
                    >
                      <span style={{ fontSize: 12, fontWeight: 600, color: "#5a8aaa" }}>{brand}</span>
                      <span style={{ fontSize: 11, color: "#1e3040", fontFamily: "monospace" }}>
                        {phone}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
