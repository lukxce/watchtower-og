// The free radar tool's server side (app/(marketing)/radar/page.tsx is the
// client). Deliberately lightweight — a trimmed-down version of the pattern
// in src/collectors/sitemapWatch.ts (sitemap discovery) and
// src/collectors/subdomains.ts (crt.sh certificate-transparency lookup),
// self-contained here so this public, unauthenticated route has no
// dependency on the DB layer or the full collector pipeline.
//
// Two honesty rules this route exists to keep:
//   1. Never throw. A partial or all-failed result is still a valid 200 with
//      explanatory *Error fields — this endpoint is public and unauthed, so a
//      hostile or malformed domain must never 500.
//   2. crt.sh gets called AT MOST once per request, and only once per domain
//      per hour thanks to the module-level cache below. crt.sh rate-limits
//      hard; retrying on failure here would be the fastest way to get this
//      route's shared IP blocked for every visitor, not just one.
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

interface RadarResult {
  domain: string;
  sitemapCount: number | null;
  sitemapError: string | null;
  subdomainCount90d: number | null;
  certError: string | null;
}

// ---------- domain validation ----------

// Strips a protocol and leading "www." the user may have pasted, then checks
// what's left looks like a real hostname: labels of letters/digits/hyphens,
// at least one dot, a TLD of 2+ letters. Not a full RFC 1035 validator — just
// enough to reject garbage before we make a network call with it.
const HOSTNAME_RE = /^(?!-)[a-z0-9-]{1,63}(?<!-)(\.(?!-)[a-z0-9-]{1,63}(?<!-))*\.[a-z]{2,}$/i;

function normalizeDomain(raw: string): string | null {
  let d = raw.trim().toLowerCase();
  if (!d) return null;
  d = d.replace(/^https?:\/\//, '');
  d = d.split('/')[0]; // drop any path
  d = d.split(':')[0]; // drop any port
  d = d.replace(/^www\./, '');
  if (d.length > 253 || !HOSTNAME_RE.test(d)) return null;
  return d;
}

// ---------- sitemap check ----------
// One request, one manual redirect follow, 5s timeout each. We only need to
// know whether it parses as a sitemap and how many <loc> entries it has —
// full XML parsing (fast-xml-parser, as used in src/lib/sitemap.ts) is more
// than this quick public tool needs, and a plain regex count on a document
// we already confirmed looks like a sitemap is both cheaper and can't throw
// on a document fast-xml-parser would consider malformed.
async function fetchWithTimeout(url: string, ms: number): Promise<Response> {
  const ctl = new AbortController();
  const timer = setTimeout(() => ctl.abort(), ms);
  try {
    return await fetch(url, {
      redirect: 'manual',
      signal: ctl.signal,
      headers: { 'user-agent': 'Mozilla/5.0 (compatible; FortressHQRadar/1.0)' },
    });
  } finally {
    clearTimeout(timer);
  }
}

async function checkSitemap(domain: string): Promise<{ count: number | null; error: string | null }> {
  let url = `https://${domain}/sitemap.xml`;
  try {
    let res = await fetchWithTimeout(url, 5000);
    // Follow exactly one redirect.
    if (res.status >= 300 && res.status < 400) {
      const loc = res.headers.get('location');
      if (loc) {
        url = new URL(loc, url).toString();
        res = await fetchWithTimeout(url, 5000);
      }
    }
    if (res.status !== 200) {
      return { count: null, error: `no sitemap found (HTTP ${res.status})` };
    }
    const text = await res.text();
    if (!/<(urlset|sitemapindex)[\s>]/i.test(text)) {
      return { count: null, error: "the response wasn't a sitemap we could read" };
    }
    const matches = text.match(/<loc>/gi);
    return { count: matches ? matches.length : 0, error: null };
  } catch (e: unknown) {
    const msg = e instanceof Error && e.name === 'AbortError' ? 'timed out reaching their site' : "couldn't reach their site";
    return { count: null, error: msg };
  }
}

// ---------- crt.sh certificate-transparency lookup ----------
// Module-level cache: survives across requests in the same server instance,
// 1-hour TTL. This is the ONLY thing standing between this public route and
// crt.sh's rate limiter, so every path below must hit this cache rather than
// crt.sh directly, and a cache miss must make at most one request with no
// retry.
interface CertCacheEntry {
  data: { count90d: number | null; error: string | null };
  expiresAt: number;
}
const CERT_CACHE_TTL_MS = 60 * 60 * 1000; // 1 hour
const certCache = new Map<string, CertCacheEntry>();

interface CrtShRow {
  name_value?: string;
  not_before?: string;
}

async function checkSubdomains90d(domain: string): Promise<{ count90d: number | null; error: string | null }> {
  const cached = certCache.get(domain);
  if (cached && cached.expiresAt > Date.now()) return cached.data;

  let result: { count90d: number | null; error: string | null };
  try {
    // Exactly one request. No retry, no backoff — crt.sh is a free public
    // service (see src/collectors/subdomains.ts) and this route is
    // unauthenticated, so it cannot be the thing that hammers it.
    const res = await fetchWithTimeout(`https://crt.sh/?q=%25.${encodeURIComponent(domain)}&output=json`, 5000);
    if (res.status !== 200) {
      result = { count90d: null, error: "certificate history wasn't available right now" };
    } else {
      const rows = (await res.json()) as CrtShRow[];
      const cutoff = Date.now() - 90 * 24 * 60 * 60 * 1000;
      const recentHosts = new Set<string>();
      for (const row of rows) {
        if (!row.not_before) continue;
        const notBefore = Date.parse(row.not_before);
        if (Number.isNaN(notBefore) || notBefore < cutoff) continue;
        for (const raw of String(row.name_value ?? '').split('\n')) {
          const h = raw.trim().toLowerCase();
          if (!h || h.startsWith('*.')) continue;
          if (h === domain || h.endsWith(`.${domain}`)) recentHosts.add(h);
        }
      }
      result = { count90d: recentHosts.size, error: null };
    }
  } catch {
    result = { count90d: null, error: "certificate history wasn't available right now" };
  }

  certCache.set(domain, { data: result, expiresAt: Date.now() + CERT_CACHE_TTL_MS });
  return result;
}

export async function POST(req: NextRequest) {
  const body = (await req.json().catch(() => ({}))) as { domain?: string };
  const domain = normalizeDomain(String(body.domain ?? ''));

  if (!domain) {
    return NextResponse.json(
      { error: 'that doesn\'t look like a real domain — try something like "example.com"' },
      { status: 400 },
    );
  }

  // Sitemap check and crt.sh lookup are independent; run them together so
  // one never blocks the other, and neither one throwing takes down the
  // response — both helpers already catch internally, but Promise.allSettled
  // is a second layer of the same guarantee.
  const [sitemapOutcome, certOutcome] = await Promise.allSettled([
    checkSitemap(domain),
    checkSubdomains90d(domain),
  ]);

  const sitemap =
    sitemapOutcome.status === 'fulfilled' ? sitemapOutcome.value : { count: null, error: "couldn't reach their site" };
  const cert =
    certOutcome.status === 'fulfilled'
      ? certOutcome.value
      : { count90d: null, error: "certificate history wasn't available right now" };

  const result: RadarResult = {
    domain,
    sitemapCount: sitemap.count,
    sitemapError: sitemap.error,
    subdomainCount90d: cert.count90d,
    certError: cert.error,
  };

  return NextResponse.json(result);
}
