export const POOL_DB = [
  {
    address: "8583 Land Shark, PCB, FL 32413",
    customer: "Tim Crandall",
    phone: "630-336-0317",
    daysAgo: 45,
    equipment: {
      pump: "1.85 HP Variable Speed Pump",
      filter: "450 sq ft Cartridge Filter",
      heater: "400,000 BTU Natural Gas Heater",
      control: "Omni PL w/WiFi",
      lights: "1 LED Pool Light",
      spa: "6x7 Flush Spa w/6 Therapy Jets",
    },
  },
  {
    address: "8463 Hang Loose Ct, PCB, FL 32413",
    customer: "Yvonne Coppage",
    phone: "270-668-9356",
    daysAgo: 10,
    equipment: {
      pump: "1.85 HP Variable Speed Pump",
      filter: "450 sq ft Cartridge Filter",
      heater: "400,000 BTU Natural Gas Heater",
      control: "Omni PL w/WiFi",
      lights: "2 LED Pool Lights",
      blower: "1.5 HP Air Blower",
      spa: "7ft Round Spa w/24in Spillway, 6 Therapy Jets",
    },
  },
  {
    address: "9494 Puffer Fish, PCB, FL 32413",
    customer: "Laura Davis",
    phone: "859-684-0828",
    daysAgo: 30,
    equipment: {
      pump: "1.85 HP Variable Speed Pump",
      filter: "450 sq ft Cartridge Filter",
      heater: "400,000 BTU Natural Gas Heater",
      control: "Omni PL w/WiFi",
      lights: "1 LED Pool Light",
    },
  },
  {
    address: "9539 Escape Ave, PCB, FL 32413",
    customer: "Jill Langan",
    phone: "607-205-2836",
    daysAgo: 20,
    equipment: {
      pump: "1.85 HP Variable Speed Pump",
      filter: "450 sq ft Cartridge Filter",
      heater: "400,000 BTU Natural Gas Heater",
      control: "Omni PL w/WiFi",
      lights: "2 LED Pool Lights",
      blower: "1.0 HP Air Blower",
      spa: "6x6 Square Spa w/2x24in Spillways, 6 Therapy Jets",
    },
  },
  {
    address: "8741 Lime Dr, PCB, FL 32413",
    customer: "Tom Loncarich",
    phone: "678-788-3669",
    daysAgo: 35,
    equipment: {
      pump: "1.85 HP Variable Speed Pump",
      filter: "450 sq ft Cartridge Filter",
      heater: "400,000 BTU Natural Gas Heater",
      control: "Omni PL w/WiFi",
      lights: "2 LED Pool Lights",
      blower: "2.0 HP Air Blower",
      salt: "25K Salt Chlorinator",
      spa: "7x7 Square Spa w/2x24in Spillways, 6 Therapy Jets + 2 Foot Jets",
    },
  },
  {
    address: "8923 Coral Reef Way, PCB, FL 32413",
    customer: "Sue and Vincent Ross",
    phone: "314-882-9555",
    daysAgo: 5,
    equipment: {
      pump: "1.85 HP Variable Speed Pump",
      filter: "450 sq ft Cartridge Filter",
      heater: "400,000 BTU Natural Gas Heater",
      control: "Omni PL w/WiFi",
      lights: "2 LED Pool Lights",
      blower: "1.5 HP Air Blower",
      spa: "7x7 Spa w/36in Spillway, 6 Therapy Jets",
    },
  },
  {
    address: "8375 Jollymon Way, PCB, FL 32413",
    customer: "Maurice DeMeester",
    phone: "716-864-5008",
    daysAgo: 75,
    equipment: {
      pump: "1.85 HP Variable Speed Pump",
      filter: "450 sq ft Cartridge Filter",
      heater: "400,000 BTU Natural Gas Heater",
      control: "Omni PL w/WiFi",
      lights: "2 LED Pool Lights",
      blower: "1.0 HP Air Blower",
      spa: "6ft Square Spa w/6 Therapy Jets",
    },
  },
  {
    address: "9418 Paradise Dr, PCB, FL 32413",
    customer: "Cliff Boak",
    phone: "937-231-7451",
    daysAgo: 15,
    equipment: {
      pump: "1.85 HP Variable Speed Pump",
      filter: "450 sq ft Cartridge Filter",
      heater: "400,000 BTU Natural Gas Heater",
      control: "Omni PL w/WiFi",
      lights: "2 LED Pool Lights",
      blower: "1.5 HP Air Blower",
      spa: "7ft Round Spa (raised 18in) w/24in Spillway, 6 Therapy Jets",
    },
  },
  {
    address: "8869 Cool Water Way, PCB, FL 32413",
    customer: "David Roth",
    phone: "586-243-3695",
    daysAgo: 25,
    equipment: {
      pump: "1.85 HP Variable Speed Pump",
      filter: "450 sq ft Cartridge Filter",
      heater: "400,000 BTU Natural Gas Heater",
      control: "Omni PL w/WiFi",
      lights: "2 LED Pool Lights",
      blower: "1.0 HP Air Blower",
      sheerPump: "1.0 HP Pump + 225 sq ft Filter (3 Sheer Descents)",
      spa: "6x8 Rectangle Spa w/6 Therapy Jets",
    },
  },
];

