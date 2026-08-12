import type { Metadata } from 'next';
import { ClerkProvider } from '@clerk/nextjs';
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';
import { clerkConfigured } from '@/lib/tenant';
import './globals.css';

export const metadata: Metadata = {
  title: 'Watchtower — Verifiable competitive intelligence',
  description:
    'Every signal cited, every gap disclosed. Track every competitor across 22 channels, self-serve, from $99/mo.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const body = (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <body>{children}</body>
    </html>
  );
  return clerkConfigured ? <ClerkProvider signInUrl="/sign-in" signUpUrl="/sign-up" afterSignOutUrl="/">{body}</ClerkProvider> : body;
}
