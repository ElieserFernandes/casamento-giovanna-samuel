import { NextResponse } from "next/server";
import { ensureSchema, getWeddingEnv } from "@/lib/cloudflare";

export async function GET() {
  try {
    const env = await getWeddingEnv();
    await ensureSchema(env.DB!);
    const album = await env.DB!.prepare("SELECT * FROM album_settings WHERE single_album = 1 LIMIT 1").first();
    return NextResponse.json({ album });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erro inesperado";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
