// The Fortress HQ mark: three courses of stone with staggered joints, the way
// masonry is actually laid. It needed no redesign for the rename — offset
// stone courses are wall coursework before they're anything else, so the mark
// reads as fortress construction at least as naturally as a tower. The offset
// is load-bearing — centred bars read as a bar chart, and a centred stack
// under a dot reads as a person. Structure stays currentColor so the mark
// inverts anywhere; the top course takes the highlighter, which is the one
// place the accent appears in the lockup.
export default function Logo({ accent = '#eafd35' }: { accent?: string }) {
  return (
    <svg viewBox="0 0 34 34" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <rect x="7" y="5.5" width="16" height="6" rx="1.4" fill={accent} />
      <rect x="11" y="14" width="16" height="6" rx="1.4" fill="currentColor" opacity="0.7" />
      <rect x="7" y="22.5" width="16" height="6" rx="1.4" fill="currentColor" opacity="0.42" />
    </svg>
  );
}
