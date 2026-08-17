import Link from 'next/link';
import { POSTS, CATEGORIES } from '@/lib/blog';
import BlogCover from '../BlogCover';

export const metadata = {
  title: 'Blog — Watchtower',
  description: 'Field notes and method from building competitive intelligence. Written from real finds, not filler.',
};

const fmt = (iso: string) =>
  new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

export default function BlogIndex() {
  const sorted = [...POSTS].sort((a, b) => b.date.localeCompare(a.date));
  const [lead, ...rest] = sorted;

  return (
    <section className="mkt-section">
      <div className="wrap">
        <span className="mkt-eyebrow">Blog</span>
        <h2>Field notes from the watch.</h2>
        <p className="lede">
          What we actually found while building this, and the methods behind it. Every example is a real
          competitor and a real signal.
        </p>

        <div className="blog-cats">
          {CATEGORIES.map((c) => (
            <span key={c} className="blog-cat">{c}</span>
          ))}
        </div>

        {/* lead story */}
        <Link href={`/blog/${lead.slug}`} className="blog-lead">
          <div className="blog-lead-art"><BlogCover cover={lead.cover} /></div>
          <div className="blog-lead-copy">
            <span className="blog-tag">{lead.category}</span>
            <h3>{lead.title}</h3>
            <p>{lead.dek}</p>
            <span className="blog-by">{lead.author} · {fmt(lead.date)} · {lead.readMins} min read</span>
          </div>
        </Link>

        <div className="blog-grid">
          {rest.map((p) => (
            <Link href={`/blog/${p.slug}`} className="blog-card" key={p.slug}>
              <div className="blog-card-art"><BlogCover cover={p.cover} /></div>
              <span className="blog-tag">{p.category}</span>
              <h4>{p.title}</h4>
              <p>{p.dek}</p>
              <span className="blog-by">{fmt(p.date)} · {p.readMins} min read</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
