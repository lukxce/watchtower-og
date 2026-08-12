// The fetch ladder (SAAS_BUILD_SPEC §4.1):
//   1. plain fetch with a real UA (cheapest, works for most targets)
//   2. challenge detection (Cloudflare 403/503, "Just a moment", JS shells)
//   3. Firecrawl browser-rendered fallback (only if FIRECRAWL_API_KEY set)
// Without Firecrawl, walled pages fail HONESTLY (recorded, never faked).

export interface FetchResult {
  status: number;
  html: string;
  finalUrl: string;
  error?: string;
}

export const UA =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36';

const CHALLENGE = /just a moment|cf-browser-verification|attention required|_cf_chl|challenge-platform/i;

export async function plainFetch(url: string, timeoutMs = 20000): Promise<FetchResult> {
  const ctl = new AbortController();
  const timer = setTimeout(() => ctl.abort(), timeoutMs);
  try {
    const res = await fetch(url, {
      headers: {
        'user-agent': UA,
        accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'accept-language': 'en-US,en;q=0.9',
      },
      redirect: 'follow',
      signal: ctl.signal,
    });
    const html = await res.text();
    return { status: res.status, html, finalUrl: res.url };
  } catch (e: unknown) {
    return { status: 0, html: '', finalUrl: url, error: e instanceof Error ? e.message : String(e) };
  } finally {
    clearTimeout(timer);
  }
}

function isWalled(r: FetchResult): boolean {
  if (r.status === 403 || r.status === 503) return true;
  if (CHALLENGE.test(r.html.slice(0, 4000))) return true;
  if (r.status === 200) {
    const stripped = r.html
      .replace(/<script[\s\S]*?<\/script>/gi, '')
      .replace(/<style[\s\S]*?<\/style>/gi, '')
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
    if (stripped.length < 400) return true; // JS shell
  }
  return false;
}

async function firecrawl(url: string, raw = false): Promise<FetchResult> {
  const key = process.env.FIRECRAWL_API_KEY;
  if (!key) return { status: 0, html: '', finalUrl: url, error: 'walled; no FIRECRAWL_API_KEY configured' };
  try {
    const res = await fetch('https://api.firecrawl.dev/v1/scrape', {
      method: 'POST',
      headers: { authorization: `Bearer ${key}`, 'content-type': 'application/json' },
      body: JSON.stringify({ url, formats: ['rawHtml'], waitFor: raw ? 0 : 3000 }),
    });
    if (!res.ok) return { status: res.status, html: '', finalUrl: url, error: `firecrawl HTTP ${res.status}` };
    const json = (await res.json()) as { data?: { rawHtml?: string; metadata?: { statusCode?: number } } };
    const html = json.data?.rawHtml ?? '';
    const status = json.data?.metadata?.statusCode ?? (html ? 200 : 0);
    return { status, html, finalUrl: url };
  } catch (e: unknown) {
    return { status: 0, html: '', finalUrl: url, error: `firecrawl: ${e instanceof Error ? e.message : String(e)}` };
  }
}

// Per-run capture cache — so the same competitor URL fetched by several
// site-derived channels (website homepage, tech-stack, logos) is captured ONCE
// (through Firecrawl when walled) and reused. Cleared at the start of each run.
const captureCache = new Map<string, FetchResult>();
export function clearCaptureCache(): void {
  captureCache.clear();
}

// HTML pages: memoized; plain fetch first, Firecrawl fallback when walled.
export async function smartFetch(url: string): Promise<FetchResult> {
  const cached = captureCache.get(url);
  if (cached) return cached;
  const plain = await plainFetch(url);
  let result: FetchResult;
  if (plain.status === 200 && !isWalled(plain)) result = plain;
  else if (plain.status >= 400 && plain.status !== 403 && plain.status !== 503) result = plain; // real 404s stay
  else result = await firecrawl(url);
  if (result.status === 200) captureCache.set(url, result);
  return result;
}

// Raw non-HTML resources (sitemap.xml) behind a wall: Firecrawl fetches with a
// real browser context, returning raw bytes (spec §4.1 rung 4 / warm-up trick).
export async function smartFetchXml(url: string): Promise<FetchResult> {
  const plain = await plainFetch(url, 15000);
  if (plain.status === 200 && /<(urlset|sitemapindex)[\s>]/i.test(plain.html)) return plain;
  if (plain.status === 403 || plain.status === 503 || CHALLENGE.test(plain.html.slice(0, 3000))) {
    const fc = await firecrawl(url, true);
    if (fc.status === 200 && /<(urlset|sitemapindex)[\s>]/i.test(fc.html)) return fc;
    return { ...fc, status: fc.status || 403, error: fc.error ?? 'walled sitemap' };
  }
  return plain;
}

export const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
