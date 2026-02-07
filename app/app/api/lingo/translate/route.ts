import { NextResponse } from "next/server";
import { LingoDotDevEngine } from "lingo.dev/sdk";

export const runtime = "nodejs";

type TranslateTextBody = {
  kind: "text";
  text: string;
  sourceLocale?: string;
  targetLocale: string;
};

type TranslateObjectBody = {
  kind: "object";
  obj: unknown;
  sourceLocale?: string;
  targetLocale: string;
};

type RequestBody = TranslateTextBody | TranslateObjectBody;

export async function POST(request: Request) {
  try {
    const apiKey = process.env.LINGODOTDEV_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "Missing LINGODOTDEV_API_KEY on server" },
        { status: 500 }
      );
    }

    const body = (await request.json()) as Partial<RequestBody>;

    const kind = body.kind;
    const sourceLocale = body.sourceLocale ?? "en";
    const targetLocale = body.targetLocale;

    if (!kind || !targetLocale) {
      return NextResponse.json(
        { error: "Invalid request: missing kind/targetLocale" },
        { status: 400 }
      );
    }

    const engine = new LingoDotDevEngine({ apiKey });

    if (kind === "text") {
      const text = (body as Partial<TranslateTextBody>).text;
      if (typeof text !== "string") {
        return NextResponse.json(
          { error: "Invalid request: text must be a string" },
          { status: 400 }
        );
      }

      const result = await engine.localizeText(text, {
        sourceLocale,
        targetLocale,
      });

      return NextResponse.json({ result });
    }

    if (kind === "object") {
      const obj = (body as Partial<TranslateObjectBody>).obj;
      if (obj === undefined) {
        return NextResponse.json(
          { error: "Invalid request: obj is required" },
          { status: 400 }
        );
      }

      if (typeof obj !== "object" || obj === null) {
        return NextResponse.json(
          { error: "Invalid request: obj must be a non-null object" },
          { status: 400 }
        );
      }

      const result = await engine.localizeObject(obj as Record<string, unknown>, {
        sourceLocale,
        targetLocale,
      });

      return NextResponse.json({ result });
    }

    return NextResponse.json({ error: "Invalid request: unknown kind" }, { status: 400 });
  } catch (error) {
    console.error("Lingo translate error:", error);
    return NextResponse.json({ error: "Translation failed" }, { status: 500 });
  }
}
