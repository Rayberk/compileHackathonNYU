import { NextResponse } from "next/server";

export const runtime = "nodejs";

type ChatRequest = {
  message: string;
  session_id?: string;
};

type ChatResponse = {
  response: string;
  session_id: string;
};

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Partial<ChatRequest>;

    if (!body.message || typeof body.message !== "string") {
      return NextResponse.json({ error: "Invalid request: message is required" }, { status: 400 });
    }

    const baseUrl = process.env.AGENT_API_URL ?? "http://127.0.0.1:8080";
    const upstream = await fetch(`${baseUrl.replace(/\/$/, "")}/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: body.message,
        session_id: body.session_id,
      }),
      cache: "no-store",
    });

    const text = await upstream.text();

    if (!upstream.ok) {
      return NextResponse.json(
        { error: "Agent upstream error", status: upstream.status, details: text },
        { status: 502 }
      );
    }

    let data: ChatResponse;
    try {
      data = JSON.parse(text) as ChatResponse;
    } catch {
      return NextResponse.json(
        { error: "Invalid agent response" },
        { status: 502 }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("/api/agent/chat error:", error);
    return NextResponse.json({ error: "Agent proxy failed" }, { status: 502 });
  }
}
