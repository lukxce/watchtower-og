// The full channel roster (single source of truth). Every channel now has real
// collector code; each self-defers cleanly when its key/vendor is absent.
// Status is computed at runtime from which credentials are present, so the
// dashboard coverage map is always honest and channels light up automatically
// as keys are added — no code change needed.
import type { Competitor } from '@/db/queries';

import { collectWebsite } from '@/collectors/website';
import { collectSitemap } from '@/collectors/sitemapWatch';
import { collectNews } from '@/collectors/news';
import { collectYouTube } from '@/collectors/youtube';
import { collectJobs } from '@/collectors/jobs';
import { collectSubdomains } from '@/collectors/subdomains';
import { collectTechstack } from '@/collectors/techstack';
import { collectPodcasts } from '@/collectors/podcasts';
import { collectAppstore } from '@/collectors/appstore';
import { collectGooglePlay } from '@/collectors/googleplay';
import { collectAdsMeta } from '@/collectors/adsMeta';
import { collectAdsGoogle } from '@/collectors/adsGoogle';
import { collectAdsLinkedin } from '@/collectors/adsLinkedin';
import { collectLogos } from '@/collectors/logos';
import { collectEvents } from '@/collectors/events';
import { collectReddit } from '@/collectors/reddit';
import { collectProductHunt } from '@/collectors/producthunt';
import { collectTrustpilot } from '@/collectors/trustpilot';
import { collectG2, collectCapterra, collectGlassdoor, collectTrustRadius, collectGartner } from '@/collectors/reviews';
import { collectLinkedinPosts } from '@/collectors/linkedinPosts';
import { collectFunding } from '@/collectors/funding';
import { collectTraffic, collectTrends } from '@/collectors/market';
import { collectNewsletters } from '@/collectors/newsletters';

export type ChannelStatus = 'active' | 'needs_key' | 'needs_account' | 'paid';
export type ChannelGroup = 'Product' | 'GTM & ads' | 'Talent' | 'Voice & PR' | 'Reputation' | 'Market' | 'Corporate';

export interface ChannelDef {
  key: string;
  label: string;
  group: ChannelGroup;
  status: ChannelStatus;
  note: string;
  run: (c: Competitor, tier2?: boolean) => Promise<string>;
}

const has = (v?: string) => !!v && v.length > 0;
const env = process.env;
// If credential present → active; else the given "blocked" status. Collector
// self-defers regardless, so running a blocked channel is a cheap no-op.
const st = (present: boolean, blocked: ChannelStatus): ChannelStatus => (present ? 'active' : blocked);

const APIFY = has(env.APIFY_TOKEN);

