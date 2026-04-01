import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import twilio from "twilio";
import { buildSystemPrompt, parseTicket, buildEmailContent, CalendarEvent, BUILDER_EMAIL, MANUFACTURER_EMAIL, BLUEHAVEN_CC } from "@/lib/warranty";
import { getHistory, appendHistory, clearHistory } from "@/lib/smsStore";
import { addEvent } from "@/lib/eventStore";
import { saveTicket } from "@/lib/ticketStore";
import { Resend } from "resend";

export const maxDuration = 30;

function twiml(msg: string): NextResponse {
  const xml = `<?xml version="1.0" encoding="UTF-8"?><Response><Message>${msg.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")}</Message></Response>`;
  return new NextResponse(xml, { headers: { "Content-Type": "text/xml" } });
}

export async function POST(req: NextRequest) {
  const form = await req.formData();
  const body = (form.get("Body") as string | null)?.trim() ?? "";
  const from = (form.get("From") as string | null) ?? "unknown";

  if (!body) return twiml("Hi! You've reached Blue Haven Pools warranty support. I'm Haven. What's your pool's service address?");

  const anthropicKey = process.env.ANTHROPIC_API_KEY;
  if (!anthropicKey) return twiml("Service temporarily unavailable. Please call Blue Haven directly.");

  const history = getHistory(from);
  appendHistory(from, { role: "user", content: body });

  const client = new Anthropic({ apiKey: anthropicKey });

  let responseText = "";
  try {
    const msg = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 1024,
      system: buildSystemPrompt(),
      messages: ([...history, { role: "user", content: body }] as { role: "user" | "assistant"; content: string }[]).slice(-8),
    });
    responseText = (msg.content[0] as { type: string; text: string }).text ?? "";
  } catch {
    return twiml("Sorry, I couldn't process that. Please try again or call Blue Haven directly.");
  }

  const { clean, ticket } = parseTicket(responseText);
  appendHistory(from, { role: "assistant", content: clean });

  if (ticket) {
    // Dispatch email
    const resendKey = process.env.RESEND_API_KEY;
    if (resendKey) {
      try {
        const resend = new Resend(resendKey);
        const { subject, body: emailBody } = buildEmailContent(ticket);
        const isBuilder = ticket.route === "builder";
        await resend.emails.send({
          from: "Haven AI <onboarding@resend.dev>",
          to: isBuilder ? BUILDER_EMAIL : MANUFACTURER_EMAIL,
          cc: isBuilder ? undefined : [BLUEHAVEN_CC],
          subject,
          text: emailBody,
        });
      } catch {}
    }

    // Save to DB
    const calEvent: CalendarEvent = {
      id: ticket.id,
      date: ticket.serviceDate,
      customer: ticket.customerName,
      address: ticket.customerAddress,
      equipment: ticket.equipment,
      issue: ticket.issueDescription,
      type: ticket.route,
      time: "9:00 AM – 11:00 AM",
      tech: ticket.techAssigned,
      status: "pending",
      ticketId: ticket.id,
    };
    addEvent(calEvent);
    saveTicket(ticket);
    clearHistory(from);

    return twiml(`${clean}\n\nYour service number: ${ticket.id}. We'll follow up shortly.`);
  }

  return twiml(clean);
}
