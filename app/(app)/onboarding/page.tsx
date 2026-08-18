// Onboarding — the first thing a fresh workspace sees: tell Fortress HQ who
// YOU are (or just your link), get competitor recommendations, one click
// each to start tracking. New orgs land here from the org-create flow.
import { requireOrgId } from '@/lib/tenant';
import OnboardingFlow from './OnboardingFlow';

export const dynamic = 'force-dynamic';

export default async function Onboarding() {
  await requireOrgId();
  return (
    <main className="main solo">
      <section className="feed">
        <h1>Who are you?</h1>
        <p className="sub">
          Fortress HQ personalizes everything to your company — battlecards say how <b>you</b> win, mentions track{' '}
          <b>your</b> name, recommendations fit <b>your</b> market. Describe yourself or just drop your link.
        </p>
        <OnboardingFlow />
      </section>
    </main>
  );
}