export const CHANNELS: ChannelDef[] = [
  // Product
  { key: 'website', label: 'Website & pricing', group: 'Product', status: 'active', note: 'Tiered page capture + content diff (Firecrawl for walled sites)', run: (c) => collectWebsite(c) },
  { key: 'sitemap', label: 'New & changed pages', group: 'Product', status: 'active', note: 'Sitemap diff — blog, case studies, changelog, product', run: collectSitemap },
  { key: 'appstore', label: 'iOS app releases', group: 'Product', status: 'active', note: 'iTunes Search API, verified by seller domain', run: collectAppstore },
  { key: 'googleplay', label: 'Android app releases', group: 'Product', status: 'active', note: 'Play Store listing (Firecrawl-backed)', run: collectGooglePlay },
  { key: 'subdomains', label: 'Subdomain watch', group: 'Product', status: 'active', note: 'CT logs (crt.sh + certspotter) — pre-launch tells', run: collectSubdomains },
  { key: 'techstack', label: 'Tech stack', group: 'Product', status: 'active', note: 'Homepage fingerprinting', run: collectTechstack },
  // GTM & ads
  { key: 'ads_meta', label: 'Meta ads', group: 'GTM & ads', status: st(has(env.META_ADS_TOKEN), 'needs_key'), note: 'Ad Library Graph API by page ID · set META_ADS_TOKEN (free)', run: collectAdsMeta },
  { key: 'ads_google', label: 'Google ads', group: 'GTM & ads', status: 'active', note: 'Transparency Center by domain', run: collectAdsGoogle },
  { key: 'ads_linkedin', label: 'LinkedIn ads', group: 'GTM & ads', status: 'active', note: 'Ad Library, advertiser-exact', run: collectAdsLinkedin },
  { key: 'events', label: 'Events & webinars', group: 'GTM & ads', status: 'active', note: 'Field-marketing themes from events pages', run: collectEvents },
  { key: 'logos', label: 'Customer logos', group: 'GTM & ads', status: 'active', note: 'Wins/losses from logo walls (shared site capture)', run: collectLogos },
  // Talent
  { key: 'jobs', label: 'Job postings', group: 'Talent', status: 'active', note: 'ATS board APIs — the momentum tell', run: collectJobs },
  { key: 'glassdoor', label: 'Glassdoor sentiment', group: 'Talent', status: st(APIFY, 'paid'), note: 'Employee sentiment · licensed vendor (APIFY_TOKEN + APIFY_GLASSDOOR_ACTOR)', run: collectGlassdoor },
  // Voice & PR
  { key: 'news', label: 'News & press', group: 'Voice & PR', status: 'active', note: has(env.GNEWS_API_KEY) ? 'GNews API' : 'Google News RSS · set GNEWS_API_KEY to upgrade', run: collectNews },
  { key: 'youtube', label: 'YouTube', group: 'Voice & PR', status: 'active', note: 'Channel RSS', run: collectYouTube },
  { key: 'podcasts', label: 'Podcasts', group: 'Voice & PR', status: 'active', note: 'iTunes episode mentions', run: collectPodcasts },
  { key: 'reddit', label: 'Reddit', group: 'Voice & PR', status: st(has(env.REDDIT_CLIENT_ID), 'needs_account'), note: 'OAuth search · set REDDIT_CLIENT_ID/SECRET (free app)', run: collectReddit },
  { key: 'producthunt', label: 'Product Hunt', group: 'Voice & PR', status: st(has(env.PRODUCTHUNT_TOKEN), 'needs_key'), note: 'GraphQL API · set PRODUCTHUNT_TOKEN (free)', run: collectProductHunt },
  { key: 'linkedin_posts', label: 'LinkedIn company posts', group: 'Voice & PR', status: st(APIFY, 'needs_account'), note: 'Licensed vendor · APIFY_TOKEN + APIFY_LINKEDIN_ACTOR', run: collectLinkedinPosts },
  { key: 'newsletters', label: 'Newsletters & sequences', group: 'Voice & PR', status: st(has(env.NEWSLETTER_INBOX) && has(env.INBOUND_TOKEN), 'needs_account'), note: 'Persona inbox → /api/inbound (secret shopper) · needs NEWSLETTER_INBOX + INBOUND_TOKEN', run: collectNewsletters },
  // Reputation
  // Not 'active' by default: the public-page path 403s on every server-side
  // request now, so without a key this rides the multi-platform Apify run.
  // Note also that Trustpilot skews consumer — Klue and Crayon have no profile
  // at all, so "not listed" is the normal, correct result for enterprise B2B.
  { key: 'trustpilot', label: 'Trustpilot reviews', group: 'Reputation', status: has(env.TRUSTPILOT_API_KEY) ? 'active' : st(APIFY, 'paid'), note: has(env.TRUSTPILOT_API_KEY) ? 'Business API' : 'Same multi-platform actor · TRUSTPILOT_API_KEY upgrades it', run: collectTrustpilot },
  { key: 'g2', label: 'G2 reviews', group: 'Reputation', status: st(APIFY, 'paid'), note: 'Licensed vendor · APIFY_TOKEN + APIFY_G2_ACTOR', run: collectG2 },
  { key: 'capterra', label: 'Capterra reviews', group: 'Reputation', status: st(APIFY, 'paid'), note: 'Licensed vendor · one multi-platform actor (APIFY_REVIEWS_ACTOR)', run: collectCapterra },
  { key: 'trustradius', label: 'TrustRadius reviews', group: 'Reputation', status: st(APIFY, 'paid'), note: 'Same multi-platform actor — no extra integration', run: collectTrustRadius },
  { key: 'gartner', label: 'Gartner Peer Insights', group: 'Reputation', status: st(APIFY, 'paid'), note: 'Same multi-platform actor — enterprise buyer voice', run: collectGartner },
  // Market
  { key: 'traffic', label: 'Traffic & SEO', group: 'Market', status: st(has(env.DATAFORSEO_LOGIN), 'paid'), note: 'DataForSEO · set DATAFORSEO_LOGIN/PASSWORD', run: collectTraffic },
  { key: 'trends', label: 'Search interest', group: 'Market', status: st(has(env.DATAFORSEO_LOGIN), 'paid'), note: 'Google Trends via DataForSEO', run: collectTrends },
  // Corporate
  { key: 'funding', label: 'Funding & M&A', group: 'Corporate', status: 'active', note: 'SEC EDGAR Form D + funding news — keyless', run: collectFunding },
];

// Every channel runs; blocked ones self-defer as a cheap no-op and record their
// own status, so the coverage map stays truthful without a separate pass.
export const RUNNABLE_CHANNELS = CHANNELS;
export const ACTIVE_CHANNELS = CHANNELS.filter((c) => c.status === 'active');
