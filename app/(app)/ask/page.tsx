import { Soon } from '@/lib/soon';
export default function Page() {
  return (
    <Soon
      title="Ask the Tower"
      blurb="Scouts gather. The Tower sees, and reads what it means — ask it anything about your market."
      needs="needs the Claude RAG layer (ANTHROPIC_API_KEY) + embeddings"
      bullets={[
        '“What has CreatorIQ changed on pricing this quarter?” · “Who is hiring in DACH?”',
        'Answers cite feed signals and captured snapshots — never fabricated (doctrine enforced).',
        'pgvector column is in the schema; wiring is the embeddings + retrieval step.',
      ]}
    />
  );
}
