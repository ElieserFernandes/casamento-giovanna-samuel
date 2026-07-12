import { NextResponse } from "next/server";
import { ensureSchema, getWeddingEnv } from "@/lib/cloudflare";

export async function GET() {
  try {
    const env = await getWeddingEnv();
    await ensureSchema(env.DB!);
    const total = await env.DB!.prepare("SELECT COUNT(*) AS count FROM contributions").first();
    return NextResponse.json({ ok: true, bindings: { DB: true, ALBUM_PHOTOS: true }, total });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erro inesperado";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
