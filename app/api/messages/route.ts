import { NextResponse } from 'next/server';
import { queryD1 } from '../../../lib/cloudflare';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const page = Math.max(Number(searchParams.get('page') ?? '1'), 1);
  const pageSize = Math.min(Math.max(Number(searchParams.get('pageSize') ?? '20'), 1), 50);
  const offset = (page - 1) * pageSize;

  const messages = await queryD1(
    'SELECT id, name, message, created_at FROM guest_messages ORDER BY created_at DESC LIMIT ? OFFSET ?',
    [pageSize, offset],
  );

  return NextResponse.json({ messages, page, pageSize });
}

export async function POST(request: Request) {
  const body = await request.json();
  const name = String(body.name ?? '').trim().slice(0, 120);
  const message = String(body.message ?? '').trim().slice(0, 1000);
  const consent = Boolean(body.consent);

  if (!name || !message || !consent) {
    return NextResponse.json({ error: 'Nome, recado e consentimento são obrigatórios.' }, { status: 400 });
  }

  const id = crypto.randomUUID();
  await queryD1('INSERT INTO guest_messages (id, name, message, created_at) VALUES (?, ?, ?, datetime())', [id, name, message]);

  return NextResponse.json({ id, persisted: true }, { status: 201 });
}
