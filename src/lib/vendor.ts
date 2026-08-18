// Shared helper for licensed-data vendors (Apify-class run-and-fetch actors).
// One integration point for every gray-source channel (LinkedIn posts, G2,
// Capterra, Glassdoor). Without APIFY_TOKEN the caller defers cleanly.
//
// Apify pattern: POST run-sync-get-dataset-items runs an actor synchronously
// and returns the dataset rows. Actor IDs are configurable per channel via env
// so you can swap actors without code changes.
export function hasVendor(): boolean {
  return !!process.env.APIFY_TOKEN;
}

/**
 * Build an actor's input from a per-actor template.
 *
 * Every Apify actor defines its own input schema — a G2 scraper wants
 * `startUrls` or a product URL, a LinkedIn scraper wants a company slug. This
 * used to send one fixed shape ({ company, domain, maxItems }) to all of them,
 * which no real actor accepts, so the channel would have failed on the first
 * call whatever actor was configured.
 *
 * The template lives beside the actor id, e.g.
 *
 *   APIFY_G2_ACTOR=jupri/g2-scraper
 *   APIFY_G2_INPUT={"startUrls":[{"url":"https://www.g2.com/products/{{slug}}/reviews"}],"maxItems":25}
 *
 * Placeholders are substituted from the competitor. Absent a template we fall
 * back to the old generic shape, so an actor that happens to accept it still
 * works.
 */
export function buildActorInput(
  templateEnv: string,
  vars: Record<string, string | number>,
  fallback: Record<string, unknown>,
): Record<string, unknown> {
  const raw = process.env[templateEnv];
  if (!raw) return fallback;
  const filled = raw.replace(/\{\{(\w+)\}\}/g, (_, k: string) => String(vars[k] ?? ''));
  try {
    return JSON.parse(filled) as Record<string, unknown>;
  } catch {
    // A malformed template must not silently send the wrong shape.
    console.warn(`[vendor] ${templateEnv} is not valid JSON after substitution; using fallback`);
    return fallback;
  }
}

export async function runApifyActor<T = Record<string, unknown>>(
  actorId: string,
  input: Record<string, unknown>,
  timeoutMs = 120000,
): Promise<T[] | null> {
  const token = process.env.APIFY_TOKEN;
  if (!token || !actorId) return null;
  const ctl = new AbortController();
  const timer = setTimeout(() => ctl.abort(), timeoutMs);
  try {
    const res = await fetch(
      `https://api.apify.com/v2/acts/${encodeURIComponent(actorId)}/run-sync-get-dataset-items?token=${token}`,
      { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(input), signal: ctl.signal },
    );
    if (!res.ok) {
      // The body carries the actual reason — almost always a rejected input
      // field. Swallowing it turned every schema mismatch into a silent
      // "vendor unavailable", which is how two wrong input shapes shipped.
      const why = await res.text().catch(() => '');
      console.warn(`[vendor] ${actorId} → HTTP ${res.status} ${why.slice(0, 300)}`);
      return null;
    }
    return (await res.json()) as T[];
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}
