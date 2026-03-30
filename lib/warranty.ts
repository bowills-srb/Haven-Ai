export const POOL_DB = [
  {
    address: "1204 Sycamore Ln, Scottsdale AZ 85251",
    customer: "Rosa Martinez",
    phone: "(480) 555-0142",
    daysAgo: 35,
    equipment: {
      pump: "Pentair IntelliFlo3 VSF",
      filter: "Pentair Clean & Clear 150",
      heater: "Pentair MasterTemp 400",
      lights: "Pentair IntelliBrite 5G",
      automation: "Pentair IntelliCenter",
    },
  },
  {
    address: "882 Desert View Dr, Mesa AZ 85201",
    customer: "James Holloway",
    phone: "(480) 555-0287",
    daysAgo: 92,
    equipment: {
      pump: "Hayward TriStar VS 950",
      filter: "Hayward SwimClear C4030",
      heater: "Hayward H400FDN",
      lights: "Hayward ColorLogic 4.0",
      cleaner: "Hayward AquaNaut 400",
    },
  },
  {
    address: "3310 Palo Verde Ct, Tempe AZ 85281",
    customer: "Linda Chen",
    phone: "(480) 555-0391",
    daysAgo: 18,
    equipment: {
      pump: "Jandy VS FloPro 1.85",
      filter: "Jandy CL460",
      heater: "Jandy JXi 400",
      lights: "Jandy WaterColors LED",
      automation: "Jandy iAquaLink",
    },
  },
  {
    address: "9921 Oak Creek Dr, Peoria AZ 85383",
    customer: "Dana Brooks",
    phone: "(623) 555-0714",
    daysAgo: 75,
    equipment: {
      pump: "Pentair SuperFlo VS",
      filter: "Pentair Clean & Clear 100",
      heater: "None",
      lights: "Polaris LED",
      cleaner: "Polaris P-965iQ",
    },
  },
  {
    address: "5501 Camelback Rd, Phoenix AZ 85031",
    customer: "Amit Patel",
    phone: "(602) 555-0445",
    daysAgo: 7,
    equipment: {
      pump: "Hayward MaxFlo VS",
      filter: "Hayward Pro-Grid DE 60",
      heater: "Hayward H250FDN",
      lights: "Hayward ColorLogic 320",
      automation: "Hayward OmniLogic",
    },
  },
  {
    address: "741 Sonoran Ridge Rd, Chandler AZ 85248",
    customer: "Cynthia Beaumont",
    phone: "(480) 555-0819",
    daysAgo: 44,
    equipment: {
      pump: "Pentair IntelliFlo VSF",
      filter: "Jandy CS500",
      heater: "Pentair MasterTemp 250",
      lights: "Pentair IntelliBrite 5G",
      cleaner: "Zodiac MX8",
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
    "STEP 1: Ask for service address. " +
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

let ticketCounter = 1001;

export function parseTicket(text: string): { clean: string; ticket: WarrantyTicket | null } {
  if (!text.includes("---TICKET---")) return { clean: text, ticket: null };
  const [clean, rest] = text.split("---TICKET---");
  try {
    // Extract JSON robustly — handles single-line or multi-line output
    const start = rest.indexOf("{");
    const end = rest.lastIndexOf("}");
    if (start === -1 || end === -1) return { clean: clean.trim(), ticket: null };
    const jsonStr = rest.slice(start, end + 1);
    const data = JSON.parse(jsonStr);
    return {
      clean: clean.trim(),
      ticket: { id: "WR-" + ticketCounter++, createdAt: new Date(), ...data },
    };
  } catch {
    return { clean: clean.trim(), ticket: null };
  }
}

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

  const subject = `[${ticket.id}] ${isBuilder ? "Builder" : "Manufacturer"} Warranty — ${ticket.customerName} — ${ticket.equipment}`;

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
