import Link from 'next/link';
import { POSTS } from '@/lib/blog';

export const metadata = {
  title: 'Blog — Watchtower',
  description: 'Notes on competitive intelligence, written from the research behind how Watchtower is built.',
};

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
}

export default function BlogIndex() {
  return (
    <section className="mkt-section">
      <div className="wrap">
        <span className="mkt-eyebrow">Blog</span>
        <h2>Notes on competitive intelligence.</h2>
        <p className="lede">Written from the same research behind how this product is built — not filler.</p>
        <div className="blog-list">
          {POSTS.map((p) => (
            <article className="blog-item" key={p.slug}>
              <div className="blog-meta">{formatDate(p.date)}<br />{p.readMins} min read</div>
              <div>
                <h3><Link href={`/blog/${p.slug}`}>{p.title}</Link></h3>
                <p>{p.dek}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
