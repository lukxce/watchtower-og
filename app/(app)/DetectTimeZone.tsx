'use client';
import { useEffect } from 'react';

// Fires once per browser. The server ignores it unless the workspace is still
// on the UTC default, so this can never override a deliberate choice.
export default function DetectTimeZone() {
  useEffect(() => {
    const KEY = 'wt_tz_sent';
    if (localStorage.getItem(KEY)) return;
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    if (!timezone) return;
    fetch('/api/timezone', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ timezone }),
    })
      .then(() => localStorage.setItem(KEY, '1'))
      .catch(() => {/* the cron falls back to UTC; not worth retrying hard */});
  }, []);
  return null;
}
