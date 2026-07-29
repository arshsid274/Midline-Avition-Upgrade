import { NextResponse } from "next/server";
import { randomUUID } from "node:crypto";

import { popularAirports, searchAirports } from "@/lib/airport-search";

type SuggestPayload = {
  text?: unknown;
  key?: unknown;
  geo?: unknown;
};

// XO's endpoint returns a per-session `key` the client echoes back. We keep
// the field for contract fidelity but it carries no server state here.
const SESSION_KEY = randomUUID().replace(/-/g, "");

// Dataset is static per deploy, so responses are safely cacheable.
const CACHE_CONTROL = "public, max-age=60, s-maxage=3600";

export async function POST(request: Request) {
  let payload: SuggestPayload;

  try {
    payload = (await request.json()) as SuggestPayload;
  } catch {
    return NextResponse.json({ message: "Invalid suggest request." }, { status: 400 });
  }

  const text = typeof payload.text === "string" ? payload.text : "";
  const { ma, ap } = text.trim() ? searchAirports(text) : popularAirports();

  return NextResponse.json(
    { status: "OK", key: SESSION_KEY, ma, ap },
    { headers: { "Cache-Control": CACHE_CONTROL } }
  );
}