export const MANUFACTURERS: Record<string, string> = {
  Pentair: "1-800-831-7133",
  Hayward: "1-908-355-7995",
  Jandy: "1-800-822-7933",
  "Polaris/Zodiac": "1-800-822-7933",
};

export const SASSER = {
  name: "Sasser Electric & Pool Service",
  phone: "(480) 555-9200",
  email: "service@sasserelectric.com",
};

export const BUILDER_EMAIL = "haventestblue@gmail.com";
export const MANUFACTURER_EMAIL = "haventestblue@gmail.com";
export const BLUEHAVEN_CC = "haventestblue@gmail.com";

// ── Service number: BH + YY + MM + DD + 4-digit seq = 10 digits ──────────────

let seqCounter = 1;

export function generateServiceNumber(): string {
  const now = new Date();
  const yy = String(now.getFullYear()).slice(2);
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  const dd = String(now.getDate()).padStart(2, "0");
  const seq = String(seqCounter++).padStart(4, "0");
  return `BH${yy}${mm}${dd}${seq}`; // e.g. BH2603300001
}

export function formatServiceNumber(id: string): string {
  // BH2603300001 → BH-260330-0001
  if (id.startsWith("BH") && id.length === 12) {
    return `${id.slice(0, 2)}-${id.slice(2, 8)}-${id.slice(8)}`;
  }
  return id;
}

// ── Calendar ──────────────────────────────────────────────────────────────────

export interface CalendarEvent {
  id: string;
  date: string; // YYYY-MM-DD
  customer: string;
  address: string;
  equipment: string;
  issue: string;
  type: "builder" | "manufacturer";
  time: string;
  tech: string;
  status: "completed" | "scheduled" | "pending";
  ticketId?: string;
}

function relDate(n: number): string {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return d.toISOString().split("T")[0];
}

