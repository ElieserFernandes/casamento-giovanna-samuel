CREATE TABLE IF NOT EXISTS guest_messages (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime())
);

CREATE TABLE IF NOT EXISTS photos (
  id TEXT PRIMARY KEY,
  object_key TEXT NOT NULL UNIQUE,
  file_name TEXT NOT NULL,
  content_type TEXT NOT NULL,
  public_url TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime())
);

CREATE INDEX IF NOT EXISTS idx_guest_messages_created_at ON guest_messages (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_photos_created_at ON photos (created_at DESC);
