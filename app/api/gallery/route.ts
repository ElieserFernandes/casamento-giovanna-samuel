import { NextRequest, NextResponse } from "next/server";
import { Contribution, ensureSchema, getWeddingEnv } from "@/lib/cloudflare";

export async function GET(request: NextRequest) {
  try {
    const env = await getWeddingEnv();
    await ensureSchema(env.DB!);
    const { searchParams } = new URL(request.url);
    const page = Math.max(1, Number(searchParams.get("page") || "1"));
    const pageSize = Math.min(24, Math.max(1, Number(searchParams.get("pageSize") || "9")));
    const offset = (page - 1) * pageSize;

    const totalRow = await env.DB!.prepare(`SELECT COUNT(*) AS total FROM contributions
      WHERE status = 'approved' AND content_type IN ('photo', 'video')`).first<{ total: number }>();
    const { results } = await env.DB!.prepare(`SELECT id, contributor_name, contributor_relation, content_type, file_url, caption, created_at
      FROM contributions WHERE status = 'approved' AND content_type IN ('photo', 'video')
      ORDER BY created_at DESC LIMIT ? OFFSET ?`).bind(pageSize, offset).all<Contribution>();

    const total = totalRow?.total ?? 0;
    return NextResponse.json({ items: results || [], page, pageSize, total, hasMore: offset + pageSize < total });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erro inesperado";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
