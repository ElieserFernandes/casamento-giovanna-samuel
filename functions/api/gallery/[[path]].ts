type Env = { DB: D1Database };

type PhotoRow = { id: string; file_name: string; public_url: string; created_at: string };
type CountRow = { total: number };

export const onRequestGet: PagesFunction<Env> = async ({ env, request }) => {
  const url = new URL(request.url);
  const page = Math.max(Number(url.searchParams.get('page') ?? '1'), 1);
  const pageSize = Math.min(Math.max(Number(url.searchParams.get('pageSize') ?? '24'), 1), 48);
  const offset = (page - 1) * pageSize;
  const { results: photos } = await env.DB.prepare('SELECT id, file_name, public_url, created_at FROM photos ORDER BY created_at DESC LIMIT ? OFFSET ?').bind(pageSize, offset).all<PhotoRow>();
  const totalRow = await env.DB.prepare('SELECT COUNT(*) AS total FROM photos').first<CountRow>();
  const total = Number(totalRow?.total ?? 0);
  return json({ photos, page, pageSize, total, totalPages: Math.max(Math.ceil(total / pageSize), 1) });
};

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json; charset=utf-8' } });
}
