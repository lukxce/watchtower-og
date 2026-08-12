import { Soon } from '@/lib/soon';
export default function Page() {
  return (
    <Soon
      title="Reports"
      blurb="On-demand team-actionable briefs (the day-one report, generated live)."
      needs="needs the Claude synthesis layer (ANTHROPIC_API_KEY)"
      bullets={[
        'Exec summary → scored threat index → sales battlecards → marketing gaps → product matrix → watchlist.',
        'Exportable to HTML/PDF for sharing, built from the current signal corpus.',
        'The static v3 brief already exists (~/Downloads/Watchtower_Day-One_Competitor_Brief.html); this makes it live and re-runnable.',
      ]}
    />
  );
}
