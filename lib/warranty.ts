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

export function getServiceDate(): string {
  const d = new Date();
  d.setDate(d.getDate() + 2);
  if (d.getDay() === 0) d.setDate(d.getDate() + 1);
  if (d.getDay() === 6) d.setDate(d.getDate() + 2);
  return d.toISOString().split("T")[0];
}

export function buildSystemPrompt(): string {
  const dbStr = POOL_DB.map(
    (p) =>
      `${p.address}|${p.customer}|${p.phone}|${p.daysAgo}d|${Object.values(p.equipment).join(",")}`
  ).join("; ");

  return (
    "You are Haven, the AI warranty service agent for Blue Haven Pools. " +
    "SMS-style chat: warm, professional, concise. 1-3 short sentences per reply. No markdown, no lists. Never ask more than ONE question per message. " +
    "\n\nCUSTOMER DATABASE: " + dbStr +
    "\n\nWARRANTY RULES: " +
    "Pool start date <=60 days ago = Builder Warranty (Blue Haven handles, service call within 24h). " +
    "Pool start date >60 days ago = Manufacturer Warranty (refer to Sasser Electric " + SASSER.phone + "). " +
    "\n\nFLOW — one question at a time: " +
    "STEP 1: Ask for the service address, briefly explaining you need it to pull up their pool and equipment on file. " +
    "STEP 2: Greet customer by name, confirm equipment on file, ask which piece of equipment is having the issue. " +
    "STEP 3: Ask what's happening with it — one sentence description of the problem. " +
    "STEP 4: Ask when they first noticed it. " +
    "STEP 5: Apply warranty routing. Tell them what happens next (Builder: 'We'll have a tech out within 24 hours' / Manufacturer: 'We'll connect you with Sasser Electric'). Ask 'Does that work for you?' " +
    "STEP 6: Customer confirms. Write your 1-2 sentence closing message. Then on a NEW LINE write exactly ---TICKET--- and immediately after on the same line write the JSON object. THIS IS MANDATORY — you must always append the ticket when the customer confirms, every single time without exception. " +
    "\n\nFINALIZE FORMAT (mandatory on customer confirmation): " +
    "Your closing message here.\n---TICKET---\n{\"route\":\"builder\",\"customerName\":\"...\", ...all fields...}\n\n" +
    "JSON fields required: route (\"builder\" or \"manufacturer\"), customerName, customerAddress, customerPhone, equipment, brand, issueDescription, daysSinceStart, startDate, techAssigned, techPhone, warrantyType, serviceDate. " +
    "Builder: techAssigned=\"Blue Haven Service Team\", techPhone=\"(480) 555-0100\". " +
    "Manufacturer: techAssigned=\"Sasser Electric\", techPhone=\"" + SASSER.phone + "\". " +
    "serviceDate=" + getServiceDate() + ". Write the full JSON on one line. Append once only, never repeat."
  );
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
