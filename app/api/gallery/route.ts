import { NextResponse } from 'next/server';
import { queryD1 } from '../../../lib/cloudflare';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const page = Math.max(Number(searchParams.get('page') ?? '1'), 1);
  const pageSize = Math.min(Math.max(Number(searchParams.get('pageSize') ?? '24'), 1), 48);
  const offset = (page - 1) * pageSize;

  const photos = await queryD1(
    'SELECT id, object_key, file_name, public_url, created_at FROM photos ORDER BY created_at DESC LIMIT ? OFFSET ?',
    [pageSize, offset],
  );
  const totals = await queryD1<{ total: number }>('SELECT COUNT(*) AS total FROM photos');
  const total = Number(totals[0]?.total ?? 0);

  return NextResponse.json({ photos, page, pageSize, total, totalPages: Math.ceil(total / pageSize) });
}
