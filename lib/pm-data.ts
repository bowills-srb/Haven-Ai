// Client-safe: no Node.js imports. Shared between client and server.

// ── Phase sequence ─────────────────────────────────────────────────────────────

export const PM_PHASES = [
  "1 — Contract & Permitting",
  "2 — Pre-Construction",
  "3 — Layout & Excavation",
  "4 — Steel / Rebar",
  "5 — Plumbing",
  "6 — Electrical Rough",
  "7 — Gunite",
  "8 — Tile & Coping",
  "9 — Decking",
  "10 — Equipment Set",
  "11 — Electrical Finish",
  "12 — Plaster & Fill",
  "13 — Final Walkthrough & Turnover",
  "14 — Punch List & Warranty",
] as const;

export type PhaseName = (typeof PM_PHASES)[number];

// ── Flag types ─────────────────────────────────────────────────────────────────

export type FlagType = "BLOCKER" | "RISK" | "ORDER_NOW" | "CUSTOMER_DECISION";

export interface PMFlag {
  type: FlagType;
  text: string;
}

// ── Job profiles ───────────────────────────────────────────────────────────────

export interface PMJob {
  id: string;
  name: string;
  address: string;
  contractDate: string;  // YYYY-MM-DD
  contractAmt: number;
  tightAccess: boolean;
  flags: PMFlag[];
  notes: string;
}

