import { Suspense } from 'react';
import { OrganizationSwitcher, UserButton } from '@clerk/nextjs';
import NavLinks from '../NavLinks';
import ChannelRail from '../ChannelRail';
import { clerkConfigured } from '@/lib/tenant';
import { getViewAsOrg } from '@/lib/adminAuth';

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const viewingAs = await getViewAsOrg();
  return (
    <div className="app">
      {viewingAs && (
        <div className="admin-banner">
          Viewing as workspace <b className="mono">{viewingAs}</b> — this is exactly what that client sees.
          <a href="/api/admin/view-as?clear=1">Exit view-as</a>
        </div>
      )}
      <header className="topbar">
        <div className="topbar-in">
          <a className="brand" href="/overview">
            <svg viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <line x1="2" y1="21" x2="9" y2="6" stroke="#5457d6" strokeWidth="2" strokeLinecap="round" />
              <line x1="8" y1="21" x2="15" y2="3" stroke="#5457d6" strokeWidth="2" strokeLinecap="round" />
              <line x1="14" y1="21" x2="21" y2="9" stroke="#5457d6" strokeWidth="2" strokeLinecap="round" />
              <line x1="20" y1="21" x2="24" y2="13" stroke="#5457d6" strokeWidth="2" strokeLinecap="round" />
            </svg>
            watch<b>tower</b>
          </a>
          <NavLinks />
          <div className="top-right">
            {clerkConfigured ? (
              <>
                <OrganizationSwitcher afterSelectOrganizationUrl="/overview" afterCreateOrganizationUrl="/onboarding" hidePersonal />
                <UserButton />
              </>
            ) : (
              <span className="ws-chip">
                <span className="ws-dot" />
                dev-workspace
              </span>
            )}
          </div>
        </div>
      </header>
      <div className="app-body">
        <Suspense fallback={<aside className="side-rail" />}>
          <ChannelRail />
        </Suspense>
        {children}
      </div>
    </div>
  );
}
