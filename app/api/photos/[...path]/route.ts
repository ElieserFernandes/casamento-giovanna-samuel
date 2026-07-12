import { NextRequest, NextResponse } from "next/server";
import { getWeddingEnv } from "@/lib/cloudflare";

export async function GET(_request: NextRequest, context: { params: Promise<{ path: string[] }> }) {
  const { path } = await context.params;
  const key = decodeURIComponent(path.join("/"));
  const env = await getWeddingEnv();
  const object = await env.ALBUM_PHOTOS!.get(key);

  if (!object) return NextResponse.json({ error: "Arquivo não encontrado." }, { status: 404 });

  const headers = new Headers();
  object.writeHttpMetadata(headers);
  headers.set("etag", object.httpEtag);
  headers.set("cache-control", "public, max-age=31536000, immutable");
  return new Response(object.body, { headers });
}
