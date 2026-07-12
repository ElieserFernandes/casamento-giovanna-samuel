import { NextRequest, NextResponse } from "next/server";
import { ensureSchema, getWeddingEnv, isAdminTokenValid } from "@/lib/cloudflare";

export async function PATCH(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const env = await getWeddingEnv();
    if (!isAdminTokenValid(request, env)) return NextResponse.json({ error: "Não autorizado." }, { status: 401 });

    const { id } = await context.params;
    const body = await request.json() as any;
    const status = String(body.status || "");
    if (!['pending', 'approved', 'rejected'].includes(status)) {
      return NextResponse.json({ error: "Status inválido." }, { status: 400 });
    }

    await ensureSchema(env.DB!);
    await env.DB!.prepare("UPDATE contributions SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?").bind(status, id).run();
    const contribution = await env.DB!.prepare("SELECT * FROM contributions WHERE id = ?").bind(id).first();
    if (!contribution) return NextResponse.json({ error: "Contribuição não encontrada." }, { status: 404 });
    return NextResponse.json({ contribution });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erro inesperado";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
