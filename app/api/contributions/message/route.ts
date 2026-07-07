import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdminClient } from "@/lib/supabase-admin";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const contributorName = String(body.contributor_name ?? "").trim();
    const contributorRelation = String(body.contributor_relation ?? "").trim() || null;
    const messageText = String(body.message_text ?? "").trim();

    if (contributorName.length < 2 || !messageText) {
      return NextResponse.json({ error: "Nome e mensagem são obrigatórios." }, { status: 400 });
    }

    const supabase = getSupabaseAdminClient();
    const { data: album, error: albumError } = await supabase
      .from("album_settings")
      .select("id")
      .eq("single_album", true)
      .single();

    if (albumError || !album) {
      return NextResponse.json({ error: "Álbum não encontrado." }, { status: 500 });
    }

    const { data, error } = await supabase
      .from("contributions")
      .insert({
        album_id: album.id,
        contributor_name: contributorName,
        contributor_relation: contributorRelation,
        content_type: "message",
        content_source: "text",
        message_text: messageText,
        status: "pending"
      })
      .select("id, status, created_at")
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ contribution: data }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erro inesperado";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
