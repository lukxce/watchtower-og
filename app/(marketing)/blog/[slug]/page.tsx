import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getPost, POSTS } from '@/lib/blog';

export function generateStaticParams() {
  return POSTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return {};
  return { title: `${post.title} — Watchtower`, description: post.dek };
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
}

export default async function BlogPost({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  return (
    <article className="mkt-section">
      <div className="wrap">
        <div className="post-head">
          <Link href="/blog" className="post-back">← All posts</Link>
          <div className="post-meta">{formatDate(post.date)} · {post.readMins} min read</div>
          <h1 className="post-title">{post.title}</h1>
          <p className="post-dek">{post.dek}</p>
        </div>
        <div className="post-body">
          {post.body.map((para, i) =>
            para.startsWith('## ') ? <h2 key={i}>{para.slice(3)}</h2> : <p key={i}>{para}</p>,
          )}
        </div>
      </div>
    </article>
  );
}