export const PM_JOBS: PMJob[] = [
  {
    id: "crandall",
    name: "Tim Crandall",
    address: "8583 Land Shark, PCB FL 32413",
    contractDate: "2025-11-10",
    contractAmt: 141402,
    tightAccess: true,
    flags: [
      { type: "RISK",              text: "Tight access — coordinate excavation and concrete equipment carefully" },
      { type: "RISK",              text: "#5 rebar on-site? Heavier spec for 2-story enclosure — verify before steel crew" },
      { type: "ORDER_NOW",         text: "Pebble Sheen interior finish — specialty item, confirm order & lead time" },
      { type: "ORDER_NOW",         text: "Art-1001 marine SS handrail — custom/specialty, long lead" },
      { type: "ORDER_NOW",         text: "Step lights (6) + wall lights (8) for firepit area — confirm with supplier" },
      { type: "CUSTOMER_DECISION", text: "Lighting addendum (3/30/26) — confirm incorporated into electrical rough scope before gunite" },
    ],
    notes: "Most complex job in portfolio. Sunken firepit is effectively a second scope track. Lighting addendum must be in electrical rough before gunite.",
  },
  {
    id: "coppage",
    name: "Yvonne Coppage",
    address: "8463 Hang Loose Ct, PCB FL 32413",
    contractDate: "2025-12-08",
    contractAmt: 100851,
    tightAccess: true,
    flags: [
      { type: "ORDER_NOW", text: "Catalina Grana decking — specialty/imported, longest lead time in portfolio" },
      { type: "RISK",      text: "Tight access — plan equipment and concrete truck staging" },
      { type: "RISK",      text: "36\" sheer descent line must be in plumbing rough scope — verify" },
      { type: "RISK",      text: "Sport turf (140 sqft) — coordinate install sequence with deck sub" },
    ],
    notes: "Latest contract (12/8/25). Catalina Grana is the highest-risk material lead time in the portfolio.",
  },
  {
    id: "davis",
    name: "Laura Davis",
    address: "9494 Puffer Fish, PCB FL 32413",
    contractDate: "2025-10-06",
    contractAmt: 64345,
    tightAccess: false,
    flags: [
      { type: "BLOCKER", text: "Confirm whether plaster has already occurred — if yes, start warranty clock now" },
      { type: "RISK",    text: "Mini fish mosaic placement — confirm location approved and marked for tile crew" },
    ],
    notes: "Likely furthest along. Pre-plaster docs in file. Simplest pool — no spa, no water features. Good candidate to close out first.",
  },
  {
    id: "langan",
    name: "Jill Langan",
    address: "9539 Escape Ave, PCB FL 32413",
    contractDate: "2025-11-25",
    contractAmt: 91436,
    tightAccess: false,
    flags: [
      { type: "BLOCKER",           text: "Deck sqft changed by CO — field must use UPDATED 912 sqft, not original contract figure" },
      { type: "RISK",              text: "24\" sheer descent dedicated plumbing line — verify in rough scope" },
      { type: "RISK",              text: "Sport turf (15'x6') — coordinate with deck sub" },
      { type: "CUSTOMER_DECISION", text: "Mosaic placement (2 mosaics) — confirm locations before tile crew" },
    ],
    notes: "Change order reduced deck sqft and credited $3,944. Updated scope sheet must be in field package.",
  },
  {
    id: "loncarich",
    name: "Tom Loncarich",
    address: "8741 Lime Dr, PCB FL 32413",
    contractDate: "2025-11-25",
    contractAmt: 109097,
    tightAccess: true,
    flags: [
      { type: "ORDER_NOW", text: "25K salt chlorinator — ONLY salt pool in portfolio, easy to overlook on standard order" },
      { type: "ORDER_NOW", text: "Marble cope — confirm order and lead time" },
      { type: "RISK",      text: "Salt cell loop must be in plumbing rough scope — verify with plumber" },
      { type: "RISK",      text: "Tight access — plan for excavation and concrete" },
      { type: "RISK",      text: "Raised spa (18\") + raised wall with columns — forming crew needed before gunite" },
      { type: "RISK",      text: "Largest pool by volume (9,214 gal) — higher chemical quantities at startup" },
    ],
    notes: "Only salt pool in portfolio. 24\" sheer descent line in rough scope. Mosaic on raised wall — confirm placement before tile.",
  },
  {
    id: "ross",
    name: "Sue & Vincent Ross",
    address: "8923 Coral Reef Way, PCB FL 32413",
    contractDate: "2025-12-15",
    contractAmt: 108527,
    tightAccess: true,
    flags: [
      { type: "CUSTOMER_DECISION", text: "Enclosure step-out locations (2x 3'x6') not confirmed — gates deck layout approval and pour" },
      { type: "RISK",              text: "Tight access — coordinate equipment carefully" },
      { type: "RISK",              text: "36\" spillway dedicated plumbing line in rough scope — verify" },
    ],
    notes: "Latest contract date (12/15/25). Do NOT finalize deck layout until step-out locations approved in writing.",
  },
  {
    id: "demeester",
    name: "Maurice DeMeester",
    address: "8375 Jollymon Way, PCB FL 32413",
    contractDate: "2025-10-02",
    contractAmt: 88950,
    tightAccess: false,
    flags: [
      { type: "CUSTOMER_DECISION", text: "Umbrella hole location not confirmed — must be decided before deck pour" },
      { type: "RISK",              text: "Herringbone deck pattern — schedule experienced installer, not standard sub" },
      { type: "RISK",              text: "Bubbler plumbing lines in rough scope — verify" },
    ],
    notes: "Earliest contract (10/2/25) — likely well along. Dewatering credit already issued. Get umbrella hole written approval from DeMeester.",
  },
  {
    id: "boak",
    name: "Cliff Boak",
    address: "9418 Paradise Dr, PCB FL 32413",
    contractDate: "2025-11-29",
    contractAmt: 105622,
    tightAccess: true,
    flags: [
      { type: "BLOCKER", text: "Deck sqft MISSING from contract — get field measurement or sales confirmation before ordering materials" },
      { type: "RISK",    text: "Raised spa (18\") — forming crew needed before gunite" },
      { type: "RISK",    text: "Tight access — coordinate equipment staging" },
      { type: "RISK",    text: "24\" sheer descent dedicated plumbing line in rough scope — verify" },
    ],
    notes: "Do not order decking materials or schedule deck crew until sqft is confirmed. Auto-fill plumbing line in rough scope — verify.",
  },
  {
    id: "roth",
    name: "David Roth",
    address: "8869 Cool Water Way, PCB FL 32413",
    contractDate: "2025-10-16",
    contractAmt: 120991,
    tightAccess: true,
    flags: [
      { type: "ORDER_NOW",         text: "Secondary pump (1.0hp) + 225sqft filter for sheer descents — separate from main equipment package" },
      { type: "ORDER_NOW",         text: "Automatic valve for sheer descents — specialty item" },
      { type: "ORDER_NOW",         text: "Marble cope — confirm order and lead time" },
      { type: "RISK",              text: "3 sheer descent lines + secondary pump tie-in in rough scope — verify plumber has full scope" },
      { type: "RISK",              text: "Tight access + largest deck (1,500 sqft) — may require multiple pours or pumping" },
      { type: "RISK",              text: "Part-time resident — build extra lead time for approvals and schedule confirmations" },
      { type: "CUSTOMER_DECISION", text: "Part-time resident — auto-fill must be tested and functioning before turnover" },
    ],
    notes: "Most complex water feature setup — 3 sheer descents on dedicated system. Secondary equipment must be ordered separately.",
  },
];