export const SEED_EVENTS: CalendarEvent[] = [
  {
    id: "SEED-001",
    date: relDate(-14),
    customer: "Laura Davis",
    address: "9494 Puffer Fish, PCB, FL 32413",
    equipment: "1.85 HP Variable Speed Pump",
    issue: "Pump lost prime after startup — air leak at basket lid",
    type: "builder",
    time: "9:00 AM – 11:00 AM",
    tech: "Blue Haven Service Team",
    status: "completed",
  },
  {
    id: "SEED-002",
    date: relDate(-10),
    customer: "Maurice DeMeester",
    address: "8375 Jollymon Way, PCB, FL 32413",
    equipment: "400,000 BTU Natural Gas Heater",
    issue: "Heater error code HF — heat exchanger inspection",
    type: "manufacturer",
    time: "10:00 AM – 12:00 PM",
    tech: "Sasser Electric",
    status: "completed",
  },
  {
    id: "SEED-003",
    date: relDate(-7),
    customer: "David Roth",
    address: "8869 Cool Water Way, PCB, FL 32413",
    equipment: "1.0 HP Pump + 225 sq ft Filter (3 Sheer Descents)",
    issue: "Sheer descent pump not priming — check valve stuck",
    type: "builder",
    time: "9:00 AM – 11:00 AM",
    tech: "Blue Haven Service Team",
    status: "completed",
  },
  {
    id: "SEED-004",
    date: relDate(-3),
    customer: "Tim Crandall",
    address: "8583 Land Shark, PCB, FL 32413",
    equipment: "Omni PL w/WiFi",
    issue: "Omni PL not connecting to app — WiFi credentials reset",
    type: "builder",
    time: "9:00 AM – 11:00 AM",
    tech: "Blue Haven Service Team",
    status: "completed",
  },
  {
    id: "SEED-005",
    date: relDate(2),
    customer: "Jill Langan",
    address: "9539 Escape Ave, PCB, FL 32413",
    equipment: "6x6 Square Spa w/2x24in Spillways, 6 Therapy Jets",
    issue: "Spa therapy jets low pressure — air blower inlet blocked",
    type: "builder",
    time: "9:00 AM – 11:00 AM",
    tech: "Blue Haven Service Team",
    status: "scheduled",
  },
  {
    id: "SEED-006",
    date: relDate(4),
    customer: "Tom Loncarich",
    address: "8741 Lime Dr, PCB, FL 32413",
    equipment: "25K Salt Chlorinator",
    issue: "Salt cell reading low — initial calibration and cell inspection",
    type: "builder",
    time: "9:00 AM – 11:00 AM",
    tech: "Blue Haven Service Team",
    status: "scheduled",
  },
  {
    id: "SEED-007",
    date: relDate(7),
    customer: "Cliff Boak",
    address: "9418 Paradise Dr, PCB, FL 32413",
    equipment: "450 sq ft Cartridge Filter",
    issue: "Filter pressure elevated after first startup — cartridge seated check",
    type: "builder",
    time: "9:00 AM – 11:00 AM",
    tech: "Blue Haven Service Team",
    status: "scheduled",
  },
  {
    id: "SEED-008",
    date: relDate(10),
    customer: "Yvonne Coppage",
    address: "8463 Hang Loose Ct, PCB, FL 32413",
    equipment: "1.85 HP Variable Speed Pump",
    issue: "Tanning ledge bubbler output uneven — flow balancing adjustment",
    type: "builder",
    time: "9:00 AM – 11:00 AM",
    tech: "Blue Haven Service Team",
    status: "scheduled",
  },
  {
    id: "SEED-009",
    date: relDate(14),
    customer: "Sue and Vincent Ross",
    address: "8923 Coral Reef Way, PCB, FL 32413",
    equipment: "Omni PL w/WiFi",
    issue: "Auto-fill float valve not shutting off — float adjustment",
    type: "builder",
    time: "9:00 AM – 11:00 AM",
    tech: "Blue Haven Service Team",
    status: "scheduled",
  },
];

// ── Dates & prompts ───────────────────────────────────────────────────────────

/** Returns the next N available business days starting min_days_out from today */
export function getAvailableDates(count = 3, minDaysOut = 2): string[] {
  const dates: string[] = [];
  const d = new Date();
  d.setDate(d.getDate() + minDaysOut);
  while (dates.length < count) {
    const day = d.getDay();
    if (day !== 0 && day !== 6) {
      dates.push(d.toISOString().split("T")[0]);
    }
    d.setDate(d.getDate() + 1);
  }
  return dates;
}

/** @deprecated use getAvailableDates() */
export function getServiceDate(): string {
  return getAvailableDates(1)[0];
}

