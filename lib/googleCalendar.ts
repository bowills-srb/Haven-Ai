import { CalendarEvent } from "./warranty";

interface GoogleCalendarResult {
  success: boolean;
  eventId?: string;
  error?: string;
}

function parseTime(timeStr: string, date: string): { start: string; end: string } {
  // Parse "9:00 AM – 11:00 AM" style strings into ISO 8601 datetimes
  // Time zone: America/Chicago (CDT, UTC-5) for Panama City Beach FL
  const parts = timeStr.split("–").map((s) => s.trim());
  const startRaw = parts[0] ?? "9:00 AM";
  const endRaw = parts[1] ?? "11:00 AM";

  const toHour = (t: string): number => {
    const match = t.match(/(\d+):(\d+)\s*(AM|PM)/i);
    if (!match) return 9;
    let h = parseInt(match[1]);
    const pm = match[3].toUpperCase() === "PM";
    if (pm && h !== 12) h += 12;
    if (!pm && h === 12) h = 0;
    return h;
  };

  const toMin = (t: string): number => {
    const match = t.match(/(\d+):(\d+)/);
    return match ? parseInt(match[2]) : 0;
  };

  const fmt = (h: number, m: number) =>
    `${date}T${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:00`;

  return {
    start: fmt(toHour(startRaw), toMin(startRaw)),
    end: fmt(toHour(endRaw), toMin(endRaw)),
  };
}

export async function createGoogleCalendarEvent(
  calEvent: CalendarEvent
): Promise<GoogleCalendarResult> {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const refreshToken = process.env.GOOGLE_REFRESH_TOKEN;
  const calendarId = process.env.GOOGLE_CALENDAR_ID ?? "primary";

  if (!clientId || !clientSecret || !refreshToken) {
    console.warn("[GoogleCalendar] env vars not set — skipping calendar event");
    return { success: false, error: "Google Calendar env vars not configured" };
  }

  try {
    // Exchange refresh token for access token
    const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        refresh_token: refreshToken,
        grant_type: "refresh_token",
      }),
    });

    if (!tokenRes.ok) {
      const err = await tokenRes.text();
      console.error("[GoogleCalendar] token exchange failed:", err);
      return { success: false, error: `Token exchange failed: ${tokenRes.status}` };
    }

    const { access_token } = await tokenRes.json() as { access_token: string };

    // Build event body
    const { start, end } = parseTime(calEvent.time, calEvent.date);
    const isBuilder = calEvent.type === "builder";

    const eventBody = {
      summary: `[BH] ${calEvent.customer} — ${calEvent.equipment}`,
      description: [
        `Issue: ${calEvent.issue}`,
        `Ticket: ${calEvent.ticketId ?? calEvent.id}`,
        `Address: ${calEvent.address}`,
        `Tech: ${calEvent.tech}`,
        `Type: ${isBuilder ? "Builder Warranty" : "Manufacturer Warranty"}`,
      ].join("\n"),
      location: calEvent.address,
      start: { dateTime: start, timeZone: "America/Chicago" },
      end: { dateTime: end, timeZone: "America/Chicago" },
      colorId: isBuilder ? "2" : "6", // sage green = builder, tangerine = manufacturer
    };

    const eventRes = await fetch(
      `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calendarId)}/events`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${access_token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(eventBody),
      }
    );

    if (!eventRes.ok) {
      const err = await eventRes.text();
      console.error("[GoogleCalendar] event creation failed:", err);
      return { success: false, error: `Event creation failed: ${eventRes.status}` };
    }

    const created = await eventRes.json() as { id: string };
    console.log(`[GoogleCalendar] event created: ${created.id} for ${calEvent.customer}`);
    return { success: true, eventId: created.id };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("[GoogleCalendar] unexpected error:", message);
    return { success: false, error: message };
  }
}
