"use client";

import { useState, useRef, useEffect, KeyboardEvent } from "react";
import { PM_JOBS, PM_PHASES, PMJob, FlagType } from "@/lib/pm-data";

// ── Types ──────────────────────────────────────────────────────────────────────

interface ChatMessage {
  id: number | string;
  role: "user" | "assistant";
  text: string;
  saved?: boolean; // true if this message triggered a memory save
}

interface ApiMessage {
  role: "user" | "assistant";
  content: string;
}

interface PMNote {
  id: string;
  jobId: string;
  fact: string;
  category: string;
  createdAt: string;
}

// ── Memory parser (mirrors parseTicket pattern) ────────────────────────────────

function parseMemory(text: string): { clean: string; note: Omit<PMNote, "id" | "createdAt"> | null } {
  if (!text.includes("---MEMORY---")) return { clean: text, note: null };
  const [clean, rest] = text.split("---MEMORY---");
  try {
    const start = rest.indexOf("{");
    const end = rest.lastIndexOf("}");
    if (start === -1 || end === -1) return { clean: clean.trim(), note: null };
    const data = JSON.parse(rest.slice(start, end + 1));
    if (!data.fact) return { clean: clean.trim(), note: null };
    return {
      clean: clean.trim(),
      note: { jobId: data.jobId || "general", fact: data.fact, category: data.category || "note" },
    };
  } catch {
    return { clean: clean.trim(), note: null };
  }
}

// ── Constants ──────────────────────────────────────────────────────────────────

const FLAG_META: Record<FlagType, { label: string; color: string; bg: string }> = {
  BLOCKER:           { label: "BLOCKER",   color: "#c0392b", bg: "#fdf0f0" },
  RISK:              { label: "RISK",      color: "#d35400", bg: "#fef5e7" },
  ORDER_NOW:         { label: "ORDER NOW", color: "#8e44ad", bg: "#f5eef8" },
  CUSTOMER_DECISION: { label: "DECISION",  color: "#2471a3", bg: "#eaf4fb" },
};

const PHASE_COLORS = [
  "#5d6d7e", // 1
  "#5d6d7e", // 2
  "#2471a3", // 3
  "#2471a3", // 4
  "#1a8c5a", // 5
  "#1a8c5a", // 6
  "#1a8c5a", // 7
  "#e67e22", // 8
  "#e67e22", // 9
  "#e67e22", // 10
  "#e67e22", // 11
  "#c0392b", // 12
  "#009985", // 13
  "#009985", // 14
];

const INIT_PM_MSG: ChatMessage = {
  id: "pm0",
  role: "assistant",
  text: "Ready. Ask me about any job, today's priorities, blockers, or what needs to be ordered. Example: \"What's the priority today?\" or \"What's next on Boak?\"",
};

// ── Flag pill ──────────────────────────────────────────────────────────────────

function FlagPill({ type, count }: { type: FlagType; count: number }) {
  const meta = FLAG_META[type];
  return (
    <span style={{
      fontSize: 9,
      fontFamily: "'DM Mono',monospace",
      fontWeight: 700,
      letterSpacing: ".06em",
      color: meta.color,
      background: meta.bg,
      border: `1px solid ${meta.color}40`,
      borderRadius: 20,
      padding: "2px 7px",
      whiteSpace: "nowrap",
    }}>
      {count} {meta.label}
    </span>
  );
}

// ── Job Card ───────────────────────────────────────────────────────────────────

