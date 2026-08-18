// Thin Claude API wrapper shared by scoring, auto-discovery, and (later)
// battlecards/Ask. Returns null when ANTHROPIC_API_KEY is absent so every
// caller degrades cleanly to a deterministic fallback.
export interface TokenUse { input: number; output: number }
export let lastUsage: TokenUse | null = null;
export const totalUsage = { input: 0, output: 0, calls: 0 };

/** Haiku 4.5 list price, $/million tokens. */
export const HAIKU_RATE = { input: 1.0, output: 5.0 };
export function usageCostUsd(u = totalUsage): number {
  return (u.input / 1e6) * HAIKU_RATE.input + (u.output / 1e6) * HAIKU_RATE.output;
}

export async function claudeJSON<T>(system: string, user: string, maxTokens = 1024): Promise<T | null> {
  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) return null;
  try {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'x-api-key': key, 'anthropic-version': '2023-06-01', 'content-type': 'application/json' },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: maxTokens,
        system,
        messages: [{ role: 'user', content: user }],
      }),
    });
    if (!res.ok) return null;
    const data = (await res.json()) as {
      content?: { text?: string }[];
      usage?: { input_tokens?: number; output_tokens?: number };
    };
    // Token accounting. The cost model carried Claude as an ESTIMATE long
    // after every other input was measured, which made it the largest
    // unverified line in the business. Cheap to just count it.
    if (data.usage) {
      lastUsage = { input: data.usage.input_tokens ?? 0, output: data.usage.output_tokens ?? 0 };
      totalUsage.input += lastUsage.input;
      totalUsage.output += lastUsage.output;
      totalUsage.calls += 1;
    }
    const txt = data.content?.[0]?.text ?? '';
    const start = txt.indexOf('[') >= 0 && (txt.indexOf('[') < txt.indexOf('{') || txt.indexOf('{') < 0) ? txt.indexOf('[') : txt.indexOf('{');
    const end = txt.lastIndexOf(']') > txt.lastIndexOf('}') ? txt.lastIndexOf(']') : txt.lastIndexOf('}');
    if (start < 0 || end < 0) return null;
    return JSON.parse(txt.slice(start, end + 1)) as T;
  } catch {
    return null;
  }
}
