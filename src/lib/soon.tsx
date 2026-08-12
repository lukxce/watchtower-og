// Honest placeholder for sections that need the LLM layer or extra infra —
// no dead links: each explains what it will do and what it depends on.
export function Soon({ title, blurb, needs, bullets }: { title: string; blurb: string; needs: string; bullets: string[] }) {
  return (
    <main className="main solo">
      <section className="feed">
        <h1>{title}</h1>
        <p className="sub">{blurb}</p>
        <div className="soon">
          <div className="soon-tag">Not yet wired · {needs}</div>
          <ul>
            {bullets.map((b) => (
              <li key={b}>{b}</li>
            ))}
          </ul>
        </div>
      </section>
    </main>
  );
}
