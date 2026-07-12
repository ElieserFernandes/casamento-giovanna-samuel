const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
const apiToken = process.env.CLOUDFLARE_API_TOKEN;
const d1DatabaseId = process.env.CLOUDFLARE_D1_DATABASE_ID;
const r2Bucket = process.env.CLOUDFLARE_R2_BUCKET;
const publicR2BaseUrl = process.env.NEXT_PUBLIC_R2_PUBLIC_URL;

export type GuestMessage = {
  id: string;
  name: string;
  message: string;
  created_at: string;
};

export async function queryD1<T>(sql: string, params: unknown[] = []) {
  assertD1Configured();
  const response = await fetch(
    `https://api.cloudflare.com/client/v4/accounts/${accountId}/d1/database/${d1DatabaseId}/query`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ sql, params }),
    },
  );

  if (!response.ok) {
    throw new Error(`D1 request failed with status ${response.status}`);
  }

  const payload = await response.json();
  return (payload.result?.[0]?.results ?? []) as T[];
}

export function buildR2ObjectUrl(key: string) {
  if (!publicR2BaseUrl) {
    return null;
  }

  return `${publicR2BaseUrl.replace(/\/$/, '')}/${key}`;
}

export function createPhotoKey(fileName: string) {
  const safeName = fileName.toLowerCase().replace(/[^a-z0-9._-]+/g, '-');
  return `wedding-album/${new Date().toISOString().slice(0, 10)}/${crypto.randomUUID()}-${safeName}`;
}

export function getStorageStatus() {
  return {
    d1Configured: Boolean(accountId && apiToken && d1DatabaseId),
    r2Configured: Boolean(accountId && apiToken && r2Bucket && publicR2BaseUrl),
    r2Bucket,
  };
}

function assertD1Configured() {
  if (!accountId || !apiToken || !d1DatabaseId) {
    throw new Error('D1 is not configured. Set CLOUDFLARE_ACCOUNT_ID, CLOUDFLARE_API_TOKEN and CLOUDFLARE_D1_DATABASE_ID.');
  }
}
