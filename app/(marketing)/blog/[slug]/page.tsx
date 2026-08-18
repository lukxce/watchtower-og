import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getPost, POSTS } from '@/lib/blog';
import BlogCover from '../../BlogCover';

export function generateStaticParams() {
  return POSTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return {};
  return { title: `${post.title} — Fortress HQ`, description: post.dek };
}

const fmt = (iso: string) =>
  new Date(iso).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

export default async function BlogPost({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  // Same category first, then most recent — so "keep reading" is actually related.
  const more = POSTS.filter((p) => p.slug !== post.slug)
    .sort((a, b) => (a.category === post.category ? -1 : 1) - (b.category === post.category ? -1 : 1)
      || b.date.localeCompare(a.date))
    .slice(0, 2);

  return (
    <article className="mkt-section">
      <div className="wrap">
        <div className="post-head">
          <Link href="/blog" className="post-back">← All posts</Link>
          <span className="blog-tag">{post.category}</span>
          <h1 className="post-title">{post.title}</h1>
          <p className="post-dek">{post.dek}</p>
          <div className="post-meta">{post.author} · {fmt(post.date)} · {post.readMins} min read</div>
        </div>

        <div className="post-art"><BlogCover cover={post.cover} /></div>

        <div className="post-body">
          {post.body.map((para, i) =>
            para.startsWith('## ') ? <h2 key={i}>{para.slice(3)}</h2> : <p key={i}>{para}</p>,
          )}
        </div>

        <aside className="post-next">
          <span className="mkt-eyebrow">Keep reading</span>
          <div className="blog-grid">
            {more.map((p) => (
              <Link href={`/blog/${p.slug}`} className="blog-card" key={p.slug}>
                <div className="blog-card-art"><BlogCover cover={p.cover} /></div>
                <span className="blog-tag">{p.category}</span>
                <h4>{p.title}</h4>
                <span className="blog-by">{fmt(p.date)} · {p.readMins} min read</span>
              </Link>
            ))}
          </div>
        </aside>

        <div className="post-cta">
          <p>Fortress HQ found every example in this post. It can watch your market the same way.</p>
          <div className="wt-cta">
            <Link href="/sign-up" className="btn btn-primary">Start free</Link>
            <Link href="/demo" className="btn btn-ghost">See the live demo →</Link>
          </div>
        </div>
      </div>
    </article>
  );
}
