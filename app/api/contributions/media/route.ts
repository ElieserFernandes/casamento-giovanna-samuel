import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdminClient } from "@/lib/supabase-admin";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");
    const contributorName = String(formData.get("contributor_name") ?? "").trim();
    const contributorRelation = String(formData.get("contributor_relation") ?? "").trim() || null;
    const caption = String(formData.get("caption") ?? "").trim() || null;

    if (!(file instanceof File)) return NextResponse.json({ error: "Arquivo obrigatório." }, { status: 400 });
    if (contributorName.length < 2) return NextResponse.json({ error: "Nome obrigatório." }, { status: 400 });

    const isVideo = file.type.startsWith("video/");
    const isPhoto = file.type.startsWith("image/");
    if (!isVideo && !isPhoto) return NextResponse.json({ error: "Tipo de arquivo não permitido." }, { status: 400 });

    const supabase = getSupabaseAdminClient();
    const { data: album, error: albumError } = await supabase.from("album_settings").select("id").eq("single_album", true).single();
    if (albumError || !album) return NextResponse.json({ error: "Álbum não encontrado." }, { status: 500 });

    const extension = file.name.split(".").pop() || "file";
    const path = `giovanna-e-samuel/${isVideo ? "videos" : "fotos"}/${Date.now()}-${crypto.randomUUID()}.${extension}`;

    const { error: uploadError } = await supabase.storage.from("wedding-media").upload(path, file, { contentType: file.type, upsert: false });
    if (uploadError) return NextResponse.json({ error: uploadError.message }, { status: 500 });

    const { data: publicUrl } = supabase.storage.from("wedding-media").getPublicUrl(path);

    const { data, error } = await supabase.from("contributions").insert({
      album_id: album.id,
      contributor_name: contributorName,
      contributor_relation: contributorRelation,
      content_type: isVideo ? "video" : "photo",
      content_source: "gallery",
      file_url: publicUrl.publicUrl,
      file_path: path,
      file_size: file.size,
      file_mime_type: file.type,
      caption,
      status: "pending"
    }).select("id, status, file_url, created_at").single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ contribution: data }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erro inesperado";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
