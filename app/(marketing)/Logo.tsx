// The Watchtower mark: three courses of stone with staggered joints, the way
// masonry is actually laid. The offset is load-bearing — centred bars read as
// a bar chart, and a centred stack under a dot reads as a person. Structure
// stays currentColor so the mark inverts anywhere; only the top course takes
// the accent.
export default function Logo({ accent = 'var(--brand, #1e6f5c)' }: { accent?: string }) {
  return (
    <svg viewBox="0 0 34 34" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <rect x="8" y="6" width="15" height="5.6" rx="1.3" fill={accent} />
      <rect x="11" y="14.2" width="15" height="5.6" rx="1.3" fill="currentColor" opacity="0.68" />
      <rect x="8" y="22.4" width="15" height="5.6" rx="1.3" fill="currentColor" opacity="0.4" />
    </svg>
  );
}
