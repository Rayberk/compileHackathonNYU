import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET() {
  const baseUrl = process.env.AGENT_API_URL ?? "http://127.0.0.1:8080";

  try {
    const upstream = await fetch(`${baseUrl.replace(/\/$/, "")}/`, {
      cache: "no-store",
    });

    const text = await upstream.text();

    if (!upstream.ok) {
      return NextResponse.json(
        { ok: false, status: upstream.status, details: text },
        { status: 502 }
      );
    }

    return NextResponse.json({ ok: true, upstream: JSON.parse(text) });
  } catch (error) {
    console.error("/api/agent/health error:", error);
    return NextResponse.json({ ok: false, error: "Agent unreachable" }, { status: 502 });
  }
}
