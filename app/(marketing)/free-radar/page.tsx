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
          90 days. Two of the 22 channels Fortress HQ watches every day — real, live, right now.
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
        <p>See all 22 channels, cited, every morning — pricing, ads, hiring, reviews, launches, and more.</p>
        <div className="wt-cta">
          <Link href="/pricing" className="btn btn-primary">See pricing</Link>
          <Link href="/demo" className="btn btn-ghost">Try the live demo</Link>
        </div>
      </div>
    </section>
  );
}