function JobCard({
  job,
  phaseIdx,
  onPhaseChange,
  onClick,
  expanded,
}: {
  job: PMJob;
  phaseIdx: number;
  onPhaseChange: (jobId: string, idx: number) => void;
  onClick: () => void;
  expanded: boolean;
}) {
  const phaseColor = PHASE_COLORS[phaseIdx] ?? "#5d6d7e";

  // Count flags by type
  const flagCounts = job.flags.reduce<Partial<Record<FlagType, number>>>((acc, f) => {
    acc[f.type] = (acc[f.type] ?? 0) + 1;
    return acc;
  }, {});

  const hasBlocker = (flagCounts.BLOCKER ?? 0) > 0;

  const contractDate = new Date(job.contractDate + "T12:00:00").toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
  });

  const contractAmt = `$${(job.contractAmt / 1000).toFixed(0)}K`;

  return (
    <div
      style={{
        background: "#fff",
        borderRadius: 12,
        border: `2px solid ${hasBlocker ? "#c0392b40" : "#c4dcf020"}`,
        boxShadow: hasBlocker ? "0 0 0 1px #c0392b20" : "0 1px 4px rgba(0,0,0,.06)",
        overflow: "hidden",
        transition: "box-shadow .15s",
        cursor: "pointer",
      }}
      onClick={onClick}
    >
      {/* card header */}
      <div style={{ background: phaseColor + "12", borderBottom: `2px solid ${phaseColor}25`, padding: "10px 14px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8 }}>
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#0d2137", lineHeight: 1.2 }}>
              {job.name.split(" ")[1].toUpperCase()}
              {hasBlocker && <span style={{ marginLeft: 6, fontSize: 11 }}>🔴</span>}
            </div>
            <div style={{ fontSize: 10, color: "#5a7e96", fontFamily: "monospace", marginTop: 2 }}>
              {job.address.split(",")[0]}
            </div>
          </div>
          <div style={{ textAlign: "right", flexShrink: 0 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: phaseColor, fontFamily: "'DM Mono',monospace" }}>
              {contractAmt}
            </div>
            <div style={{ fontSize: 9, color: "#a8c8e0", fontFamily: "monospace" }}>{contractDate}</div>
          </div>
        </div>
      </div>

      {/* phase selector */}
      <div style={{ padding: "8px 14px", borderBottom: "1px solid #f0f6fc" }} onClick={(e) => e.stopPropagation()}>
        <div style={{ fontSize: 8, color: "#a8c8e0", fontFamily: "'DM Mono',monospace", textTransform: "uppercase", letterSpacing: ".1em", marginBottom: 4 }}>
          Current Phase
        </div>
        <select
          value={phaseIdx}
          onChange={(e) => onPhaseChange(job.id, Number(e.target.value))}
          style={{
            width: "100%",
            fontSize: 11,
            fontFamily: "'DM Mono',monospace",
            color: phaseColor,
            fontWeight: 700,
            background: phaseColor + "10",
            border: `1px solid ${phaseColor}40`,
            borderRadius: 6,
            padding: "5px 8px",
            cursor: "pointer",
            appearance: "none",
            WebkitAppearance: "none",
          }}
        >
          {PM_PHASES.map((p, i) => (
            <option key={i} value={i}>{p}</option>
          ))}
        </select>
      </div>

      {/* flag pills */}
      <div style={{ padding: "8px 14px", display: "flex", flexWrap: "wrap", gap: 4 }}>
        {(["BLOCKER", "RISK", "ORDER_NOW", "CUSTOMER_DECISION"] as FlagType[]).map((type) =>
          (flagCounts[type] ?? 0) > 0 ? (
            <FlagPill key={type} type={type} count={flagCounts[type]!} />
          ) : null
        )}
        {job.tightAccess && (
          <span style={{ fontSize: 9, fontFamily: "'DM Mono',monospace", color: "#5a7e96", background: "#f0f6fc", border: "1px solid #c4dcf0", borderRadius: 20, padding: "2px 7px" }}>
            TIGHT ACCESS
          </span>
        )}
      </div>

      {/* expanded: flag details + notes */}
      {expanded && (
        <div style={{ padding: "8px 14px 12px", borderTop: "1px solid #f0f6fc", background: "#fafcff" }}>
          {job.flags.map((flag, i) => {
            const meta = FLAG_META[flag.type];
            return (
              <div key={i} style={{ display: "flex", gap: 8, marginBottom: 6, alignItems: "flex-start" }}>
                <span style={{ fontSize: 9, fontFamily: "'DM Mono',monospace", fontWeight: 700, color: meta.color, background: meta.bg, border: `1px solid ${meta.color}40`, borderRadius: 4, padding: "1px 5px", flexShrink: 0, marginTop: 1 }}>
                  {meta.label}
                </span>
                <span style={{ fontSize: 11, color: "#1a4868", lineHeight: 1.45 }}>{flag.text}</span>
              </div>
            );
          })}
          {job.notes && (
            <div style={{ marginTop: 8, fontSize: 11, color: "#306080", lineHeight: 1.6, fontStyle: "italic", borderTop: "1px solid #e8f0f8", paddingTop: 8 }}>
              {job.notes}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ── PM Chat bubble ─────────────────────────────────────────────────────────────

function PMBubble({ msg }: { msg: ChatMessage }) {
  const isUser = msg.role === "user";
  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      alignItems: isUser ? "flex-end" : "flex-start",
      marginBottom: 10,
      paddingLeft: isUser ? 60 : 0,
      paddingRight: isUser ? 0 : 60,
    }}>
      <div style={{
        background: isUser ? "#0d2137" : "#f0f6fc",
        color: isUser ? "#e8f4fb" : "#0d2137",
        borderRadius: isUser ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
        padding: "10px 14px",
        fontSize: 13,
        lineHeight: 1.6,
        fontFamily: "-apple-system, BlinkMacSystemFont, sans-serif",
        whiteSpace: "pre-wrap",
        wordBreak: "break-word",
        maxWidth: "100%",
      }}>
        {msg.text}
      </div>
      {msg.saved && (
        <div style={{ fontSize: 9, color: "#009985", fontFamily: "'DM Mono', monospace", marginTop: 3, letterSpacing: ".06em" }}>
          💾 saved to field log
        </div>
      )}
    </div>
  );
}

// ── Main construction page ─────────────────────────────────────────────────────

export default function ConstructionPage() {
  const [tab, setTab] = useState<"board" | "chat">("board");
  const [phases, setPhases] = useState<Record<string, number>>({});
  const [expandedJob, setExpandedJob] = useState<string | null>(null);

  // PM Chat state
  const [msgs, setMsgs] = useState<ChatMessage[]>([INIT_PM_MSG]);
  const [hist, setHist] = useState<ApiMessage[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [notes, setNotes] = useState<PMNote[]>([]);
  const [savedToast, setSavedToast] = useState<string | null>(null); // shows briefly after save
  const endRef = useRef<HTMLDivElement>(null);
  const inRef = useRef<HTMLInputElement>(null);

  // Load phases and notes from API on mount
  useEffect(() => {
    fetch("/api/jobs")
      .then((r) => r.json())
      .then((data: Record<string, number>) => {
        if (data && typeof data === "object" && !data.error) setPhases(data);
      })
      .catch((e) => console.error("Failed to load phases:", e));

    fetch("/api/pm-notes")
      .then((r) => r.json())
      .then((data: PMNote[]) => {
        if (Array.isArray(data)) setNotes(data);
      })
      .catch((e) => console.error("Failed to load notes:", e));
  }, []);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [msgs, busy]);

  const updatePhase = async (jobId: string, phaseIdx: number) => {
    setPhases((prev) => ({ ...prev, [jobId]: phaseIdx }));
    try {
      await fetch("/api/jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobId, phaseIdx }),
      });
    } catch (e) {
      console.error("Failed to save phase:", e);
    }
  };

  const send = async (text: string) => {
    if (!text.trim() || busy) return;
    const userMsg: ChatMessage = { id: Date.now(), role: "user", text: text.trim() };
    setMsgs((p) => [...p, userMsg]);
    setInput("");
    setBusy(true);
    const newHist: ApiMessage[] = [...hist, { role: "user", content: text.trim() }];

    try {
      const res = await fetch("/api/pm-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newHist.slice(-12) }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "API error");
      const rawText: string = data.text || "No response.";

      // Parse and strip memory delimiter
      const { clean, note } = parseMemory(rawText);
      let saved = false;

      if (note) {
        try {
          const saveRes = await fetch("/api/pm-notes", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(note),
          });
          const saved_note: { ok: boolean; note: PMNote } = await saveRes.json();
          if (saved_note.ok) {
            setNotes((prev) => [saved_note.note, ...prev]);
            setSavedToast(note.fact);
            setTimeout(() => setSavedToast(null), 4000);
            saved = true;
          }
        } catch (e) {
          console.error("Failed to save memory note:", e);
        }
      }

      setMsgs((p) => [...p, { id: Date.now() + 1, role: "assistant", text: clean, saved }]);
      setHist([...newHist, { role: "assistant", content: clean }]);
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Unknown error";
      setMsgs((p) => [...p, { id: Date.now() + 1, role: "assistant", text: "⚠ " + msg }]);
    } finally {
      setBusy(false);
      setTimeout(() => inRef.current?.focus(), 80);
    }
  };

  // Summary counts across all jobs
  const blockerJobs = PM_JOBS.filter((j) => j.flags.some((f) => f.type === "BLOCKER")).length;
  const orderNowTotal = PM_JOBS.reduce((s, j) => s + j.flags.filter((f) => f.type === "ORDER_NOW").length, 0);
  const decisionTotal = PM_JOBS.reduce((s, j) => s + j.flags.filter((f) => f.type === "CUSTOMER_DECISION").length, 0);

  return (
    <div style={{ minHeight: "100vh", background: "#eef6fc", fontFamily: "'Barlow', sans-serif", display: "flex", flexDirection: "column" }}>

      {/* ── top bar ── */}
      <div style={{ background: "#0d2137", borderBottom: "1px solid #1a3a55", padding: "14px 24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 34, height: 34, borderRadius: 9, background: "linear-gradient(135deg,#e07030,#c0392b)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: 13, color: "#fff", fontFamily: "'Barlow Condensed', sans-serif" }}>
            PM
          </div>
          <div>
            <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 800, fontSize: 17, color: "#e07030", letterSpacing: ".07em" }}>
              BLUE HAVEN · CONSTRUCTION PM
            </div>
            <div style={{ fontSize: 10, color: "#5a7e96", fontFamily: "'DM Mono', monospace", letterSpacing: ".1em" }}>
              9 ACTIVE BUILDS · MARGARITAVILLE PCB
            </div>
          </div>
        </div>
        <a
          href="/"
          style={{ fontSize: 10, fontFamily: "'DM Mono', monospace", color: "#5a7e96", textDecoration: "none", letterSpacing: ".1em", border: "1px solid #1a3a55", borderRadius: 6, padding: "5px 12px", transition: "color .1s" }}
        >
          ← WARRANTY
        </a>
      </div>

      {/* ── summary bar ── */}
      <div style={{ background: "#0d2137", borderBottom: "1px solid #1a3a55", padding: "8px 24px", display: "flex", gap: 20 }}>
        {[
          { label: "ACTIVE JOBS",   val: PM_JOBS.length,  color: "#009985" },
          { label: "BLOCKERS",      val: blockerJobs,     color: "#c0392b" },
          { label: "ORDER NOW",     val: orderNowTotal,   color: "#8e44ad" },
          { label: "DECISIONS",     val: decisionTotal,   color: "#2471a3" },
        ].map((s) => (
          <div key={s.label} style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
            <span style={{ fontSize: 18, fontWeight: 800, color: s.color, fontFamily: "'DM Mono', monospace" }}>{s.val}</span>
            <span style={{ fontSize: 9, color: "#5a7e96", fontFamily: "'DM Mono', monospace", letterSpacing: ".1em" }}>{s.label}</span>
          </div>
        ))}
      </div>

      {/* ── sub-tab bar ── */}
      <div style={{ background: "#fff", borderBottom: "1px solid #c4dcf0", padding: "0 24px", display: "flex" }}>
        {([["board", "JOB BOARD"], ["chat", "PM CHAT"]] as [string, string][]).map(([id, label]) => (
          <button
            key={id}
            onClick={() => { setTab(id as "board" | "chat"); if (id === "chat") setTimeout(() => inRef.current?.focus(), 80); }}
            style={{
              background: "none",
              border: "none",
              borderBottom: `3px solid ${tab === id ? "#e07030" : "transparent"}`,
              padding: "12px 20px",
              marginBottom: -1,
              cursor: "pointer",
              fontFamily: "'DM Mono', monospace",
              fontSize: 11,
              fontWeight: tab === id ? 700 : 400,
              letterSpacing: ".12em",
              color: tab === id ? "#e07030" : "#5a7e96",
              transition: "all .15s",
            }}
          >
            {label}
          </button>
        ))}
      </div>

      {/* ── content ── */}
      <div style={{ flex: 1, padding: "20px 24px", maxWidth: 1180, margin: "0 auto", width: "100%" }}>

        {/* JOB BOARD */}
        {tab === "board" && (
          <div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 14 }}>
              {PM_JOBS.map((job) => (
                <JobCard
                  key={job.id}
                  job={job}
                  phaseIdx={phases[job.id] ?? 0}
                  onPhaseChange={updatePhase}
                  onClick={() => setExpandedJob(expandedJob === job.id ? null : job.id)}
                  expanded={expandedJob === job.id}
                />
              ))}
            </div>

            {/* phase legend */}
            <div style={{ marginTop: 20, background: "#fff", borderRadius: 12, padding: "14px 18px" }}>
              <div style={{ fontSize: 9, fontFamily: "'DM Mono', monospace", color: "#a8c8e0", textTransform: "uppercase", letterSpacing: ".1em", marginBottom: 10 }}>Phase Legend</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {PM_PHASES.map((p, i) => (
                  <span key={i} style={{ fontSize: 10, fontFamily: "'DM Mono', monospace", color: PHASE_COLORS[i], background: PHASE_COLORS[i] + "15", border: `1px solid ${PHASE_COLORS[i]}30`, borderRadius: 20, padding: "3px 10px" }}>
                    {p}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* PM CHAT */}
        {tab === "chat" && (
          <div style={{ display: "flex", gap: 20, alignItems: "flex-start", maxWidth: 900, margin: "0 auto" }}>
            {/* chat window */}
            <div style={{ flex: 1, background: "#fff", borderRadius: 14, border: "1px solid #c4dcf0", overflow: "hidden", display: "flex", flexDirection: "column", height: 600 }}>
              {/* chat header */}
              <div style={{ padding: "12px 18px", borderBottom: "1px solid #f0f6fc", background: "#fafcff", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "#0d2137" }}>PM Assistant</div>
                  <div style={{ fontSize: 10, color: "#5a7e96", fontFamily: "'DM Mono', monospace" }}>Knows all 9 jobs · current phases · every flag</div>
                </div>
                <button onClick={() => { setMsgs([INIT_PM_MSG]); setHist([]); }} style={{ background: "none", border: "1px solid #c4dcf0", borderRadius: 6, padding: "4px 10px", fontFamily: "'DM Mono', monospace", fontSize: 9, color: "#5a7e96", cursor: "pointer", letterSpacing: ".1em" }}>
                  ↺ RESET
                </button>
              </div>

              {/* messages */}
              <div style={{ flex: 1, overflowY: "auto", padding: "14px 16px" }}>
                {msgs.map((m) => <PMBubble key={m.id} msg={m} />)}
                {busy && (
                  <div style={{ display: "flex", gap: 4, paddingLeft: 4, marginBottom: 10 }}>
                    {[0, 0.2, 0.4].map((delay, i) => (
                      <div key={i} style={{ width: 7, height: 7, borderRadius: "50%", background: "#a8c8e0", animation: `blink 1.2s ${delay}s ease infinite` }} />
                    ))}
                  </div>
                )}
                <div ref={endRef} />
              </div>

              {/* input */}
              <div style={{ padding: "10px 14px", borderTop: "1px solid #f0f6fc", display: "flex", gap: 8 }}>
                <input
                  ref={inRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e: KeyboardEvent<HTMLInputElement>) => { if (e.key === "Enter" && !busy) send(input); }}
                  placeholder="Ask about any job or today's priorities..."
                  style={{ flex: 1, background: "#f0f6fc", border: "1px solid #c4dcf0", borderRadius: 20, padding: "9px 16px", fontSize: 13, color: "#0d2137", fontFamily: "-apple-system, sans-serif", outline: "none" }}
                />
                <button
                  onClick={() => send(input)}
                  disabled={!input.trim() || busy}
                  style={{ width: 36, height: 36, borderRadius: "50%", background: input.trim() && !busy ? "#e07030" : "#c4dcf0", border: "none", cursor: input.trim() && !busy ? "pointer" : "default", color: "#fff", fontSize: 16, display: "flex", alignItems: "center", justifyContent: "center", transition: "background .15s" }}
                >
                  ↑
                </button>
              </div>
            </div>

            {/* quick prompts + field log sidebar */}
            <div style={{ width: 220, flexShrink: 0, display: "flex", flexDirection: "column", gap: 16 }}>

              {/* quick asks */}
              <div>
                <div style={{ fontSize: 9, fontFamily: "'DM Mono', monospace", color: "#a8c8e0", textTransform: "uppercase", letterSpacing: ".1em", marginBottom: 8 }}>Quick asks</div>
                {[
                  "What's the priority today?",
                  "Which jobs have blockers?",
                  "What needs to be ordered now?",
                  "Any pending customer decisions?",
                  "What's next on Davis?",
                  "What's next on Boak?",
                  "Which jobs are furthest along?",
                  "What are the tight-access jobs?",
                ].map((q) => (
                  <button
                    key={q}
                    onClick={() => { setTab("chat"); send(q); }}
                    style={{ display: "block", width: "100%", textAlign: "left", background: "#fff", border: "1px solid #c4dcf0", borderRadius: 8, padding: "8px 10px", marginBottom: 6, fontSize: 11, color: "#1a4868", fontFamily: "-apple-system, sans-serif", cursor: "pointer", lineHeight: 1.4, transition: "background .1s" }}
                    onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.background = "#f0f6fc")}
                    onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.background = "#fff")}
                  >
                    {q}
                  </button>
                ))}
              </div>

              {/* saved toast */}
              {savedToast && (
                <div style={{ background: "#e8fdf5", border: "1px solid #00998540", borderRadius: 8, padding: "8px 10px", animation: "pop .2s ease" }}>
                  <div style={{ fontSize: 9, fontFamily: "'DM Mono', monospace", color: "#009985", letterSpacing: ".1em", marginBottom: 3 }}>💾 SAVED TO FIELD LOG</div>
                  <div style={{ fontSize: 11, color: "#006650", lineHeight: 1.4 }}>{savedToast}</div>
                </div>
              )}

              {/* field log */}
              <div>
                <div style={{ fontSize: 9, fontFamily: "'DM Mono', monospace", color: "#a8c8e0", textTransform: "uppercase", letterSpacing: ".1em", marginBottom: 8 }}>
                  Field Log {notes.length > 0 && <span style={{ color: "#009985" }}>({notes.length})</span>}
                </div>
                {notes.length === 0 ? (
                  <div style={{ fontSize: 10, color: "#c4dcf0", fontFamily: "'DM Mono', monospace", lineHeight: 1.6 }}>
                    No updates yet. Tell me a fact — &quot;Boak sqft confirmed at 750&quot; — and it will persist here.
                  </div>
                ) : (
                  notes.slice(0, 8).map((n) => {
                    const ts = new Date(n.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" });
                    const jobLabel = n.jobId === "general" ? "General" : PM_JOBS.find((j) => j.id === n.jobId)?.name.split(" ")[1] ?? n.jobId;
                    return (
                      <div key={n.id} style={{ background: "#fff", border: "1px solid #e8f4fb", borderLeft: "3px solid #009985", borderRadius: 6, padding: "6px 9px", marginBottom: 6 }}>
                        <div style={{ fontSize: 9, fontFamily: "'DM Mono', monospace", color: "#a8c8e0", marginBottom: 2 }}>
                          {ts} · {jobLabel}
                        </div>
                        <div style={{ fontSize: 11, color: "#1a4868", lineHeight: 1.4 }}>{n.fact}</div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes blink { 0%,100%{opacity:.3} 50%{opacity:1} }
      `}</style>
    </div>
  );
}
