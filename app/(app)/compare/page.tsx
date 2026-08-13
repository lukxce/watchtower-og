// Compare was folded into Competitors (the comparison table lives there now,
// next to the positioning map) — this route just forwards so no old link or
// bookmark breaks.
import { redirect } from 'next/navigation';

export default function ComparePage() {
  redirect('/competitors');
}
