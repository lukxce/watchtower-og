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
    if (!res.ok) return null;
    return (await res.json()) as T[];
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}
