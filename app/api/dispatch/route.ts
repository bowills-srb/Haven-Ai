import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { buildEmailContent, WarrantyTicket, BUILDER_EMAIL, MANUFACTURER_EMAIL, BLUEHAVEN_CC } from "@/lib/warranty";

export const maxDuration = 30;

export async function POST(req: NextRequest) {
  try {
    const ticket: WarrantyTicket = await req.json();

    if (!ticket || !ticket.id) {
      return NextResponse.json({ error: "ticket data required" }, { status: 400 });
    }

    const resendKey = process.env.RESEND_API_KEY;
    if (!resendKey) {
      console.error("Missing RESEND_API_KEY env var");
      return NextResponse.json({ emailSent: false, eventCreated: false, error: "RESEND_API_KEY not set in Railway" }, { status: 500 });
    }

    const resend = new Resend(resendKey);
    const { subject, body } = buildEmailContent(ticket);

    const isBuilder = ticket.route === "builder";
    // Builder: to Blue Haven only. Manufacturer: to Sasser primary, Blue Haven CC for records.
    const toEmail = isBuilder ? BUILDER_EMAIL : MANUFACTURER_EMAIL;
    const ccEmails = isBuilder ? [] : [BLUEHAVEN_CC];

    const { error } = await resend.emails.send({
      from: "Haven AI <onboarding@resend.dev>",
      to: toEmail,
      cc: ccEmails.length ? ccEmails : undefined,
      subject,
      text: body,
    });

    if (error) {
      console.error("Resend error:", JSON.stringify(error));
      return NextResponse.json({ emailSent: false, eventCreated: false, error: error.message }, { status: 500 });
    }

    console.log(`Email sent: ${ticket.id} → ${toEmail}${ccEmails.length ? ` CC ${ccEmails.join(", ")}` : ""}`);
    return NextResponse.json({ emailSent: true, eventCreated: false });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("Dispatch API error:", message);
    return NextResponse.json({ emailSent: false, eventCreated: false, error: message }, { status: 500 });
  }
}
