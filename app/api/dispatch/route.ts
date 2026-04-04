import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { buildEmailContent, WarrantyTicket, CalendarEvent, BUILDER_EMAIL, MANUFACTURER_EMAIL, BLUEHAVEN_CC } from "@/lib/warranty";
import { addEvent } from "@/lib/eventStore";
import { saveTicket } from "@/lib/ticketStore";
import { createGoogleCalendarEvent } from "@/lib/googleCalendar";

export const maxDuration = 30;

export async function POST(req: NextRequest) {
  try {
    const ticket: WarrantyTicket = await req.json();

    if (!ticket || !ticket.id) {
      return NextResponse.json({ error: "ticket data required" }, { status: 400 });
    }

    const isBuilder = ticket.route === "builder";
    const toEmail = isBuilder ? BUILDER_EMAIL : MANUFACTURER_EMAIL;
    const ccEmails = isBuilder ? [] : [BLUEHAVEN_CC];

    // Always save the ticket and calendar event first — email is best-effort.
    const calEvent: CalendarEvent = {
      id: ticket.id,
      date: ticket.serviceDate,
      customer: ticket.customerName,
      address: ticket.customerAddress,
      equipment: ticket.equipment,
      issue: ticket.issueDescription,
      type: ticket.route,
      time: ticket.serviceTime ?? "9:00 AM – 11:00 AM",
      tech: ticket.techAssigned,
      status: "pending",
      ticketId: ticket.id,
    };
    addEvent(calEvent);
    saveTicket(ticket);
    const gcal = await createGoogleCalendarEvent(calEvent);

    const resendKey = process.env.RESEND_API_KEY;
    if (!resendKey) {
      console.warn("RESEND_API_KEY not set — ticket saved, email skipped");
      return NextResponse.json({ emailSent: false, eventCreated: true, calendarEventCreated: gcal.success });
    }

    const resend = new Resend(resendKey);
    const { subject, body } = buildEmailContent(ticket);

    const { error } = await resend.emails.send({
      from: "Haven AI <onboarding@resend.dev>",
      to: toEmail,
      cc: ccEmails.length ? ccEmails : undefined,
      subject,
      text: body,
    });

    if (error) {
      console.error("Resend error:", JSON.stringify(error));
      return NextResponse.json({ emailSent: false, eventCreated: true, calendarEventCreated: gcal.success, error: error.message });
    }

    console.log(`Email sent: ${ticket.id} → ${toEmail}${ccEmails.length ? ` CC ${ccEmails.join(", ")}` : ""}`);
    return NextResponse.json({ emailSent: true, eventCreated: true, calendarEventCreated: gcal.success });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("Dispatch API error:", message);
    return NextResponse.json({ emailSent: false, eventCreated: false, error: message }, { status: 500 });
  }
}
