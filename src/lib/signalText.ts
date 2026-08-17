// Read-time cleanup for stored signal titles.
//
// Collector titles are the citation — they stay in the database exactly as
// captured, and nothing here is written back. But several collectors bake
// machine text into the title that no customer should ever read:
//
//   sitemap  "New page published: https://www.modash.io/de/pricing"
//   events   "Event/webinar: cover images for Webinar (11) [https://…png]"
//   logos    "Customer/brand shown: AmazonLogo_Color"
//
// The card shows the clean sentence and the row stays clickable, so the URL
// is still one tap away — it just isn't the headline any more.

// Anything that reads like an asset rather than a sentence. These come from
// html-to-text emitting image alt text plus the src, and from logo-wall
// filenames.
const ASSET = /\.(png|jpe?g|gif|svg|webp|avif|pdf|mp4|webm)\b/i;

// Section headings and nav links off an events page, which match the events
// keyword filter on the bare word alone.
const NAV_FURNITURE =
  /^((explore|browse|view|see|watch|discover|all|our|more|upcoming|past|featured|on[- ]demand|register(\s+for)?|join(\s+us)?)\s+)*((up\s?coming|past|featured|on[- ]demand|live|virtual)\s+)?(webinars?|events?|workshops?|conferences?|summits?|masterclasses|resources?)(\s+(and|&)\s+\w+)?$/i;

/** Strip a trailing "[https://…]" and any bare URLs left inline. */
function stripUrls(s: string): string {
  return s
    .replace(/\[\s*https?:\/\/[^\]]*\]/gi, '') // html-to-text link residue
    .replace(/\(\s*https?:\/\/[^)]*\)/gi, '')
    .replace(/https?:\/\/\S+/gi, '')
    .trim();
}

/** "https://www.modash.io/de/pricing" → "modash.io/de/pricing" */
function prettyUrl(raw: string): string {
  try {
    const u = new URL(raw);
    const path = (u.pathname + u.search).replace(/\/$/, '');
    return `${u.hostname.replace(/^www\./, '')}${path}`;
  } catch {
    return raw;
  }
}

/** "AmazonLogo_Color" → "Amazon" · "Logo_Google_Analytics" → "Google Analytics" */
function prettyLogo(raw: string): string {
  const s = raw
    .replace(/\.[a-z0-9]{2,4}$/i, '')
    .replace(/[_-]+/g, ' ')
    .replace(/\b(logo|logos|color|colour|white|black|dark|light|full|mark|wordmark|rgb|svg|png|final|copy|\d+x\d+|@\dx)\b/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  return s || raw;
}

/**
 * The customer-facing form of a stored title. Returns null when the row is
 * pure noise and should not be shown at all — a bare date with no event name,
 * or an asset filename that only ever looked like a signal.
 */
export function cleanTitle(channel: string, title: string): string | null {
  const prefix = title.match(/^([^:]{3,24}:\s*)/)?.[1] ?? '';
  let body = title.slice(prefix.length).trim();

  if (channel === 'sitemap' && /^https?:\/\//i.test(body)) {
    return `${prefix}${prettyUrl(body)}`;
  }

  if (channel === 'logos') {
    const pretty = prettyLogo(body);
    return pretty.length >= 2 ? `${prefix}${pretty}` : null;
  }

  if (channel === 'events') {
    // Image alt text + src, e.g. "cover images for Webinar (11) [https://…png]"
    if (ASSET.test(body)) return null;
    body = stripUrls(body).replace(/^[*•·\-\s]+/, '');
    // Nav and section headings off the same page: "Explore our webinars",
    // "All events", "Upcoming Webinars". They match EVENTY on the bare word
    // and are not events.
    if (NAV_FURNITURE.test(body)) return null;
    // A line that is only a date is the events page's calendar furniture, not
    // an event: "November 24–25, 2026", "September 5, 2026".
    const dateOnly =
      /^(?:mon|tue|wed|thu|fri|sat|sun)[a-z]*,?\s*/i.test(body) ||
      /^[a-z]+\s+\d{1,2}(\s*[–—-]\s*\d{1,2})?(,)?\s*20\d\d$/i.test(body) ||
      /^\d{1,2}[./-]\d{1,2}[./-]\d{2,4}$/.test(body) ||
      // date-led schedule row, name lives elsewhere on the page:
      // "OCTOBER 13, 2026 | LOS ANGELES, CA". A month with no day after it
      // ("October Product Summit") is a real title and survives.
      /^(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\.?\s+\d{1,2}\b/i.test(body);
    if (dateOnly || body.replace(/[^a-z]/gi, '').length < 6) return null;
    return `${prefix}${body}`;
  }

  body = stripUrls(body);
  if (!body) return null;
  return `${prefix}${body}`.replace(/\s+/g, ' ').trim();
}
