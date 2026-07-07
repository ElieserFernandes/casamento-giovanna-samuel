import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    supabase_url: Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL),
    supabase_anon_key: Boolean(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY),
    supabase_service_role_key: Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY),
    admin_token: Boolean(process.env.ADMIN_TOKEN),
    message: "Esta rota mostra apenas se as variáveis existem, sem revelar valores."
  });
}