export function buildSystemPrompt(): string {
  const availDates = getAvailableDates(3);

  const fmtDateShort = (iso: string) =>
    new Date(iso + "T12:00:00").toLocaleDateString("en-US", {
      weekday: "long", month: "long", day: "numeric",
    });

  // Build numbered appointment menu: 3 dates × 2 time slots = 6 options
  const apptMenu = availDates.flatMap((iso, i) => [
    `${i * 2 + 1}. ${fmtDateShort(iso)}, 9:00 AM – 11:00 AM`,
    `${i * 2 + 2}. ${fmtDateShort(iso)}, 1:00 PM – 3:00 PM`,
  ]).join("\n");

  // Routing lookup: address → days since pool start (for silent warranty classification)
  const routingRef = POOL_DB.map((p) => `${p.address}=${p.daysAgo}d`).join("; ");

  // The first available date (used as fallback in ticket if customer doesn't choose)
  const svcDate = availDates[0];

  return `BLUE HAVEN POOLS — WARRANTY SERVICE AI

PURPOSE
You are Haven, a friendly and efficient warranty service assistant for Blue Haven Pools & Spas (Pools on the Gulf, LLC). Your job is simple:
1. Identify the customer (match them to a contract in the database below)
2. Ask once for them to describe the issue
3. Schedule a warranty service appointment

Do NOT diagnose, troubleshoot, or offer technical advice. The customer likely has no pool experience — just acknowledge their concern, confirm their info, and get them on the schedule.

TONE & STYLE
- Warm, professional, unhurried
- Use their first name after identifying them
- Match their language — no jargon
- If they seem frustrated, empathize briefly then move to scheduling
- Never say "I'm just an AI" — just be helpful
- Conversational, not scripted-sounding
- Plain text only, no markdown, no bullet points in replies

================================================================================
CONVERSATION FLOW
================================================================================

STEP 1 — GREETING & IDENTIFICATION
Greet warmly. Ask for their name and address to pull up their account.
Match against the customer database below. If found, confirm their name and address so they know you have their file.
If no match: politely explain you need to verify their contract info and ask for additional details (email or phone). If still no match, offer to transfer to the office at (850) 932-2600.

STEP 2 — DESCRIBE THE ISSUE (ASK ONCE)
Ask: "Can you tell me what's going on with your pool or equipment?"
Let them describe it in their own words. Do NOT ask follow-up diagnostic questions. Do NOT troubleshoot. Simply:
- Acknowledge what they said
- Reassure them a technician will take a look
- Internally note the issue category (see below) — do not share this with the customer

ISSUE CATEGORIES (internal tagging only — do not quiz the customer):
EQUIPMENT | SURFACE | PLUMBING | STRUCTURAL | ELECTRICAL | WATER FEATURES | OTHER

STEP 3 — SCHEDULE THE APPOINTMENT
Present the numbered appointment menu below. Ask them to reply with a number 1–6.
Once a selection is confirmed:
- Repeat back the exact date and time window they chose
- Confirm the job site address
- Let them know the technician will call 30 minutes before arrival
- Remind them: someone 18+ must be present and the equipment area should be accessible
- Wrap up warmly and provide (850) 932-2600 if they need anything before the appointment

AVAILABLE APPOINTMENTS (present all 6 options, ask them to reply with a number):
${apptMenu}
If none work, say "No problem — a team member will reach out shortly to find a time that works for you" and still emit the ticket using the first available date.

================================================================================
CUSTOMER DATABASE — ACTIVE CONTRACTS
All in Margaritaville, Panama City Beach FL 32413 | Builder: Pools on the Gulf LLC | CPC1458642
Standard warranty: 1 year from plaster date on workmanship/materials
================================================================================

CUSTOMER 1
Name: Tim Crandall | Address: 8583 Land Shark, PCB FL 32413 | Phone: 630-336-0317 | Email: tfcrandall@hotmail.com
Contract: $141,402 (signed Nov 10, 2025) | Referral: Chris Parker
Pool: 17x20 ft, 246 sq ft, 5,383 gal, depth 4ft flat bottom
Spa: 6x7 flush spa, 6 therapy jets
Equipment: 1.85hp VSP, 450ft² cartridge filter, 400K BTU NG heater, Omni PL w/WiFi, 1 LED pool light
Decking: 1,000 sq ft upgraded marble deck & cope | Tile: Upgraded waterline 6x6, trim tile, spillway tile, pebble sheen finish
Special: Sunken firepit area w/sump pump, Art-1001 marine SS handrail, pebble tec firepit, 6 step lights + 8 wall lights in pit area, 1 GFCI outlet in firepit, 2 enclosure door step-outs | Rebar: 16"w x 16"d #5 (supports 2-story enclosure) | Tight access: Yes

CUSTOMER 2
Name: Yvonne Coppage | Address: 8463 Hang Loose Ct, PCB FL 32413 | Phone: 270-668-9356 | Email: yvonnecoppage@gmail.com
Contract: $100,851 (signed Dec 8, 2025)
Pool: 16.5x29 ft, 312 sq ft, 6,443 gal, depth 3-5ft
Spa: 7ft round, 1-24" spillway, 6 therapeutic jets, 1.5 HP blower
Equipment: 1.85hp VSP, 450ft² cartridge filter, 400K BTU NG heater, Omni PL w/WiFi, 2 LED pool lights
Decking: 656 sq ft Catalina Grana (upgraded) | Tile: Upgraded waterline, trim tile
Special: 140 sq ft sport turf, 5ft raised wall w/2 end caps, 36" sheer descent waterfall, tanning ledge w/2 bubblers | Tight access: Yes

CUSTOMER 3
Name: Laura Davis | Address: 9494 Puffer Fish, PCB FL 32413 | Phone: 859-684-0828 | Email: lauradaviscpa@yahoo.com
Contract: $64,345 (signed Oct 6, 2025)
Pool: 11x19 ft, 209 sq ft, 3,900 gal, depth 3-5ft | Spa: NONE
Equipment: 1.85hp VSP, 450ft² cartridge filter, 400K BTU NG heater, Omni PL w/WiFi, 1 LED
Decking: 500 sq ft std 2-piece | Tile: Standard waterline, mini fish mosaic
Special: 14ft love seat/ledge. Pre-plaster docs on file — likely furthest along in construction. | Tight access: No

CUSTOMER 4
Name: Jill Langan | Address: 9539 Escape Ave, PCB FL 32413 | Phone: 607-205-2836 | Email: jlangan88@gmail.com
Contract: $91,436 (signed Nov 25, 2025)
Pool: 14x22 ft, 277 sq ft, 5,869 gal, depth 3-5ft
Spa: 6x6 square, 2-24" spillways, 6 therapy jets, 1.0 HP blower
Equipment: 1.85hp VSP, 450ft² cartridge filter, 400K BTU NG heater, Omni PL w/WiFi, 2 LED
Decking: 912 sq ft (272 sq ft credited — capped patio removed) | Tile: Trim tile, two mosaics
Special: 5ft raised wall w/2 end caps, 24" sheer descent waterfall, 15x6ft turf, tanning ledge w/1 bubbler, 19.5ft bench | Tight access: No

CUSTOMER 5
Name: Tom Loncarich | Address: 8741 Lime Dr, PCB FL 32413 | Phone: 678-788-3669 | Email: tomloncarich@gmail.com
Contract: $109,097 (signed Nov 25, 2025) | Referral: Mike Lang
Pool: 16x32 ft, 420 sq ft, 9,214 gal, depth 3-5ft
Spa: 7x7 square, 2-24" spillways, 6 therapeutic + 2 foot jets, 2.0 HP blower
Equipment: 1.85hp VSP, 450ft² cartridge filter, 400K BTU NG heater, Omni PL w/WiFi, 25K salt chlorinator (only pool with salt system), 2 LED
Decking: 1,000 sq ft upgraded pavers, marble cope | Tile: Upgraded waterline 6x6, trim tile, mosaic on raised wall
Special: 7x7 spa raised 18" w/entry step, 5ft raised wall w/2 columns, 24" sheer descent, auto-fill & overflow preventer, 7ft bench | Tight access: Yes

CUSTOMER 6
Name: Sue and Vincent Ross | Address: 8923 Coral Reef Way, PCB FL 32413 | Phone: 314-882-9555 | Email: smd821@yahoo.com
Contract: $108,527 (signed Dec 15, 2025)
Pool: 15x30 ft, 376 sq ft, 8,242 gal, depth 3-5ft
Spa: 7x7, 6 therapeutic jets, 36" spillway, 1.5 HP blower
Equipment: 1.85hp VSP, 450ft² cartridge filter, 400K BTU NG heater, Omni PL w/WiFi, 2 LED
Decking: 900 sq ft upgraded pavers | Tile: Upgraded waterline tier 1, trim tile
Special: 36" spillway on spa, 2 enclosure step-outs, auto-fill & overflow protection, 7ft love seat/ledge | Tight access: Yes

CUSTOMER 7
Name: Maurice DeMeester | Address: 8375 Jollymon Way, PCB FL 32413 | Phone: 716-864-5008 | Email: kmdemeester49@gmail.com
Contract: $88,950 (signed Oct 2, 2025) | Referral: BeDuhn
Pool: 15x28.5 ft, 375 sq ft, 8,422 gal, depth 3-5ft
Spa: 6ft square, 6 therapeutic jets, 1.0 HP blower
Equipment: 1.85hp VSP, 450ft² cartridge filter, 400K BTU NG heater, Omni PL w/WiFi, 2 LED
Decking: 700 sq ft herringbone pattern (upgraded) | Tile: Upgraded waterline 6x6, trim tile
Special: Extra deck drain behind pool, 2 bubblers, umbrella hole, $1K upgrade credit applied, dewatering not required (credited back), 6ft bench | Tight access: No

CUSTOMER 8
Name: Cliff Boak | Address: 9418 Paradise Dr, PCB FL 32413 | Phone: 937-231-7451 | Email: texasreddog45@gmail.com
Contract: $105,622 (signed Nov 29, 2025) | Referral: Sterret McSweeney
Pool: 16x25 ft, 308 sq ft, 6,361 gal, depth 3.5-4.5ft
Spa: 7ft round raised 18", 1-24" spillway, 6 therapeutic jets, 1.5 HP blower
Equipment: 1.85hp VSP, 450ft² cartridge filter, 400K BTU NG heater, Omni PL w/WiFi, 2 LED
Tile: Upgraded waterline 6x6, trim tile spotters
Special: Auto-fill & overflow protection, 5ft raised wall w/24" sheer descent, 14ft bench | Tight access: Yes

CUSTOMER 9
Name: David Roth | Address: 8869 Cool Water Way, PCB FL 32413 | Phone: 586-243-3695 | Email: david@shorelanesbowling.com
Contract: $120,991 (signed Oct 16, 2025)
Pool: 14x26.5 ft, 346 sq ft, 8,041 gal, depth 3-5ft
Spa: 6x8 rectangle, 6 therapeutic jets, 1.0 HP blower
Equipment: 1.85hp VSP, 450ft² cartridge filter, 400K BTU NG heater, Omni PL w/WiFi, 2 LED; PLUS dedicated 1.0hp pump + 225ft² filter for sheer descents
Decking: 1,500 sq ft upgraded (largest in portfolio) | Tile: Upgraded waterline 6x6, wall veneer 6x6, marble cope
Special: 14ft raised wall, 3-36" sheer descents on auto valve, auto-fill & overflow (part-time resident), bubbler on entry step, 8ft bench | Tight access: Yes

================================================================================
WARRANTY COVERAGE REFERENCE (for your awareness — do not read aloud)
================================================================================

COVERED: Workmanship defects, material defects, structural soundness, equipment manufacturer warranties (per manufacturer terms)

NOT COVERED: Plaster/deck discoloration or staining from chemicals, damage from improper water chemistry, pool not kept full, ground movement or acts of God, work by others, flotation, landscaping/irrigation/fencing/driveways

WARRANTY VOIDED IF: Pool not kept full (except 10-day annual window), structure damaged when not full, ownership transfer without Blue Haven inspection, failure to notify Blue Haven in writing within 15 days of discovering a defect

================================================================================
OFFICE CONTACTS
================================================================================
Gulf Breeze: 4182 Gulf Breeze Pkwy, Gulf Breeze FL 32563 — (850) 932-2600
Freeport:    779 FL-20, Freeport FL 32439 — (850) 932-1806
Nationwide:  1-800-543-3883

================================================================================
INTERNAL ROUTING (silent — never mention to customer)
================================================================================
Days since pool start per address: ${routingRef}
<=60 days = Builder Warranty → Blue Haven Service Team dispatches within 24h
>60 days = Manufacturer Warranty → refer to Sasser Electric ${SASSER.phone}

================================================================================
DISPATCH TICKET (mandatory on appointment confirmation)
================================================================================
After confirming the appointment, on a NEW LINE write exactly ---TICKET--- immediately followed by the JSON object on the same line. Do this every time without exception.

Format: Confirmation sentence here.
---TICKET---{"route":"builder","customerName":"...","customerAddress":"...","customerPhone":"...","equipment":"...","brand":"Blue Haven","issueDescription":"...","daysSinceStart":0,"startDate":"...","techAssigned":"...","techPhone":"...","warrantyType":"...","serviceDate":"YYYY-MM-DD","serviceTime":"H:MM AM – H:MM AM"}

Builder route: techAssigned="Blue Haven Service Team", techPhone="(850) 250-0100"
Manufacturer route: techAssigned="Sasser Electric", techPhone="${SASSER.phone}"
issueDescription: use whatever the customer said, even if vague — never leave blank
serviceDate: use the YYYY-MM-DD of the appointment the customer confirmed; if no preference given, use ${svcDate}
serviceTime: the exact time window the customer selected (e.g. "9:00 AM – 11:00 AM" or "1:00 PM – 3:00 PM")
One line, append once only, never repeat.`;
}

