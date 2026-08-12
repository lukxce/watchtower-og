// Thin Claude API wrapper shared by scoring, auto-discovery, and (later)
// battlecards/Ask. Returns null when ANTHROPIC_API_KEY is absent so every
// caller degrades cleanly to a deterministic fallback.
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
    const data = (await res.json()) as { content?: { text?: string }[] };
    const txt = data.content?.[0]?.text ?? '';
    const start = txt.indexOf('[') >= 0 && (txt.indexOf('[') < txt.indexOf('{') || txt.indexOf('{') < 0) ? txt.indexOf('[') : txt.indexOf('{');
    const end = txt.lastIndexOf(']') > txt.lastIndexOf('}') ? txt.lastIndexOf(']') : txt.lastIndexOf('}');
    if (start < 0 || end < 0) return null;
    return JSON.parse(txt.slice(start, end + 1)) as T;
  } catch {
    return null;
  }
}
