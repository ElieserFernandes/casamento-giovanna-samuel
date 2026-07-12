import { NextResponse } from 'next/server';
import { buildR2ObjectUrl, createPhotoKey, queryD1 } from '../../../../lib/cloudflare';

export async function POST(request: Request) {
  const body = await request.json();
  const fileName = String(body.fileName ?? 'foto.jpg');
  const contentType = String(body.contentType ?? 'image/jpeg');
  const consent = Boolean(body.consent);

  if (!consent || !contentType.startsWith('image/')) {
    return NextResponse.json({ error: 'Consentimento e arquivo de imagem são obrigatórios.' }, { status: 400 });
  }

  const id = crypto.randomUUID();
  const key = createPhotoKey(fileName);
  const publicUrl = buildR2ObjectUrl(key);

  await queryD1(
    'INSERT INTO photos (id, object_key, file_name, content_type, public_url, created_at) VALUES (?, ?, ?, ?, ?, datetime())',
    [id, key, fileName, contentType, publicUrl],
  );

  return NextResponse.json({
    id,
    key,
    publicUrl,
    uploadMode: 'r2-direct-upload-required',
    note: 'Metadados persistidos em D1. Configure uma função de assinatura R2/S3 no ambiente Sites para upload direto ao bucket.',
  });
}
