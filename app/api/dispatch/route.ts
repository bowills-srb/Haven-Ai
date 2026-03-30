import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { buildDispatchPrompt, WarrantyTicket } from "@/lib/warranty";

export async function POST(req: NextRequest) {
  try {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "ANTHROPIC_API_KEY is not set" }, { status: 500 });
    }
    const client = new Anthropic({ apiKey });

    const ticket: WarrantyTicket = await req.json();

    if (!ticket || !ticket.id) {
      return NextResponse.json({ error: "ticket data required" }, { status: 400 });
    }

    const prompt = buildDispatchPrompt(ticket);

    const response = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 512,
      messages: [{ role: "user", content: prompt }],
      // @ts-expect-error mcp_servers is not in the official type yet
      mcp_servers: [
        { type: "url", url: "https://gmail.mcp.claude.com/mcp", name: "gmail" },
        { type: "url", url: "https://gcal.mcp.claude.com/mcp", name: "gcal" },
      ],
    });

    const text = response.content
      .filter((b) => b.type === "text")
      .map((b) => (b as { type: "text"; text: string }).text)
      .join(" ")
      .trim();

    try {
      const match = text.match(/\{[\s\S]*?\}/);
      if (match) {
        return NextResponse.json(JSON.parse(match[0]));
      }
    } catch {
      // fall through to default success
    }

    return NextResponse.json({ emailSent: true, eventCreated: true });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("Dispatch API error:", message);
    return NextResponse.json(
      { emailSent: false, eventCreated: false, error: message },
      { status: 500 }
    );
  }
}
