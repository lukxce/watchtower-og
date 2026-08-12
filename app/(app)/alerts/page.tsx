import { Soon } from '@/lib/soon';
export default function Page() {
  return (
    <Soon
      title="Alerts"
      blurb="Instant notifications when a high-impact signal lands."
      needs="needs notification wiring (Slack/email via Resend)"
      bullets={[
        'Rules like “pricing page changed”, “exec departed”, “raised a round”, or any signal above a score threshold.',
        'Daily digest to a Slack/Teams channel; instant alerts to a webhook.',
        'Signal scores already power the threshold logic — this view needs the delivery step.',
      ]}
    />
  );
}
