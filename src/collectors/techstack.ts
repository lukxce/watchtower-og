// Tech-stack fingerprinting (spec §4.8): signature scan of the homepage HTML.
// New tool = strategy signal (6sense ⇒ ABM; Chili Piper ⇒ sales-led).
import { smartFetch } from '@/lib/fetchLadder';
import { ingestItems, recordRun, type Competitor } from '@/db/queries';

const SIGNATURES: [string, RegExp][] = [
  ['Google Analytics 4', /gtag\/js\?id=G-/],
  ['Google Tag Manager', /googletagmanager\.com/],
  ['Google Ads', /googleads|google_conversion/],
  ['Meta Pixel', /connect\.facebook\.net/],
  ['LinkedIn Insight', /snap\.licdn\.com/],
  ['TikTok Pixel', /analytics\.tiktok\.com/],
  ['Segment', /cdn\.segment\.com/],
  ['Mixpanel', /cdn\.mxpnl\.com|mixpanel/],
  ['Amplitude', /cdn\.amplitude\.com/],
  ['PostHog', /posthog/],
  ['Hotjar', /static\.hotjar\.com/],
  ['FullStory', /fullstory\.com\/s\/fs\.js/],
  ['HubSpot', /js\.hs-scripts\.com|js\.hsforms\.net/],
  ['Marketo', /munchkin\.marketo/],
  ['Intercom', /widget\.intercom\.io|intercomSettings/],
  ['Drift', /js\.driftt\.com/],
  ['Zendesk', /static\.zdassets\.com/],
  ['Crisp', /client\.crisp\.chat/],
  ['Qualified', /js\.qualified\.com/],
  ['Clearbit', /tag\.clearbitscripts\.com|clearbit\.com/],
  ['6sense', /j\.6sc\.co|6sense/],
  ['Demandbase', /demandbase/],
  ['Mutiny', /client-registry\.mutinycdn\.com/],
  ['Optimizely', /cdn\.optimizely\.com/],
  ['VWO', /dev\.visualwebsiteoptimizer\.com/],
  ['Stripe', /js\.stripe\.com/],
  ['Chargebee', /chargebee/],
  ['Calendly', /assets\.calendly\.com/],
  ['Chili Piper', /chilipiper/],
  ['Typeform', /embed\.typeform\.com/],
  ['Navattic', /navattic/],
  ['Storylane', /storylane/],
  ['Appcues', /appcues/],
  ['Pendo', /pendo/],
  ['Sentry', /browser\.sentry-cdn\.com|sentry\.io/],
  ['Wistia', /fast\.wistia/],
  ['WordPress', /wp-content/],
  ['Webflow', /website-files\.com|webflow/],
  ['Elementor', /elementor/],
];

export async function collectTechstack(comp: Competitor): Promise<string> {
  const res = await smartFetch(`https://${comp.domain}/`);
  if (res.status !== 200) {
    await recordRun(comp.id, 'techstack', false, 0, `homepage HTTP ${res.status}: ${res.error ?? ''}`);
    return `FAILED (HTTP ${res.status})`;
  }
  const detected = SIGNATURES.filter(([, re]) => re.test(res.html)).map(([name]) => name);
  const { added, fresh } = await ingestItems(
    comp.id,
    'techstack',
    detected.map((name) => ({ externalId: `tool:${name}`, title: `Tech detected on ${comp.domain}: ${name}` })),
  );
  await recordRun(comp.id, 'techstack', true, added, `${detected.length} tools detected`);
  return `+${added} (${fresh} pending) — ${detected.length} tools`;
}
