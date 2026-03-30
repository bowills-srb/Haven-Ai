import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { buildEmailContent, WarrantyTicket, BUILDER_EMAIL, MANUFACTURER_EMAIL } from "@/lib/warranty";

export async function POST(req: NextRequest) {
  try {
    const ticket: WarrantyTicket = await req.json();

    if (!ticket || !ticket.id) {
      return NextResponse.json({ error: "ticket data required" }, { status: 400 });
    }

    const gmailUser = process.env.GMAIL_USER;
    const gmailPass = process.env.GMAIL_APP_PASSWORD;

    if (!gmailUser || !gmailPass) {
      console.error("Missing GMAIL_USER or GMAIL_APP_PASSWORD env vars");
      return NextResponse.json({ emailSent: false, eventCreated: false, error: "Email not configured" }, { status: 500 });
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user: gmailUser, pass: gmailPass },
    });

    const toEmail = ticket.route === "builder" ? BUILDER_EMAIL : MANUFACTURER_EMAIL;
    const { subject, body } = buildEmailContent(ticket);

    await transporter.sendMail({
      from: `"Haven AI · Blue Haven Pools" <${gmailUser}>`,
      to: toEmail,
      subject,
      text: body,
    });

    return NextResponse.json({ emailSent: true, eventCreated: false });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("Dispatch API error:", message);
    return NextResponse.json({ emailSent: false, eventCreated: false, error: message }, { status: 500 });
  }
}
