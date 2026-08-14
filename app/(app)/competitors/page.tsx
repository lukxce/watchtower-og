// Competitors was folded into Battlecards — one place per competitor (the
// read, the card, the side-by-side numbers, the map), not two tabs telling
// half the story each. This route just forwards so no old link breaks.
import { redirect } from 'next/navigation';

export default function CompetitorsPage() {
  redirect('/battlecards');
}
