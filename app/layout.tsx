import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Watchtower — Competitive intelligence on autopilot',
  description:
    'Track every competitor across 22 channels. Know what they do before they announce it. Self-serve competitive intelligence from $99/mo.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
