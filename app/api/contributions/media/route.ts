import { NextRequest, NextResponse } from "next/server";
import { getSingleAlbumId, getWeddingEnv, publicPhotoUrl } from "@/lib/cloudflare";

const maxFileSize = 25 * 1024 * 1024;

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");
    const contributorName = String(formData.get("contributor_name") ?? "").trim();
    const contributorRelation = String(formData.get("contributor_relation") ?? "").trim() || null;
    const caption = String(formData.get("caption") ?? "").trim() || null;

    if (!(file instanceof File)) return NextResponse.json({ error: "Arquivo obrigatório." }, { status: 400 });
    if (contributorName.length < 2) return NextResponse.json({ error: "Nome obrigatório." }, { status: 400 });
    if (file.size > maxFileSize) return NextResponse.json({ error: "Arquivo maior que 25 MB." }, { status: 400 });

    const isVideo = file.type.startsWith("video/");
    const isPhoto = file.type.startsWith("image/");
    if (!isVideo && !isPhoto) return NextResponse.json({ error: "Tipo de arquivo não permitido." }, { status: 400 });

    const env = await getWeddingEnv();
    const albumId = await getSingleAlbumId(env.DB!);
    const id = crypto.randomUUID();
    const extension = file.name.split(".").pop()?.replace(/[^a-zA-Z0-9]/g, "") || (isVideo ? "mp4" : "jpg");
    const path = `giovanna-e-samuel/${isVideo ? "videos" : "fotos"}/${Date.now()}-${id}.${extension}`;

    await env.ALBUM_PHOTOS!.put(path, file.stream(), {
      httpMetadata: { contentType: file.type || "application/octet-stream" },
      customMetadata: { contributorName }
    });

    const fileUrl = publicPhotoUrl(path, env.R2_PUBLIC_BASE_URL);
    await env.DB!.prepare(`INSERT INTO contributions (
      id, album_id, contributor_name, contributor_relation, content_type, content_source,
      file_url, file_path, file_size, file_mime_type, caption, status
    ) VALUES (?, ?, ?, ?, ?, 'guest_upload', ?, ?, ?, ?, ?, 'pending')`).bind(
      id, albumId, contributorName, contributorRelation, isVideo ? "video" : "photo", fileUrl, path, file.size, file.type, caption
    ).run();

    const contribution = await env.DB!.prepare("SELECT id, status, file_url, created_at FROM contributions WHERE id = ?").bind(id).first();
    return NextResponse.json({ contribution }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erro inesperado";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
