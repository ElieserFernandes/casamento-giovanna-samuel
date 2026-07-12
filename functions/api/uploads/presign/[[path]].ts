type Env = { DB: D1Database; ALBUM_PHOTOS: R2Bucket; NEXT_PUBLIC_R2_PUBLIC_URL?: string };

export const onRequestPost: PagesFunction<Env> = async ({ env, request }) => {
  const form = await request.formData();
  const file = form.get('file');
  const consent = form.get('consent') === 'true' || form.get('consent') === 'on';

  if (!(file instanceof File) || !consent || !file.type.startsWith('image/')) {
    return json({ error: 'Consentimento e arquivo de imagem são obrigatórios.' }, 400);
  }

  const id = crypto.randomUUID();
  const safeName = file.name.toLowerCase().replace(/[^a-z0-9._-]+/g, '-');
  const objectKey = `wedding-album/${new Date().toISOString().slice(0, 10)}/${id}-${safeName}`;
  await env.ALBUM_PHOTOS.put(objectKey, file.stream(), {
    httpMetadata: { contentType: file.type },
    customMetadata: { originalName: file.name, consent: 'true' },
  });
  const publicUrl = `${(env.NEXT_PUBLIC_R2_PUBLIC_URL ?? '').replace(/\/$/, '')}/${objectKey}`;
  await env.DB.prepare('INSERT INTO photos (id, object_key, file_name, content_type, public_url, created_at) VALUES (?, ?, ?, ?, ?, datetime())').bind(id, objectKey, file.name, file.type, publicUrl).run();

  return json({ id, key: objectKey, publicUrl, persisted: true }, 201);
};

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json; charset=utf-8' } });
}