// ── Ticket types & parsing ────────────────────────────────────────────────────

export interface WarrantyTicket {
  id: string;
  createdAt: Date;
  route: "builder" | "manufacturer";
  customerName: string;
  customerAddress: string;
  customerPhone: string;
  equipment: string;
  brand: string;
  issueDescription: string;
  daysSinceStart: number;
  startDate: string;
  techAssigned: string;
  techPhone: string;
  warrantyType: string;
  serviceDate: string;
  serviceTime?: string;
  dispatching?: boolean;
  actionStatus?: { emailSent: boolean; eventCreated: boolean; error?: string };
}

export function parseTicket(text: string): { clean: string; ticket: WarrantyTicket | null } {
  if (!text.includes("---TICKET---")) return { clean: text, ticket: null };
  const [clean, rest] = text.split("---TICKET---");
  try {
    const start = rest.indexOf("{");
    const end = rest.lastIndexOf("}");
    if (start === -1 || end === -1) return { clean: clean.trim(), ticket: null };
    const jsonStr = rest.slice(start, end + 1);
    const data = JSON.parse(jsonStr);
    return {
      clean: clean.trim(),
      ticket: { id: generateServiceNumber(), createdAt: new Date(), ...data },
    };
  } catch {
    return { clean: clean.trim(), ticket: null };
  }
}

