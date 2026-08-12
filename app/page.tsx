// Internal tool — root redirects straight into the app feed. No marketing/
// funnel: Watchtower is a private competitive-intelligence tool for the team.
import { redirect } from 'next/navigation';

export default function Root() {
  redirect('/feed');
}
