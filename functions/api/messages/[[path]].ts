type Env = { DB: D1Database };

type MessageRow = { id: string; name: string; message: string; created_at: string };

export const onRequestGet: PagesFunction<Env> = async ({ env, request }) => {
  const url = new URL(request.url);
  const page = Math.max(Number(url.searchParams.get('page') ?? '1'), 1);
  const pageSize = Math.min(Math.max(Number(url.searchParams.get('pageSize') ?? '20'), 1), 50);
  const offset = (page - 1) * pageSize;
  const { results } = await env.DB.prepare('SELECT id, name, message, created_at FROM guest_messages ORDER BY created_at DESC LIMIT ? OFFSET ?').bind(pageSize, offset).all<MessageRow>();
  return json({ messages: results, page, pageSize });
};

export const onRequestPost: PagesFunction<Env> = async ({ env, request }) => {
  const form = await request.formData();
  const name = String(form.get('name') ?? '').trim().slice(0, 120);
  const message = String(form.get('message') ?? '').trim().slice(0, 1000);
  const consent = form.get('consent') === 'on' || form.get('consent') === 'true';

  if (!name || !message || !consent) {
    return json({ error: 'Nome, recado e consentimento são obrigatórios.' }, 400);
  }

  const id = crypto.randomUUID();
  await env.DB.prepare('INSERT INTO guest_messages (id, name, message, created_at) VALUES (?, ?, ?, datetime())').bind(id, name, message).run();
  return json({ id, persisted: true }, 201);
};

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json; charset=utf-8' } });
}