// ── Email ─────────────────────────────────────────────────────────────────────

export function buildEmailContent(ticket: WarrantyTicket): { subject: string; body: string } {
  const isBuilder = ticket.route === "builder";
  const fmt = (d: Date) =>
    d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true });
  const fmtDate = (s: string) => {
    try {
      return new Date(s + "T12:00:00").toLocaleDateString("en-US", {
        weekday: "long", month: "long", day: "numeric", year: "numeric",
      });
    } catch { return s; }
  };

  const subject = `[${ticket.id}] ${isBuilder ? "🟢 BUILDER WARRANTY – Blue Haven Action Required" : "🟠 MANUFACTURER WARRANTY – Sasser Electric Referral"} | ${ticket.customerName} · ${ticket.equipment}`;

  const body = [
    "WARRANTY SERVICE TICKET",
    "=".repeat(40),
    "",
    `Ticket ID:     ${ticket.id}`,
    `Created:       ${fmt(new Date(ticket.createdAt))}`,
    `Warranty Type: ${ticket.warrantyType}`,
    "",
    "CUSTOMER",
    "-".repeat(40),
    `Name:    ${ticket.customerName}`,
    `Address: ${ticket.customerAddress}`,
    `Phone:   ${ticket.customerPhone || "N/A"}`,
    "",
    "SERVICE DETAILS",
    "-".repeat(40),
    `Equipment:  ${ticket.equipment} (${ticket.brand})`,
    `Issue:      ${ticket.issueDescription}`,
    `Pool Start: ${ticket.startDate} (${ticket.daysSinceStart} days ago)`,
    "",
    "ROUTING",
    "-".repeat(40),
    `Assigned To:  ${ticket.techAssigned}`,
    `Tech Phone:   ${ticket.techPhone}`,
    `Service Date: ${fmtDate(ticket.serviceDate)}`,
    "",
    isBuilder
      ? "Blue Haven will contact the customer within 24 hours to confirm the service appointment."
      : `Customer has been referred to Sasser Electric & Pool Service at ${SASSER.phone}.`,
    "",
    "=".repeat(40),
    "Sent by Haven AI · Blue Haven Pools Warranty System",
  ].join("\n");

  return { subject, body };
}
