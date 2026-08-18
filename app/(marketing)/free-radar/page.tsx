'use client';
import { useState, FormEvent } from 'react';
import Link from 'next/link';

interface RadarResult {
  domain: string;
  sitemapCount: number | null;
  sitemapError: string | null;
  subdomainCount90d: number | null;
  certError: string | null;
}

export default function Radar() {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<RadarResult | null>(null);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!input.trim() || loading) return;
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await fetch('/api/radar', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ domain: input.trim() }),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok) {
        setError(data?.error ?? 'something went wrong — try again');
        return;
      }
      setResult(data as RadarResult);
    } catch {
      setError("couldn't reach the radar — try again in a moment");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="cpx-radar">
      <div className="wrap cpx-radar-hero">
        <span className="kicker">Free tool · no sign-up</span>
        <h1>Point it at any competitor.</h1>
        <p>
          We&apos;ll pull their sitemap outline and check the public certificate log for anything new in the last
          90 days. Two of the 28 channels Fortress HQ watches every day — real, live, right now.
        </p>
      </div>

      <form className="wrap cpx-radar-form" onSubmit={onSubmit}>
        <input
          className="cpx-radar-input"
          type="text"
          inputMode="url"
          autoCapitalize="off"
          autoCorrect="off"
          spellCheck={false}
          placeholder="a competitor's domain, e.g. klue.com"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          aria-label="Domain to scan"
        />
        <button className="btn btn-primary btn-lg" type="submit" disabled={loading}>
          {loading ? 'Watching…' : 'Scan it'}
        </button>
      </form>
      <p className="wrap cpx-radar-hint">No account needed. We don&apos;t store what you search.</p>

      {error && (
        <div className="wrap">
          <p className="cpx-radar-err">{error}</p>
        </div>
      )}

      {result && (
        <div className="wrap">
          <p className="cpx-radar-domain">{result.domain}</p>
          <div className="cpx-radar-results">
            <div className="cpx-radar-stat">
              <span className={`cpx-radar-num${result.sitemapCount == null ? ' na' : ''}`}>
                {result.sitemapCount == null ? '—' : result.sitemapCount}
              </span>
              <div className="cpx-radar-body">
                {result.sitemapCount != null ? (
                  <>
                    <b>We found the outline of their site.</b>
                    <span>{result.sitemapCount} pages listed in their public sitemap.</span>
                  </>
                ) : (
                  <>
                    <b>We couldn&apos;t find a sitemap.</b>
                    <span>{result.sitemapError ?? "Their sitemap wasn't reachable."}</span>
                  </>
                )}
              </div>
            </div>

            <div className="cpx-radar-stat">
              <span className={`cpx-radar-num${result.subdomainCount90d == null ? ' na' : ''}`}>
                {result.subdomainCount90d == null ? '—' : result.subdomainCount90d}
              </span>
              <div className="cpx-radar-body">
                {result.subdomainCount90d != null ? (
                  <>
                    <b>New hostnames on the certificate log.</b>
                    <span>
                      {result.subdomainCount90d} subdomain{result.subdomainCount90d === 1 ? '' : 's'} registered in
                      the last 90 days — often the first public trace of something being built.
                    </span>
                  </>
                ) : (
                  <>
                    <b>Certificate history wasn&apos;t available right now.</b>
                    <span>{result.certError ?? 'The certificate-transparency log is rate-limited; try again shortly.'}</span>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="cpx-radar-cta">
        <h2 style={{ margin: '0 0 12px', fontSize: 22, fontWeight: 800, letterSpacing: '-.02em' }}>
          That&apos;s a fraction of what Fortress HQ watches continuously.
        </h2>
        <p>See all 28 channels, cited, every morning — pricing, ads, hiring, reviews, launches, and more.</p>
        <div className="wt-cta">
          <Link href="/pricing" className="btn btn-primary">See pricing</Link>
          <Link href="/demo" className="btn btn-ghost">Try the live demo</Link>
        </div>
      </div>

      <section className="cpx-section">
        <div className="wrap">
          <h2>What we actually check</h2>
          <p className="lede">
            Two real, live lookups — the same techniques a scout in the full product uses on these exact channels,
            just run once instead of on a standing schedule.
          </p>
          <div className="cpx-modes" style={{ marginTop: 24 }}>
            <div className="cpx-mode">
              <span className="cpx-mode-k mono">sitemap outline</span>
              <h3>Their public sitemap.xml, counted</h3>
              <p>
                We fetch <code>https://[domain]/sitemap.xml</code>, follow one redirect if there is one, and count
                the <code>&lt;loc&gt;</code> entries — a rough outline of how many pages they have listed publicly.
                If it doesn&apos;t exist, isn&apos;t reachable in five seconds, or doesn&apos;t parse as a sitemap, we
                say so rather than guessing.
              </p>
            </div>
            <div className="cpx-mode">
              <span className="cpx-mode-k mono">certificate log</span>
              <h3>New hostnames on the public cert log</h3>
              <p>
                We query <code>crt.sh</code>, the public certificate-transparency log, for any certificate issued to a
                subdomain of theirs in the last 90 days. A new hostname — <code>interviewer-v2.klue.com</code> is our
                own favorite real example — is often the first public trace of something being built, long before
                any announcement.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="cpx-section">
        <div className="wrap">
          <h2>This is 2 of the 28 channels Fortress HQ watches</h2>
          <p className="lede">
            Sitemap structure and certificate transparency are real, useful channels — and also two of the easiest to
            check without an account, which is exactly why we built the free version around them. The other 20 in
            the full product cover ground this tool intentionally doesn&apos;t: pricing pages read for actual price
            and tier changes, ad libraries on Google and LinkedIn, job boards for hiring clusters, review sites for
            reputation patterns, press and funding news, launch and changelog pages, and more — each read daily, on
            a schedule, and reasoned about together rather than reported as a raw list of diffs. What you get here is
            a snapshot of two channels, once. What the product does is watch all 28, every day, and tell you what a
            change actually means.
          </p>
        </div>
      </section>

      <section className="cpx-section">
        <div className="wrap">
          <h2>Questions people actually ask</h2>
          <div className="cpx-faq">
            <details className="cpx-faq-item">
              <summary>Do you store what I search?</summary>
              <p>
                No. This tool doesn&apos;t write your query or its result to a database — the sitemap fetch and
                certificate-log lookup happen for the duration of the request, and the certificate-log result is
                cached in server memory for up to an hour purely to avoid hammering crt.sh&apos;s public rate limit,
                not tied to who asked. No account, no email, no log of your searches.
              </p>
            </details>
            <details className="cpx-faq-item">
              <summary>Why does the certificate-log check sometimes time out or come back empty?</summary>
              <p>
                crt.sh is a free public service with a hard rate limit, and this tool intentionally makes at most one
                request per domain per hour to avoid getting the shared IP blocked for every visitor. If you check
                the same domain again within that hour, or if crt.sh is slow that moment, you may see &quot;certificate
                history wasn&apos;t available right now&quot; — that&apos;s an honest gap, not a hidden failure
                dressed up as a zero.
              </p>
            </details>
            <details className="cpx-faq-item">
              <summary>Why might the sitemap count look wrong?</summary>
              <p>
                We count <code>&lt;loc&gt;</code> tags in whatever <code>sitemap.xml</code> returns, following exactly
                one redirect. Some sites use a sitemap index that points to several smaller sitemaps rather than
                listing every URL directly — in that case the number reflects what&apos;s in the outer file, not
                every page on the site. It&apos;s a real count of what&apos;s published, not a guaranteed total.
              </p>
            </details>
            <details className="cpx-faq-item">
              <summary>How accurate is a new-hostname count as a signal?</summary>
              <p>
                It&apos;s a real, honest count of certificates issued in the last 90 days — not an interpretation.
                Companies provision subdomains constantly for staging, previews, and things that get killed, so a
                hostname alone isn&apos;t a story by itself. It&apos;s a starting point for a question, not a
                conclusion — which is exactly why the full product reads it alongside other channels before drawing
                one.
              </p>
            </details>
            <details className="cpx-faq-item">
              <summary>Can I run this against any domain, including my own?</summary>
              <p>
                Yes — it works on any public domain with a reachable sitemap or a certificate history, competitor or
                otherwise. Both checks only look at what&apos;s already public, the same way anyone with a browser
                could, just automated and counted for you.
              </p>
            </details>
            <details className="cpx-faq-item">
              <summary>Is this the same engine as the paid product?</summary>
              <p>
                It&apos;s a deliberately trimmed-down version of two real collectors from the full product, built to
                run standalone without an account or a database. The full product runs these same kinds of checks on
                a schedule, across 28 channels, and reasons about what they mean together — this page runs two of
                them, once, on request.
              </p>
            </details>
          </div>
        </div>
      </section>
    </section>
  );
}
