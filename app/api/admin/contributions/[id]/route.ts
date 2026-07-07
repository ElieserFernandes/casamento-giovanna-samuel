import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdminClient } from "@/lib/supabase-admin";

function isAuthorized(request: NextRequest) {
  const token = request.headers.get("x-admin-token");
  return token && token === process.env.ADMIN_TOKEN;
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!isAuthorized(request)) return NextResponse.json({ error: "Não autorizado." }, { status: 401 });

  try {
    const { id } = await params;
    const body = await request.json();
    const status = body.status === "approved" ? "approved" : body.status === "rejected" ? "rejected" : null;
    if (!status) return NextResponse.json({ error: "Status inválido." }, { status: 400 });

    const supabase = getSupabaseAdminClient();
    const payload = status === "approved"
      ? { status, approved_at: new Date().toISOString(), rejected_at: null }
      : { status, rejected_at: new Date().toISOString(), approved_at: null };

    const { data, error } = await supabase.from("contributions").update(payload).eq("id", id).select("*").single();
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ contribution: data });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erro inesperado";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
