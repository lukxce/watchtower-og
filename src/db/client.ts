// Database client: Neon/any Postgres via DATABASE_URL in production, embedded
// PGlite (in-process Postgres) for local dev — same SQL either way. Schema is
// the proven MVP schema (entity-centric: competitors are global objects),
// bootstrapped idempotently on first connection.
import { PGlite } from '@electric-sql/pglite';
import postgres from 'postgres';
import path from 'node:path';

export interface Db {
  query<T = Record<string, unknown>>(text: string, params?: unknown[]): Promise<T[]>;
}

const DDL = `
CREATE TABLE IF NOT EXISTS competitors (
  id SERIAL PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  domain TEXT NOT NULL,
  meta_page_id TEXT,
  youtube_handle TEXT,
  track_linkedin BOOLEAN NOT NULL DEFAULT false,
  queries JSONB NOT NULL DEFAULT '{}'::jsonb,
  extra_tier1 JSONB NOT NULL DEFAULT '[]'::jsonb,
  extra_tier2 JSONB NOT NULL DEFAULT '[]'::jsonb
);

CREATE TABLE IF NOT EXISTS pages (
  id SERIAL PRIMARY KEY,
  competitor_id INT NOT NULL REFERENCES competitors(id),
  url TEXT NOT NULL,
  tier INT NOT NULL,
  active BOOLEAN NOT NULL DEFAULT true,
  discovered_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(competitor_id, url)
);

CREATE TABLE IF NOT EXISTS snapshots (
  id SERIAL PRIMARY KEY,
  page_id INT NOT NULL REFERENCES pages(id),
  captured_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  content_hash TEXT NOT NULL,
  content TEXT NOT NULL,
  http_status INT
);
CREATE INDEX IF NOT EXISTS idx_snapshots_page ON snapshots(page_id, captured_at DESC);

CREATE TABLE IF NOT EXISTS changes (
  id SERIAL PRIMARY KEY,
  page_id INT NOT NULL REFERENCES pages(id),
  prev_snapshot_id INT REFERENCES snapshots(id),
  new_snapshot_id INT NOT NULL REFERENCES snapshots(id),
  diff TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  note TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS stream_items (
  id SERIAL PRIMARY KEY,
  competitor_id INT NOT NULL REFERENCES competitors(id),
  channel TEXT NOT NULL,
  external_id TEXT NOT NULL,
  title TEXT NOT NULL,
  url TEXT,
  published_at TIMESTAMPTZ,
  payload JSONB,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(competitor_id, channel, external_id)
);
CREATE INDEX IF NOT EXISTS idx_items_feed ON stream_items(created_at DESC);

CREATE TABLE IF NOT EXISTS signals (
  id SERIAL PRIMARY KEY,
  competitor_id INT NOT NULL REFERENCES competitors(id),
  channel TEXT NOT NULL,
  category TEXT,
  title TEXT NOT NULL,
  summary TEXT,
  url TEXT,
  score INT,
  source_ref TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS collection_runs (
  id SERIAL PRIMARY KEY,
  competitor_id INT NOT NULL REFERENCES competitors(id),
  channel TEXT NOT NULL,
  run_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  ok BOOLEAN NOT NULL,
  items INT NOT NULL DEFAULT 0,
  note TEXT
);

CREATE TABLE IF NOT EXISTS sources (
  id SERIAL PRIMARY KEY,
  competitor_id INT NOT NULL REFERENCES competitors(id),
  channel TEXT NOT NULL,
  kind TEXT NOT NULL,
  value TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(competitor_id, channel, kind)
);

CREATE TABLE IF NOT EXISTS sitemap_urls (
  id SERIAL PRIMARY KEY,
  competitor_id INT NOT NULL REFERENCES competitors(id),
  url TEXT NOT NULL,
  lastmod TEXT,
  tier INT NOT NULL,
  first_seen TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(competitor_id, url)
);

CREATE TABLE IF NOT EXISTS threat_scores (
  competitor_id INT PRIMARY KEY REFERENCES competitors(id),
  dims JSONB NOT NULL,
  total INT NOT NULL,
  as_of TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS meta (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS threat_history (
  id SERIAL PRIMARY KEY,
  competitor_id INT NOT NULL REFERENCES competitors(id),
  total INT NOT NULL,
  captured_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE stream_items ADD COLUMN IF NOT EXISTS score INT;
ALTER TABLE stream_items ADD COLUMN IF NOT EXISTS category TEXT;

CREATE TABLE IF NOT EXISTS battlecards (
  competitor_id INT PRIMARY KEY REFERENCES competitors(id),
  content JSONB NOT NULL,
  generated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  generated_by TEXT NOT NULL DEFAULT 'claude-in-session'
);
`;

declare global {
  // eslint-disable-next-line no-var
  var __watchtowerDb: Promise<Db> | undefined;
}

async function connect(): Promise<Db> {
  const url = process.env.DATABASE_URL;
  let db: Db;
  if (url) {
    const sql = postgres(url, { max: 5 });
    db = {
      async query<T>(text: string, params: unknown[] = []) {
        return (await sql.unsafe(text, params as never[])) as unknown as T[];
      },
    };
  } else {
    const pg = new PGlite(path.join(process.cwd(), 'data', 'pglite'));
    db = {
      async query<T>(text: string, params: unknown[] = []) {
        const res = await pg.query<T>(text, params as never[]);
        return res.rows;
      },
    };
  }
  for (const stmt of DDL.split(';').map((s) => s.trim()).filter(Boolean)) {
    await db.query(stmt);
  }
  return db;
}

export function getDb(): Promise<Db> {
  if (!globalThis.__watchtowerDb) globalThis.__watchtowerDb = connect();
  return globalThis.__watchtowerDb;
}
