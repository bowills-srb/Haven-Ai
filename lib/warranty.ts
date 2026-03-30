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

export const DISPATCH_EMAIL = "BluehavenWarranty@gmail.com";

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
    "You are Haven, Blue Haven Pools warranty AI. Short 2-3 sentence SMS replies only. No markdown. DB: " +
    dbStr +
    " RULES: <=60d=Builder Warranty(Blue Haven,24h). >60d=Manufacturer Warranty(Sasser Electric " +
    SASSER.phone +
    "). " +
    "FLOW: ask address, confirm customer+gear, ask issue, route+confirm. " +
    "FINALIZE: append ---TICKET--- then JSON {route,customerName,customerAddress,customerPhone,equipment,brand,issueDescription,daysSinceStart,startDate,techAssigned,techPhone,warrantyType,serviceDate}. " +
    "Builder: techAssigned=Blue Haven Service Team,techPhone=(480) 555-0100. Mfr: techAssigned=Sasser Electric,techPhone=" +
    SASSER.phone +
    ". serviceDate=" +
    getServiceDate() +
    ". Append once only."
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
    const jsonStr = rest.trim().split("\n")[0].trim();
    const data = JSON.parse(jsonStr);
    return {
      clean: clean.trim(),
      ticket: { id: "WR-" + ticketCounter++, createdAt: new Date(), ...data },
    };
  } catch {
    return { clean: clean.trim(), ticket: null };
  }
}

export function buildDispatchPrompt(ticket: WarrantyTicket): string {
  const isBuilder = ticket.route === "builder";
  const fmt = (d: Date) =>
    d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true });
  const fmtDate = (s: string) => {
    try {
      return new Date(s + "T12:00:00").toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
      });
    } catch {
      return s;
    }
  };

  const subject =
    `[${ticket.id}] ${isBuilder ? "Builder" : "Manufacturer"} Warranty — ${ticket.customerName} — ${ticket.equipment}`;

  const emailBody = [
    "WARRANTY SERVICE TICKET",
    "",
    `Ticket: ${ticket.id}`,
    `Created: ${fmt(ticket.createdAt)}`,
    `Type: ${ticket.warrantyType}`,
    "",
    "CUSTOMER",
    `Name: ${ticket.customerName}`,
    `Address: ${ticket.customerAddress}`,
    `Phone: ${ticket.customerPhone || "N/A"}`,
    "",
    "SERVICE DETAILS",
    `Equipment: ${ticket.equipment} (${ticket.brand})`,
    `Issue: ${ticket.issueDescription}`,
    `Pool Start Date: ${ticket.startDate} (${ticket.daysSinceStart} days ago)`,
    "",
    "ROUTING",
    `Assigned To: ${ticket.techAssigned}`,
    `Tech Phone: ${ticket.techPhone}`,
    `Scheduled: ${fmtDate(ticket.serviceDate)}`,
    "",
    isBuilder
      ? "Blue Haven will contact customer within 24 hours."
      : `Customer referred to Sasser Electric at ${SASSER.phone}.`,
    "",
    "---",
    "Sent by Haven AI · Blue Haven Pools Warranty System",
  ].join("\n");

  const eventDesc =
    `Ticket: ${ticket.id}\nCustomer: ${ticket.customerName} ${ticket.customerPhone || ""}\n` +
    `Issue: ${ticket.issueDescription}\nEquipment: ${ticket.equipment} (${ticket.brand})\nType: ${ticket.warrantyType}`;

  return (
    "Complete both tasks using your tools:\n\n" +
    `TASK 1 - Send email to ${DISPATCH_EMAIL}\nSubject: ${subject}\nBody:\n${emailBody}\n\n` +
    `TASK 2 - Create calendar event:\nTitle: ${ticket.id} — ${ticket.customerName} Pool Service\n` +
    `Date: ${ticket.serviceDate}\nTime: 9:00 AM–11:00 AM\nLocation: ${ticket.customerAddress}\nDescription: ${eventDesc}\n\n` +
    'Reply with JSON only: {"emailSent":true,"eventCreated":true}'
  );
}
