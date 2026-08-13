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

-- Multi-tenancy: every competitor belongs to a workspace (Clerk org id, or
-- 'dev-workspace' when Clerk isn't configured for local dev). Competitors were
-- previously globally unique by slug (single shared workspace) — now uniqueness
-- is scoped per workspace so two customers can each track a "salesforce".
ALTER TABLE competitors DROP CONSTRAINT IF EXISTS competitors_slug_key;
ALTER TABLE competitors ADD COLUMN IF NOT EXISTS org_id TEXT NOT NULL DEFAULT 'dev-workspace';
CREATE UNIQUE INDEX IF NOT EXISTS idx_competitors_org_slug ON competitors(org_id, slug);
CREATE INDEX IF NOT EXISTS idx_competitors_org ON competitors(org_id);

-- Claim ledger (field report §03): structured claims extracted from any
-- captured page, deduped/tracked new-vs-changed, and checked against the
-- workspace's own feature truth table for contradiction ("how to win").
CREATE TABLE IF NOT EXISTS claims (
  id SERIAL PRIMARY KEY,
  org_id TEXT NOT NULL,
  competitor_id INT NOT NULL REFERENCES competitors(id),
  section TEXT NOT NULL, -- positioning | pricing | feature | integration | compliance | proof | objection
  claim_text TEXT NOT NULL,
  source_url TEXT,
  source_quote TEXT,
  status TEXT NOT NULL DEFAULT 'new', -- new | reaffirmed | changed | contradicted
  confidence INT NOT NULL DEFAULT 1, -- bumped on repetition across sources
  first_seen TIMESTAMPTZ NOT NULL DEFAULT now(),
  last_seen TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_claims_org_comp ON claims(org_id, competitor_id, section);

-- Comparison / alternative pages discovered per competitor (sitemap + pattern
-- match + Wayback CDX union, per field-report §03) — the highest-value page
-- type: a competitor's own claimed differentiators about us.
CREATE TABLE IF NOT EXISTS comparison_pages (
  id SERIAL PRIMARY KEY,
  org_id TEXT NOT NULL,
  competitor_id INT NOT NULL REFERENCES competitors(id),
  url TEXT NOT NULL,
  discovered_via TEXT NOT NULL, -- sitemap | crawl | wayback
  mentions_us BOOLEAN NOT NULL DEFAULT false,
  first_seen TIMESTAMPTZ NOT NULL DEFAULT now(),
  last_checked TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(competitor_id, url)
);

-- Workspace's own feature/claim truth table — what the claim ledger checks
-- competitor claims against to auto-derive "how to win" content.
CREATE TABLE IF NOT EXISTS our_claims (
  id SERIAL PRIMARY KEY,
  org_id TEXT NOT NULL,
  section TEXT NOT NULL,
  claim_text TEXT NOT NULL,
  source_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_our_claims_org ON our_claims(org_id, section);

-- Newsletters & secret shopper (handoff §"channels"): a persona inbox signs
-- up for each competitor's newsletter/product emails, and forwarded mail
-- lands in stream_items via /api/inbound. This table tracks the manual signup
-- step itself, since nothing can automate "fill out a form on their site"
-- honestly without a real browser session and a real inbox to receive the
-- confirmation link.
CREATE TABLE IF NOT EXISTS secret_shopper (
  id SERIAL PRIMARY KEY,
  org_id TEXT NOT NULL,
  competitor_id INT NOT NULL REFERENCES competitors(id),
  persona_email TEXT,
  status TEXT NOT NULL DEFAULT 'not_started', -- not_started | signed_up | confirmed | bounced
  note TEXT,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(org_id, competitor_id)
);

-- Marketing-site contact form submissions. No email service is wired yet
-- (would be Resend) — submissions land here so nothing is silently dropped.
CREATE TABLE IF NOT EXISTS contact_messages (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Workspace's own brand identity — what to watch FOR, not just what to watch.
-- Nothing here is guessed: a workspace has no mentions module until someone
-- types their own brand name in. aliases covers short forms/old names a
-- competitor's copy or the press might use instead of the full name.
CREATE TABLE IF NOT EXISTS org_settings (
  org_id TEXT PRIMARY KEY,
  brand_name TEXT NOT NULL,
  brand_domain TEXT,
  aliases JSONB NOT NULL DEFAULT '[]'::jsonb,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Platform-admin corrections on the LLM reasoning layer (src/lib/reason.ts).
-- Deliberately NOT org-scoped for reads — a correction made while viewing one
-- workspace is admin judgment about how interpretation SHOULD work, and gets
-- fed back as few-shot guidance to every workspace's reasoning calls. No raw
-- customer/competitor data is shared between workspaces this way — only the
-- admin's own generalized judgment ("this connection was wrong, because X").
CREATE TABLE IF NOT EXISTS interpretation_feedback (
  id SERIAL PRIMARY KEY,
  org_id TEXT NOT NULL,
  competitor_name TEXT NOT NULL,
  channel TEXT NOT NULL,
  signal_title TEXT NOT NULL,
  headline_shown TEXT NOT NULL,
  verdict TEXT NOT NULL, -- correct | incorrect
  note TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_feedback_verdict ON interpretation_feedback(verdict, created_at DESC);

-- Cached reasoning for when there's no ANTHROPIC_API_KEY to call live —
-- same "Claude-in-session" pattern as battlecards.ts: the reasoning is done
-- by Claude Code by hand, once, against the real data, and cached per
-- signal instead of templated. A snapshot, not a live loop — doesn't
-- reason about signals that show up after it was generated until re-run or
-- a real key is added (see scripts/reason-cache.ts).
CREATE TABLE IF NOT EXISTS reasoning_cache (
  stream_item_id INT PRIMARY KEY REFERENCES stream_items(id),
  headline TEXT NOT NULL,
  how_we_know TEXT,
  context JSONB,
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
  // Strip `-- line comments` before splitting on `;` — a semicolon inside a
  // comment (e.g. "emails; forwarded mail...") otherwise breaks a statement
  // in half. This has bitten this file twice; fixing it here instead of
  // just the symptom.
  const withoutComments = DDL.replace(/--[^\n]*/g, '');
  for (const stmt of withoutComments.split(';').map((s) => s.trim()).filter(Boolean)) {
    await db.query(stmt);
  }
  return db;
}

export function getDb(): Promise<Db> {
  if (!globalThis.__watchtowerDb) globalThis.__watchtowerDb = connect();
  return globalThis.__watchtowerDb;
}
