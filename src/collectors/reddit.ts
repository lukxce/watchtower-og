// Reddit / community (spec §4.9). Reddit blocks unauthenticated JSON (403 even
// via browser since 2023), so this needs a free "script" OAuth app. Set
// REDDIT_CLIENT_ID / REDDIT_CLIENT_SECRET; without them it defers cleanly.
import { ingestItems, recordRun, type Competitor } from '@/db/queries';

const UA = 'fortress-hq-ci/0.1 by /u/hypefy';

async function token(): Promise<string | null> {
  const id = process.env.REDDIT_CLIENT_ID;
  const secret = process.env.REDDIT_CLIENT_SECRET;
  if (!id || !secret) return null;
  try {
    const res = await fetch('https://www.reddit.com/api/v1/access_token', {
      method: 'POST',
      headers: {
        authorization: `Basic ${Buffer.from(`${id}:${secret}`).toString('base64')}`,
        'content-type': 'application/x-www-form-urlencoded',
        'user-agent': UA,
      },
      body: 'grant_type=client_credentials',
    });
    if (!res.ok) return null;
    return ((await res.json()) as { access_token?: string }).access_token ?? null;
  } catch {
    return null;
  }
}

export async function collectReddit(comp: Competitor): Promise<string> {
  const t = await token();
  if (!t) {
    await recordRun(comp.id, 'reddit', true, 0, 'deferred: set REDDIT_CLIENT_ID/SECRET (free app)');
    return 'deferred (needs Reddit OAuth app)';
  }
  const q = comp.queries?.reddit ?? `"${comp.name}"`;
  try {
    const res = await fetch(`https://oauth.reddit.com/search?q=${encodeURIComponent(q)}&sort=new&limit=25&t=month`, {
      headers: { authorization: `Bearer ${t}`, 'user-agent': UA },
    });
    if (!res.ok) {
      await recordRun(comp.id, 'reddit', false, 0, `HTTP ${res.status}`);
      return `FAILED (HTTP ${res.status})`;
    }
    const data = (await res.json()) as {
      data?: { children?: { data: { id: string; title: string; permalink: string; created_utc: number; subreddit: string } }[] };
    };
    const posts = data.data?.children ?? [];
    const { added, fresh } = await ingestItems(
      comp.id,
      'reddit',
      posts.map(({ data: p }) => ({
        externalId: p.id,
        title: `Reddit (r/${p.subreddit}): ${p.title}`,
        url: `https://www.reddit.com${p.permalink}`,
        publishedAt: new Date(p.created_utc * 1000).toISOString(),
      })),
    );
    await recordRun(comp.id, 'reddit', true, added);
    return `+${added} (${fresh} pending)`;
  } catch (e) {
    await recordRun(comp.id, 'reddit', false, 0, e instanceof Error ? e.message : String(e));
    return 'FAILED (fetch)';
  }
}
