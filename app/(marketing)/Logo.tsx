export default function Logo({ dark }: { dark?: boolean }) {
  const stroke = dark ? '#7ea0ff' : '#0040ff';
  return (
    <svg viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <line x1="2" y1="21" x2="9" y2="6" stroke={stroke} strokeWidth="2" strokeLinecap="round" />
      <line x1="8" y1="21" x2="15" y2="3" stroke={stroke} strokeWidth="2" strokeLinecap="round" />
      <line x1="14" y1="21" x2="21" y2="9" stroke={stroke} strokeWidth="2" strokeLinecap="round" />
      <line x1="20" y1="21" x2="24" y2="13" stroke={stroke} strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
