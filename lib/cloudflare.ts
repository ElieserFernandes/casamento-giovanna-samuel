import { getCloudflareContext } from "@opennextjs/cloudflare";

type WeddingEnv = CloudflareEnv & {
  DB?: D1Database;
  ALBUM_PHOTOS?: R2Bucket;
  ADMIN_TOKEN?: string;
  R2_PUBLIC_BASE_URL?: string;
};

export type Contribution = {
  id: string;
  contributor_name: string;
  contributor_relation: string | null;
  content_type: "photo" | "video" | "message";
  content_source: string;
  file_url: string | null;
  file_path: string | null;
  file_size: number | null;
  file_mime_type: string | null;
  caption: string | null;
  message_text: string | null;
  status: "pending" | "approved" | "rejected";
  created_at: string;
  updated_at: string;
};

export async function getWeddingEnv() {
  const { env } = await getCloudflareContext({ async: true });
  const weddingEnv = env as WeddingEnv;
  if (!weddingEnv.DB) throw new Error("Binding D1 DB não configurado.");
  if (!weddingEnv.ALBUM_PHOTOS) throw new Error("Binding R2 ALBUM_PHOTOS não configurado.");
  return weddingEnv;
}

export function isAdminTokenValid(request: Request, env: WeddingEnv) {
  const expected = env.ADMIN_TOKEN;
  return Boolean(expected && request.headers.get("x-admin-token") === expected);
}

export function publicPhotoUrl(path: string, baseUrl?: string) {
  if (baseUrl) return `${baseUrl.replace(/\/$/, "")}/${path}`;
  return `/api/photos/${encodeURIComponent(path)}`;
}

export async function ensureSchema(db: D1Database) {
  await db.batch([
    db.prepare(`CREATE TABLE IF NOT EXISTS album_settings (
      id TEXT PRIMARY KEY,
      couple TEXT NOT NULL DEFAULT 'Giovanna & Samuel',
      event_date TEXT,
      single_album INTEGER NOT NULL DEFAULT 1,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    )`),
    db.prepare(`CREATE TABLE IF NOT EXISTS contributions (
      id TEXT PRIMARY KEY,
      album_id TEXT NOT NULL DEFAULT 'giovanna-samuel',
      contributor_name TEXT NOT NULL,
      contributor_relation TEXT,
      content_type TEXT NOT NULL CHECK (content_type IN ('photo','video','message')),
      content_source TEXT NOT NULL DEFAULT 'guest',
      file_url TEXT,
      file_path TEXT,
      file_size INTEGER,
      file_mime_type TEXT,
      caption TEXT,
      message_text TEXT,
      status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','approved','rejected')),
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    )`),
    db.prepare("CREATE INDEX IF NOT EXISTS idx_contributions_gallery ON contributions(status, content_type, created_at)"),
    db.prepare("INSERT OR IGNORE INTO album_settings (id, single_album) VALUES ('giovanna-samuel', 1)")
  ]);
}

export async function getSingleAlbumId(db: D1Database) {
  await ensureSchema(db);
  const row = await db.prepare("SELECT id FROM album_settings WHERE single_album = 1 LIMIT 1").first<{ id: string }>();
  return row?.id ?? "giovanna-samuel";
}
