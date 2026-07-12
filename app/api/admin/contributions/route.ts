import { NextRequest, NextResponse } from "next/server";
import { ensureSchema, getWeddingEnv, isAdminTokenValid } from "@/lib/cloudflare";

export async function GET(request: NextRequest) {
  try {
    const env = await getWeddingEnv();
    if (!isAdminTokenValid(request, env)) return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
    await ensureSchema(env.DB!);
    const { results } = await env.DB!.prepare("SELECT * FROM contributions ORDER BY created_at DESC").all();
    return NextResponse.json({ contributions: results || [] });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erro inesperado";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
