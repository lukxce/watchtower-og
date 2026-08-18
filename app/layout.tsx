import type { Metadata } from 'next';
import { ClerkProvider } from '@clerk/nextjs';
import { Plus_Jakarta_Sans } from 'next/font/google';
import { GeistMono } from 'geist/font/mono';
import { clerkConfigured } from '@/lib/tenant';
import './globals.css';

// Plus Jakarta Sans — the soft geometric grotesk of the reference dashboards.
// next/font downloads at build time and self-hosts; no runtime CDN request.
const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-jakarta',
});

export const metadata: Metadata = {
  title: 'Fortress HQ — Verifiable competitive intelligence',
  description:
    'Every signal cited, every gap disclosed. Track every competitor across 22 channels, self-serve, from $99/mo.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const body = (
    <html lang="en" className={`${jakarta.variable} ${GeistMono.variable}`}>
      <body>{children}</body>
    </html>
  );
  return clerkConfigured ? <ClerkProvider signInUrl="/sign-in" signUpUrl="/sign-up" afterSignOutUrl="/">{body}</ClerkProvider> : body;
}
