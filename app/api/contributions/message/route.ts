import { NextRequest, NextResponse } from "next/server";
import { getSingleAlbumId, getWeddingEnv } from "@/lib/cloudflare";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as any;
    const contributorName = String(body.contributor_name ?? "").trim();
    const contributorRelation = String(body.contributor_relation ?? "").trim() || null;
    const messageText = String(body.message_text ?? "").trim();

    if (contributorName.length < 2 || !messageText) {
      return NextResponse.json({ error: "Nome e mensagem são obrigatórios." }, { status: 400 });
    }

    const env = await getWeddingEnv();
    const albumId = await getSingleAlbumId(env.DB!);
    const id = crypto.randomUUID();

    await env.DB!.prepare(`INSERT INTO contributions (
      id, album_id, contributor_name, contributor_relation, content_type, content_source, message_text, status
    ) VALUES (?, ?, ?, ?, 'message', 'guest_message', ?, 'pending')`).bind(id, albumId, contributorName, contributorRelation, messageText).run();

    const contribution = await env.DB!.prepare("SELECT id, status, created_at FROM contributions WHERE id = ?").bind(id).first();
    return NextResponse.json({ contribution }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erro inesperado";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
